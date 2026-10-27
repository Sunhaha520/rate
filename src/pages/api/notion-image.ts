import type { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { notion } from '@/lib/notion';
import type {
    PageObjectResponse,
    BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Notion 图片代理（实时取图 + 缩略图 + 长缓存）
//
// 原理：
// 1. Notion 上传的图片是约 1 小时过期的 S3 签名 URL，代理在收到请求时
//    通过 Notion API 实时换取有效地址；签名地址本身缓存 40 分钟，避免每张图都打接口。
// 2. 支持 ?w= 宽度参数，用 sharp 转成 WebP 缩略图，避免头像/卡片图下载几 MB 原图。
// 3. 页面生成的图片地址带 ?v=<最后编辑时间>，内容不变时 URL 不变，
//    因此可以放心设置一年 immutable 缓存；图片更新后 v 变化，自动失效。
//
// 请求方式：
//   页面图：/api/notion-image?pageId=...&w=900&v=...
//   正文图：/api/notion-image?blockId=...&w=1600&v=...

const SIGNED_URL_TTL = 40 * 60 * 1000;
const signedUrls = new Map<string, { url: string; at: number }>();

const VARIANT_TTL = 15 * 60 * 1000;
const MAX_CACHE_BYTES = 32 * 1024 * 1024;
const variants = new Map<
    string,
    { buffer: Buffer; type: string; at: number }
>();
let cacheBytes = 0;

function readVariant(key: string) {
    const hit = variants.get(key);
    if (!hit) return null;

    if (Date.now() - hit.at > VARIANT_TTL) {
        variants.delete(key);
        cacheBytes -= hit.buffer.length;
        return null;
    }

    // 刷新 LRU 顺序
    variants.delete(key);
    variants.set(key, hit);
    return hit;
}

function writeVariant(key: string, buffer: Buffer, type: string) {
    const previous = variants.get(key);
    if (previous) cacheBytes -= previous.buffer.length;

    variants.set(key, { buffer, type, at: Date.now() });
    cacheBytes += buffer.length;

    while (cacheBytes > MAX_CACHE_BYTES && variants.size > 1) {
        const oldest = variants.keys().next().value as string | undefined;
        if (!oldest) break;
        const entry = variants.get(oldest);
        variants.delete(oldest);
        if (entry) cacheBytes -= entry.buffer.length;
    }
}

function parseWidth(value: unknown): number {
    if (typeof value !== 'string') return 0;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(Math.max(parsed, 32), 2400);
}

function parseQuality(value: unknown): number {
    if (typeof value !== 'string') return 78;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 78;
    return Math.min(Math.max(parsed, 40), 90);
}

// 解析页面 / 图片块对应的最新签名地址（带 40 分钟缓存）
async function resolveImageUrl(
    pageId: string | undefined,
    blockId: string | undefined,
    force = false
): Promise<string> {
    const key = blockId ? `block:${blockId}` : `page:${pageId}`;
    if (!force) {
        const hit = signedUrls.get(key);
        if (hit && Date.now() - hit.at < SIGNED_URL_TTL) return hit.url;
    }

    let imageUrl = '';

    if (blockId) {
        const block = (await notion.blocks.retrieve({
            block_id: blockId,
        })) as BlockObjectResponse;
        if (block.type === 'image') {
            const image = block.image;
            if (image.type === 'external') imageUrl = image.external.url;
            else if (image.type === 'file') imageUrl = image.file.url;
        }
    } else if (pageId) {
        const page = (await notion.pages.retrieve({
            page_id: pageId,
        })) as PageObjectResponse;

        const props = page.properties || {};
        const candidateKeys = Object.keys(props).filter((key) =>
            [
                'picture',
                'cover',
                'photo',
                'avatar',
                'map image',
                'map',
                'location image',
                '\u5c01\u9762',
                '\u56fe\u7247',
                '\u5934\u50cf',
                '\u7167\u7247',
                '\u4e2a\u4eba\u7167\u7247',
                '\u5730\u56fe',
                '\u4f4d\u7f6e\u56fe',
            ].includes(key.toLowerCase())
        );

        for (const key of candidateKeys) {
            const prop = props[key];
            if (prop.type === 'files' && prop.files.length > 0) {
                const file = prop.files[0];
                if (file.type === 'external') imageUrl = file.external.url;
                else if (file.type === 'file') imageUrl = file.file.url;
                if (imageUrl) break;
            }
        }

        // 列名是自定义的（如 Map Image / Banner）时，退回到页面里第一个文件属性
        if (!imageUrl) {
            for (const prop of Object.values(props)) {
                if (prop.type === 'files' && prop.files.length > 0) {
                    const file = prop.files[0];
                    if (file.type === 'external') imageUrl = file.external.url;
                    else if (file.type === 'file') imageUrl = file.file.url;
                    if (imageUrl) break;
                }
            }
        }

        if (!imageUrl && page.cover) {
            if (page.cover.type === 'external') {
                imageUrl = page.cover.external.url;
            } else if (page.cover.type === 'file') {
                imageUrl = page.cover.file.url;
            }
        }
    }

    if (imageUrl) {
        signedUrls.set(key, { url: imageUrl, at: Date.now() });
    } else {
        signedUrls.delete(key);
    }
    return imageUrl;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { pageId, blockId, v, w, q } = req.query;

    const page = typeof pageId === 'string' ? pageId : undefined;
    const block = typeof blockId === 'string' ? blockId : undefined;

    if (!page && !block) {
        res.status(400).json({ error: '缺少 pageId 或 blockId 参数' });
        return;
    }

    const width = parseWidth(w);
    const quality = parseQuality(q);
    const versioned = typeof v === 'string' && v.length > 0;
    const cacheKey = `${block ? `b:${block}` : `p:${page}`}:${width}:${quality}`;

    try {
        const cached = readVariant(cacheKey);
        let buffer: Buffer;
        let contentType: string;

        if (cached) {
            buffer = cached.buffer;
            contentType = cached.type;
        } else {
            let imageUrl = await resolveImageUrl(page, block, false);
            if (!imageUrl) {
                res.status(404).json({ error: '未找到可用图片' });
                return;
            }

            let upstream = await fetch(imageUrl);

            // 缓存的签名地址可能刚好过期，强制换一次新签名再试
            if (!upstream.ok) {
                imageUrl = await resolveImageUrl(page, block, true);
                if (imageUrl) upstream = await fetch(imageUrl);
            }

            if (!upstream.ok) {
                res.status(502).json({ error: '上游图片获取失败' });
                return;
            }

            contentType = upstream.headers.get('content-type') || 'image/jpeg';
            buffer = Buffer.from(await upstream.arrayBuffer());

            // 缩略图：只处理常见位图格式，SVG/GIF 保持原样
            if (
                width > 0 &&
                /^image\/(jpeg|png|webp|avif|tiff)/i.test(contentType)
            ) {
                try {
                    buffer = await sharp(buffer)
                        .rotate()
                        .resize({ width, withoutEnlargement: true })
                        .webp({ quality })
                        .toBuffer();
                    contentType = 'image/webp';
                } catch (err) {
                    console.warn('Notion 图片压缩失败，返回原图:', err);
                }
            }

            // 小图才进内存缓存，避免大图占满内存
            if (buffer.length <= 4 * 1024 * 1024) {
                writeVariant(cacheKey, buffer, contentType);
            }
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', String(buffer.length));
        res.setHeader(
            'Cache-Control',
            versioned
                ? 'public, max-age=31536000, s-maxage=31536000, immutable'
                : 'public, max-age=3600, stale-while-revalidate=86400'
        );
        res.status(200).send(buffer);
    } catch (err) {
        console.error('Notion 图片代理失败:', err);
        res.status(500).json({ error: '图片代理内部错误' });
    }
}

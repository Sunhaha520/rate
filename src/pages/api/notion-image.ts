import type { NextApiRequest, NextApiResponse } from 'next';

// Notion 图片代理（实时取图 + 缩略图 + 长缓存）
//
// 这里刻意不引入 @/lib/notion：那条管线包含 notion-to-md / remark / sanitize-html，
// 在 Vercel 的 serverless 运行时里可能因为外部模块解析失败而导致整个接口 500。
// 图片接口只需要调用两个 Notion 只读接口，直接用 fetch 更轻、更稳。
//
// 请求方式：
//   页面图：/api/notion-image?pageId=...&w=900&v=...
//   正文图：/api/notion-image?blockId=...&w=1600&v=...

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

interface NotionFile {
    type: 'external' | 'file';
    external?: { url: string };
    file?: { url: string };
}

interface NotionProperty {
    type: string;
    files?: NotionFile[];
}

interface NotionPage {
    properties?: Record<string, NotionProperty>;
    cover?: NotionFile | null;
}

interface NotionBlock {
    type: string;
    image?: NotionFile;
}

async function notionApi<T>(path: string): Promise<T> {
    const token = process.env.NOTION_TOKEN;
    if (!token) throw new Error('NOTION_TOKEN 未配置');

    const response = await fetch(`${NOTION_API}/${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Notion-Version': NOTION_VERSION,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        const detail = (await response.text()).slice(0, 200);
        throw new Error(`Notion API ${response.status}: ${detail}`);
    }

    return (await response.json()) as T;
}

function fileUrl(file: NotionFile | null | undefined): string {
    if (!file) return '';
    if (file.type === 'external') return file.external?.url ?? '';
    if (file.type === 'file') return file.file?.url ?? '';
    return '';
}

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
        const block = await notionApi<NotionBlock>(`blocks/${blockId}`);
        if (block.type === 'image') imageUrl = fileUrl(block.image);
    } else if (pageId) {
        const page = await notionApi<NotionPage>(`pages/${pageId}`);
        const props = page.properties ?? {};

        const candidateKeys = Object.keys(props).filter((propKey) =>
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
            ].includes(propKey.toLowerCase())
        );

        for (const propKey of candidateKeys) {
            const prop = props[propKey];
            if (prop.type === 'files' && prop.files?.length) {
                imageUrl = fileUrl(prop.files[0]);
                if (imageUrl) break;
            }
        }

        // 自定义图片列名（Map Image / Banner 等）：退回到第一个文件属性
        if (!imageUrl) {
            for (const prop of Object.values(props)) {
                if (prop.type === 'files' && prop.files?.length) {
                    imageUrl = fileUrl(prop.files[0]);
                    if (imageUrl) break;
                }
            }
        }

        if (!imageUrl) imageUrl = fileUrl(page.cover);
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

            // 缩略图：动态加载 sharp；Vercel 上不可用时降级返回原图
            if (
                width > 0 &&
                /^image\/(jpeg|png|webp|avif|tiff)/i.test(contentType)
            ) {
                try {
                    const { default: sharp } = await import('sharp');
                    buffer = await sharp(buffer)
                        .rotate()
                        .resize({ width, withoutEnlargement: true })
                        .webp({ quality })
                        .toBuffer();
                    contentType = 'image/webp';
                } catch (err) {
                    console.warn(
                        'Notion 图片压缩不可用，返回原图:',
                        err instanceof Error ? err.message : err
                    );
                }
            }

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
        const message = err instanceof Error ? err.message : String(err);
        console.error('Notion 图片代理失败:', message);
        res.status(500).json({
            error: '图片代理内部错误',
            // 加 ?debug=1 可看到具体原因，便于线上排查（不包含 token）
            ...(req.query.debug === '1' ? { detail: message } : {}),
        });
    }
}

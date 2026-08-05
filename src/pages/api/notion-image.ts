import type { NextApiRequest, NextApiResponse } from 'next';
import { notion } from '@/lib/notion';
import type {
    PageObjectResponse,
    BlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

// Notion 图片代理接口（实时取图，彻底解决 S3 签名过期问题）
//
// 原理：Notion 上传的图片是 S3 临时签名 URL（约 1 小时过期）。
// 如果把签名 URL 固化到静态页面或代理参数里，时间一长必然失效。
// 本代理只接收稳定的 pageId（封面图）或 blockId（正文图），
// 在“收到请求的那一刻”通过 Notion API 实时拉取当前有效的签名 URL，
// 再把图片二进制转发给浏览器。因此无论过多久都能拿到新鲜可用的图片。
//
// 请求方式：
//   封面图：/api/notion-image?pageId=<Notion页面ID>
//   正文图：/api/notion-image?blockId=<Notion图片块ID>
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { pageId, blockId } = req.query;

    if (
        (!pageId || typeof pageId !== 'string') &&
        (!blockId || typeof blockId !== 'string')
    ) {
        res.status(400).json({ error: '缺少 pageId 或 blockId 参数' });
        return;
    }

    try {
        let imageUrl = '';

        if (blockId && typeof blockId === 'string') {
            // 正文图片：实时获取该 image block 的最新签名 URL
            const block = (await notion.blocks.retrieve({
                block_id: blockId,
            })) as BlockObjectResponse;
            if (block.type === 'image') {
                const img = block.image;
                if (img.type === 'external') imageUrl = img.external.url;
                else if (img.type === 'file') imageUrl = img.file.url;
            }
        } else if (pageId && typeof pageId === 'string') {
            // 封面图：实时获取该页面的最新封面签名 URL
            const page = (await notion.pages.retrieve({
                page_id: pageId,
            })) as PageObjectResponse;

            const props = page.properties || {};
            const candidateKeys = Object.keys(props).filter((k) =>
                ['picture', 'cover', '\u5c01\u9762', '\u56fe\u7247'].includes(
                    k.toLowerCase()
                )
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
            if (!imageUrl && page.cover) {
                if (page.cover.type === 'external')
                    imageUrl = page.cover.external.url;
                else if (page.cover.type === 'file')
                    imageUrl = page.cover.file.url;
            }
        }

        if (!imageUrl) {
            res.status(404).json({ error: '\u672a\u627e\u5230\u53ef\u7528\u56fe\u7247' });
            return;
        }

        // 拉取图片二进制并转发
        const upstream = await fetch(imageUrl);
        if (!upstream.ok) {
            res.status(upstream.status).json({ error: '\u4e0a\u6e38\u56fe\u7247\u83b7\u53d6\u5931\u8d25' });
            return;
        }

        const contentType = upstream.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await upstream.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 缓存策略：浏览器/CDN 缓存 1 小时（与 Notion 签名有效期相近），
        // 过期后后台再验证，既减少回源又保证图片不会长期失效。
        res.setHeader('Content-Type', contentType);
        res.setHeader(
            'Cache-Control',
            'public, max-age=3600, stale-while-revalidate=86400'
        );
        res.status(200).send(buffer);
    } catch (err) {
        console.error('Notion \u56fe\u7247\u4ee3\u7406\u5931\u8d25:', err);
        res.status(500).json({ error: '\u56fe\u7247\u4ee3\u7406\u5185\u90e8\u9519\u8bef' });
    }
}

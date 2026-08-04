import type { NextApiRequest, NextApiResponse } from 'next';
import { notion } from '@/lib/notion';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

// Notion 图片代理接口（按 pageId 实时取图，彻底解决签名过期问题）
//
// 原理：Notion 上传的图片是 S3 临时签名 URL（约 1 小时过期）。
// 如果把签名 URL 直接固化到静态页面或代理参数里，时间一长必然失效。
// 本代理只接收稳定的 pageId，在“收到请求的那一刻”通过 Notion API
// 实时拉取该页面当前有效的封面签名 URL，再把图片二进制转发给浏览器。
// 因此无论过多久，每次访问都能拿到新鲜可用的图片。
//
// 请求方式：/api/notion-image?pageId=<Notion页面ID>
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { pageId } = req.query;

    if (!pageId || typeof pageId !== 'string') {
        res.status(400).json({ error: '缺少 pageId 参数' });
        return;
    }

    try {
        // 1) 实时获取该页面的最新数据（含未过期的封面签名 URL）
        const page = (await notion.pages.retrieve({
            page_id: pageId,
        })) as PageObjectResponse;

        // 2) 解析封面图地址：优先自定义的 Picture/Cover files 属性，其次页面 cover
        let imageUrl = '';

        const props = page.properties || {};
        // 兼容多种列名
        const candidateKeys = Object.keys(props).filter((k) =>
            ['picture', 'cover', '封面', '图片'].includes(k.toLowerCase())
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

        // 回退到页面封面
        if (!imageUrl && page.cover) {
            if (page.cover.type === 'external') imageUrl = page.cover.external.url;
            else if (page.cover.type === 'file') imageUrl = page.cover.file.url;
        }

        if (!imageUrl) {
            res.status(404).json({ error: '该页面没有可用的封面图片' });
            return;
        }

        // 3) 拉取图片二进制并转发
        const upstream = await fetch(imageUrl);
        if (!upstream.ok) {
            res.status(upstream.status).json({ error: '上游图片获取失败' });
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
        console.error('Notion 图片代理失败:', err);
        res.status(500).json({ error: '图片代理内部错误' });
    }
}

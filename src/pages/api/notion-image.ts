import type { NextApiRequest, NextApiResponse } from 'next';

// Notion 图片代理接口
// Notion 的图片是 S3 临时签名 URL（约 1 小时过期），直接嵌入静态页面会导致签名过期后破图。
// 通过本代理，前端只需引用稳定的 /api/notion-image?url=... 地址，
// 由服务端实时向 Notion/S3 拉取图片并转发，避免签名过期问题。
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: '缺少 url 参数' });
        return;
    }

    // 安全校验：仅允许代理 Notion / AWS S3 的图片域名，避免被当作开放代理滥用
    let target: URL;
    try {
        target = new URL(url);
    } catch {
        res.status(400).json({ error: 'url 参数不是合法地址' });
        return;
    }

    const allowedHostSuffixes = [
        'notion.so',
        'notion-static.com',
        'amazonaws.com',
    ];
    const isAllowed = allowedHostSuffixes.some(
        (suffix) => target.hostname === suffix || target.hostname.endsWith('.' + suffix)
    );
    if (!isAllowed) {
        res.status(403).json({ error: '不允许代理该域名的图片' });
        return;
    }

    try {
        const upstream = await fetch(target.toString());
        if (!upstream.ok) {
            res.status(upstream.status).json({ error: '上游图片获取失败' });
            return;
        }

        const contentType =
            upstream.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await upstream.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 缓存策略：CDN 缓存 1 天，过期后后台再验证，避免频繁回源
        res.setHeader('Content-Type', contentType);
        res.setHeader(
            'Cache-Control',
            'public, max-age=86400, stale-while-revalidate=604800'
        );
        res.status(200).send(buffer);
    } catch (err) {
        console.error('Notion 图片代理失败:', err);
        res.status(500).json({ error: '图片代理内部错误' });
    }
}

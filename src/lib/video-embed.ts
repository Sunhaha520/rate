export type VideoProvider = 'youtube' | 'bilibili';

export interface VideoEmbedInfo {
    provider: VideoProvider;
    id: string;
    embedUrl: string;
    // YouTube 有公开缩略图；Bilibili 需要 Notion 里填 Cover 或使用占位图
    thumbnail: string;
}

// 识别 YouTube / Bilibili 链接，返回可直接用于 iframe 的地址。
export function parseVideoEmbed(rawUrl: string): VideoEmbedInfo | null {
    const url = rawUrl.trim();
    if (!url) return null;

    if (/youtu\.be|youtube(?:-nocookie)?\.com/i.test(url)) {
        const id = url.match(
            /(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/
        )?.[1];
        if (id) {
            return {
                provider: 'youtube',
                id,
                embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
                thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
            };
        }
    }

    if (/bilibili\.com|b23\.tv/i.test(url)) {
        const bvid = url.match(/(BV[0-9A-Za-z]+)/)?.[1];
        const aid = url.match(/(?:^|\/)av(\d+)/i)?.[1];
        const page = url.match(/[?&]p=(\d+)/)?.[1] ?? '1';

        if (bvid) {
            return {
                provider: 'bilibili',
                id: bvid,
                embedUrl: `https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}&autoplay=0&high_quality=1&danmaku=0`,
                thumbnail: '',
            };
        }
        if (aid) {
            return {
                provider: 'bilibili',
                id: `av${aid}`,
                embedUrl: `https://player.bilibili.com/player.html?aid=${aid}&page=${page}&autoplay=0&high_quality=1&danmaku=0`,
                thumbnail: '',
            };
        }
    }

    return null;
}

export function isDirectVideoUrl(url: string): boolean {
    return /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(url);
}

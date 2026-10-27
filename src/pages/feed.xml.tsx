import type { GetServerSideProps } from 'next';
import { getPublishedPosts } from '@/lib/notion';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/site';

function cdata(value: string): string {
    return `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

function rfc822(value: string): string | null {
    const time = Date.parse(value);
    if (!Number.isFinite(time)) return null;
    return new Date(time).toUTCString();
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
    try {
        posts = await getPublishedPosts();
    } catch (err) {
        console.error('生成 RSS 时读取 Notion 新闻失败:', err);
    }

    const items = posts
        .map((post) => {
            const link = `${SITE_URL}/posts/${post.id}`;
            const pubDate = rfc822(post.date);
            return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      <description>${cdata(post.summary || post.title)}</description>
    </item>`;
        })
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${cdata(`${SITE_NAME} News`)}</title>
    <link>${SITE_URL}/news</link>
    <description>${cdata(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    res.end(xml);

    return { props: {} };
};

export default function Feed() {
    return null;
}

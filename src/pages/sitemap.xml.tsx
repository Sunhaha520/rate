import type { GetServerSideProps } from 'next';
import { getPublishedPosts } from '@/lib/notion';
import { getAllMemberSlugs } from '@/lib/notion-members';
import { SITE_URL } from '@/lib/site';

interface SitemapEntry {
    path: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
}

const STATIC_PAGES: SitemapEntry[] = [
    { path: '/', changefreq: 'weekly', priority: '1.0' },
    { path: '/news', changefreq: 'weekly', priority: '0.9' },
    { path: '/publications', changefreq: 'monthly', priority: '0.9' },
    { path: '/project', changefreq: 'monthly', priority: '0.8' },
    { path: '/current-members', changefreq: 'monthly', priority: '0.8' },
    { path: '/former-members', changefreq: 'monthly', priority: '0.7' },
    { path: '/supervisor', changefreq: 'monthly', priority: '0.8' },
    { path: '/equipment', changefreq: 'monthly', priority: '0.7' },
    { path: '/demo', changefreq: 'monthly', priority: '0.7' },
    { path: '/join-us', changefreq: 'monthly', priority: '0.8' },
];

// 旧版写死的成员主页，Notion 里没有对应记录时仍然可以访问
const LEGACY_MEMBER_SLUGS = [
    'sunyifeng',
    'lychee',
    'zhoushaobin',
    'homanhin',
];

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    let postEntries: SitemapEntry[] = [];
    let memberSlugs: string[] = [];

    try {
        const [posts, slugs] = await Promise.all([
            getPublishedPosts(),
            getAllMemberSlugs(),
        ]);
        postEntries = posts.map((post) => ({
            path: `/posts/${post.id}`,
            lastmod: post.date || undefined,
            changefreq: 'yearly',
            priority: '0.6',
        }));
        memberSlugs = slugs;
    } catch (err) {
        console.error('生成 sitemap 时读取 Notion 数据失败:', err);
    }

    const members = Array.from(
        new Set([...memberSlugs, ...LEGACY_MEMBER_SLUGS])
    ).map<SitemapEntry>((slug) => ({
        path: `/members/${slug}`,
        changefreq: 'monthly',
        priority: '0.6',
    }));

    const urls = [...STATIC_PAGES, ...postEntries, ...members]
        .map(
            (entry) => `  <url>
    <loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>${
                entry.lastmod
                    ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
                    : ''
            }${
                entry.changefreq
                    ? `\n    <changefreq>${entry.changefreq}</changefreq>`
                    : ''
            }${
                entry.priority
                    ? `\n    <priority>${entry.priority}</priority>`
                    : ''
            }
  </url>`
        )
        .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    res.end(xml);

    return { props: {} };
};

export default function Sitemap() {
    return null;
}

import type { GetServerSideProps } from 'next';
import { SITE_URL } from '@/lib/site';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=3600, stale-while-revalidate=86400'
    );
    res.end(robots);

    return { props: {} };
};

export default function Robots() {
    return null;
}

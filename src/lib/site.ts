// 站点级 SEO 配置与 JSON-LD 辅助函数

// 生产环境建议在 Vercel 里配置 NEXT_PUBLIC_SITE_URL（例如 https://rate.um.edu.mo）。
// 没配置时依次使用 Vercel 提供的域名，最后回退到 localhost。
const explicitUrl =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || '';

const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const SITE_URL = (
    explicitUrl || (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const SITE_NAME = 'RATE@UM';

export const SITE_DESCRIPTION =
    'RATE@UM — Research Group of Advanced Technologies in Engineering, Department of Civil and Environmental Engineering, University of Macau. Research on BIM, multi-user AR/VR, construction robotics, computer vision and digital twins.';

export const DEFAULT_OG_IMAGE = '/img/bannercover.webp';

export function absoluteUrl(path = '/'): string {
    if (/^https?:\/\//i.test(path)) return path;
    return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function organizationJsonLd(name: string = SITE_NAME) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ResearchOrganization',
        name,
        alternateName:
            'Research Group of Advanced Technologies in Engineering',
        url: SITE_URL,
        logo: absoluteUrl('/logo.png'),
        description: SITE_DESCRIPTION,
        parentOrganization: {
            '@type': 'CollegeOrUniversity',
            name: 'University of Macau',
            url: 'https://www.um.edu.mo',
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Macau',
            addressCountry: 'MO',
        },
    };
}

export function websiteJsonLd(name: string = SITE_NAME) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name,
        alternateName:
            'Research Group of Advanced Technologies in Engineering',
        url: SITE_URL,
        inLanguage: 'en',
    };
}

export function breadcrumbJsonLd(
    items: Array<{ name: string; path: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(item.path),
        })),
    };
}

export function itemListJsonLd(
    items: Array<{ name: string; path: string }>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: absoluteUrl(item.path),
        })),
    };
}

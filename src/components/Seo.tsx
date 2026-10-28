import Head from 'next/head';
import type { ReactNode } from 'react';
import {
    SITE_NAME,
    SITE_DESCRIPTION,
    DEFAULT_OG_IMAGE,
    absoluteUrl,
} from '@/lib/site';

interface SeoProps {
    title?: string;
    description?: string;
    // 规范路径（站内路径，例如 /news），用于 canonical / og:url
    path: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    noindex?: boolean;
    publishedTime?: string;
    modifiedTime?: string;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
    children?: ReactNode;
}

// 统一输出 title / meta / canonical / Open Graph / JSON-LD。
// 标题格式统一为 “页面标题 | RATE@UM”，首页不重复后缀。
export function Seo({
    title,
    description,
    path,
    image,
    type = 'website',
    noindex = false,
    publishedTime,
    modifiedTime,
    jsonLd,
    children,
}: SeoProps) {
    const fullTitle =
        !title || title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
    const desc = (description || SITE_DESCRIPTION).slice(0, 300);
    const canonical = absoluteUrl(path);
    const imageUrl = absoluteUrl(image || DEFAULT_OG_IMAGE);
    const structuredData = jsonLd
        ? Array.isArray(jsonLd)
            ? jsonLd
            : [jsonLd]
        : [];

    return (
        <Head>
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <link rel="canonical" href={canonical} />
            <meta
                name="robots"
                content={noindex ? 'noindex,nofollow' : 'index,follow'}
            />

            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:locale" content="en_US" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={imageUrl} />

            {type === 'article' && publishedTime && (
                <meta
                    property="article:published_time"
                    content={publishedTime}
                />
            )}
            {type === 'article' && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}

            {structuredData.map((item, index) => (
                <script
                    key={`jsonld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(item).replace(/</g, '\\u003c'),
                    }}
                />
            ))}

            {children}
        </Head>
    );
}

export default Seo;

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { RouteProgress } from '@/components/RouteProgress';
import { organizationJsonLd, websiteJsonLd } from '@/lib/site';
import '@/styles/globals.css';

// 动态导入 ThemeToggle 组件，禁用 SSR
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
});

// 站点字体（霞鹜新致宋）不再阻塞首屏：
// 页面先用系统宋体栈渲染，字体表在空闲时异步加载，加载完成后自动替换。
const FONT_STYLESHEET = 'https://static.zeoseven.com/zsft/22/main/result.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_STYLESHEET}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_STYLESHEET;
    document.head.appendChild(link);
  }, []);

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0d9488" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RATE@UM News"
          href="/feed.xml"
        />
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()).replace(
              /</g,
              '\\u003c'
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd()).replace(/</g, '\\u003c'),
          }}
        />
      </Head>

      <RouteProgress />

      <main>
        <Component {...pageProps} />
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}

import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import App, { AppContext, AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { RouteProgress } from '@/components/RouteProgress';
import { organizationJsonLd, websiteJsonLd } from '@/lib/site';
import {
    DEFAULT_SITE_SETTINGS,
    SiteSettingsProvider,
    type SiteSettings,
} from '@/lib/site-settings';
import '@/styles/globals.css';

// 动态导入 ThemeToggle 组件，禁用 SSR
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
});

// 站点字体（霞鹜新致宋）不再阻塞首屏：
// 页面先用系统宋体栈渲染，字体表在空闲时异步加载，加载完成后自动替换。
const FONT_STYLESHEET = 'https://static.zeoseven.com/zsft/22/main/result.css';

interface RateAppProps extends AppProps {
  siteSettings: SiteSettings;
}

function RateApp({
  Component,
  pageProps,
  siteSettings = DEFAULT_SITE_SETTINGS,
}: RateAppProps) {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_STYLESHEET}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = FONT_STYLESHEET;
    document.head.appendChild(link);
  }, []);

  const logo = siteSettings.logo || '/logo.png';

  return (
    <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
      <SiteSettingsProvider settings={siteSettings}>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="icon" href={logo} />
          <link rel="apple-touch-icon" href={logo} />
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
              __html: JSON.stringify(
                organizationJsonLd(siteSettings.siteName)
              ).replace(/</g, '\\u003c'),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                websiteJsonLd(siteSettings.siteName)
              ).replace(/</g, '\\u003c'),
            }}
          />
        </Head>

        <RouteProgress />

        <main>
          <Component {...pageProps} />
          <ThemeToggle />
        </main>
      </SiteSettingsProvider>
    </ThemeProvider>
  );
}

// 站点级设置（网站名称、Logo、Banner 等）在构建 / ISR 再生时读取，
// 通过 Context 提供给 Header / Footer / Seo 使用。
RateApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  let siteSettings: SiteSettings = DEFAULT_SITE_SETTINGS;
  try {
    // 动态 import：只在服务端 getInitialProps 中执行，避免把 Notion 内容管线打进浏览器包
    const { getSiteSettings } = await import('@/lib/notion-home');
    siteSettings = await getSiteSettings();
  } catch (err) {
    console.error('读取 Notion 站点设置失败，使用默认值:', err);
  }

  return { ...appProps, siteSettings };
};

export default RateApp;

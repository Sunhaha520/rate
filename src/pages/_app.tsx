import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
import Head from 'next/head'; // 引入 Head 组件
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// 动态导入 ThemeToggle 组件，禁用 SSR
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" enableSystem>
      {/* 全局 Head 内容 */}
      <Head>
        <html lang="en" /> {/* 设置 lang 属性 */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="RATE@UM - Research Group of Advanced Technologies in Engineering" />
        <link rel="icon" type="image/png" href="/logo.png"></link>
        <title>RATE@UM</title> {/* 默认标题，页面中可以覆盖 */}
        <link rel="stylesheet" href="https://static.zeoseven.com/zsft/22/main/result.css" />

        {/* 插入百度统计脚本 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?5dd1291981c0ce9262475e9714893674";
                var s = document.getElementsByTagName("script")[0]; 
                s.parentNode.insertBefore(hm, s);
              })();
            `,
          }}
        />
      </Head>

      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        <Component {...pageProps} />
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}
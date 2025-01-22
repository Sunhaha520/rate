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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="RATE@UM - Research Group of Advanced Technologies in Engineering" />
        <link rel="icon" type="image/png" href="/logo.png"></link>
        <title>RATE@UM</title> {/* 默认标题，页面中可以覆盖 */}
      </Head>

      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        <Component {...pageProps} />
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}
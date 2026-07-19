import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head'; // 引入 Head 组件
import '@/styles/globals.css';

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
        <link rel="icon" type="image/png" href="/logo.png" />
        <title>RATE@UM</title> {/* 默认标题，页面中可以覆盖 */}
      </Head>

      <main className="font-sans">
        <Component {...pageProps} />
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}

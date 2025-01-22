import { ThemeProvider } from 'next-themes';
import { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import dynamic from 'next/dynamic';
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
      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        <Component {...pageProps} />
        <ThemeToggle />
      </main>
    </ThemeProvider>
  );
}
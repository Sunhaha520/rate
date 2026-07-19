import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head'; // 引入 Head 组件
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';
import { CalendarDays, Clock } from 'lucide-react';

export default function Post({ postData }: InferGetStaticPropsType<typeof getStaticProps>) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [cleanHtml, setCleanHtml] = useState('');
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 动态加载 DOMPurify 并清理 HTML 内容
  useEffect(() => {
    import('dompurify').then((module) => {
      const DOMPurify = module.default(window) as {
        sanitize: (input: string) => string;
      };
      if (postData.contentHtml) {
        setCleanHtml(DOMPurify.sanitize(postData.contentHtml));
      }
    });
  }, [postData.contentHtml]);

  // IntersectionObserver 逻辑
  useEffect(() => {
    const titleElement = titleRef.current;
    const dateElement = dateRef.current;
    const contentElement = contentRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1,
      }
    );

    if (titleElement) observer.observe(titleElement);
    if (dateElement) observer.observe(dateElement);
    if (contentElement) observer.observe(contentElement);

    return () => {
      observer.disconnect();
    };
  }, [mounted, theme]); // 依赖 mounted 和 theme

  // 确保组件在客户端渲染后再应用主题
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* 动态设置 Head 内容 */}
      <Head>
        <title>{postData.title} - RATE@UM</title>
        <meta name="description" content={postData.excerpt || 'A news post from RATE@UM.'} />
        <meta property="og:title" content={`${postData.title} - RATE@UM`} />
        <meta property="og:description" content={postData.excerpt || 'A news post from RATE@UM.'} />
        <meta property="og:type" content="article" />
      </Head>

      <header>
        <Header />
      </header>

      <main className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-6 sm:pb-10">
        <div className="mx-auto w-full max-w-3xl">
          {/* 文章卡片 */}
          <article
            className={`rounded-xl shadow-md overflow-hidden ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            }`}
          >
            <div className="px-6 sm:px-8 md:px-10 pt-0 pb-10 sm:pb-12 md:pb-14">
              <h1
                ref={titleRef}
                className={`text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mt-0 mb-4 opacity-0 translate-y-10 transition-all duration-500 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {postData.title}
              </h1>

              <div
                ref={dateRef}
                className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-8 pb-6 border-b opacity-0 translate-y-10 transition-all duration-500 delay-100 ${
                  isDark ? 'text-slate-400 border-slate-700/60' : 'text-slate-500 border-slate-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={15} strokeWidth={2} className="text-teal-500" />
                  <span>{postData.date}</span>
                </span>
                {postData.readingTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} strokeWidth={2} className="text-teal-500" />
                    <span>{postData.readingTime} min read</span>
                  </span>
                )}
              </div>

              <div
                ref={contentRef}
                className={`prose prose-slate max-w-none prose-headings:font-bold prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:mx-auto opacity-0 translate-y-10 transition-all duration-500 delay-200 ${
                  isDark ? 'prose-invert prose-a:text-teal-400' : ''
                }`}
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            </div>
          </article>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  return {
    props: {
      postData,
    },
  };
};

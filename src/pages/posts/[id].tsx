import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';


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

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <header>
        <Header />
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1
          ref={titleRef}
          className={`text-3xl font-bold mb-4 opacity-0 translate-y-10 transition-all duration-500 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {postData.title}
        </h1>

        <div
          ref={dateRef}
          className={`text-gray-500 mb-4 opacity-0 translate-y-10 transition-all duration-500 delay-100 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {postData.date}
        </div>

        <div
          ref={contentRef}
          className={`prose opacity-0 translate-y-10 transition-all duration-500 delay-200 ${
            theme === 'dark' ? 'prose-dark' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
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
import { GetStaticPaths, GetStaticProps } from 'next';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface PostProps {
  postData: {
    id: string;
    title: string;
    date: string;
    contentHtml: string;
  };
}

export default function Post({ postData }: PostProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            observer.unobserve(entry.target); // 动画触发后取消观察
          }
        });
      },
      {
        rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
        threshold: 0.1, // 当元素10%进入视口时触发
      }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (dateRef.current) observer.observe(dateRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (dateRef.current) observer.unobserve(dateRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <Header />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <h1
          ref={titleRef}
          className="text-3xl font-bold mb-4 opacity-0 translate-y-10 transition-all duration-500"
        >
          {postData.title}
        </h1>

        {/* 日期 */}
        <div
          ref={dateRef}
          className="text-gray-500 mb-4 opacity-0 translate-y-10 transition-all duration-500 delay-100"
        >
          {postData.date}
        </div>

        {/* 内容 */}
        <div
          ref={contentRef}
          className="prose opacity-0 translate-y-10 transition-all duration-500 delay-200"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </main>

      {/* Footer */}
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
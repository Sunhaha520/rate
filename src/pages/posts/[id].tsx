import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { ArticleContent } from '@/components/ArticleContent';
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/site';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';

export default function Post({ postData }: InferGetStaticPropsType<typeof getStaticProps>) {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: postData.title,
    description: postData.summary || undefined,
    datePublished: postData.date || undefined,
    dateModified: postData.date || undefined,
    image: postData.picture ? [absoluteUrl(postData.picture)] : undefined,
    author: { '@type': 'Organization', name: 'RATE@UM' },
    publisher: {
      '@type': 'Organization',
      name: 'RATE@UM',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: absoluteUrl(`/posts/${postData.id}`),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Seo
        title={postData.title}
        path={`/posts/${postData.id}`}
        description={postData.summary || 'A news post from RATE@UM.'}
        image={postData.picture || undefined}
        type="article"
        publishedTime={postData.date || undefined}
        jsonLd={[
          articleJsonLd,
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'News', path: '/news' },
            { name: postData.title, path: `/posts/${postData.id}` },
          ]),
        ]}
      />

      <Header />

      <main className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10 sm:pb-14">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm mb-4 text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to News
          </Link>

          <article className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            {/* 顶部学术感细装饰线 */}
            <div className="h-1 w-full bg-gradient-to-r from-teal-600/80 via-teal-500/35 to-transparent" />

            <div className="px-6 sm:px-8 md:px-10 pt-7 sm:pt-9 pb-10 sm:pb-12">
              <h1 className="text-2xl sm:text-3xl md:text-[2.15rem] font-bold leading-[1.28] tracking-tight text-gray-900 dark:text-white">
                {postData.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm pb-6 mb-8 border-b border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
                  <time dateTime={postData.date}>{postData.date}</time>
                </span>
                {postData.readingTime && (
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
                    <span>{postData.readingTime} min read</span>
                  </span>
                )}
                <span className="ml-auto inline-flex items-center rounded-full border border-teal-600/25 dark:border-teal-400/25 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 text-xs font-medium tracking-wide text-teal-700 dark:text-teal-300">
                  News
                </span>
              </div>

              {postData.contentHtml ? (
                <ArticleContent html={postData.contentHtml} />
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  This page has no content yet.
                </p>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  let posts: Awaited<ReturnType<typeof getSortedPostsData>> = [];
  try {
    posts = await getSortedPostsData();
  } catch (err) {
    console.error('读取 Notion 新闻失败，文章将在访问时按需生成:', err);
  }

  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  return {
    paths,
    // Notion 新增文章后可通过 fallback 按需生成，无需重新构建
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params?.id as string);
  return {
    props: {
      postData,
    },
    // 每 60 秒增量再生，确保 Notion 更新后网站自动同步
    revalidate: 60,
  };
};

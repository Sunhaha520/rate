import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { itemListJsonLd } from '@/lib/site';
import { getSortedPostsData, PostData } from '@/lib/posts';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';

interface NewsProps {
    allPosts: PostData[];
}

const News: React.FC<NewsProps> = ({ allPosts }) => {
    const [loadedCount, setLoadedCount] = useState(5); // 初始加载的新闻数量

    // 初始加载新闻
    const visiblePosts = allPosts.slice(0, loadedCount);

    // 加载更多新闻
    const loadMore = () => {
        setLoadedCount((prev) => prev + 5); // 每次加载 5 条新闻
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="News"
                path="/news"
                description="Latest news, conferences, awards and activities from RATE@UM, the Research Group of Advanced Technologies in Engineering at the University of Macau."
                jsonLd={itemListJsonLd(
                    allPosts.map((post) => ({
                        name: post.title,
                        path: `/posts/${post.id}`,
                    }))
                )}
            />

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* News Section */}
                <section>
                    {/* 标题卡片 */}
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">All News</h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Stay updated with the latest news from RATE@UM.
                        </p>
                    </div>

                    {/* 新闻列表 */}
                    <div className="space-y-6">
                        {visiblePosts.map((post) => (
                            <div
                                key={post.id}
                                className="card-enter bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105"
                            >
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="block cursor-pointer group"
                                    aria-label={`Read more about ${post.title}`}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* 图片部分：固定比例，避免图片把卡片撑高 */}
                                        {/* 图片部分：没有图片时整块省略 */}
                                        {post.picture && (
                                            <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 md:h-auto md:min-h-[13.5rem] md:w-[42%]">
                                                <img
                                                    src={post.picture}
                                                    alt={post.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                                />
                                                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
                                                    <CalendarDays size={12} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
                                                    <time dateTime={post.date}>{post.date}</time>
                                                </span>
                                            </div>
                                        )}
                                        {/* 标题、摘要与阅读入口 */}
                                        <div className={`flex w-full flex-col p-6 md:p-7 ${post.picture ? 'md:w-[58%]' : ''}`}>
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                                {!post.picture && post.date && (
                                                    <>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <CalendarDays size={13} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
                                                            <time dateTime={post.date}>{post.date}</time>
                                                        </span>
                                                        <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
                                                    </>
                                                )}
                                                {post.readingTime && (
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock size={13} strokeWidth={2} className="text-teal-600 dark:text-teal-400" />
                                                        <span>{post.readingTime} min read</span>
                                                    </span>
                                                )}
                                                <span className="h-3 w-px bg-slate-200 dark:bg-slate-700" />
                                                <span className="uppercase tracking-[0.16em]">News</span>
                                            </div>
                                            <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300 md:text-xl">
                                                {post.title}
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {post.summary}
                                            </p>
                                            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-teal-700 dark:text-teal-300">
                                                Read article
                                                <ArrowRight
                                                    size={15}
                                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Load More 按钮 */}
                    {loadedCount < allPosts.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                className="px-5 py-2 text-sm font-medium rounded-lg border border-teal-600/30 dark:border-teal-400/30 bg-teal-50/60 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-500/20 transition-colors"
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default News;

export async function getStaticProps() {
    let allPosts: PostData[] = [];
    try {
        allPosts = await getSortedPostsData();
    } catch (err) {
        console.error('读取 Notion 新闻失败，新闻列表暂为空:', err);
    }

    return {
        props: {
            allPosts,
        },
        // 每 60 秒增量再生，确保 Notion 更新后网站自动同步
        revalidate: 60,
    };
}

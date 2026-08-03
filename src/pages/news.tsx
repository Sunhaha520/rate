import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getSortedPostsData, PostData } from '@/lib/posts';
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子
import { CalendarDays, Clock } from 'lucide-react';

interface NewsProps {
    allPosts: PostData[];
}

const News: React.FC<NewsProps> = ({ allPosts }) => {
    const [visibleNews, setVisibleNews] = useState<number[]>([]);
    const [visiblePosts, setVisiblePosts] = useState<PostData[]>([]);
    const [loadedCount, setLoadedCount] = useState(5); // 初始加载的新闻数量
    const newsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    // 初始加载新闻
    useEffect(() => {
        setVisiblePosts(allPosts.slice(0, loadedCount));
    }, [allPosts, loadedCount]);

    // 加载更多新闻
    const loadMore = () => {
        setLoadedCount((prev) => prev + 5); // 每次加载 5 条新闻
    };

    // Intersection Observer 配置（用于新闻）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleNews((prev) => [...prev, index]);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px 100px 0px',
                threshold: 0.1,
            }
        );

        newsRefs.current.forEach((news) => {
            if (news) observer.observe(news);
        });

        return () => {
            observer.disconnect();
        };
    }, [visiblePosts]);

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>All News - RATE@UM</title>
                <meta name="description" content="Stay updated with the latest news from RATE@UM." />
                <meta property="og:title" content="All News - RATE@UM" />
                <meta property="og:description" content="Stay updated with the latest news from RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* News Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">All News</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Stay updated with the latest news from RATE@UM.
                        </p>
                    </div>

                    {/* 新闻列表 */}
                    <div className="space-y-6">
                        {visiblePosts.map((post, index) => (
                            <div
                                key={post.id}
                                ref={(el) => {
                                    newsRefs.current[index] = el; // 绑定新闻引用
                                }}
                                data-index={index}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                    visibleNews.includes(index)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                <a href={`/posts/${post.id}`} className="block cursor-pointer" aria-label={`Read more about ${post.title}`}>
                                    <div className="flex flex-col md:flex-row">
                                        {/* 图片部分 */}
                                        <div className="md:w-1/3">
                                            <img
                                                src={post.picture}
                                                alt={post.title}
                                                className="object-cover w-full h-48 md:h-full"
                                            />
                                        </div>
                                        {/* 标题、发布时间和简介部分 */}
                                        <div className="p-6 md:w-2/3 relative flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2 dark:text-white">{post.title}</h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <CalendarDays size={14} strokeWidth={2} className="text-teal-500" />
                                                        <span>{post.date}</span>
                                                    </span>
                                                    {post.readingTime && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock size={14} strokeWidth={2} className="text-teal-500" />
                                                            <span>{post.readingTime} min read</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 dark:text-gray-300 leading-[1.2em] flex flex-col whitespace-normal sm:max-h-full sm:overflow-visible sm:text-clip md:max-h-[3.6em] md:overflow-hidden md:text-ellipsis">
                                                    <span className="overflow-hidden sm:block sm:-webkit-box sm:-webkit-line-clamp-full sm:-webkit-box-orient-vertical md:block md:-webkit-box md:-webkit-line-clamp-3 md:-webkit-box-orient-vertical">
                                                        {post.summary}
                                                    </span>
                                                </p>
                                            </div>
                                            <span
                                                className="mt-4 px-6 py-2 !bg-blue-500 !text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 self-center sm:self-center md:self-end"
                                            >
                                                Read More
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Load More 按钮 */}
                    {loadedCount < allPosts.length && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMore}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
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
    const allPosts = await getSortedPostsData();
    return {
        props: {
            allPosts,
        },
        // 每 60 秒增量再生，确保 Notion 更新后网站自动同步
        revalidate: 60,
    };
}

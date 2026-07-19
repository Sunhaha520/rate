import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { researchDirections } from '@/data/researchDirections';
import { getSortedPostsData, PostData } from '@/lib/posts';
import Link from 'next/link'; // 引入 Link 组件
import { CalendarDays, Clock } from 'lucide-react';

interface HomeProps {
    latestPosts: PostData[];
}

const Home: React.FC<HomeProps> = ({ latestPosts }) => {
    const [loading, setLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState<number[]>([]);
    const [visibleNews, setVisibleNews] = useState<number[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const newsRefs = useRef<(HTMLDivElement | null)[]>([]);

    // 预加载 Banner 图片
    useEffect(() => {
        const preloadBanner = async () => {
            try {
                const bannerImage = new Image();
                bannerImage.src = '/img/bannercover.webp';
                await bannerImage.decode();
            } catch (error) {
                console.error('Error preloading banner image:', error);
            } finally {
                setLoading(false);
            }
        };

        preloadBanner();
    }, []);

    // Intersection Observer 配置（用于卡片）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleCards((prev) => [...prev, index]);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px 100px 0px',
                threshold: 0.1,
            }
        );

        cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        return () => {
            observer.disconnect();
        };
    }, []); // 移除 researchDirections 依赖

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
    }, [latestPosts]); // 保留 latestPosts 依赖

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80 dark:bg-gray-800 dark:bg-opacity-80">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            )}

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Banner Section */}
                <section className="relative mb-12">
                    <div className="relative w-full rounded-xl overflow-hidden flex justify-center items-center">
                        <img
                            src="/img/bannercover.webp"
                            alt="Banner"
                            className="block w-full h-auto"
                        />
                        {/* 渐变遮罩：底部更深，提升文字可读性 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>
                        <div className="absolute z-10 text-center px-6 max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight !text-white drop-shadow-lg">
                                RATE@UM
                            </h1>
                            <p className="mt-3 text-base md:text-xl font-medium !text-white/90 text-center tracking-wide drop-shadow">
                                Research Group of Advanced Technologies in Engineering
                            </p>
                        </div>
                    </div>
                </section>

                {/* Research Group Introduction Section */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        {/* Logo Section */}
                        <div className="p-6 md:w-1/3 text-center order-1 md:order-1 flex justify-center">
                            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white shadow-lg transform transition-transform duration-300 hover:scale-110 shrink-0">
                                <img
                                    src="/img/logo.png"
                                    alt="Logo"
                                    className="w-20 h-20 object-contain rounded-full"
                                />
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="p-6 md:w-2/3 order-1 md:order-2">
                            <h2 className="text-xl font-semibold mb-4 text-center md:text-left dark:text-white">
                                Here is RATE@UM
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300">
                                RATE@UM (Research Group of Advanced Technologies in Engineering) is a research group in the Department of Civil and Environment Engineering, Faculty of Science and Technology at the University of Macau. We are dedicated to driving innovative research and development in civil engineering and other related interdisciplinary fields. Our vision is to develop and leverage collaborative intelligence technologies to integrate human beings, physical environments, and digital twins seamlessly towards a safer and more sustainable future.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Research Direction Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                        Research Directions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {researchDirections.map((card, index) => (
                            <div
                                key={card.id}
                                ref={(el) => {
                                    cardRefs.current[index] = el; // 绑定卡片引用
                                }}
                                data-index={index}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out hover:scale-105 ${
                                    visibleCards.includes(index)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                {/* 图片部分 */}
                                <div className=" bg-gray-200 rounded-t-xl overflow-hidden relative"> {/* 减小高度 */}
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                                {/* 内容部分 */}
                                <div className="p-4 min-h-[80px] flex items-center justify-center"> {/* 减小 padding 和 min-h */}
                                    <h2 className="text-md font-semibold dark:text-white text-center">{card.title}</h2> {/* 减小字体大小 */}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="mt-12">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                        Latest News
                    </h2>
                    <div className="space-y-6">
                        {latestPosts.map((post, index) => (
                            <div
                                key={post.id}
                                ref={(el) => {
                                    newsRefs.current[index] = el; // 绑定新闻引用
                                }}
                                data-index={index}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out hover:scale-105 ${
                                    visibleNews.includes(index)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
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
                                            <p className="text-gray-700 dark:text-gray-300 leading-[1.2em] flex flex-col whitespace-normal md:max-h-[3.6em] md:overflow-hidden md:text-ellipsis">
                                                <span className="overflow-hidden md:block md:-webkit-box md:-webkit-line-clamp-3 md:-webkit-box-orient-vertical">
                                                    {post.summary}
                                                </span>
                                            </p>
                                        </div>
                                        <a
                                            href={`/posts/${post.id}`}
                                            className="mt-4 px-6 py-2 !bg-blue-500 !text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 self-center md:self-end "
                                            aria-label={`Read more about ${post.title}`}
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 新增的总的 Read More 按钮 */}
                    <Link
                        href="/news"
                        className="mt-6 block w-fit px-6 py-2 mx-auto !bg-orange-500 !text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 hover:scale-105"
                        aria-label="Read more news"
                    >
                        Read more news
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;

export async function getStaticProps() {
    const latestPosts = getSortedPostsData().slice(0, 3);
    return {
        props: {
            latestPosts,
        },
    };
}

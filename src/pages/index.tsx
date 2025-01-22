import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { researchDirections } from '@/data/researchDirections';
import { getSortedPostsData, PostData } from '@/lib/posts';

interface HomeProps {
    latestPosts: PostData[];
}

const Home: React.FC<HomeProps> = ({ latestPosts }) => {
    const [loading, setLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState<number[]>([]);
    const [visibleNews, setVisibleNews] = useState<number[]>([]);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const newsRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme, setTheme } = useTheme();

    // 切换主题
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // 预加载 Banner 图片
    useEffect(() => {
        const preloadBanner = async () => {
            try {
                const bannerImage = new Image();
                bannerImage.src = '/img/banner.webp';
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
    }, [researchDirections]);

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
    }, [latestPosts]);

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
                    <div className="relative h-64 md:h-96 bg-gray-200 rounded-xl overflow-hidden flex justify-center items-center">
                        <img
                            src="/img/banner.webp"
                            alt="Banner"
                            className="absolute inset-0 object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                        <div className="relative z-10 text-center text-white flex items-center space-x-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold">RATE@UM</h1>
                                <p className="text-lg">Research Group of Advanced Technologies in Engineering</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Research Group Introduction Section */}
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row items-center bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                        {/* Logo Section */}
                        <div className="p-6 md:w-1/3 text-center order-2 md:order-1">
                            <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-white shadow-lg transform transition-transform duration-300 hover:scale-110">
                                <img
                                    src="/img/logo.jpg"
                                    alt="Logo"
                                    className="w-20 h-20 object-contain rounded-full"
                                />
                            </div>
                        </div>

                        {/* Text Section */}
                        <div className="p-6 md:w-2/3 order-1 md:order-2">
                            <h3 className="text-xl font-semibold mb-4 text-center md:text-left dark:text-white">👋 Here is RATE@UM</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                RATE@UM, a research team at the University of Macau, focuses on engineering innovation, covering architecture, construction, and smart technologies to enhance industry efficiency and sustainability.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Research Direction Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                        🔬 Research Directions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {researchDirections.map((card, index) => (
                            <div
                                key={card.id}
                                ref={(el) => (cardRefs.current[index] = el)}
                                data-index={index}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out hover:scale-105 ${
                                    visibleCards.includes(index)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                }`}
                            >
                                {/* 图片部分 */}
                                <div className="h-48 bg-gray-200 rounded-t-xl overflow-hidden relative">
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                                {/* 内容部分 */}
                                <div className="p-6 min-h-[200px]">
                                    <h2 className="text-xl font-semibold mb-2 dark:text-white">{card.title}</h2>
                                    <p className="text-gray-700 dark:text-gray-300">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="mt-8">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                        📰 Latest News
                    </h2>
                    <div className="space-y-6">
                        {latestPosts.map((post, index) => (
                            <div
                                key={post.id}
                                ref={(el) => (newsRefs.current[index] = el)}
                                data-index={index}
                                className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out ${
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
                                    <div className="p-6 md:w-2/3">
                                        <h3 className="text-lg font-semibold mb-2 dark:text-white">{post.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">Published on: {post.date}</p>
                                        <p className="text-gray-700 dark:text-gray-300">{post.summary}</p>
                                        <a
                                            href={`/posts/${post.id}`}
                                            className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                                        >
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
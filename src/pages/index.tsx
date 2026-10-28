import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { researchDirections } from '@/data/researchDirections';
import { getHomeLogo } from '@/lib/notion-home';
import {
    getResearchDirections,
    type DirectionItem,
} from '@/lib/notion-directions';
import { getSortedPostsData, PostData } from '@/lib/posts';
import Link from 'next/link'; // 引入 Link 组件
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';

interface HomeProps {
    latestPosts: PostData[];
    logo: string;
    directions: DirectionItem[];
}

const Home: React.FC<HomeProps> = ({ latestPosts, logo, directions }) => {
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="RATE@UM"
                path="/"
                image="/img/bannercover.webp"
                description="RATE@UM is a research group at the University of Macau working on BIM, multi-user AR/VR, construction robotics, computer vision and digital twins for the AECO industry."
            />
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
                                    src={logo}
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
                                RATE@UM (Research Group of Advanced Technologies in Engineering) is a research group in the Department of Civil and Environment Engineering, Faculty of Engineering at the University of Macau. We are dedicated to driving innovative research and development in civil engineering and other related interdisciplinary fields. Our vision is to develop and leverage collaborative intelligence technologies to integrate human beings, physical environments, and digital twins seamlessly towards a safer and more sustainable future.
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
                        {directions.map((card) => (
                            <a
                                key={card.id}
                                href={card.link || undefined}
                                {...(card.link
                                    ? {
                                          target: '_blank',
                                          rel: 'noopener noreferrer',
                                      }
                                    : {})}
                                className="card-enter block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out hover:scale-105"
                            >
                                {/* 图片部分 */}
                                <div className=" bg-gray-200 rounded-t-xl overflow-hidden relative"> {/* 减小高度 */}
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                                {/* 内容部分 */}
                                <div className="p-4 min-h-[80px] flex items-center justify-center"> {/* 减小 padding 和 min-h */}
                                    <h2 className="text-md font-semibold dark:text-white text-center">{card.name}</h2> {/* 减小字体大小 */}
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                {/* Latest News Section */}
                <section className="mt-12">
                    <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
                        Latest News
                    </h2>
                    <div className="space-y-6">
                        {latestPosts.map((post) => (
                            <article
                                key={post.id}
                                className="card-enter group overflow-hidden rounded-xl shadow-md bg-white dark:bg-gray-800 transition-all duration-500 ease-out hover:scale-105"
                            >
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="flex flex-col md:flex-row"
                                    aria-label={`Read more about ${post.title}`}
                                >
                                    {/* 图片部分：有图才显示，避免空白占位 */}
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
                                </Link>
                            </article>
                        ))}
                    </div>
                    {/* 新增的总的 Read More 按钮 */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/news"
                            className="group inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-sm font-medium text-teal-700 transition-colors hover:border-teal-600 dark:text-teal-300 dark:hover:border-teal-400"
                            aria-label="Read more news"
                        >
                            Read more news
                            <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;

export async function getStaticProps() {
    let latestPosts: PostData[] = [];
    try {
        const allPosts = await getSortedPostsData();
        latestPosts = allPosts.slice(0, 3);
    } catch (err) {
        console.error('读取 Notion 新闻失败，首页暂不显示新闻:', err);
    }
    let logo = '/img/logo.png';
    try {
        logo = await getHomeLogo();
    } catch (err) {
        console.error('读取 Notion Home Logo 失败，使用本地 Logo:', err);
    }

    let directions: DirectionItem[] = [];
    try {
        directions = await getResearchDirections();
    } catch (err) {
        console.error('读取 Notion 研究方向失败，使用本地数据:', err);
    }
    if (directions.length === 0) {
        directions = researchDirections.map((item, index) => ({
            id: String(item.id),
            name: item.title,
            description: item.description,
            image: item.image,
            link: '',
            order: index,
        }));
    }

    return {
        props: {
            latestPosts,
            logo,
            directions,
        },
        // 每 60 秒增量再生，确保 Notion 更新后网站自动同步
        revalidate: 60,
    };
}

// 确保在客户端渲染
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';
import { mentor, researches, MentorInfo, Research } from '@/data/personal';

interface MentorPageProps {
    mentor: MentorInfo;
    researches: Research[];
}

const MentorPage: React.FC<MentorPageProps> = ({ mentor, researches }) => {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 检查初始视口内的元素
    useEffect(() => {
        if (mounted) {
            const initialVisibleIndices: number[] = [];
            itemRefs.current.forEach((item, index) => {
                if (item && isElementInViewport(item)) {
                    initialVisibleIndices.push(index);
                }
            });
            setVisibleItems(initialVisibleIndices);
        }
    }, [mounted]);

    // Intersection Observer 配置
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleItems((prev) => [...prev, index]);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1,
            }
        );

        itemRefs.current.forEach((item) => {
            if (item) observer.observe(item);
        });

        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isElementInViewport = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // GitHub SVG
    const GitHubSVG = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 hover:stroke-red-500 transition-colors duration-200"
        >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
    );

    // Paper Website SVG
    const PaperSVG = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 hover:stroke-blue-500 transition-colors duration-200"
        >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
            <path d="M18 14h-8"></path>
            <path d="M15 18h-5"></path>
            <path d="M10 6h8v4h-8V6Z"></path>
        </svg>
    );

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Head>
                {/* 转义 ' 字符 */}
                <title>{mentor.name}&apos;s Profile - RATE@UM</title>
                <meta name="description" content={`Explore the profile and latest research of ${mentor.name}&apos; at RATE@UM.`} />
                <meta property="og:title" content={`${mentor.name}&apos;s Profile - RATE@UM`} />
                <meta property="og:description" content={`Explore the profile and latest research of ${mentor.name}&apos; at RATE@UM.`} />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* 添加类似标题的部分 */}
                <div
                    className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} ${theme === 'dark' ? 'bg-scrolling-animation-dark' : 'bg-scrolling-animation'}`}
                >
                    <h2 className="text-3xl font-bold mb-4 text-center">👨‍🏫 {mentor.name}</h2>
                    <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Supervisor of RATE@UM.
                    </p>
                </div>

                {/* Biography Section */}
                <section className="">
                    <div
                        ref={(el) => {
                            itemRefs.current[0] = el;
                        }}
                        data-index={0}
                        className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out ${
                            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-center space-y-6 md:space-y-0 md:space-x-8">
                            <div className="flex-shrink-0 w-48 h-48 rounded-full overflow-hidden">
                                <img
                                    src={mentor.photo}
                                    alt={mentor.name}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                {mentor.bio}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Selected latest research Section */}
                <section className="">
                    <h2
                        ref={(el) => {
                            itemRefs.current[1] = el;
                        }}
                        data-index={1}
                        className={`text-2xl font-bold mb-4 text-center ${
                            visibleItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                        Selected latest research
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                        {researches.map((research, index) => {
                            const itemIndex = index + 2;
                            return (
                                <div
                                    key={research.id}
                                    ref={(el) => {
                                        itemRefs.current[itemIndex] = el;
                                    }}
                                    data-index={itemIndex}
                                    className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out ${
                                        visibleItems.includes(itemIndex) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                    } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* 调整图片容器宽度和高度 */}
                                        <div className="w-full md:w-1/4 h-28 md:h-auto">
                                            <img
                                                src={research.photo}
                                                alt={research.name}
                                                className="object-cover w-full h-full"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/path/to/fallback-image.jpg';
                                                }}
                                            />
                                        </div>
                                        <div className="w-full md:w-3/4 p-4">
                                            <h2 className="text-xl font-semibold mb-2">{research.name}</h2>
                                            <p className="text-sm mb-2">{research.author}</p>
                                            <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {research.intro}
                                            </p>
                                            {/* 使用响应式 flex 布局 */}
                                            <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                                                <p className="mb-0">For more details, please see:</p>
                                                <div className="flex items-center space-x-4">
                                                    {research.detailsLinks.github && (
                                                        <a
                                                            href={research.detailsLinks.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-1 hover:!text-red-500 hover:!stroke-red-500 transition-colors duration-200"
                                                        >
                                                            <GitHubSVG />
                                                            <span>GitHub</span>
                                                        </a>
                                                    )}
                                                    {research.detailsLinks.paperWebsite && (
                                                        <a
                                                            href={research.detailsLinks.paperWebsite}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center space-x-1 hover:!text-blue-500 hover:!stroke-blue-500 transition-colors duration-200"
                                                        >
                                                            <PaperSVG />
                                                            <span>Paper Website</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MentorPage;

// 使用 getStaticProps 获取数据
export async function getStaticProps() {
    return {
        props: {
            mentor,
            researches,
        },
    };
}

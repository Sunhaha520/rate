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
                        <div className="flex flex-col md:flex-row items-center md:items-start">
                            <img 
                                src={mentor.photo} 
                                alt={mentor.name} 
                                className="w-48 h-48 rounded-full object-cover md:mr-6 mb-6 md:mb-0" 
                            />
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
                        className={`text-3xl font-bold mb-4 text-center ${
                            visibleItems.includes(1)
                                ? 'opacity-100 translate-y-0' 
                                : 'opacity-0 translate-y-10' 
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
                                        visibleItems.includes(itemIndex)
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-10' 
                                    } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    style={{ minHeight: '200px' }} // 调整卡片高度
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="w-full md:w-1/3 h-40 md:h-auto"> {/* 调整图片高度 */}
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
                                        <div className="w-full md:w-2/3 p-4"> {/* 调整内边距 */}
                                            <h2 className="text-xl font-semibold mb-2">{research.name}</h2>
                                            <p className="text-sm mb-2">{research.author}</p>
                                            <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{research.intro}</p>
                                            <a 
                                                href={research.detailsLink} 
                                                className="text-blue-500 hover:underline"
                                            >
                                                For more details, please see
                                            </a>
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
            researches
        },
    };
}

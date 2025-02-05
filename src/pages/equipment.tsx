"use client"; // 确保在客户端渲染
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { devices, Device } from '@/data/devices'; // 引入设备数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

interface HomeProps {
    devices: Device[];
}

const DevicesPage: React.FC<HomeProps> = ({ devices }) => {
    const [loading, setLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState<number[]>([]); // 记录已加载的卡片索引
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储卡片的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题

    // 预加载图片
    useEffect(() => {
        const preloadImages = async () => {
            try {
                const imagePromises = devices.map((device) => {
                    const img = new Image();
                    img.src = device.image;
                    return img.decode().catch(() => {
                        console.error(`Failed to load image: ${device.image}`);
                    });
                });
                await Promise.all(imagePromises);
            } catch (error) {
                console.error('Error preloading images:', error);
            } finally {
                setLoading(false); // 无论成功与否，都关闭 loading
            }
        };

        preloadImages();
    }, [devices]);

    // 检查初始视口内的元素
    useEffect(() => {
        if (mounted) {
            const initialVisibleIndices: number[] = [];
            cardRefs.current.forEach((card, index) => {
                if (card && isElementInViewport(card)) {
                    initialVisibleIndices.push(index);
                }
            });
            setVisibleCards(initialVisibleIndices);
        }
    }, [mounted]);

    // Intersection Observer 配置（用于卡片和标题）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        console.log(`Element ${index} is visible`); // 添加日志
                        setVisibleCards((prev) => [...prev, index]); // 将可见元素的索引加入状态
                        observer.unobserve(entry.target); // 停止观察已加载的元素
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
                threshold: 0.1, // 当元素10%进入视口时触发
            }
        );

        // 观察所有卡片和标题
        cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        // 清理 Observer
        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]); // 依赖 mounted 和 theme

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    // 按分类分组设备
    const categoryGroups: { [key: string]: Device[] } = {};
    const categories = [
        'Construction robots',
        'Extended reality devices',
        'Reality capture and sensing devices',
        'High-performance computers'
    ];

    devices.forEach((device) => {
        if (!categoryGroups[device.category]) {
            categoryGroups[device.category] = [];
        }
        categoryGroups[device.category].push(device);
    });

    // 辅助函数：检查元素是否在视口内
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
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Our Equipment - RATE@UM</title>
                <meta name="description" content="Explore the advanced equipment in our laboratory at RATE@UM." />
                <meta property="og:title" content="Our Equipment - RATE@UM" />
                <meta property="og:description" content="Explore the advanced equipment in our laboratory at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            {/* Loading Overlay */}
            {loading && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800 bg-opacity-80' : 'bg-gray-100 bg-opacity-80'}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            )}

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Devices Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        {/* 标题居中 */}
                        <h2 className="text-3xl font-bold mb-4 text-center">🛠️ Our Equipment</h2>
                        {/* 副标题居中 */}
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore the advanced equipment in our laboratory.
                        </p>
                    </div>

                    {/* 按分类渲染设备 */}
                    {categories.map((category, categoryIndex) => {
                        let emoji;
                        switch (category) {
                            case 'Construction robots':
                                emoji = '🤖';
                                break;
                            case 'Extended reality devices':
                                emoji = '👓';
                                break;
                            case 'Reality capture and sensing devices':
                                emoji = '📷';
                                break;
                            case 'High-performance computers':
                                emoji = '💻';
                                break;
                            default:
                                emoji = '';
                        }
                        return (
                            <div key={category}>
                                <h3
                                    ref={(el) => {
                                        cardRefs.current[categoryIndex] = el; // 绑定标题引用
                                    }}
                                    data-index={categoryIndex} // 记录标题索引
                                    className={`text-2xl font-bold mb-4 text-center mt-8 ${
                                        visibleCards.includes(categoryIndex)
                                            ? 'opacity-100 translate-y-0' // 可见时的样式
                                            : 'opacity-0 translate-y-10' // 不可见时的样式
                                    } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {emoji} {category}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryGroups[category]?.map((device, index) => (
                                        <div
                                            key={device.id}
                                            ref={(el) => {
                                                cardRefs.current[categories.length + index] = el; // 绑定卡片引用
                                            }}
                                            data-index={categories.length + index} // 记录卡片索引
                                            className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                                visibleCards.includes(categories.length + index)
                                                    ? 'opacity-100 translate-y-0' // 可见时的样式
                                                    : 'opacity-0 translate-y-10' // 不可见时的样式
                                            } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                            style={{ minHeight: '300px' }} // 确保卡片有最小高度
                                        >
                                            {/* 图片部分 */}
                                            <div className="w-full h-49">
                                                <img
                                                    src={device.image}
                                                    alt={device.name}
                                                    className="object-cover w-full h-full"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/path/to/fallback-image.jpg'; // 加载失败时显示回退图片
                                                    }}
                                                />
                                            </div>
                                            {/* 设备介绍部分 */}
                                            <div className="p-6">
                                                <h2 className="text-xl font-semibold mb-2">{device.name}</h2>
                                                {device.features.map((feature, idx) => (
                                                    <p key={idx} className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        • {feature}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default DevicesPage;

// 使用 getStaticProps 获取设备数据
export async function getStaticProps() {
    return {
        props: {
            devices, // 直接使用 devices.ts 中的数据
        },
    };
}

"use client"; // 确保在客户端渲染
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { devices, Device } from '@/data/devices'; // 引入设备数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子
import { Bot, Glasses, Camera, Cpu, type LucideIcon } from 'lucide-react';

interface HomeProps {
    devices: Device[];
}

const DevicesPage: React.FC<HomeProps> = ({ devices }) => {
    const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set()); // 使用 Set 避免重复
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储标题和卡片的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题

    // 检查初始视口内的元素
    useEffect(() => {
        if (mounted) {
            const initialVisibleIndices: number[] = [];
            itemRefs.current.forEach((item, index) => {
                if (item && isElementInViewport(item)) {
                    initialVisibleIndices.push(index);
                }
            });
            setVisibleItems(new Set(initialVisibleIndices));
        }
    }, [mounted]);

    // Intersection Observer 配置
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        console.log(`Element ${index} is visible`); // 添加日志
                        setVisibleItems((prev) => new Set([...prev, index])); // 使用 Set 避免重复
                        observer.unobserve(entry.target); // 停止观察已加载的元素
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
                threshold: 0.1, // 当元素10%进入视口时触发
            }
        );

        // 观察所有标题和卡片
        itemRefs.current.forEach((item) => {
            if (item) observer.observe(item);
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

    // 计算累计索引
    let currentIndex = 0;

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

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Devices Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        {/* 标题居中 */}
                        <h2 className="text-3xl font-bold mb-4 text-center">Our Equipment</h2>
                        {/* 副标题居中 */}
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore the advanced equipment in our laboratory.
                        </p>
                    </div>

                    {/* 按分类渲染设备 */}
                    {categories.map((category) => {
                        let CategoryIcon: LucideIcon | null;
                        switch (category) {
                            case 'Construction robots':
                                CategoryIcon = Bot;
                                break;
                            case 'Extended reality devices':
                                CategoryIcon = Glasses;
                                break;
                            case 'Reality capture and sensing devices':
                                CategoryIcon = Camera;
                                break;
                            case 'High-performance computers':
                                CategoryIcon = Cpu;
                                break;
                            default:
                                CategoryIcon = null;
                        }
                        
                        // 标题索引
                        const titleIndex = currentIndex++;
                        
                        return (
                            <div key={category}>
                                <h3
                                    ref={(el) => {
                                        itemRefs.current[titleIndex] = el; // 绑定标题引用
                                    }}
                                    data-index={titleIndex} // 记录标题索引
                                    className={`text-2xl font-bold mb-4 mt-8 flex items-center justify-center gap-2.5 transition-all duration-500 ease-out transform ${
                                        visibleItems.has(titleIndex)
                                            ? 'opacity-100 translate-y-0' // 可见时的样式
                                            : 'opacity-0 translate-y-10' // 不可见时的样式
                                    } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {CategoryIcon && <CategoryIcon size={26} strokeWidth={2} className="text-indigo-500" />}
                                    <span>{category}</span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryGroups[category]?.map((device) => {
                                        const itemIndex = currentIndex++;
                                        return (
                                            <div
                                                key={device.id}
                                                ref={(el) => {
                                                    itemRefs.current[itemIndex] = el; // 绑定卡片引用
                                                }}
                                                data-index={itemIndex} // 记录卡片索引
                                                className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                                    visibleItems.has(itemIndex)
                                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                                        : 'opacity-0 translate-y-10' // 不可见时的样式
                                                } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                                style={{ minHeight: '300px' }} // 确保卡片有最小高度
                                            >
                                                {/* 图片部分，添加条件判断 */}
                                                {device.image && (
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
                                                )}
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
                                        );
                                    })}
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

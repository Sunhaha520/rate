"use client"; // 确保在客户端渲染
import React, { useState, useEffect, useRef } from 'react';
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

    // Intersection Observer 配置（用于卡片）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        console.log(`Card ${index} is visible`); // 添加日志
                        setVisibleCards((prev) => [...prev, index]); // 将可见卡片的索引加入状态
                        observer.unobserve(entry.target); // 停止观察已加载的卡片
                    }
                });
            },
            {
                rootMargin: '0px 0px 0px 0px', // 调整为 0
                threshold: 0.01, // 降低阈值
            }
        );

        // 观察所有卡片
        cardRefs.current.forEach((card) => {
            if (card) observer.observe(card);
        });

        // 清理 Observer
        return () => {
            observer.disconnect();
        };
    }, [devices]); // 添加 devices 作为依赖

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* Loading Overlay */}
            {loading && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800 bg-opacity-80' : 'bg-gray-100 bg-opacity-80'}`}>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            )}

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Devices Section */}
                <section className="mt-8">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4">🛠️ Our Equipment</h2>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore the advanced equipment in our laboratory.
                        </p>
                    </div>

                    {/* 设备卡片 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devices.map((device, index) => (
                            <div
                                key={device.id}
                                ref={(el) => {
                                    cardRefs.current[index] = el; // 绑定卡片引用
                                    console.log(`Ref for card ${index} set`); // 添加日志
                                }}
                                data-index={index} // 记录卡片索引
                                className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                    visibleCards.includes(index)
                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                        : '' // 删除 opacity-0 translate-y-10
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
                                    <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span className="font-medium">Model:</span> {device.model}
                                    </p>
                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span className="font-medium">Introduction:</span> {device.purpose}
                                    </p>
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

export default DevicesPage;

// 使用 getStaticProps 获取设备数据
export async function getStaticProps() {
    return {
        props: {
            devices, // 直接使用 devices.ts 中的数据
        },
    };
}
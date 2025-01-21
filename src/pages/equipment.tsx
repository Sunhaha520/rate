import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { devices, Device } from '@/data/devices'; // 引入设备数据

interface HomeProps {
    devices: Device[];
}

const DevicesPage: React.FC<HomeProps> = ({ devices }) => {
    const [loading, setLoading] = useState(true);
    const [visibleCards, setVisibleCards] = useState<number[]>([]); // 记录已加载的卡片索引
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储卡片的引用

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
                        setVisibleCards((prev) => [...prev, index]); // 将可见卡片的索引加入状态
                        observer.unobserve(entry.target); // 停止观察已加载的卡片
                    }
                });
            },
            {
                rootMargin: '0px 0px 100px 0px', // 提前 100px 加载
                threshold: 0.1, // 当卡片 10% 进入视口时触发
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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-80">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                </div>
            )}

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Devices Section */}
                <section className="mt-8">
                    {/* 标题卡片 */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105">
                        <h2 className="text-3xl font-bold mb-4">🛠️ Our Equipment</h2>
                        <p className="text-gray-700 text-lg">
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
                                }}
                                data-index={index} // 记录卡片索引
                                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                    visibleCards.includes(index)
                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                        : 'opacity-0 translate-y-10' // 不可见时的样式
                                }`}
                            >
                                {/* 图片部分 */}
                                <div className="w-full">
                                    <img
                                        src={device.image}
                                        alt={device.name}
                                        className="object-cover w-full h-49"
                                        loading="lazy" // 启用原生懒加载
                                    />
                                </div>
                                {/* 设备介绍部分 */}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">{device.name}</h2>
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-medium">Model:</span> {device.model}
                                    </p>
                                    <p className="text-gray-700">
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
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { resources, Resource } from '@/data/resources'; // 引入资源数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

interface ResourcesProps {
    resources: Resource[];
}

const DemoResourcesPage: React.FC<ResourcesProps> = ({ resources }) => {
    const [visibleResources, setVisibleResources] = useState<number[]>([]); // 记录已加载的资源索引
    const resourceRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储资源的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null); // 当前选中的资源
    const [cardHeight, setCardHeight] = useState('80vh'); // 动态卡片高度

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    // 动态调整卡片高度
    useEffect(() => {
        const handleResize = () => {
            const screenHeight = document.documentElement.clientHeight;
            // 设置卡片高度为屏幕高度的80%
            setCardHeight(`${screenHeight * 0.8}px`);
        };

        // 初始化高度
        handleResize();

        // 监听窗口大小变化
        window.addEventListener('resize', handleResize);

        // 清理事件监听
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Intersection Observer 配置（用于资源）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleResources((prev) => [...prev, index]); // 将可见资源的索引加入状态
                        observer.unobserve(entry.target); // 停止观察已加载的资源
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
                threshold: 0.1, // 当元素10%进入视口时触发
            }
        );

        // 观察所有资源
        resourceRefs.current.forEach((resource) => {
            if (resource) observer.observe(resource);
        });

        // 清理 Observer
        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]); // 依赖 mounted 和 theme

    // 关闭资源详情卡片
    const closeResourceDetails = () => {
        setSelectedResource(null);
    };

    // 点击遮罩层关闭卡片
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeResourceDetails();
        }
    };

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Demo&Resources - RATE@UM</title>
                <meta name="description" content="Explore our demos and resources at RATE@UM." />
                <meta property="og:title" content="Demo&Resources - RATE@UM" />
                <meta property="og:description" content="Explore our demos and resources at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Resources Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">📚 Demo&Resources</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore our demos and resources at RATE@UM.
                        </p>
                    </div>

                    {/* 资源展示 */}
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
                        {resources.map((resource, index) => {
                            const tagBgColor = resource.tag === 'Demo videos' ? 'bg-blue-500' : 'bg-green-500';
                            return (
                                <div
                                    key={resource.id}
                                    ref={(el) => {
                                        resourceRefs.current[index] = el; // 绑定资源引用
                                    }}
                                    data-index={index} // 记录资源索引
                                    className={`rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer ${
                                        visibleResources.includes(index)
                                            ? 'opacity-100 translate-y-0' // 可见时的样式
                                            : 'opacity-0 translate-y-10' // 不可见时的样式
                                    } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    onClick={() => setSelectedResource(resource)} // 点击资源显示详情
                                >
                                    <div className="flex sm:flex-row flex-col relative">
                                        {/* 资源封面 */}
                                        <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                            <img
                                                src={resource.coverImage}
                                                alt={resource.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {/* 资源信息 */}
                                        <div className="w-full sm:w-2/3 p-4">
                                            <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                                                {resource.description}
                                            </p>
                                        </div>
                                        {/* 胶囊状标签 */}
                                        <div className={`absolute top-2 left-2 px-4 py-1 rounded-full ${tagBgColor} text-white`}>
                                            {resource.tag}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* 资源详情卡片 */}
            {selectedResource && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleBackdropClick} // 点击遮罩层关闭卡片
                >
                    <div
                        className={`rounded-xl shadow-md overflow-hidden w-11/12 max-w-2xl ${
                            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{ 
                            maxHeight: cardHeight, 
                            WebkitOverflowScrolling: 'touch', 
                            scrollbarWidth: 'none',
                            overflowY: 'auto'
                        }}
                        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡，避免点击卡片内容时关闭卡片
                    >
                        <div className="relative h-64 overflow-hidden">
                            {selectedResource.isVideo ? (
                                <video
                                    src={selectedResource.headImage}
                                    controls
                                    className="w-full h-full object-cover"
                                ></video>
                            ) : (
                                <img
                                    src={selectedResource.headImage}
                                    alt={selectedResource.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div className="p-6 overflow-y-auto" style={{ maxHeight: `calc(${cardHeight} - 64px)` }}>
                            <h2 className="text-2xl font-bold mb-4">{selectedResource.title}</h2>
                            <p className="mb-4">{selectedResource.fullDescription}</p>
                            <button
                                onClick={closeResourceDetails}
                                className="px-4 py-2 bg-red-400 !text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default DemoResourcesPage;

// 使用 getStaticProps 获取资源数据
export async function getStaticProps() {
    return {
        props: {
            resources, // 直接使用 resources.ts 中的数据
        },
    };
}

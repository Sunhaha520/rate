import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { papers, Paper } from '@/data/papers'; // 引入论文数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

interface PapersProps {
    papers: Paper[];
}

const PapersPage: React.FC<PapersProps> = ({ papers }) => {
    const [visibleBooks, setVisibleBooks] = useState<number[]>([]); // 记录已加载的书本索引
    const bookRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储书本的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null); // 当前选中的论文

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    // Intersection Observer 配置（用于书本）
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleBooks((prev) => [...prev, index]); // 将可见书本的索引加入状态
                        observer.unobserve(entry.target); // 停止观察已加载的书本
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
                threshold: 0.1, // 当元素10%进入视口时触发
            }
        );

        // 观察所有书本
        bookRefs.current.forEach((book) => {
            if (book) observer.observe(book);
        });

        // 清理 Observer
        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]); // 依赖 mounted 和 theme

    // 关闭论文详情卡片
    const closePaperDetails = () => {
        setSelectedPaper(null);
    };

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Our Papers - RATE@UM</title>
                <meta name="description" content="Explore our published papers at RATE@UM." />
                <meta property="og:title" content="Our Papers - RATE@UM" />
                <meta property="og:description" content="Explore our published papers at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Papers Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">📚 Our Papers</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore our published papers at RATE@UM.
                        </p>
                    </div>

                    {/* 书本展示 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {papers.map((paper, index) => (
                            <div
                                key={paper.id}
                                ref={(el) => {
                                    bookRefs.current[index] = el; // 绑定书本引用
                                }}
                                data-index={index} // 记录书本索引
                                className={`rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer ${
                                    visibleBooks.includes(index)
                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                        : 'opacity-0 translate-y-10' // 不可见时的样式
                                }`}
                                style={{ backgroundColor: paper.color }} // 使用论文数据中的颜色
                                onClick={() => setSelectedPaper(paper)} // 点击书本显示详情
                            >
                                {/* 书本封面 */}
                                <div className="relative h-48 p-6 text-center">
                                    {/* 封面标题，强制设置为白色 */}
                                    <h3 className="text-xl font-bold text-white !text-white">
                                        {paper.title}
                                    </h3>
                                    {/* 年份标签 */}
                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                                        {paper.year}
                                    </div>
                                    {/* 👨‍🎓 图标 */}
        <div className="absolute bottom-2 right-2 text-white text-4xl opacity-30 z-0">
            👨‍🎓
        </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 论文详情卡片 */}
            {selectedPaper && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 w-11/12 max-w-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-2xl font-bold mb-4">{selectedPaper.title}</h2>
                        <p className="mb-2"><strong>Authors:</strong> {selectedPaper.authors.join(', ')}</p>
                        <p className="mb-2"><strong>Published in:</strong> {selectedPaper.journal}</p>
                        <p className="mb-2"><strong>Year:</strong> {selectedPaper.year}</p>
                        <p className="mb-4"><strong>Abstract:</strong> {selectedPaper.abstract}</p>

                        {/* 数据关键词 */}
                        <div className="mb-4">
                            <strong>Keywords:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedPaper.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 论文链接 */}
                        <div className="flex items-center justify-between">
                            <a
                                href={selectedPaper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-blue-500 !text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                <span>在线阅读</span>
                            </a>
                            <button
                                onClick={closePaperDetails}
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

export default PapersPage;

// 使用 getStaticProps 获取论文数据
export async function getStaticProps() {
    return {
        props: {
            papers, // 直接使用 papers.ts 中的数据
        },
    };
}
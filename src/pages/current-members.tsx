import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { members, Member } from '@/data/members'; // 引入成员数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

interface MembersProps {
    members: Member[];
}

const MembersPage: React.FC<MembersProps> = ({ members }) => {
    const [visibleCards, setVisibleCards] = useState<number[]>([]); // 记录已加载的卡片索引
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储卡片的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

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
                rootMargin: '0px 0px -50px 0px', // 提前50px触发动画
                threshold: 0.1, // 当元素10%进入视口时触发
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
    }, [mounted, theme]); // 依赖 mounted 和 theme

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Our Members - RATE@UM</title>
                <meta name="description" content="Meet our talented members at RATE@UM." />
                <meta property="og:title" content="Our Members - RATE@UM" />
                <meta property="og:description" content="Meet our talented members at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Members Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">👥 Our Members</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Meet our talented members at RATE@UM.
                        </p>
                    </div>

                    {/* 成员卡片 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {members.map((member, index) => (
                            <div
                                key={member.id}
                                ref={(el) => {
                                    cardRefs.current[index] = el; // 绑定卡片引用
                                }}
                                data-index={index} // 记录卡片索引
                                className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                    visibleCards.includes(index)
                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                        : 'opacity-0 translate-y-10' // 不可见时的样式
                                } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                style={{ position: 'relative' }} // 设置相对定位
                            >
                                {/* 照片部分 */}
                                <div className="w-full aspect-square overflow-hidden">
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="object-cover w-full h-full" // 确保图片按比例缩放并裁剪
                                        loading="lazy"
                                        onError={(e) => {
                                            e.currentTarget.src = '/path/to/fallback-image.jpg'; // 加载失败时显示回退图片
                                        }}
                                    />
                                </div>

                                {/* 信息部分 */}
                                <div className="p-6">
                                    {/* 社交图标 */}
                                    <div className="flex space-x-4 mb-4">
                                        {member.github && (
                                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                                                <svg
                                                    className="w-6 h-6 fill-current text-gray-500 hover:text-blue-500 transition-colors duration-300"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                        {member.homepage && (
                                            <a href={member.homepage} target="_blank" rel="noopener noreferrer">
                                                <svg
                                                    className="w-6 h-6 fill-current text-gray-500 hover:text-green-500 transition-colors duration-300"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-3v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z" />
                                                </svg>
                                            </a>
                                        )}
                                        {member.email && (
                                            <a href={`mailto:${member.email}`}>
                                                <svg
                                                    className="w-6 h-6 fill-current text-gray-500 hover:text-red-500 transition-colors duration-300"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>

                                    {/* 姓名 */}
                                    <h2 className="text-xl font-semibold mb-2">{member.name}</h2>

                                    {/* 年级 */}
                                    <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        {member.year}
                                    </p>

                                    {/* 研究主题 */}
                                    <p className={`line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span className="font-medium">Research Topic:</span> {member.researchTopic}
                                    </p>
                                </div>

                                {/* 胶囊标签 */}
                                <div
                                    className="absolute top-4 right-4" // 固定在右上角
                                >
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                            member.role === 'PhD'
                                                ? 'bg-red-500 text-white'
                                                : member.role === 'Master'
                                                ? 'bg-purple-500 text-white'
                                                : member.role === 'Undergraduate'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-green-500 text-white'
                                        }`}
                                    >
                                        {member.role}
                                    </span>
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

export default MembersPage;

// 使用 getStaticProps 获取成员数据
export async function getStaticProps() {
    return {
        props: {
            members, // 直接使用 members.ts 中的数据
        },
    };
}
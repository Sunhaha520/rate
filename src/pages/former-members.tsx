import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { alumni, Alumni } from '@/data/alumni'; // 引入前成员数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

const AlumniPage: React.FC = () => {
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题
    const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null); // 当前选中的前成员

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    // 关闭前成员详情卡片
    const closeAlumniDetails = () => {
        setSelectedAlumni(null);
    };

    // 点击遮罩层关闭卡片
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeAlumniDetails();
        }
    };

    // 根据身份设置右侧背景颜色
    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'phd':
                return 'bg-blue-500'; // 博士
            case 'master':
                return 'bg-green-500'; // 硕士
            case 'ug':
                return 'bg-purple-500'; // 本科
            case 'ra':
                return 'bg-orange-500'; // RA
            default:
                return 'bg-gray-500'; // 默认
        }
    };

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Former Members - RATE@UM</title>
                <meta name="description" content="Explore our former members at RATE@UM." />
                <meta property="og:title" content="Former Members - RATE@UM" />
                <meta property="og:description" content="Explore our former members at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* 前成员 Section */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">👥 Former Members</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore our former research team members.
                        </p>
                    </div>

                    {/* 姓名和身份标签 */}
                    <div className="flex flex-wrap gap-4">
                        {alumni.map((member: Alumni) => (
                            <div
                                key={member.id}
                                className="flex cursor-pointer transition-all duration-300 hover:scale-105"
                                onClick={() => setSelectedAlumni(member)}
                            >
                                {/* 左侧：姓名 */}
                                <div className={`px-4 py-2 rounded-l-full ${
                                    theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                                }`}>
                                    {member.name}
                                </div>
                                {/* 右侧：身份 */}
                                <div className={`px-4 py-2 text-white rounded-r-full ${getRoleColor(member.role)}`}>
                                    {member.role}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* 前成员详情卡片 */}
            {selectedAlumni && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleBackdropClick} // 点击遮罩层关闭卡片
                >
                    <div
                        className={`rounded-xl shadow-md overflow-hidden p-6 w-11/12 max-w-2xl overflow-y-auto ${
                            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{ maxHeight: '80vh', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
                        onClick={(e) => e.stopPropagation()} // 阻止事件冒泡，避免点击卡片内容时关闭卡片
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedAlumni.name}</h2>
                        <p className="mb-2"><strong>Year:</strong> {selectedAlumni.year}</p>
                        <p className="mb-2"><strong>Role:</strong> {selectedAlumni.role}</p>
                        <p className="mb-4"><strong>Research Topic:</strong> {selectedAlumni.researchTopic}</p>

                        {/* 关闭按钮 */}
                        <div className="flex justify-end">
                            <button
                                onClick={closeAlumniDetails}
                                className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AlumniPage;

// 使用 getStaticProps 获取前成员数据
export async function getStaticProps() {
    return {
        props: {
            alumni, // 直接使用 alumni.ts 中的数据
        },
    };
}
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { alumni, Alumni } from '@/data/alumni'; // 引入前成员数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子
import { Mail, Building2, GraduationCap, User } from 'lucide-react';

const AlumniPage: React.FC = () => {
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    // 根据身份设置标签配色（收敛到青碧同色系）
    const getRoleBadge = (role: string) => {
        switch (role.toLowerCase()) {
            case 'phd':
                return 'bg-teal-600 text-white';
            case 'master':
                return 'bg-cyan-600 text-white';
            case 'ug':
                return 'bg-cyan-700 text-white';
            case 'ra':
                return 'bg-slate-500 text-white';
            default:
                return 'bg-slate-500 text-white';
        }
    };

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
                <section>
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">Former Members</h2>
                        <p className={`text-lg text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Our alumni and their current destinations.
                        </p>
                    </div>

                    {/* 成员卡片网格 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {alumni.map((member: Alumni) => (
                            <div
                                key={member.id}
                                className={`rounded-xl shadow-md overflow-hidden p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 ${
                                    isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                                }`}
                            >
                                {/* 头像 */}
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-teal-500/30 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    {member.photo ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.querySelector('.avatar-fallback')?.classList.remove('hidden');
                                            }}
                                        />
                                    ) : null}
                                    <User className={`avatar-fallback ${member.photo ? 'hidden' : ''} text-gray-400`} size={40} strokeWidth={1.5} />
                                </div>

                                {/* 姓名 */}
                                <h3 className="text-lg font-bold mb-1">{member.name}</h3>

                                {/* 身份标签 + 届别 */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                                        {member.role}
                                    </span>
                                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Class of {member.year}
                                    </span>
                                </div>

                                {/* 信息列表 */}
                                <div className={`w-full space-y-2 text-sm text-left ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {member.position && (
                                        <div className="flex items-start gap-2">
                                            <GraduationCap size={16} strokeWidth={2} className="text-teal-500 shrink-0 mt-0.5" />
                                            <span>{member.position}</span>
                                        </div>
                                    )}
                                    {member.destination && (
                                        <div className="flex items-start gap-2">
                                            <Building2 size={16} strokeWidth={2} className="text-teal-500 shrink-0 mt-0.5" />
                                            <span>{member.destination}</span>
                                        </div>
                                    )}
                                    {member.email && (
                                        <div className="flex items-start gap-2">
                                            <Mail size={16} strokeWidth={2} className="text-teal-500 shrink-0 mt-0.5" />
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="break-all hover:text-teal-500 transition-colors"
                                            >
                                                {member.email}
                                            </a>
                                        </div>
                                    )}
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

export default AlumniPage;

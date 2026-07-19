import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // 引入 Head 组件
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { members } from '@/data/members'; // 引入成员数据
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子
import { useRouter } from 'next/router'; // 引入 useRouter 钩子

// 假设 Member 接口中的 researchTopic 改为字符串数组
interface Member {
    id: number;
    name: string;
    year: string;
    role: string;
    photo: string;
    github?: string;
    homepage?: string;
    email?: string;
    researchTopic: string[]; // 修改为字符串数组
}

interface MembersProps {
    members: Member[];
}

const MembersPage: React.FC<MembersProps> = ({ members }) => {
    const [visibleCards, setVisibleCards] = useState<number[]>([]); // 记录已加载的卡片索引
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]); // 用于存储卡片的引用
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 确保组件在客户端渲染后再应用主题
    const [hoveredMember, setHoveredMember] = useState<number | null>(null); // 记录当前悬停的成员 ID
    const router = useRouter(); // 获取路由对象

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

    // 按 role 分组成员
    const roleGroups: { [key: string]: Member[] } = {};
    members.forEach((member) => {
        if (!roleGroups[member.role]) {
            roleGroups[member.role] = [];
        }
        roleGroups[member.role].push(member);
    });

    // 定义固定顺序
    const fixedOrder = ['Supervisor', 'PhD', 'Master'];
    const otherRoles = Object.keys(roleGroups).filter(role => !fixedOrder.includes(role));
    const orderedRoles = [...fixedOrder, ...otherRoles].filter(role => roleGroups[role]);

    // 处理头像点击事件
    const handleAvatarClick = (homepage: string | undefined) => {
        if (homepage) {
            router.push(homepage); // 跳转到个人主页
        }
    };

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
                        <h2 className="text-3xl font-bold mb-4 text-center">Our Members</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Meet our talented members at RATE@UM.
                        </p>
                    </div>

                    {/* 按 role 渲染成员 */}
                    {orderedRoles.map((role, roleIndex) => {
                        return (
                            <div key={role}>
                                <h3
                                    className={`text-2xl font-bold mb-4 text-center mt-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {role}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {roleGroups[role].map((member, index) => {
                                        const itemIndex = roleIndex * members.length + index;
                                        return (
                                            <div
                                                key={member.id}
                                                ref={(el) => {
                                                    cardRefs.current[itemIndex] = el; // 绑定卡片引用
                                                }}
                                                data-index={itemIndex} // 记录卡片索引
                                                className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                                    visibleCards.includes(itemIndex)
                                                        ? 'opacity-100 translate-y-0' // 可见时的样式
                                                        : 'opacity-0 translate-y-10' // 不可见时的样式
                                                } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                                style={{ minHeight: '400px' }} // 增加卡片最小高度
                                            >
                                                {/* 照片部分 */}
                                                <div 
                                                    className="flex justify-center pt-4 relative"
                                                    onMouseEnter={() => setHoveredMember(member.id)}
                                                    onMouseLeave={() => setHoveredMember(null)}
                                                    onClick={() => handleAvatarClick(member.homepage)} // 点击跳转
                                                >
                                                    <div className="w-40 h-40 aspect-square overflow-hidden rounded-full relative cursor-pointer"> {/* 添加 cursor-pointer */}
                                                        <img
                                                            src={member.photo}
                                                            alt={member.name}
                                                            className={`object-cover w-full h-full transition-filter duration-300 ${
                                                                hoveredMember === member.id ? 'filter blur-sm' : ''
                                                            }`} // 确保图片按比例缩放并裁剪
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/path/to/fallback-image.jpg'; // 加载失败时显示回退图片
                                                            }}
                                                        />
                                                        {hoveredMember === member.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg 
                                                                    className="icon" 
                                                                    viewBox="0 0 1024 1024" 
                                                                    version="1.1" 
                                                                    xmlns="http://www.w3.org/2000/svg" 
                                                                    p-id="3508" 
                                                                    width="64" 
                                                                    height="64"
                                                                >
                                                                    <path d="M901.12 836.608H122.88c-22.528 0-40.96-18.432-40.96-40.96v-573.44c0-22.528 18.432-40.96 40.96-40.96h778.24c22.528 0 40.96 18.432 40.96 40.96v573.44c0 22.528-18.432 40.96-40.96 40.96zM122.88 222.208v573.44h778.24v-573.44H122.88z" p-id="3509" fill="#8a8a8a"></path>
                                                                    <path d="M707.072 497.152c-31.744 0-56.832-31.744-56.832-72.192s25.088-72.192 56.832-72.192c31.744 0 56.832 31.744 56.832 72.192s-24.576 72.192-56.832 72.192z m0-103.424c-6.144 0-15.872 12.288-15.872 31.232 0 18.944 9.728 31.232 15.872 31.232 6.144 0 15.872-12.288 15.872-31.232 0.512-18.944-9.216-31.232-15.872-31.232zM707.072 665.088c-55.808 0-132.608 0-132.608-60.416 0-49.664 58.368-88.064 132.608-88.064s132.608 38.912 132.608 88.064c0 60.416-76.8 60.416-132.608 60.416z m0-107.52c-53.76 0-91.648 25.088-91.648 47.104 0 16.384 34.816 19.456 91.648 19.456 56.32 0 91.648-3.072 91.648-19.456 0-22.016-37.376-47.104-91.648-47.104zM427.52 531.968h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04zM427.52 634.368h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04zM427.52 429.568h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04z" p-id="3510" fill="#8a8a8a"></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 信息部分 */}
                                                <div className="p-6">
                                                    {/* 社交图标 */}
                                                    <div className="flex space-x-3 mb-3"> {/* 缩小社交图标间距 */}
                                                        {member.github && (
                                                            <a href={member.github} target="_blank" rel="noopener noreferrer">
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-blue-500 transition-colors duration-300" // 缩小图标大小
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        {member.homepage && (
                                                            <a href={member.homepage} target="_blank" rel="noopener noreferrer">
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-green-500 transition-colors duration-300" // 缩小图标大小
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-3v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        {member.email && (
                                                            <a href={`mailto:member.email`}>
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-red-500 transition-colors duration-300" // 缩小图标大小
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* 姓名 */}
                                                    <h2 className="text-lg font-semibold mb-1"> {/* 缩小姓名字体大小并减少间距 */}
                                                        {member.name}
                                                    </h2>

                                                    {/* 年级（如果不是 Supervisor 则显示） */}
                                                    {member.role!== 'Supervisor' && (
                                                        <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}> {/* 缩小年级字体大小并减少间距 */}
                                                            {member.year}
                                                        </p>
                                                    )}

                                                    {/* 研究主题 */}
                                                    <div className={`text-sm leading-normal ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}> {/* 调整字体大小和行高 */}
                                                        <span className="font-medium">Research Topic:</span>
                                                        <ul className="list-disc list-inside">
                                                            {member.researchTopic.map((topic, idx) => (
                                                                <li key={idx}>{topic}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* 胶囊标签 */}
                                                <div
                                                    className="absolute top-4 right-4" // 固定在右上角
                                                >
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                            member.role === 'Supervisor'
                                                                ? 'bg-blue-500 text-white' // 修改导师标签颜色
                                                                : member.role === 'PhD'
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

export default MembersPage;

// 使用 getStaticProps 获取成员数据
export async function getStaticProps() {
    return {
        props: {
            members, // 
        },
    };
}
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { itemListJsonLd } from '@/lib/site';
import { members as localMembers } from '@/data/members'; // 本地兜底数据
import { getPublishedMembers, WebsiteMember } from '@/lib/notion-members';
import { useRouter } from 'next/router';
import { User, ArrowUpRight } from 'lucide-react';

interface MembersProps {
    members: WebsiteMember[];
}

// 头像：Notion 里没有图片或代理取图失败时，回退到占位图标，
// 而不是留下一块空白圆形。
function MemberAvatar({
    member,
    blurred,
}: {
    member: WebsiteMember;
    blurred: boolean;
}) {
    const [failed, setFailed] = useState(false);

    if (!member.photo || failed) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <User size={48} strokeWidth={1.5} className="text-gray-400" />
            </div>
        );
    }

    return (
        <img
            src={member.photo}
            alt={member.name}
            className={`object-cover w-full h-full transition-all duration-300 ${
                blurred ? 'filter blur-sm scale-105' : ''
            }`}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}

const MembersPage: React.FC<MembersProps> = ({ members }) => {
    const [hoveredMember, setHoveredMember] = useState<string | null>(null); // 记录当前悬停的成员 ID
    const router = useRouter(); // 获取路由对象

    // 按 role 分组成员
    const roleGroups: { [key: string]: WebsiteMember[] } = {};
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

    // 处理头像点击事件：填了外链就新标签页打开；
    // 填了站内路径就跳转；都没填则进入 Notion 页面生成的个人主页
    const handleAvatarClick = (member: WebsiteMember) => {
        const homepage = member.homepage;
        if (homepage) {
            if (/^https?:\/\//i.test(homepage)) {
                window.open(homepage, '_blank', 'noopener,noreferrer');
            } else {
                router.push(homepage.startsWith('/') ? homepage : `/${homepage}`);
            }
            return;
        }
        if (member.id && !/^\d+$/.test(member.id)) {
            router.push(`/members/${member.id}`);
        }
    };

    const profileHref = (member: WebsiteMember) =>
        member.homepage && !/^https?:\/\//i.test(member.homepage)
            ? member.homepage.startsWith('/')
                ? member.homepage
                : `/${member.homepage}`
            : member.id && !/^\d+$/.test(member.id)
            ? `/members/${member.id}`
            : '';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Research Team"
                path="/current-members"
                description="Current members of RATE@UM — supervisor, PhD students, master students and research assistants at the University of Macau."
                jsonLd={itemListJsonLd(
                    members.map((member) => ({
                        name: member.name,
                        path: `/members/${member.id}`,
                    }))
                )}
            />

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Members Section */}
                <section>
                    {/* 标题卡片 */}
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">Our Members</h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Meet our talented members at RATE@UM.
                        </p>
                    </div>

                    {/* 按 role 渲染成员 */}
                    {orderedRoles.length === 0 && (
                        <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No members found. Please add records in the Notion members database.
                        </p>
                    )}
                    {orderedRoles.map((role) => {
                        return (
                            <div key={role}>
                                <div className="mt-10 mb-5 flex items-center gap-3">
                                    <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                        {role}
                                    </h3>
                                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                                    <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                        {roleGroups[role].length}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {roleGroups[role].map((member) => {
                                        const href = profileHref(member);
                                        return (
                                            <div
                                                key={member.id}
                                                className="card-enter relative rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                                style={{ minHeight: '400px' }} // 增加卡片最小高度
                                            >
                                                {/* 照片部分 */}
                                                <div
                                                    className="flex justify-center pt-4 relative"
                                                    onMouseEnter={() => setHoveredMember(member.id)}
                                                    onMouseLeave={() => setHoveredMember(null)}
                                                    onClick={() => handleAvatarClick(member)} // 点击跳转
                                                >
                                                    <div className="w-40 h-40 aspect-square overflow-hidden rounded-full relative cursor-pointer bg-gray-100 dark:bg-gray-700 ring-1 ring-slate-200 dark:ring-slate-700">
                                                        <MemberAvatar
                                                            member={member}
                                                            blurred={hoveredMember === member.id}
                                                        />
                                                        {hoveredMember === member.id && (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <svg
                                                                    className="icon"
                                                                    viewBox="0 0 1024 1024"
                                                                    version="1.1"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="64"
                                                                    height="64"
                                                                >
                                                                    <path d="M901.12 836.608H122.88c-22.528 0-40.96-18.432-40.96-40.96v-573.44c0-22.528 18.432-40.96 40.96-40.96h778.24c22.528 0 40.96 18.432 40.96 40.96v573.44c0 22.528-18.432 40.96-40.96 40.96zM122.88 222.208v573.44h778.24v-573.44H122.88z" fill="#8a8a8a"></path>
                                                                    <path d="M707.072 497.152c-31.744 0-56.832-31.744-56.832-72.192s25.088-72.192 56.832-72.192c31.744 0 56.832 31.744 56.832 72.192s-24.576 72.192-56.832 72.192z m0-103.424c-6.144 0-15.872 12.288-15.872 31.232 0 18.944 9.728 31.232 15.872 31.232 6.144 0 15.872-12.288 15.872-31.232 0.512-18.944-9.216-31.232-15.872-31.232zM707.072 665.088c-55.808 0-132.608 0-132.608-60.416 0-49.664 58.368-88.064 132.608-88.064s132.608 38.912 132.608 88.064c0 60.416-76.8 60.416-132.608 60.416z m0-107.52c-53.76 0-91.648 25.088-91.648 47.104 0 16.384 34.816 19.456 91.648 19.456 56.32 0 91.648-3.072 91.648-19.456 0-22.016-37.376-47.104-91.648-47.104zM427.52 531.968h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04zM427.52 634.368h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04zM427.52 429.568h-220.16c-12.8 0-23.04-10.24-23.04-23.04s10.24-23.04 23.04-23.04h220.16c12.8 0 23.04 10.24 23.04 23.04s-10.24 23.04-23.04 23.04z" fill="#8a8a8a"></path>
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* 信息部分 */}
                                                <div className="p-6">
                                                    {/* 社交图标 */}
                                                    <div className="flex space-x-3 mb-3">
                                                        {member.github && (
                                                            <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on GitHub`}>
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.92 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        {member.homepage && (
                                                            <a href={member.homepage} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} homepage`}>
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-3v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H4V4h16v12z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                        {member.email && (
                                                            <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
                                                                <svg
                                                                    className="w-5 h-5 fill-current text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* 姓名 */}
                                                    <h2 className="text-lg font-semibold mb-1 flex items-center gap-1.5">
                                                        {href ? (
                                                            <Link
                                                                href={href}
                                                                className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                                            >
                                                                {member.name}
                                                            </Link>
                                                        ) : (
                                                            member.name
                                                        )}
                                                        {href && (
                                                            <ArrowUpRight
                                                                size={15}
                                                                className="text-slate-300 dark:text-slate-600"
                                                            />
                                                        )}
                                                    </h2>

                                                    {/* 年级（如果不是 Supervisor 则显示） */}
                                                    {member.role !== 'Supervisor' && (
                                                        <p className="text-sm mb-1 text-gray-700 dark:text-gray-300">
                                                            {member.year}
                                                        </p>
                                                    )}

                                                    {/* 研究主题 */}
                                                    <div className="text-sm leading-normal text-gray-700 dark:text-gray-300">
                                                        <span className="font-medium">Research Topic:</span>
                                                        <ul className="list-disc list-inside marker:text-teal-600 dark:marker:text-teal-400">
                                                            {member.researchTopic.map((topic, idx) => (
                                                                <li key={idx}>{topic}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>

                                                {/* 胶囊标签 */}
                                                <div className="absolute top-4 right-4">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                            member.role === 'Supervisor'
                                                                ? 'bg-blue-500 text-white'
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

                    {/* 已毕业成员入口：本科生按约定归入 Former Members */}
                    <div className="mt-10 flex justify-center">
                        <Link
                            href="/former-members"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 dark:text-teal-300 border border-teal-600/25 dark:border-teal-400/25 bg-teal-50/60 dark:bg-teal-500/10 px-4 py-2 rounded-lg hover:bg-teal-100/70 dark:hover:bg-teal-500/20 transition-colors"
                        >
                            View Former Members
                            <ArrowUpRight size={15} />
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default MembersPage;

// 使用 getStaticProps 从 Notion 成员表读取数据（60 秒增量再生）
export async function getStaticProps() {
    let members: WebsiteMember[] = localMembers;

    try {
        members = await getPublishedMembers();
        // 成员表还没录入数据时，先用本地数据兜底，避免页面空白
        if (members.length === 0) {
            console.warn('Notion 成员表暂无记录，暂用本地成员数据兜底');
            members = localMembers;
        }
    } catch (err) {
        console.error('读取 Notion 成员表失败，已回退到本地数据:', err);
        members = localMembers;
    }

    return {
        props: {
            // Undergraduate 归入 /former-members，不在当前成员里展示
            members: members.filter((member) => member.role !== 'Undergraduate'),
        },
        revalidate: 60,
    };
}

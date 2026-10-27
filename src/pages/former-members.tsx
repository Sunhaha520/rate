import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { itemListJsonLd } from '@/lib/site';
import { alumni, Alumni } from '@/data/alumni';
import { getFormerMembers, WebsiteMember } from '@/lib/notion-members';
import { Mail, Building2, GraduationCap, User, ArrowUpRight } from 'lucide-react';

// 统一后的校友卡片数据：本地 alumni.ts + Notion 里的毕业成员
interface FormerMemberCard {
    key: string;
    name: string;
    year: string;
    role: string;
    photo: string;
    email: string;
    company: string;
    position: string;
    href: string;
}

interface FormerMembersProps {
    members: FormerMemberCard[];
}

// 根据身份设置标签配色（收敛到青碧同色系）
function getRoleBadge(role: string): string {
    switch (role.toLowerCase()) {
        case 'phd':
            return 'bg-teal-600 text-white';
        case 'master':
            return 'bg-cyan-600 text-white';
        case 'ug':
        case 'undergraduate':
            return 'bg-cyan-700 text-white';
        case 'ra':
            return 'bg-slate-500 text-white';
        default:
            return 'bg-slate-500 text-white';
    }
}

function roleLabel(role: string): string {
    return role.toLowerCase() === 'undergraduate' ? 'UG' : role;
}

// 姓名归一化：忽略大小写与姓名顺序（"Sun Zhenyu" 与 "Zhenyu SUN" 视为同一人）
function nameKey(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z\u4e00-\u9fa5]+/g, ' ')
        .trim()
        .split(/\s+/)
        .sort()
        .join(' ');
}

// 头像失败时回退到占位图标
function Avatar({ member }: { member: FormerMemberCard }) {
    const [failed, setFailed] = useState(false);

    if (!member.photo || failed) {
        return <User className="text-gray-400" size={40} strokeWidth={1.5} />;
    }

    return (
        <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
        />
    );
}

const AlumniPage: React.FC<FormerMembersProps> = ({ members }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Former Members"
                path="/former-members"
                description="Alumni and former members of RATE@UM, together with their current positions and destinations."
                jsonLd={itemListJsonLd(
                    members.map((member) => ({
                        name: member.name,
                        path: member.href || '/former-members',
                    }))
                )}
            />

            <Header />

            <main className="container mx-auto px-4 py-8">
                <section>
                    {/* 标题卡片 */}
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            Former Members
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Our alumni and their current destinations.
                        </p>
                    </div>

                    {members.length === 0 && (
                        <p className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No former members yet. Add graduated members in the Notion
                            members table, or edit src/data/alumni.ts.
                        </p>
                    )}

                    {members.length > 0 && (
                        <div className="mt-8 mb-5 flex items-center gap-3">
                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                Alumni
                            </h3>
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                            <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                {members.length}
                            </span>
                        </div>
                    )}

                    {/* 成员卡片网格 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {members.map((member) => (
                            <div
                                key={member.key}
                                className="relative rounded-xl shadow-md overflow-hidden p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-105 bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                            >
                                {/* 头像 */}
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                                    <Avatar member={member} />
                                </div>

                                {/* 姓名 */}
                                <h3 className="text-lg font-bold mb-1 flex items-center gap-1.5">
                                    {member.href ? (
                                        <Link
                                            href={member.href}
                                            className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                        >
                                            {member.name}
                                        </Link>
                                    ) : (
                                        member.name
                                    )}
                                    {member.href && (
                                        <ArrowUpRight
                                            size={15}
                                            className="text-slate-300 dark:text-slate-600"
                                        />
                                    )}
                                </h3>

                                {/* 身份标签 + 届别 */}
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(
                                            member.role
                                        )}`}
                                    >
                                        {roleLabel(member.role)}
                                    </span>
                                    {member.year && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Class of {member.year}
                                        </span>
                                    )}
                                </div>

                                {/* 信息列表：职位 / 公司 / 邮箱 */}
                                <div className="w-full space-y-2 text-sm text-left text-gray-600 dark:text-gray-300">
                                    {member.position && (
                                        <div className="flex items-start gap-2">
                                            <GraduationCap size={16} strokeWidth={2} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <span>{member.position}</span>
                                        </div>
                                    )}
                                    {member.company && (
                                        <div className="flex items-start gap-2">
                                            <Building2 size={16} strokeWidth={2} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <span>{member.company}</span>
                                        </div>
                                    )}
                                    {member.email && (
                                        <div className="flex items-start gap-2">
                                            <Mail size={16} strokeWidth={2} className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="break-all hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
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

export async function getStaticProps() {
    // 本地 alumni.ts 提供公司 / 职位等补充信息；
    // Notion 成员表里的毕业成员（含 Undergraduate）补充进来。
    let notionFormer: WebsiteMember[] = [];
    try {
        notionFormer = await getFormerMembers();
    } catch (err) {
        console.error('读取 Notion 毕业成员失败，仅显示本地校友数据:', err);
    }

    const cards: FormerMemberCard[] = [];
    const byName = new Map<string, FormerMemberCard>();

    const add = (card: FormerMemberCard) => {
        cards.push(card);
        byName.set(nameKey(card.name), card);
    };

    alumni.forEach((member: Alumni) => {
        add({
            key: `local-${member.id}`,
            name: member.name,
            year: member.year,
            role: member.role,
            photo: member.photo ?? '',
            email: member.email ?? '',
            company: member.destination ?? '',
            position: member.position ?? '',
            href: '',
        });
    });

    notionFormer.forEach((member) => {
        const key = nameKey(member.name);
        const existing = byName.get(key);
        const href =
            member.id && !/^\d+$/.test(member.id)
                ? `/members/${member.id}`
                : undefined;

        if (existing) {
            // 同一个人同时出现在本地校友表和 Notion 时：
            // 身份信息（姓名 / 角色 / 届别）以 Notion 为准，
            // 公司、职位、头像、邮箱等 Notion 没填的用本地数据补齐。
            existing.name = member.name || existing.name;
            existing.role = member.role || existing.role;
            existing.year = member.year || existing.year;
            existing.photo = existing.photo || member.photo || '';
            existing.email = existing.email || member.email || '';
            existing.company = existing.company || member.company || '';
            existing.position = existing.position || member.position || '';
            existing.href = existing.href || href || '';
            return;
        }

        add({
            key: `notion-${member.id}`,
            name: member.name,
            year: member.year,
            role: member.role,
            photo: member.photo || '',
            email: member.email || '',
            company: member.company || '',
            position: member.position || '',
            href: href || '',
        });
    });

    cards.sort((a, b) => {
        if (a.year !== b.year) return (b.year || '').localeCompare(a.year || '');
        return a.name.localeCompare(b.name);
    });

    return {
        props: {
            members: cards,
        },
        revalidate: 60,
    };
}

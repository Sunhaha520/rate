import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { ArticleContent } from '@/components/ArticleContent';
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/site';
import { CalendarDays, ExternalLink, Mail, User } from 'lucide-react';
import { MemberProfile } from '@/lib/notion-members';

interface MemberHomepageViewProps {
    member: MemberProfile;
    // 规范地址：/members/<slug>（根路径别名也指向这里）
    canonicalPath?: string;
}

const ROLE_LABEL: Record<string, string> = {
    Supervisor: 'Supervisor of RATE@UM.',
    PhD: 'PhD Student at RATE@UM.',
    Master: 'Master Student at RATE@UM.',
    Undergraduate: 'Undergraduate Student at RATE@UM.',
    RA: 'Research Assistant at RATE@UM.',
};

// 与导师页保持一致的 GitHub 图标（lucide-react 当前版本未导出 Github）
const GitHubIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);

// 成员个人主页：版式与新闻详情页一致（单卡片 + 正文），容器更宽。
// 正文 HTML 在服务端生成并清洗，直接随首屏输出，不再等客户端水合。
// `/members/<slug>` 与 `/<slug>`（如 /qiaoyutong）共用这个视图。
export function MemberHomepageView({
    member,
    canonicalPath,
}: MemberHomepageViewProps) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const roleLabel = ROLE_LABEL[member.role] ?? 'Member of RATE@UM.';
    const hasExternalHomepage = /^https?:\/\//i.test(member.homepage ?? '');
    const path = canonicalPath || `/members/${member.id}`;

    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: member.name,
        jobTitle: roleLabel.replace(/\.$/, ''),
        description: `${member.name}, ${roleLabel}`,
        image: member.photo ? absoluteUrl(member.photo) : undefined,
        url: absoluteUrl(path),
        affiliation: {
            '@type': 'Organization',
            name: 'RATE@UM',
            url: absoluteUrl('/'),
        },
        sameAs: [member.github, member.homepage]
            .filter((value): value is string => Boolean(value))
            .map((value) => absoluteUrl(value)),
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title={member.name}
                path={path}
                description={`${member.name}, ${roleLabel} Research interests: ${member.researchTopic.join(', ')}.`}
                image={member.photo || undefined}
                type="profile"
                jsonLd={[
                    personJsonLd,
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: 'Research Team', path: '/current-members' },
                        { name: member.name, path },
                    ]),
                ]}
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10 sm:pb-14">
                <div className="mx-auto w-full max-w-5xl">
                    <article className="rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <div className="h-1 w-full bg-gradient-to-r from-teal-600/80 via-teal-500/35 to-transparent" />

                        <div className="px-6 sm:px-8 md:px-10 pt-8 sm:pt-10 pb-10 sm:pb-12">
                            {/* 顶部：头像 + 姓名 + 身份说明 */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 mx-auto sm:mx-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-1 ring-slate-200 dark:ring-slate-700">
                                    {member.photo && !photoFailed ? (
                                        <img
                                            src={member.photo}
                                            alt={member.name}
                                            loading="eager"
                                            decoding="async"
                                            className="object-cover w-full h-full"
                                            onError={() => setPhotoFailed(true)}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User
                                                size={44}
                                                strokeWidth={1.5}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center sm:text-left">
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                                        {member.name}
                                    </h1>
                                    <p className="mt-1.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        {roleLabel}
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                        {member.year && (
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={15} className="text-teal-600 dark:text-teal-400" />
                                                <span>{member.year}</span>
                                            </span>
                                        )}
                                        {member.email && (
                                            <a
                                                href={`mailto:${member.email}`}
                                                title={member.email}
                                                className="flex items-center gap-1.5 max-w-full break-all hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                            >
                                                <Mail size={15} className="shrink-0" />
                                                <span>{member.email}</span>
                                            </a>
                                        )}
                                        {member.github && (
                                            <a
                                                href={member.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                            >
                                                <GitHubIcon />
                                                <span>GitHub</span>
                                            </a>
                                        )}
                                        {hasExternalHomepage && (
                                            <a
                                                href={member.homepage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                            >
                                                <ExternalLink size={15} />
                                                <span>Homepage</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 研究方向（Notion 里填了才显示）：学术标签样式 */}
                            {member.researchTopic.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/60">
                                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-3">
                                        Research Interests
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {member.researchTopic.map((topic) => (
                                            <span
                                                key={topic}
                                                className="px-2.5 py-1 rounded-md text-[0.8rem] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200"
                                            >
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 正文：成员在 Notion 页面里写了什么就渲染什么，空白不显示 */}
                            {member.contentHtml && (
                                <ArticleContent
                                    html={member.contentHtml}
                                    className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/60"
                                />
                            )}
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default MemberHomepageView;

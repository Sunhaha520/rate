import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { ArticleContent } from '@/components/ArticleContent';
import { absoluteUrl } from '@/lib/site';
import { getSupervisor, MemberProfile } from '@/lib/notion-members';
import {
    getFeaturedPublications,
    PublicationItem,
} from '@/lib/notion-publications';
import { mentor, researches, MentorInfo } from '@/data/personal';
import { CalendarDays, Mail, ExternalLink, User, ArrowUpRight } from 'lucide-react';

interface MentorPageProps {
    supervisor: MemberProfile | null;
    research: PublicationItem[];
    mentor: MentorInfo;
}

const GitHubSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
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

const PaperSVG = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
    </svg>
);

const MentorPage: React.FC<MentorPageProps> = ({ supervisor, research, mentor }) => {
    const name = supervisor?.name || mentor.name;
    const photo = supervisor?.photo || mentor.photo;
    const hasNotionContent = Boolean(supervisor?.contentHtml);
    const hasExternalHomepage = /^https?:\/\//i.test(supervisor?.homepage ?? '');

    const personJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        jobTitle: 'Supervisor, Research Group of Advanced Technologies in Engineering',
        description: `Profile and research of ${name}, Supervisor of RATE@UM at the University of Macau.`,
        image: photo ? absoluteUrl(photo) : undefined,
        url: absoluteUrl('/supervisor'),
        affiliation: {
            '@type': 'Organization',
            name: 'RATE@UM',
            url: absoluteUrl('/'),
        },
        sameAs: [supervisor?.github, supervisor?.homepage]
            .filter((value): value is string => Boolean(value))
            .map((value) => absoluteUrl(value)),
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title={name}
                path="/supervisor"
                description={`Profile and research of ${name}, Supervisor of RATE@UM at the University of Macau.`}
                image={photo || undefined}
                type="profile"
                jsonLd={personJsonLd}
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-10 sm:pb-14">
                <div className="mx-auto w-full max-w-5xl space-y-8">
                    {/* 导师档案卡片：数据来自 Notion 成员表中 Role=Supervisor 的那一行 */}
                    <article className="card-enter rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <div className="h-1 w-full bg-gradient-to-r from-teal-600/80 via-teal-500/35 to-transparent" />

                        <div className="px-6 sm:px-8 md:px-10 pt-8 sm:pt-10 pb-10 sm:pb-12">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 mx-auto sm:mx-0 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-1 ring-slate-200 dark:ring-slate-700">
                                    {photo ? (
                                        <img
                                            src={photo}
                                            alt={name}
                                            loading="eager"
                                            decoding="async"
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={44} strokeWidth={1.5} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <div className="text-center sm:text-left">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                                        Supervisor
                                    </p>
                                    <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                                        {name}
                                    </h1>
                                    <p className="mt-1.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        Supervisor of RATE@UM.
                                    </p>

                                    <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                                        {supervisor?.year && (
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={15} className="text-teal-600 dark:text-teal-400" />
                                                <span>{supervisor.year}</span>
                                            </span>
                                        )}
                                        {supervisor?.email && (
                                            <a
                                                href={`mailto:${supervisor.email}`}
                                                className="flex items-center gap-1.5 max-w-full break-all hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                            >
                                                <Mail size={15} className="shrink-0" />
                                                <span>{supervisor.email}</span>
                                            </a>
                                        )}
                                        {supervisor?.github && (
                                            <a
                                                href={supervisor.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                            >
                                                <GitHubSVG />
                                                <span>GitHub</span>
                                            </a>
                                        )}
                                        {hasExternalHomepage && (
                                            <a
                                                href={supervisor?.homepage}
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

                            {supervisor && supervisor.researchTopic.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/60">
                                    <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 mb-3">
                                        Research Interests
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {supervisor.researchTopic.map((topic) => (
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

                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/60">
                                {hasNotionContent && supervisor ? (
                                    <ArticleContent html={supervisor.contentHtml} />
                                ) : (
                                    <p className="text-[1.0625rem] leading-[1.85] text-gray-700 dark:text-gray-300 text-justify">
                                        {mentor.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                    </article>

                    {/* 代表性研究：目前仍来自 src/data/personal.ts，可后续迁到 Notion */}
                    <section>
                        <div className="mb-5 flex items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                Selected latest research
                            </h2>
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {research.map((paper) => (
                                <article
                                    key={paper.id}
                                    className="card-enter rounded-xl shadow-md overflow-hidden bg-white dark:bg-gray-800"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {paper.coverImage && (
                                            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 md:h-auto md:min-h-[12rem] md:w-[36%]">
                                                <img
                                                    src={paper.coverImage}
                                                    alt={paper.title}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className={`flex w-full flex-col p-6 ${paper.coverImage ? 'md:w-[64%]' : ''}`}>
                                            <h3 className="text-lg font-semibold leading-snug text-gray-900 dark:text-white">
                                                {paper.title}
                                            </h3>
                                            {(paper.venue || paper.year) && (
                                                <p className="mt-1 text-xs italic text-slate-500 dark:text-slate-400">
                                                    {[paper.venue, paper.year]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </p>
                                            )}
                                            {paper.authors && (
                                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                    {paper.authors}
                                                </p>
                                            )}
                                            {paper.abstract && (
                                                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                    {paper.abstract}
                                                </p>
                                            )}

                                            {(paper.github || paper.link) && (
                                                <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-sm">
                                                    {paper.github && (
                                                        <a
                                                            href={paper.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                        >
                                                            <GitHubSVG />
                                                            <span>GitHub</span>
                                                            <ArrowUpRight size={13} />
                                                        </a>
                                                    )}
                                                    {paper.link && (
                                                        <a
                                                            href={paper.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                        >
                                                            <PaperSVG />
                                                            <span>Paper Website</span>
                                                            <ArrowUpRight size={13} />
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MentorPage;

export async function getStaticProps() {
    // 导师资料来自 Notion 成员表里 Role=Supervisor 的那一行；
    // 代表性研究来自 Notion 论文表里勾选 Featured 的条目，没有时回退到本地数据。
    let supervisor: MemberProfile | null = null;
    let research: PublicationItem[] = [];

    try {
        supervisor = await getSupervisor();
    } catch (err) {
        console.error('读取 Notion 导师资料失败，已回退到本地数据:', err);
    }

    try {
        research = await getFeaturedPublications();
    } catch (err) {
        console.error('读取 Notion 代表性论文失败，已回退到本地数据:', err);
    }

    if (research.length === 0) {
        research = researches.map((paper) => ({
            id: String(paper.id),
            title: paper.name,
            authors: paper.author,
            venue: '',
            year: '',
            type: '',
            abstract: paper.intro,
            coverImage: paper.photo,
            link: paper.detailsLinks.paperWebsite ?? '',
            github: paper.detailsLinks.github ?? '',
            featured: true,
            order: 0,
        }));
    }

    return {
        props: {
            supervisor,
            research,
            mentor,
        },
        revalidate: 60,
    };
}

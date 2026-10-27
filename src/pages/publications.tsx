import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { itemListJsonLd } from '@/lib/site';
import { papers } from '@/data/papers';
import {
    getPublications,
    PublicationItem,
} from '@/lib/notion-publications';
import { ArrowUpRight } from 'lucide-react';

// 论文配图可能来自外部图床（存在防盗链 403），加载失败时整体收起，
// 不留下破图占位或 alt 文字。
function PublicationCover({ src, alt }: { src: string; alt: string }) {
    const [failed, setFailed] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // SSR 阶段图片就可能已经加载失败，onError 来不及绑定；
    // 水合后补一次检查，避免留下破图。
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth === 0) {
            setFailed(true);
        }
    }, []);

    if (failed) return null;

    return (
        <div className="relative h-40 w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 sm:h-auto sm:min-h-[9rem] sm:w-56 md:w-64">
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={() => setFailed(true)}
                className="absolute inset-0 h-full w-full object-cover"
            />
        </div>
    );
}

interface PublicationsPageProps {
    publications: PublicationItem[];
}

const PublicationsPage: React.FC<PublicationsPageProps> = ({ publications }) => {
    // 按年份分组（年份倒序，无年份的放最后）
    const groups = new Map<string, PublicationItem[]>();
    publications.forEach((paper) => {
        const year = paper.year || 'Other';
        const list = groups.get(year);
        if (list) {
            list.push(paper);
        } else {
            groups.set(year, [paper]);
        }
    });

    const years = [...groups.keys()].sort((a, b) => {
        const na = Number(a);
        const nb = Number(b);
        if (Number.isFinite(na) && Number.isFinite(nb)) return nb - na;
        if (Number.isFinite(na)) return -1;
        if (Number.isFinite(nb)) return 1;
        return a.localeCompare(b);
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Publications"
                path="/publications"
                description="Peer-reviewed publications from RATE@UM on BIM, digital twins, construction automation, multi-user AR/VR and computer vision."
                jsonLd={itemListJsonLd(
                    publications.map((paper) => ({
                        name: paper.title,
                        path: paper.link || '/publications',
                    }))
                )}
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <section>
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            Our Papers
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Explore our published papers at RATE@UM.
                        </p>
                    </div>

                    {publications.length === 0 && (
                        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
                            No publications yet. Add records in the Notion
                            Publications table, or edit src/data/papers.ts.
                        </p>
                    )}

                    <div className="space-y-10">
                        {years.map((year) => (
                            <div key={year}>
                                <div className="mb-4 flex items-center gap-3">
                                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                        {year}
                                    </h2>
                                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                                    <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                        {groups.get(year)!.length}
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    {groups.get(year)!.map((paper) => (
                                        <article
                                            key={paper.id}
                                            className="card-enter overflow-hidden rounded-xl shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                {paper.coverImage && (
                                                    <PublicationCover
                                                        src={paper.coverImage}
                                                        alt={paper.title}
                                                    />
                                                )}

                                                <div className="flex flex-1 flex-col p-5 sm:p-6">
                                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                                        {paper.venue && (
                                                            <span className="italic text-slate-500 dark:text-slate-400">
                                                                {paper.venue}
                                                            </span>
                                                        )}
                                                        {paper.type && (
                                                            <span className="rounded-full border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[0.68rem] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                                                                {paper.type}
                                                            </span>
                                                        )}
                                                        {paper.featured && (
                                                            <span className="rounded-full border border-teal-600/25 dark:border-teal-400/25 bg-teal-50 dark:bg-teal-500/10 px-2 py-0.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
                                                                Selected
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="mt-2 text-lg font-semibold leading-snug">
                                                        {paper.title}
                                                    </h3>

                                                    {paper.authors && (
                                                        <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
                                                            {paper.authors}
                                                        </p>
                                                    )}

                                                    {paper.abstract && (
                                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                                            {paper.abstract}
                                                        </p>
                                                    )}

                                                    {(paper.link || paper.github) && (
                                                        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-sm">
                                                            {paper.link && (
                                                                <a
                                                                    href={paper.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                                >
                                                                    Read Paper
                                                                    <ArrowUpRight size={14} />
                                                                </a>
                                                            )}
                                                            {paper.github && (
                                                                <a
                                                                    href={paper.github}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                                >
                                                                    Code
                                                                    <ArrowUpRight size={14} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
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

export default PublicationsPage;

// 本地兜底数据（Notion 论文表为空或尚未创建时使用）
const localPublications: PublicationItem[] = papers.map((paper) => ({
    id: String(paper.id),
    title: paper.title,
    authors: paper.authors.join(', '),
    venue: paper.journal,
    year: String(paper.year),
    type: '',
    link: paper.link,
    github: '',
    coverImage: paper.coverImage ?? '',
    abstract: '',
    featured: false,
    order: 0,
}));

export async function getStaticProps() {
    let publications: PublicationItem[] = [];

    try {
        publications = await getPublications();
    } catch (err) {
        console.error('读取 Notion 论文表失败，已回退到本地数据:', err);
    }

    if (publications.length === 0) {
        publications = localPublications;
    }

    return {
        props: {
            publications,
        },
        revalidate: 60,
    };
}

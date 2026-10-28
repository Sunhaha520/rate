import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { resources } from '@/data/resources';
import { getDemoResources, DemoItem } from '@/lib/notion-demo';
import { parseVideoEmbed, isDirectVideoUrl } from '@/lib/video-embed';
import { Play, X, ArrowUpRight, ImageIcon } from 'lucide-react';

interface DemoResourcesPageProps {
    resources: DemoItem[];
}

// 视频卡片的封面：优先用 Cover；没有封面或封面加载失败时，
// 直接用视频本身的第一帧当封面（静音、只取元数据，不自动播放）。
function DemoCover({ item }: { item: DemoItem }) {
    const [coverFailed, setCoverFailed] = useState(false);
    const [thumbFailed, setThumbFailed] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const embed = item.isVideo ? parseVideoEmbed(item.headImage) : null;
    const canPlayNative =
        item.isVideo &&
        !embed &&
        (isDirectVideoUrl(item.headImage) ||
            item.headImage.includes('/api/notion-image'));

    // SSR 阶段图片可能已经加载失败，onError 来不及绑定；水合后补一次检查
    useEffect(() => {
        const img = imgRef.current;
        if (img && img.complete && img.naturalWidth === 0) {
            setCoverFailed(true);
        }
    }, []);

    if (item.coverImage && !coverFailed) {
        return (
            <img
                ref={imgRef}
                src={item.coverImage}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setCoverFailed(true)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
        );
    }

    // YouTube 使用官方缩略图
    if (embed?.thumbnail && !thumbFailed) {
        return (
            <img
                src={embed.thumbnail}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setThumbFailed(true)}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
        );
    }

    // 直链视频（mp4 等）取第一帧；YouTube / Bilibili 不使用 <video>
    if (canPlayNative) {
        const src = item.headImage.includes('#')
            ? item.headImage
            : `${item.headImage}#t=0.1`;
        return (
            <video
                src={src}
                muted
                playsInline
                preload="metadata"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
            />
        );
    }

    if (!embed && !item.isVideo && item.headImage) {
        return (
            <img
                src={item.headImage}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
            />
        );
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon
                size={40}
                strokeWidth={1.4}
                className="text-slate-300 dark:text-slate-600"
            />
        </div>
    );
}

const DemoResourcesPage: React.FC<DemoResourcesPageProps> = ({ resources }) => {
    const [selected, setSelected] = useState<DemoItem | null>(null);
    const selectedEmbed =
        selected && selected.isVideo
            ? parseVideoEmbed(selected.headImage)
            : null;
    const selectedCanPlayNative =
        Boolean(selected) &&
        selected!.isVideo &&
        !selectedEmbed &&
        (isDirectVideoUrl(selected!.headImage) ||
            selected!.headImage.includes('/api/notion-image'));

    // Esc 关闭 + 打开弹窗时锁定页面滚动
    useEffect(() => {
        if (!selected) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelected(null);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [selected]);

    const tagGroups = new Map<string, DemoItem[]>();
    resources.forEach((item) => {
        const list = tagGroups.get(item.tag);
        if (list) {
            list.push(item);
        } else {
            tagGroups.set(item.tag, [item]);
        }
    });

    const tagOrder = (tag: string) =>
        tag === 'Demo videos' ? 0 : tag === 'Resources' ? 1 : 2;
    const tags = [...tagGroups.keys()].sort(
        (a, b) => tagOrder(a) - tagOrder(b) || a.localeCompare(b)
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Demo & Resources"
                path="/demo"
                description="Demos, videos and open resources from RATE@UM, including BIM and multi-user AR/VR construction systems and research datasets."
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <section>
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            Demo &amp; Resources
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Explore our demos and resources at RATE@UM.
                        </p>
                    </div>

                    {resources.length === 0 && (
                        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
                            No demos or resources yet. Add records in the Notion
                            Demo table, or edit src/data/resources.ts.
                        </p>
                    )}

                    {tags.map((tag) => (
                        <div key={tag} className="mt-10 first:mt-0">
                            <div className="mb-5 flex items-center gap-3">
                                <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                    {tag}
                                </h2>
                                <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                                <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                    {tagGroups.get(tag)!.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {tagGroups.get(tag)!.map((item) => (
                                    <article
                                        key={item.id}
                                        onClick={() => setSelected(item)}
                                        className="card-enter group cursor-pointer overflow-hidden rounded-xl shadow-md bg-white text-gray-900 transition-all duration-500 ease-out hover:scale-[1.02] dark:bg-gray-800 dark:text-white"
                                    >
                                        {(item.coverImage || item.headImage) && (
                                            <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-700 sm:h-auto sm:aspect-video">
                                                <DemoCover item={item} />

                                                {item.isVideo && (
                                                    <span className="absolute inset-0 flex items-center justify-center">
                                                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                                                            <Play
                                                                size={22}
                                                                className="ml-0.5"
                                                                fill="currentColor"
                                                            />
                                                        </span>
                                                    </span>
                                                )}

                                                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
                                                    {item.tag}
                                                </span>
                                            </div>
                                        )}

                                        <div className="p-4 sm:p-5">
                                            {!(item.coverImage || item.headImage) && (
                                                <span className="mb-2 inline-flex rounded-full border border-slate-200 px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                                    {item.tag}
                                                </span>
                                            )}
                                            <h3 className="text-base font-semibold leading-snug">
                                                {item.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:line-clamp-3">
                                                {item.description}
                                            </p>
                                            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-700 dark:text-teal-300">
                                                {item.isVideo
                                                    ? 'Watch demo'
                                                    : 'View details'}
                                                <ArrowUpRight size={14} />
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>

            {selected && (
                <div
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
                    onClick={() => setSelected(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={selected.title}
                >
                    <div
                        className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white text-gray-900 shadow-2xl dark:bg-gray-800 dark:text-white"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* 顶栏：标签 + 关闭按钮，不再压在大图上 */}
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5 dark:border-slate-700/60 sm:px-5">
                            <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[0.68rem] font-medium tracking-wide text-slate-600 dark:border-slate-700 dark:text-slate-300">
                                {selected.tag}
                            </span>
                            <button
                                type="button"
                                onClick={() => setSelected(null)}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            {(selected.isVideo || selected.headImage) && (
                                <div className="w-full bg-slate-950">
                                    {selectedEmbed ? (
                                        <div className="relative h-48 w-full sm:h-auto sm:aspect-video">
                                            <iframe
                                                src={selectedEmbed.embedUrl}
                                                title={selected.title}
                                                loading="lazy"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                allowFullScreen
                                                className="absolute inset-0 h-full w-full border-0"
                                            />
                                        </div>
                                    ) : selectedCanPlayNative ? (
                                        <video
                                            src={selected.headImage}
                                            controls
                                            playsInline
                                            className="max-h-[28vh] w-full object-contain sm:max-h-[38vh]"
                                        />
                                    ) : selected.coverImage || !selected.isVideo ? (
                                        <img
                                            src={
                                                selected.isVideo
                                                    ? selected.coverImage
                                                    : selected.headImage
                                            }
                                            alt={selected.title}
                                            className="h-40 w-full object-cover sm:h-72"
                                        />
                                    ) : null}
                                </div>
                            )}

                            <div className="p-5 sm:p-6">
                                <h2 className="text-lg font-semibold leading-snug sm:text-xl">
                                    {selected.title}
                                </h2>
                                <p className="mt-2.5 text-justify text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    {selected.fullDescription}
                                </p>

                                {selected.link && (
                                    <a
                                        href={selected.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200"
                                    >
                                        Open resource
                                        <ArrowUpRight size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default DemoResourcesPage;

// 本地兜底数据（Notion Demo 表为空或尚未创建时使用）
const localDemoResources: DemoItem[] = resources.map((resource) => ({
    id: String(resource.id),
    title: resource.title,
    description: resource.description,
    fullDescription: resource.fullDescription,
    coverImage: resource.coverImage,
    headImage: resource.headImage,
    isVideo: resource.isVideo,
    tag: resource.tag,
    link: resource.link ?? '',
    order: 0,
}));

export async function getStaticProps() {
    let demoResources: DemoItem[] = [];

    try {
        demoResources = await getDemoResources();
    } catch (err) {
        console.error('读取 Notion Demo 表失败，已回退到本地数据:', err);
    }

    if (demoResources.length === 0) {
        demoResources = localDemoResources;
    }

    return {
        props: {
            resources: demoResources,
        },
        revalidate: 60,
    };
}

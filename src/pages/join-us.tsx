import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { ArticleContent } from '@/components/ArticleContent';
import { getJoinUs, JoinUsInfo } from '@/lib/notion-joinus';
import { markdownToHtml } from '@/lib/notion';
import { recruitmentData, addressData } from '@/data/joinus';
import { MapPin, Mail, ArrowUpRight } from 'lucide-react';

interface JoinUsView {
    title: string;
    welcome: string;
    contentHtml: string;
    address: string;
    contactText: string;
    email: string;
    mapImage: string;
    mapLink: string;
}

interface JoinUsPageProps {
    joinUs: JoinUsView;
}

// 默认百度和地图链接（Notion 里没填 Map Link 时使用）
const DEFAULT_MAP_LINK =
    'https://map.baidu.com/poi/%E6%BE%B3%E9%97%A8%E5%A4%A7%E5%AD%A6/@12641274.195,2511304.25,19z?uid=ce12fe3348045569f33cbace&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl';

// 地图预览：图片未加载/加载失败时显示定位图标，避免出现破图或 alt 文字
function MapPreview({ src }: { src: string }) {
    const [failed, setFailed] = useState(false);

    return (
        <>
            <div className="absolute inset-0 flex items-center justify-center">
                <MapPin
                    size={36}
                    strokeWidth={1.5}
                    className="text-slate-300 dark:text-slate-600"
                />
            </div>
            {src && !failed && (
                <img
                    src={src}
                    alt=""
                    loading="eager"
                    decoding="async"
                    onError={() => setFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
                />
            )}
            {/* 地图定位点：静态青碧圆点 + 扩散光圈，与黑白地图形成对比 */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 animate-marker rounded-full bg-teal-500/60"
            />
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-teal-600 shadow-[0_0_0_4px_rgba(13,148,136,0.22)]"
            />
        </>
    );
}

const JoinUsPage: React.FC<JoinUsPageProps> = ({ joinUs }) => {
    const hasContact = Boolean(joinUs.email || joinUs.contactText);
    const hasAddress = Boolean(joinUs.address || joinUs.mapImage);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Join Us"
                path="/join-us"
                description="Recruitment information for postdoctoral, PhD, master and research assistant positions at RATE@UM, University of Macau."
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <section>
                    {/* 标题卡片 */}
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            {joinUs.title}
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        {joinUs.welcome && (
                            <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                                {joinUs.welcome}
                            </p>
                        )}
                    </div>

                    {/* 招聘正文：来自 Notion 页面正文 */}
                    <div className="card-enter rounded-xl shadow-md overflow-hidden p-6 sm:p-8 mb-6 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        {joinUs.contentHtml ? (
                            <ArticleContent html={joinUs.contentHtml} />
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">
                                Recruitment information will be available soon.
                            </p>
                        )}
                    </div>

                    {/* 地址 + 联系方式 */}
                    {(hasAddress || hasContact) && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {hasAddress && (
                                <div className="card-enter flex flex-col overflow-hidden rounded-xl shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white sm:flex-row">
                                    <a
                                        href={joinUs.mapLink || DEFAULT_MAP_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block h-44 w-full shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700 sm:h-auto sm:min-h-[12rem] sm:w-2/5"
                                        aria-label="Open location in map"
                                    >
                                        <MapPreview src={joinUs.mapImage} />
                                    </a>

                                    <div className="flex flex-1 flex-col p-6">
                                        <h2 className="flex items-center gap-2 text-lg font-bold">
                                            <MapPin
                                                size={18}
                                                className="text-teal-600 dark:text-teal-400"
                                            />
                                            {addressData.title || 'Address'}
                                        </h2>
                                        {joinUs.address && (
                                            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                {joinUs.address}
                                            </p>
                                        )}
                                        <a
                                            href={joinUs.mapLink || DEFAULT_MAP_LINK}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                        >
                                            Open in Maps
                                            <ArrowUpRight size={14} />
                                        </a>
                                    </div>
                                </div>
                            )}

                            {hasContact && (
                                <div className="card-enter flex flex-col rounded-xl shadow-md bg-white p-6 text-gray-900 dark:bg-gray-800 dark:text-white">
                                    <h2 className="flex items-center gap-2 text-lg font-bold">
                                        <Mail
                                            size={18}
                                            className="text-teal-600 dark:text-teal-400"
                                        />
                                        Contact Us
                                    </h2>
                                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                        {joinUs.contactText ||
                                            'If you have any questions, feel free to contact us:'}
                                    </p>
                                    {joinUs.email && (
                                        <a
                                            href={`mailto:${joinUs.email}`}
                                            className="mt-4 inline-flex max-w-full items-center gap-2 break-all rounded-lg border border-teal-600/25 dark:border-teal-400/25 bg-teal-50/60 dark:bg-teal-500/10 px-3 py-2 text-sm font-medium text-teal-700 dark:text-teal-300 hover:bg-teal-100/70 dark:hover:bg-teal-500/20 transition-colors"
                                        >
                                            <Mail size={15} className="shrink-0" />
                                            {joinUs.email}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default JoinUsPage;

export async function getStaticProps() {
    // 招聘信息、地址、联系方式都从 Notion 的 Join Us 页面读取；
    // 没有配置或字段留空时用本地默认值补齐。
    let info: JoinUsInfo | null = null;
    try {
        info = await getJoinUs();
    } catch (err) {
        console.error('读取 Notion Join Us 失败，已回退到本地数据:', err);
    }

    const localContentHtml = await markdownToHtml(recruitmentData);

    const joinUs: JoinUsView = {
        title: info?.title || 'Join Us',
        welcome: info?.welcome || 'Welcome to join us.',
        contentHtml: info?.contentHtml || localContentHtml,
        address: info?.address || addressData.address,
        contactText:
            info?.contactText ||
            'If you have any questions, feel free to contact us:',
        email: info?.email || 'mowong@um.edu.mo',
        mapImage: info?.mapImage || '/img/map.webp',
        mapLink: info?.mapLink || DEFAULT_MAP_LINK,
    };

    return {
        props: {
            joinUs,
        },
        revalidate: 60,
    };
}

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { recruitmentData, addressData } from '@/data/joinus';

const JoinUsPage: React.FC = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        setMounted(true);
        async function convertMarkdown() {
            const processedContent = await remark()
                .use(gfm) // 使用GFM插件支持删除线等语法
                .use(html)
                .process(recruitmentData);
            setMarkdownContent(processedContent.toString());
        }
        convertMarkdown();
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Head>
                <title>Join Us - RATE@UM</title>
                <meta name="description" content="Recruitment for AY 2026/2027 at RATE@UM." />
                <meta property="og:title" content="Join Us - RATE@UM" />
                <meta property="og:description" content="Recruitment for AY 2026/2027 at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${
                        theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-gray-900'
                    }`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">🤝Join Us</h2>
                        <p className={`text-lg text-center ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Welcome to join us.
                        </p>
                    </div>

                    {/* 招聘详情卡片 - 添加删除线支持 */}
                    <div 
                        className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${
                            theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-gray-900'
                        } markdown-content`}
                        dangerouslySetInnerHTML={{ __html: markdownContent }}
                    />

                    {/* 卡片容器 */}
                    <div className="flex flex-wrap -mx-3">
                        {/* 地图卡片 */}
                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <div className={`flex flex-col md:flex-row border rounded-xl shadow-md overflow-hidden p-6 transition-all duration-500 ease-out transform hover:scale-105 ${
                                theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-gray-900'
                            }`}>
                                {/* 地图部分 */}
                                <a
                                    href="https://map.baidu.com/poi/%E6%BE%B3%E9%97%A8%E5%A4%A7%E5%AD%A6/@12641274.195,2511304.25,19z?uid=ce12fe3348045569f33cbace&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full md:w-1/2 h-full group relative"
                                >
                                    <div className="h-full bg-[url('/img/map.webp')] bg-center bg-cover bg-no-repeat filter grayscale-0 sm:grayscale sm:group-hover:grayscale-0 transition-all rounded-xl" style={{ minHeight: '200px' }}></div>
                                    <div className="absolute z-30 left-1/2 top-1/2 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 animate-marker rounded-full bg-blue-500"></div>
                                    <div className="absolute left-1/2 top-1/2 z-30 h-[20px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-neutral-50 bg-blue-500 shadow-2xl"></div>
                                </a>
                                {/* 文字介绍部分 */}
                                <div className="w-full md:w-1/2 p-4">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl font-bold mb-2">{addressData.title}</h2>
                                        <span className={`${
                                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                        }`}>{addressData.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 联系信息卡片 */}
                        <div className="w-full md:w-1/2 px-3 mb-6">
                            <div className={`flex flex-col justify-between border rounded-xl shadow-md overflow-hidden p-6 transition-all duration-500 ease-out transform hover:scale-105 ${
                                theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-gray-900'
                            }`} style={{ minHeight: '250px' }}>
                                <div>
                                    <h2 className="text-xl font-bold mb-2">Contact Us</h2>
                                    <p className={`${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        If you have any questions, feel free to contact us:
                                    </p>
                                    <ul className="list-disc list-inside">
                                        <li>Email: mowong@um.edu.mo</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default JoinUsPage;

export async function getStaticProps() {
    return {
        props: {}
    };
}
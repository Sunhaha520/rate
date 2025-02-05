import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from 'next-themes';

const JoinUsPage: React.FC = () => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 确保组件在客户端渲染后再应用主题
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            {/* 动态设置 Head 内容 */}
            <Head>
                <title>Join Us - RATE@UM</title>
                <meta name="description" content="Recruitment for AY 2026/2027 at RATE@UM." />
                <meta property="og:title" content="Join Us - RATE@UM" />
                <meta property="og:description" content="Recruitment for AY 2026/2027 at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* 招聘信息部分 */}
                <section className="">
                    {/* 标题卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">🤝Join Us</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Welcome to join us.
                        </p>
                    </div>

                    {/* 招聘详情卡片 */}
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <p className="text-xl font-bold mb-4 text-yellow-500">Recruitment is open for AY 2026/2027</p>
                        <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Candidates with backgrounds in <span className="font-bold text-blue-500">Civil Engineering</span>, <span className="font-bold text-blue-500">Construction Management</span>, <span className="font-bold text-blue-500">Computer Science</span>, and/or <span className="font-bold text-blue-500">Automation and Robotics</span> and with strong interests in <span className="font-bold text-green-500">BIM</span>, <span className="font-bold text-green-500">multi - user AR/VR</span>, <span className="font-bold text-green-500">cobots</span>, and <span className="font-bold text-green-500">3D reconstruction</span> in the AECO industries are welcome to apply for <span className="font-bold text-orange-500">Ph.D./research assistant (RA)</span> positions.
                        </p>
                        <hr className="my-4 border-gray-400" />
                        <p className={`text-lg mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Please attach your <span className="font-bold text-purple-500">CV</span>, <span className="font-bold text-purple-500">transcripts</span>, and <span className="font-bold text-purple-500">research proposals</span> and send the application to email <a href="mailto:mowong@um.edu.mo" className="text-blue-500 hover:underline">mowong@um.edu.mo</a>.
                        </p>
                        <hr className="my-4 border-gray-400" />
                        <p className={`text-lg mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            For more details, please visit the <span className="font-bold text-teal-500"><a href="#" className="text-blue-500 hover:underline">UM application webpage</a></span>.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default JoinUsPage;

// 使用 getStaticProps 获取数据（这里无实际数据获取需求，仅为示例格式）
export async function getStaticProps() {
    return {
        props: {}
    };
}

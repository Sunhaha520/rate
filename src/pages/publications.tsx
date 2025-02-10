import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { papers, Paper } from '@/data/papers'; 
import { useTheme } from 'next-themes'; 

interface PapersProps {
    papers: Paper[];
}

const PapersPage: React.FC<PapersProps> = ({ papers }) => {
    const [visibleBooks, setVisibleBooks] = useState<number[]>([]); 
    const bookRefs = useRef<(HTMLDivElement | null)[]>([]); 
    const { theme } = useTheme(); 
    const [mounted, setMounted] = useState(false); 
    const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null); 
    const [cardHeight, setCardHeight] = useState('80vh'); 

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const screenHeight = window.innerHeight;
            setCardHeight(`${screenHeight * 0.8}px`);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleBooks((prev) => [...prev, index]); 
                        observer.unobserve(entry.target); 
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px', 
                threshold: 0.1, 
            }
        );

        bookRefs.current.forEach((book) => {
            if (book) observer.observe(book);
        });

        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]);

    const closePaperDetails = () => {
        setSelectedPaper(null);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closePaperDetails();
        }
    };

    if (!mounted) {
        return null; 
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Head>
                <title>Our Papers - RATE@UM</title>
                <meta name="description" content="Explore our published papers at RATE@UM." />
                <meta property="og:title" content="Our Papers - RATE@UM" />
                <meta property="og:description" content="Explore our published papers at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                <section className="">
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">📚 Our Papers</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore our published papers at RATE@UM.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {papers.map((paper, index) => (
                            <div
                                key={paper.id}
                                ref={(el) => {
                                    bookRefs.current[index] = el; 
                                }}
                                data-index={index} 
                                className={`rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer ${
                                    visibleBooks.includes(index)
                                        ? 'opacity-100 translate-y-0' 
                                        : 'opacity-0 translate-y-10' 
                                }`}
                                style={{ 
                                    backgroundColor: paper.color, 
                                    height: '300px', 
                                    position: 'relative',
                                    backfaceVisibility: 'hidden', // 启用硬件加速
                                    transform: 'translate3d(0,0,0)' // 启用硬件加速
                                }} 
                                onClick={() => setSelectedPaper(paper)} 
                            >
                                <div className="h-full p-6 text-center">
                                    <h3 className="text-xl font-bold text-white !text-white">
                                        {paper.title}
                                    </h3>
                                    <p className="text-sm !text-white mt-2">
                                        {paper.authors.join(', ')}
                                    </p>
                                    <div className="absolute bottom-2 left-2 px-3 py-1 bg-blue-500 text-white rounded-full text-sm">
                                        {paper.year}
                                    </div>
                                    <div className="absolute bottom-2 right-2 text-white text-4xl opacity-30 z-0">
                                        👨‍🎓
                                    </div>
                                </div>
                                <div
                                    className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-800 bg-opacity-10' : 'bg-white bg-opacity-10'} backdrop-blur-sm flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100`}
                                    style={{
                                        transformOrigin: 'center', // 设置遮罩层的变换中心为中心
                                        backfaceVisibility: 'hidden', // 启用硬件加速
                                        transform: 'translate3d(0,0,0)' // 启用硬件加速
                                    }}
                                >
                                    <p className="text-white text-lg font-bold">Click to learn more</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {selectedPaper && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleBackdropClick} 
                >
                    <div
                        className={`rounded-xl shadow-md overflow-hidden p-6 w-11/12 max-w-2xl overflow-y-auto ${
                            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{ maxHeight: cardHeight, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <h2 className="text-2xl font-bold mb-4">{selectedPaper.title}</h2>
                        <p className="mb-2"><strong>Authors:</strong> {selectedPaper.authors.join(', ')}</p>
                        <p className="mb-2"><strong>Published in:</strong> {selectedPaper.journal}</p>
                        <p className="mb-2"><strong>Year:</strong> {selectedPaper.year}</p>
                        <p className="mb-4"><strong>Abstract:</strong> {selectedPaper.abstract}</p>

                        <div className="mb-4">
                            <strong>Keywords:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedPaper.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <a
                                href={selectedPaper.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-blue-500 !text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                <span>Read Online</span>
                            </a>
                            <button
                                onClick={closePaperDetails}
                                className="px-4 py-2 bg-red-400 !text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default PapersPage;

export async function getStaticProps() {
    return {
        props: {
            papers, 
        },
    };
}

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
    const bookRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [visibleBooks, setVisibleBooks] = useState<number[]>([]);

    useEffect(() => {
        setMounted(true);
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

                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-6">
                        {papers.map((paper, index) => (
                            <div
                                key={paper.id}
                                ref={(el) => {
                                    bookRefs.current[index] = el;
                                }}
                                data-index={index}
                                className={`rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                    visibleBooks.includes(index)
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-10'
                                }`}
                                style={{
                                    backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                                    position: 'relative',
                                    backfaceVisibility: 'hidden',
                                    transform: 'translate3d(0,0,0)',
                                    padding: '1.5rem',
                                }}
                            >
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                            {paper.title}
                                        </h3>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                                            <strong>Authors: </strong>{paper.authors.join(', ')}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                                            <strong>Year: </strong>{paper.year}
                                        </p>
                                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mt-2`}>
                                            <strong>Journal: </strong>{paper.journal}
                                        </p>
                                    </div>
                                    <div className="hidden sm:flex justify-end mt-4">
                                        <a
                                            href={paper.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-500 !text-white rounded-full text-base"
                                        >
                                            Read Online
                                        </a>
                                    </div>
                                    <div className="sm:hidden flex justify-center mt-6">
                                        <a
                                            href={paper.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-500 !text-white rounded-full text-base"
                                        >
                                            Read Online
                                        </a>
                                    </div>
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

export default PapersPage;

export async function getStaticProps() {
    return {
        props: {
            papers,
        },
    };
}

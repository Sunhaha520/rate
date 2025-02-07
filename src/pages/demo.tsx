import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { resources, Resource } from '@/data/resources';
import { useTheme } from 'next-themes';

interface ResourcesProps {
    resources: Resource[];
}

const DemoResourcesPage: React.FC<ResourcesProps> = ({ resources }) => {
    const [visibleResources, setVisibleResources] = useState<number[]>([]);
    const resourceRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
    const [cardHeight, setCardHeight] = useState('80vh');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const screenHeight = document.documentElement.clientHeight;
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
                        setVisibleResources((prev) => [...prev, index]);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1,
            }
        );

        resourceRefs.current.forEach((resource) => {
            if (resource) observer.observe(resource);
        });

        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]);

    const closeResourceDetails = () => {
        setSelectedResource(null);
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            closeResourceDetails();
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Head>
                <title>Demo&Resources - RATE@UM</title>
                <meta name="description" content="Explore our demos and resources at RATE@UM." />
                <meta property="og:title" content="Demo&Resources - RATE@UM" />
                <meta property="og:description" content="Explore our demos and resources at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                <section className="">
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">📚 Demo&Resources</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore our demos and resources at RATE@UM.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
                        {resources.map((resource, index) => {
                            const tagBgColor = resource.tag === 'Demo videos' ? 'bg-blue-500' : 'bg-green-500';
                            return (
                                <div
                                    key={resource.id}
                                    ref={(el) => {
                                        resourceRefs.current[index] = el;
                                    }}
                                    data-index={index}
                                    className={`rounded-lg shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer ${
                                        visibleResources.includes(index)
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-10'
                                    } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                    onClick={() => setSelectedResource(resource)}
                                >
                                    <div className="flex sm:flex-row flex-col relative">
                                        <div className="w-full sm:w-1/3 h-48 sm:h-auto overflow-hidden">
                                            <img
                                                src={resource.coverImage}
                                                alt={resource.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="w-full sm:w-2/3 p-4">
                                            <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <div className={`absolute top-2 left-2 px-4 py-1 rounded-full ${tagBgColor} text-white`}>
                                            {resource.tag}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {selectedResource && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                    onClick={handleBackdropClick}
                >
                    <div
                        className={`rounded-xl shadow-md overflow-hidden w-11/12 max-w-2xl ${
                            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                        }`}
                        style={{
                            maxHeight: cardHeight,
                            WebkitOverflowScrolling: 'touch',
                            scrollbarWidth: 'none',
                            overflowY: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 修改头图样式 */}
                        <div className="relative overflow-hidden">
                            {selectedResource.isVideo ? (
                                <video
                                    src={selectedResource.headImage}
                                    controls
                                    className="w-full object-cover rounded-t-xl"
                                ></video>
                            ) : (
                                <img
                                    src={selectedResource.headImage}
                                    alt={selectedResource.title}
                                    className="w-full object-cover rounded-t-xl"
                                />
                            )}
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{selectedResource.title}</h2>
                            <p className="mb-4">{selectedResource.fullDescription}</p>
                            <div className="flex justify-between mt-6"> {/* 按钮布局容器 */}
                                <button
                                    onClick={closeResourceDetails}
                                    className="px-4 py-2 bg-red-400 !text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                                >
                                    Close
                                </button>
                                {selectedResource.link && (
                                    <a
                                        href={selectedResource.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-400 !text-white rounded-full hover:bg-blue-600 transition-colors duration-300"
                                    >
                                        Online View
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

export async function getStaticProps() {
    return {
        props: {
            resources,
        },
    };
}

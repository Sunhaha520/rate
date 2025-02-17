"use client";
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { projects, Project } from '@/data/projects';
import { useTheme } from 'next-themes';
//jjjj
interface HomeProps {
    projects: Project[];
}

const ProjectsPage: React.FC<HomeProps> = ({ projects }) => {
    const [visibleItems, setVisibleItems] = useState<number[]>([]);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // 按项目类型分组项目
    const categoryGroups: { [key: string]: Project[] } = {
        'Active projects': [],
        'Past projects': []
    };

    projects.forEach((project) => {
        if (project.projectCategory === 'Past projects') {
            categoryGroups['Past projects'].push(project);
        } else {
            categoryGroups['Active projects'].push(project);
        }
    });

    // 检查初始视口内的元素
    useEffect(() => {
        if (mounted) {
            const initialVisibleIndices: number[] = [];
            itemRefs.current.forEach((item, index) => {
                if (item && isElementInViewport(item)) {
                    initialVisibleIndices.push(index);
                }
            });
            setVisibleItems(initialVisibleIndices);
        }
    }, [mounted]);

    // Intersection Observer 配置
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'));
                        setVisibleItems((prev) => [...prev, index]);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '0px 0px -50px 0px',
                threshold: 0.1
            }
        );

        itemRefs.current.forEach((item) => {
            if (item) observer.observe(item);
        });

        return () => {
            observer.disconnect();
        };
    }, [mounted, theme]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const isElementInViewport = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Head>
                <title>Our Projects - RATE@UM</title>
                <meta name="description" content="Explore the projects in our laboratory at RATE@UM." />
                <meta property="og:title" content="Our Projects - RATE@UM" />
                <meta property="og:description" content="Explore the projects in our laboratory at RATE@UM." />
                <meta property="og:type" content="website" />
            </Head>

            <Header />

            <main className="container mx-auto px-4 py-8">
                <section>
                    <div className={`rounded-xl shadow-md overflow-hidden p-6 mb-6 transition-all duration-500 ease-out transform hover:scale-105 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <h2 className="text-3xl font-bold mb-4 text-center">📋 Our Projects</h2>
                        <p className={`text-lg text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Explore the projects in our laboratory.
                        </p>
                    </div>

                    {Object.keys(categoryGroups).map((category, categoryIndex) => {
                        const startIndex = categoryIndex + Object.keys(categoryGroups).length * categoryIndex;
                        return (
                            <div key={category}>
                                <h3
                                    ref={(el) => {
                                        itemRefs.current[startIndex] = el;
                                    }}
                                    data-index={startIndex}
                                    className={`text-2xl font-bold mb-4 text-center mt-8 ${
                                        visibleItems.includes(startIndex)
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-10'
                                    } ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {category}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                                    {categoryGroups[category]?.map((project, index) => {
                                        const itemIndex = startIndex + index + 1;
                                        // 处理年份显示
                                        const displayYear = project.startYear === project.endYear
                                            ? project.startYear
                                            : `${project.startYear} - ${project.endYear}`;
                                        return (
                                            <div
                                                key={project.id}
                                                ref={(el) => {
                                                    itemRefs.current[itemIndex] = el;
                                                }}
                                                data-index={itemIndex}
                                                className={`rounded-xl shadow-md overflow-hidden transition-all duration-500 ease-out transform hover:scale-105 ${
                                                    visibleItems.includes(itemIndex)
                                                        ? 'opacity-100 translate-y-0'
                                                        : 'opacity-0 translate-y-10'
                                                } ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                                                style={{ minHeight: '0px' }}
                                            >
                                                <div className="p-6">
                                                    <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                                                    <p className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <strong>Members:</strong> {project.members.join(', ')}
                                                    </p>
                                                    <p className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <strong>Time:</strong> {displayYear}
                                                    </p>
                                                    <p className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <strong>Funding Institution:</strong> {project.fundingInstitution}
                                                    </p>
                                                    <p className={`mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        <strong>Project Type:</strong> {project.projectType}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectsPage;

export async function getStaticProps() {
    return {
        props: {
            projects
        }
    };
}

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import { itemListJsonLd } from '@/lib/site';
import { projects } from '@/data/projects';
import { getProjects, ProjectItem } from '@/lib/notion-projects';
import {
    CalendarDays,
    Users,
    Building2,
    ArrowUpRight,
} from 'lucide-react';

interface ProjectsPageProps {
    projects: ProjectItem[];
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects }) => {
    const groups: Record<'Active projects' | 'Past projects', ProjectItem[]> = {
        'Active projects': [],
        'Past projects': [],
    };

    projects.forEach((project) => {
        groups[project.category].push(project);
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Seo
                title="Projects"
                path="/project"
                description="Research projects at RATE@UM funded by FDCT and other agencies, covering digital twins, AI-driven inspection and construction automation."
                jsonLd={itemListJsonLd(
                    projects.map((project) => ({
                        name: project.name,
                        path: project.link || '/project',
                    }))
                )}
            />

            <Header />

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <section>
                    <div className="rounded-xl shadow-md overflow-hidden p-6 mb-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-white">
                        <h1 className="text-3xl font-bold mb-3 text-center tracking-tight">
                            Our Projects
                        </h1>
                        <div className="mx-auto mb-4 h-px w-12 bg-teal-600/70 dark:bg-teal-400/60" />
                        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
                            Explore the projects in our laboratory.
                        </p>
                    </div>

                    {projects.length === 0 && (
                        <p className="py-16 text-center text-gray-500 dark:text-gray-400">
                            No projects yet. Add records in the Notion Projects
                            table, or edit src/data/projects.ts.
                        </p>
                    )}

                    {(['Active projects', 'Past projects'] as const).map((category) =>
                        groups[category].length > 0 ? (
                            <div key={category} className="mt-10 first:mt-0">
                                <div className="mb-5 flex items-center gap-3">
                                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                        {category}
                                    </h2>
                                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700/70" />
                                    <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
                                        {groups[category].length}
                                    </span>
                                </div>

                                <div className="space-y-5">
                                    {groups[category].map((project) => (
                                        <article
                                            key={project.id}
                                            className="card-enter overflow-hidden rounded-xl shadow-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
                                        >
                                            {project.photo && (
                                                <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                    <img
                                                        src={project.photo}
                                                        alt={project.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="absolute inset-0 h-full w-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="p-6">
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {project.projectType && (
                                                        <span className="rounded-full border border-teal-600/25 dark:border-teal-400/25 bg-teal-50 dark:bg-teal-500/10 px-2.5 py-0.5 font-medium text-teal-700 dark:text-teal-300">
                                                            {project.projectType}
                                                        </span>
                                                    )}
                                                    {project.period && (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 text-slate-500 dark:text-slate-400">
                                                            <CalendarDays size={12} />
                                                            {project.period}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="mt-3 text-lg font-semibold leading-snug">
                                                    {project.name}
                                                </h3>

                                                {project.summary && (
                                                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                                        {project.summary}
                                                    </p>
                                                )}

                                                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                                    {project.members && (
                                                        <div className="flex gap-2">
                                                            <Users
                                                                size={15}
                                                                className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400"
                                                            />
                                                            <div>
                                                                <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                                                    Members
                                                                </dt>
                                                                <dd className="mt-0.5 text-gray-700 dark:text-gray-300">
                                                                    {project.members}
                                                                </dd>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {project.funding && (
                                                        <div className="flex gap-2">
                                                            <Building2
                                                                size={15}
                                                                className="mt-0.5 shrink-0 text-teal-600 dark:text-teal-400"
                                                            />
                                                            <div>
                                                                <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                                                    Funding
                                                                </dt>
                                                                <dd className="mt-0.5 text-gray-700 dark:text-gray-300">
                                                                    {project.funding}
                                                                </dd>
                                                            </div>
                                                        </div>
                                                    )}
                                                </dl>

                                                {project.link && (
                                                    <div className="pt-4 text-sm">
                                                        <a
                                                            href={project.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 font-medium text-teal-700 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-200 transition-colors"
                                                        >
                                                            Project details
                                                            <ArrowUpRight size={14} />
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProjectsPage;

// 本地兜底数据（Notion 项目表为空或尚未创建时使用）
const localProjects: ProjectItem[] = projects.map((project) => {
    const period =
        project.startYear === project.endYear
            ? project.startYear
            : `${project.startYear} - ${project.endYear}`;

    return {
        id: String(project.id),
        name: project.name,
        members: project.members.join(', '),
        period,
        startYear: project.startYear,
        endYear: project.endYear,
        funding: project.fundingInstitution,
        projectType: project.projectType,
        category: project.projectCategory,
        summary: '',
        link: '',
        photo: '',
        order: 0,
    };
});

export async function getStaticProps() {
    let projectItems: ProjectItem[] = [];

    try {
        projectItems = await getProjects();
    } catch (err) {
        console.error('读取 Notion 项目表失败，已回退到本地数据:', err);
    }

    if (projectItems.length === 0) {
        projectItems = localProjects;
    }

    return {
        props: {
            projects: projectItems,
        },
        revalidate: 60,
    };
}

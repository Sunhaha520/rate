import {
    findProperty,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
} from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getPageSlug,
    getOrder,
    getCheckbox,
} from './notion-collection';

// 论文条目（/publications 与导师页「Selected latest research」共用）
export interface PublicationItem {
    id: string;
    title: string;
    authors: string;
    venue: string;
    year: string;
    type: string;
    link: string;
    github: string;
    coverImage: string;
    abstract: string;
    featured: boolean;
    order: number;
}

const PUBLICATIONS_CACHE = createKeyedCache<PublicationItem[]>(CONTENT_CACHE_TTL);

async function fetchPublications(): Promise<PublicationItem[]> {
    const dataSourceId = await getDataSourceId('publications');
    if (!dataSourceId) return [];

    const pages = await getPublishedPages(dataSourceId);

    const items = pages
        .map((page) => {
            const title = getPropertyText(
                findProperty(page, [
                    'Title',
                    'Name',
                    'Paper',
                    'Paper Title',
                    '论文标题',
                    '标题',
                    '名称',
                ])
            );
            const year = getPropertyText(
                findProperty(page, ['Year', '年份', '发表年份'])
            );

            return {
                id: getPageSlug(page, title),
                title,
                authors: getPropertyText(
                    findProperty(page, ['Authors', 'Author', '作者'])
                ),
                venue: getPropertyText(
                    findProperty(page, [
                        'Journal',
                        'Venue',
                        'Conference',
                        'Publication',
                        '期刊',
                        '会议',
                        '发表',
                    ])
                ),
                year,
                type: getPropertyText(
                    findProperty(page, [
                        'Type',
                        'Publication Type',
                        '类型',
                    ])
                ),
                link: getPropertyText(
                    findProperty(page, [
                        'Link',
                        'DOI',
                        'URL',
                        'Paper URL',
                        '论文链接',
                        '原文链接',
                        '链接',
                    ])
                ),
                github: getPropertyText(
                    findProperty(page, ['GitHub', 'Github', 'Code', '代码'])
                ),
                coverImage: getPageImage(
                    page,
                    [
                        'Cover',
                        'Photo',
                        'Image',
                        'Thumbnail',
                        '封面',
                        '图片',
                    ],
                    640
                ),
                abstract: getPropertyText(
                    findProperty(page, [
                        'Abstract',
                        'Summary',
                        '摘要',
                        '简介',
                    ])
                ),
                featured: getCheckbox(page, [
                    'Featured',
                    'Selected',
                    'Highlight',
                    '精选',
                    '代表性成果',
                    '精选论文',
                ]),
                order: getOrder(page),
            } as PublicationItem;
        })
        .filter((item) => item.title.trim() !== '');

    return items.sort((a, b) => {
        const yearDiff = Number(b.year) - Number(a.year);
        if (Number.isFinite(yearDiff) && yearDiff !== 0) return yearDiff;
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
    });
}

export function getPublications(): Promise<PublicationItem[]> {
    return PUBLICATIONS_CACHE('all', fetchPublications);
}

// 导师页「Selected latest research」：论文表里勾选 Featured 的条目
export async function getFeaturedPublications(): Promise<PublicationItem[]> {
    const all = await getPublications();
    return all.filter((item) => item.featured);
}

import { findProperty, getDataSourceId, createKeyedCache, CONTENT_CACHE_TTL } from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getPageSlug,
    getOrder,
} from './notion-collection';

export interface DirectionItem {
    id: string;
    name: string;
    description: string;
    image: string;
    link: string;
    order: number;
}

const DIRECTIONS_CACHE = createKeyedCache<DirectionItem[]>(CONTENT_CACHE_TTL);

async function fetchDirections(): Promise<DirectionItem[]> {
    const dataSourceId = await getDataSourceId('directions');
    if (!dataSourceId) return [];

    const pages = await getPublishedPages(dataSourceId);

    const items = pages
        .map((page) => {
            const name = getPropertyText(
                findProperty(page, [
                    'Name',
                    'Title',
                    'Direction',
                    'Research Direction',
                    '研究方向',
                    '名称',
                    '标题',
                ])
            );

            return {
                id: getPageSlug(page, name),
                name,
                description: getPropertyText(
                    findProperty(page, [
                        'Description',
                        'Summary',
                        'Intro',
                        '描述',
                        '简介',
                        '说明',
                    ])
                ),
                image: getPageImage(
                    page,
                    ['Image', 'Photo', 'Cover', '图片', '配图', '封面'],
                    1000
                ),
                link:
                    getPropertyText(
                        findProperty(page, ['Link', 'URL', '链接'])
                    ) || '',
                order: getOrder(page),
            } as DirectionItem;
        })
        .filter((item) => item.name.trim() !== '');

    return items.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
    });
}

export function getResearchDirections(): Promise<DirectionItem[]> {
    return DIRECTIONS_CACHE('all', fetchDirections);
}

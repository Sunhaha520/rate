import { findProperty, getDataSourceId, createKeyedCache, CONTENT_CACHE_TTL, getPageMarkdown, markdownToHtml } from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getOrder,
} from './notion-collection';

// Join Us 页面数据：招聘正文来自 Notion 页面正文，
// 欢迎语 / 地址 / 联系方式 / 地图来自同一行的属性。
export interface JoinUsInfo {
    id: string;
    title: string;
    welcome: string;
    address: string;
    contactText: string;
    email: string;
    mapImage: string;
    mapLink: string;
    contentHtml: string;
}

const JOINUS_CACHE = createKeyedCache<JoinUsInfo | null>(CONTENT_CACHE_TTL);

async function fetchJoinUs(): Promise<JoinUsInfo | null> {
    const dataSourceId = await getDataSourceId('joinus');
    if (!dataSourceId) return null;

    const pages = await getPublishedPages(dataSourceId);
    if (pages.length === 0) return null;

    // 多行时按 Order 取第一条，方便保留草稿
    const page = [...pages].sort((a, b) => getOrder(a) - getOrder(b))[0];

    const title =
        getPropertyText(
            findProperty(page, ['Title', 'Name', '标题', '名称'])
        ) || 'Join Us';

    const contentHtml = await markdownToHtml(await getPageMarkdown(page.id));

    return {
        id: page.id,
        title,
        welcome: getPropertyText(
            findProperty(page, [
                'Welcome',
                'Subtitle',
                'Intro',
                '欢迎语',
                '简介',
                '说明',
            ])
        ),
        address: getPropertyText(
            findProperty(page, ['Address', 'Location', '地址', '地址信息'])
        ),
        contactText: getPropertyText(
            findProperty(page, [
                'Contact Text',
                'Contact Note',
                'Contact',
                '联系说明',
                '联系',
            ])
        ),
        email: getPropertyText(
            findProperty(page, [
                'Contact Email',
                'Email',
                '邮箱',
                '联系邮箱',
            ])
        ),
        mapImage: getPageImage(
            page,
            [
                'Map Image',
                'Map',
                'Location Image',
                '地图',
                '位置图',
                '位置地图',
            ],
            900
        ),
        mapLink: getPropertyText(
            findProperty(page, [
                'Map Link',
                'Map URL',
                'Location Link',
                '地图链接',
                '位置链接',
                '地图',
            ])
        ),
        contentHtml,
    };
}

export function getJoinUs(): Promise<JoinUsInfo | null> {
    return JOINUS_CACHE('info', fetchJoinUs);
}

import {
    notionImageProxyUrl,
    findProperty,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
    isNotionHostedImage,
} from './notion';
import {
    getPublishedPages,
    getPropertyText,
    getPageImage,
    getPageSlug,
    getOrder,
} from './notion-collection';
import type { PageObjectResponse } from '@notionhq/client';

export interface DemoItem {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    coverImage: string;
    headImage: string;
    isVideo: boolean;
    tag: string;
    link: string;
    order: number;
}

const DEMO_CACHE = createKeyedCache<DemoItem[]>(CONTENT_CACHE_TTL);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i;

// 媒体列可能是 URL，也可能是上传的文件；上传文件统一走实时代理
function getMediaUrl(
    page: PageObjectResponse,
    candidates: string[]
): string {
    const proxyUrl = notionImageProxyUrl(
        page.id,
        page.last_edited_time,
        0
    );
    const prop = findProperty(page, candidates);
    if (!prop) return '';

    if (prop.type === 'url') return prop.url ?? '';

    if (prop.type === 'files' && prop.files.length > 0) {
        const file = prop.files[0];
        if (file.type === 'external') {
            return isNotionHostedImage(file.external.url)
                ? proxyUrl
                : file.external.url;
        }
        if (file.type === 'file') return proxyUrl;
    }

    return '';
}

function normalizeTag(value: string, isVideo: boolean): string {
    if (/demo|video|演示|视频/i.test(value)) return 'Demo videos';
    if (/resource|dataset|code|资源|数据集|代码/i.test(value)) {
        return 'Resources';
    }
    return value.trim() || (isVideo ? 'Demo videos' : 'Resources');
}

async function fetchDemoResources(): Promise<DemoItem[]> {
    const dataSourceId = await getDataSourceId('demo');
    if (!dataSourceId) return [];

    const pages = await getPublishedPages(dataSourceId);

    const items = pages
        .map((page) => {
            const title = getPropertyText(
                findProperty(page, [
                    'Title',
                    'Name',
                    'Demo',
                    '名称',
                    '标题',
                ])
            );
            const description = getPropertyText(
                findProperty(page, [
                    'Description',
                    'Summary',
                    'Short Description',
                    '简介',
                    '摘要',
                    '描述',
                ])
            );
            const fullDescription = getPropertyText(
                findProperty(page, [
                    'Full Description',
                    'Details',
                    'Content',
                    '正文',
                    '详细介绍',
                    '说明',
                ])
            );

            const coverImage = getPageImage(
                page,
                [
                    'Cover',
                    'Thumbnail',
                    'Photo',
                    'Image',
                    '封面',
                    '缩略图',
                    '图片',
                ],
                900
            );
            const videoUrl = getMediaUrl(page, [
                'Video',
                'Video URL',
                'Video File',
                '视频',
                '演示视频',
            ]);
            const headImage =
                getMediaUrl(page, [
                    'Head Image',
                    'Media',
                    '主图',
                    '详情图',
                ]) || coverImage;

            const typeText = getPropertyText(
                findProperty(page, ['Type', 'Media Type', 'Media', '类型'])
            );
            const isVideo =
                Boolean(videoUrl) ||
                /video|视频/i.test(typeText) ||
                VIDEO_EXT_RE.test(headImage) ||
                VIDEO_EXT_RE.test(videoUrl);

            return {
                id: getPageSlug(page, title),
                title,
                description: description || fullDescription,
                fullDescription: fullDescription || description,
                coverImage: coverImage || headImage,
                headImage: videoUrl || headImage || coverImage,
                isVideo,
                tag: normalizeTag(
                    getPropertyText(
                        findProperty(page, [
                            'Tag',
                            'Category',
                            'Type',
                            '标签',
                            '类别',
                            '分类',
                            '类型',
                        ])
                    ),
                    isVideo
                ),
                link: getPropertyText(
                    findProperty(page, [
                        'Link',
                        'URL',
                        'External Link',
                        '链接',
                    ])
                ),
                order: getOrder(page),
            } as DemoItem;
        })
        .filter((item) => item.title.trim() !== '');

    const tagOrder = (tag: string) =>
        tag === 'Demo videos' ? 0 : tag === 'Resources' ? 1 : 2;

    return items.sort((a, b) => {
        if (tagOrder(a.tag) !== tagOrder(b.tag)) {
            return tagOrder(a.tag) - tagOrder(b.tag);
        }
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
    });
}

export function getDemoResources(): Promise<DemoItem[]> {
    return DEMO_CACHE('all', fetchDemoResources);
}

import type {
    PageObjectResponse,
    QueryDataSourceResponse,
} from '@notionhq/client';
import {
    notionImageProxyUrl,
    notion,
    findProperty,
    isNotionHostedImage,
    getDataSourceId,
    createKeyedCache,
    CONTENT_CACHE_TTL,
    normalizeSlug,
    withRetry,
} from './notion';

// 设备卡片数据（/equipment 使用）
export interface EquipmentItem {
    id: string;
    name: string;
    category: string;
    image: string;
    features: string[];
    description?: string;
    brand?: string;
    model?: string;
    location?: string;
    status?: string;
    quantity?: string;
    link?: string;
    order: number;
}

type Property = PageObjectResponse['properties'][string];

function isFullPage(
    page: QueryDataSourceResponse['results'][number]
): page is PageObjectResponse {
    return page.object === 'page' && 'properties' in page;
}

// 统一读取各种属性类型的文本值
function getText(property: Property | undefined): string {
    if (!property) return '';
    switch (property.type) {
        case 'title':
            return property.title.map((t) => t.plain_text).join('');
        case 'rich_text':
            return property.rich_text.map((t) => t.plain_text).join('');
        case 'select':
            return property.select?.name ?? '';
        case 'status':
            return property.status?.name ?? '';
        case 'multi_select':
            return property.multi_select.map((o) => o.name).join(', ');
        case 'url':
            return property.url ?? '';
        case 'number':
            return property.number === null ? '' : String(property.number);
        case 'formula':
            return property.formula.type === 'string'
                ? property.formula.string ?? ''
                : '';
        default:
            return '';
    }
}

// 特性列表：多选直接取；文本按换行 / 分号 / 竖线拆分，并去掉行首的 • - *
function getFeatures(property: Property | undefined): string[] {
    if (!property) return [];

    if (property.type === 'multi_select') {
        return property.multi_select.map((o) => o.name).filter(Boolean);
    }

    return getText(property)
        .split(/[\n;；|]+/)
        .map((line) => line.replace(/^\s*[•·\-*]\s*/, '').trim())
        .filter(Boolean);
}

// 设备图片：Notion 托管的文件走实时代理，外链直接使用
function getImage(page: PageObjectResponse): string {
    const proxyUrl = notionImageProxyUrl(
        page.id,
        page.last_edited_time,
        900
    );
    const photoProp = findProperty(page, [
        'Photo',
        'Image',
        'Picture',
        'Picture URL',
        '图片',
        '照片',
        '设备图片',
    ]);

    if (photoProp && photoProp.type === 'files' && photoProp.files.length > 0) {
        const file = photoProp.files[0];
        if (file.type === 'external') {
            return isNotionHostedImage(file.external.url)
                ? proxyUrl
                : file.external.url;
        }
        if (file.type === 'file') return proxyUrl;
    }

    if (page.cover) {
        if (page.cover.type === 'external') {
            return isNotionHostedImage(page.cover.external.url)
                ? proxyUrl
                : page.cover.external.url;
        }
        if (page.cover.type === 'file') return proxyUrl;
    }

    return '';
}

function getSlug(page: PageObjectResponse, name: string): string {
    const slug = normalizeSlug(
        getText(findProperty(page, ['Slug', 'slug', '链接']))
    );
    return slug || normalizeSlug(name) || page.id.replace(/-/g, '');
}

async function queryAllPages(dataSourceId: string): Promise<PageObjectResponse[]> {
    const pages: PageObjectResponse[] = [];
    let cursor: string | undefined;

    do {
        const response = await withRetry(() =>
            notion.dataSources.query({
                data_source_id: dataSourceId,
                start_cursor: cursor,
            })
        );
        pages.push(...response.results.filter(isFullPage));
        cursor = response.has_more
            ? response.next_cursor ?? undefined
            : undefined;
    } while (cursor);

    return pages;
}

const EQUIPMENT_CACHE = createKeyedCache<EquipmentItem[]>(CONTENT_CACHE_TTL);

async function fetchEquipment(): Promise<EquipmentItem[]> {
    const dataSourceId = await getDataSourceId('equipment');
    if (!dataSourceId) return [];

    const pages = await queryAllPages(dataSourceId);

    const items = pages
        .filter((page) => {
            const publishedProp = findProperty(page, [
                'Published',
                'published',
                '发布',
                '已发布',
            ]);
            if (!publishedProp) return true;
            return publishedProp.type === 'checkbox'
                ? publishedProp.checkbox
                : true;
        })
        .map((page) => {
            const name = getText(
                findProperty(page, [
                    'Name',
                    'Title',
                    'Equipment',
                    'Device',
                    '设备名称',
                    '名称',
                    '标题',
                ])
            );
            const category =
                getText(
                    findProperty(page, [
                        'Category',
                        'Type',
                        'Group',
                        '类别',
                        '分类',
                        '类型',
                    ])
                ).trim() || 'Other equipment';

            return {
                id: getSlug(page, name),
                name,
                category,
                image: getImage(page),
                features: getFeatures(
                    findProperty(page, [
                        'Features',
                        'Specs',
                        'Specifications',
                        'Highlights',
                        '特点',
                        '参数',
                        '规格',
                        '配置',
                    ])
                ),
                description: getText(
                    findProperty(page, [
                        'Description',
                        'Intro',
                        'Notes',
                        '描述',
                        '简介',
                        '备注',
                    ])
                ),
                brand: getText(
                    findProperty(page, ['Brand', 'Manufacturer', '品牌', '厂商'])
                ),
                model: getText(
                    findProperty(page, ['Model', '型号', '规格型号'])
                ),
                location: getText(
                    findProperty(page, ['Location', 'Room', '位置', '存放地点'])
                ),
                status: getText(
                    findProperty(page, ['Status', 'State', '状态'])
                ),
                quantity: getText(
                    findProperty(page, ['Quantity', 'Qty', 'Count', '数量'])
                ),
                link: getText(
                    findProperty(page, [
                        'Link',
                        'URL',
                        'Website',
                        '链接',
                        '官网',
                    ])
                ),
                order:
                    findProperty(page, ['Order', 'Sort', '排序', '顺序'])
                        ?.type === 'number'
                        ? Number(
                              getText(
                                  findProperty(page, [
                                      'Order',
                                      'Sort',
                                      '排序',
                                      '顺序',
                                  ])
                              )
                          ) || 0
                        : 0,
            } as EquipmentItem;
        })
        .filter((item) => item.name.trim() !== '');

    return items.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
    });
}

// 设备列表：Notion 设备表存在时用 Notion，否则返回空数组（页面回退到本地数据）
export function getEquipment(): Promise<EquipmentItem[]> {
    return EQUIPMENT_CACHE('all', fetchEquipment);
}

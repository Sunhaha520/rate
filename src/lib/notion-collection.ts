import type {
    PageObjectResponse,
    QueryDataSourceResponse,
} from '@notionhq/client';
import { notion, findProperty, isNotionHostedImage, normalizeSlug, notionImageProxyUrl, withRetry } from './notion';

export type NotionProperty = PageObjectResponse['properties'][string];

export function isFullPage(
    page: QueryDataSourceResponse['results'][number]
): page is PageObjectResponse {
    return page.object === 'page' && 'properties' in page;
}

// 读取属性为纯文本
export function getPropertyText(property: NotionProperty | undefined): string {
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

// 读取为字符串数组：多选直接取，文本按换行/分号/竖线拆分
export function getPropertyList(property: NotionProperty | undefined): string[] {
    if (!property) return [];
    if (property.type === 'multi_select') {
        return property.multi_select.map((o) => o.name).filter(Boolean);
    }
    return getPropertyText(property)
        .split(/[\n;；|]+/)
        .map((line) => line.replace(/^\s*[•·\-*]\s*/, '').trim())
        .filter(Boolean);
}

// Notion 托管的文件走实时代理，外链直接使用
export function getPageImage(
    page: PageObjectResponse,
    candidates: string[],
    width = 1200
): string {
    const proxyUrl = notionImageProxyUrl(
        page.id,
        page.last_edited_time,
        width
    );
    const prop = findProperty(page, candidates);

    if (prop && prop.type === 'files' && prop.files.length > 0) {
        const file = prop.files[0];
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

export function getPageSlug(page: PageObjectResponse, name: string): string {
    const slug = normalizeSlug(
        getPropertyText(findProperty(page, ['Slug', 'slug', '链接']))
    );
    return slug || normalizeSlug(name) || page.id.replace(/-/g, '');
}

export function getOrder(page: PageObjectResponse): number {
    const prop = findProperty(page, ['Order', 'Sort', '排序', '顺序']);
    return prop?.type === 'number' ? prop.number ?? 0 : 0;
}

export function getCheckbox(
    page: PageObjectResponse,
    candidates: string[]
): boolean {
    const prop = findProperty(page, candidates);
    return prop?.type === 'checkbox' ? prop.checkbox : false;
}

// 分页拉取数据源里的全部记录，并过滤未发布项
export async function getPublishedPages(
    dataSourceId: string
): Promise<PageObjectResponse[]> {
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

    return pages.filter((page) => {
        const prop = findProperty(page, [
            'Published',
            'published',
            '发布',
            '已发布',
        ]);
        if (!prop) return true;
        return prop.type === 'checkbox' ? prop.checkbox : true;
    });
}

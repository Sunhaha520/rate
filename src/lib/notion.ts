import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import type {
    PageObjectResponse,
    QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

// 初始化 Notion 官方客户端，token 来自环境变量
export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

// notion-to-md 实例：将 Notion 页面正文块转换为 Markdown 字符串
export const n2m = new NotionToMarkdown({ notionClient: notion });

// Notion 数据库 ID，来自环境变量
export const databaseId = process.env.NOTION_DATABASE_ID as string;

// 判断返回对象是否为完整的 Page 对象（含 properties）
function isFullPage(
    page: QueryDatabaseResponse['results'][number]
): page is PageObjectResponse {
    return 'properties' in page;
}

// 在页面属性里按「多个候选列名」查找属性，兼容不同命名（区分/不区分大小写）
function findProperty(
    page: PageObjectResponse,
    candidates: string[]
): PageObjectResponse['properties'][string] | undefined {
    const props = page.properties;
    // 先精确匹配
    for (const name of candidates) {
        if (props[name]) return props[name];
    }
    // 再不区分大小写匹配
    const lowerMap: Record<string, string> = {};
    for (const key of Object.keys(props)) {
        lowerMap[key.toLowerCase()] = key;
    }
    for (const name of candidates) {
        const hit = lowerMap[name.toLowerCase()];
        if (hit) return props[hit];
    }
    return undefined;
}

// 安全读取纯文本类型属性（title / rich_text）
function getPlainText(
    property: PageObjectResponse['properties'][string] | undefined
): string {
    if (!property) return '';
    if (property.type === 'title') {
        return property.title.map((t) => t.plain_text).join('');
    }
    if (property.type === 'rich_text') {
        return property.rich_text.map((t) => t.plain_text).join('');
    }
    return '';
}

// 读取日期类型属性
function getDate(
    property: PageObjectResponse['properties'][string] | undefined
): string {
    if (property && property.type === 'date' && property.date) {
        return property.date.start;
    }
    return '';
}

// 读取复选框属性
function getCheckbox(
    property: PageObjectResponse['properties'][string] | undefined
): boolean {
    if (property && property.type === 'checkbox') {
        return property.checkbox;
    }
    return false;
}

// 判断某个图片地址是否为 Notion 托管的 S3 临时签名地址（会过期，需要代理）
function isNotionHostedImage(url: string): boolean {
    if (!url) return false;
    return (
        url.includes('amazonaws.com') ||
        url.includes('notion.so') ||
        url.includes('notion-static.com')
    );
}

// 读取封面图并返回稳定地址。
// Notion 上传的图片（file 类型）是 S3 临时签名 URL（约 1 小时过期），
// 若把签名 URL 固化到静态页面或代理参数里，时间一长必然失效。
// 因此这里对 Notion 托管图片统一返回 /api/notion-image?pageId=<页面ID>，
// 由代理在“收到请求那一刻”用 Notion API 实时取最新签名图片，永不过期。
// 用户自填的外链图片（external 且非 Notion 域名）稳定，直接返回原地址。
function getPicture(page: PageObjectResponse): string {
    const pictureProp = findProperty(page, ['Picture', 'Cover', '封面', '图片']);
    if (pictureProp && pictureProp.type === 'files' && pictureProp.files.length > 0) {
        const file = pictureProp.files[0];
        if (file.type === 'external') {
            return isNotionHostedImage(file.external.url)
                ? `/api/notion-image?pageId=${page.id}`
                : file.external.url;
        }
        if (file.type === 'file') {
            return `/api/notion-image?pageId=${page.id}`;
        }
    }
    // 回退到页面封面
    if (page.cover) {
        if (page.cover.type === 'external') {
            return isNotionHostedImage(page.cover.external.url)
                ? `/api/notion-image?pageId=${page.id}`
                : page.cover.external.url;
        }
        if (page.cover.type === 'file') {
            return `/api/notion-image?pageId=${page.id}`;
        }
    }
    return '';
}

// 读取 Slug（用于 URL 的 id）；若无 Slug 属性则回退用 Notion 页面 id
function getSlug(page: PageObjectResponse): string {
    const slugProp = findProperty(page, ['Slug', 'slug', '链接']);
    const slug = getPlainText(slugProp);
    return slug || page.id.replace(/-/g, '');
}

// 单条 Notion 新闻的元数据结构
export interface NotionPostMeta {
    id: string; // slug 或页面 id，用作 URL 参数
    pageId: string; // Notion 原始页面 id，用于拉取正文
    title: string;
    date: string;
    summary: string;
    picture: string;
}

// 查询数据库中所有已发布的新闻（在代码里过滤与排序，避免依赖特定列名）
export async function getPublishedPosts(): Promise<NotionPostMeta[]> {
    if (!databaseId) {
        console.error('缺少环境变量 NOTION_DATABASE_ID');
        return [];
    }

    // 不在 API 层做 filter/sort（列名不匹配会直接报错），改为拉取全部后在代码里处理，更健壮
    const response = await notion.databases.query({
        database_id: databaseId,
    });

    const posts = response.results
        .filter(isFullPage)
        .map((page) => {
            const publishedProp = findProperty(page, [
                'Published',
                'published',
                '发布',
                '已发布',
            ]);
            return {
                id: getSlug(page),
                pageId: page.id,
                title: getPlainText(
                    findProperty(page, ['Title', 'Name', 'title', '标题', '名称'])
                ),
                date: getDate(findProperty(page, ['Date', 'date', '日期', '发布日期'])),
                summary: getPlainText(
                    findProperty(page, ['Summary', 'summary', '摘要', '简介'])
                ),
                picture: getPicture(page),
                // 若不存在 Published 列，则默认视为已发布（true）
                published: publishedProp ? getCheckbox(publishedProp) : true,
            };
        })
        // 只保留已发布的
        .filter((p) => p.published)
        // 按日期降序排序（无日期的排在最后）
        .sort((a, b) => {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return a.date < b.date ? 1 : -1;
        });

    // 去掉内部使用的 published 字段，符合 NotionPostMeta 结构
    return posts.map((p) => ({
        id: p.id,
        pageId: p.pageId,
        title: p.title,
        date: p.date,
        summary: p.summary,
        picture: p.picture,
    }));
}

// 根据 slug/id 查找对应的页面元数据
export async function getPostMetaById(
    id: string
): Promise<NotionPostMeta | null> {
    const posts = await getPublishedPosts();
    return posts.find((p) => p.id === id) ?? null;
}

// 将指定页面的正文块转换为 Markdown 字符串
export async function getPageMarkdown(pageId: string): Promise<string> {
    const mdBlocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdBlocks);
    // notion-to-md 返回 { parent: string } 结构
    return mdString.parent ?? '';
}

import { Client, LogLevel } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { remark } from 'remark';
import gfm from 'remark-gfm';
import html from 'remark-html';
import sanitizeHtml from 'sanitize-html';
import type {
    PageObjectResponse,
    QueryDataSourceResponse,
} from '@notionhq/client';

// 初始化 Notion 官方客户端，token 来自环境变量
// 只输出 error 级别日志，避免解析数据源时的探测失败产生大量 warning
export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
    logLevel: LogLevel.ERROR,
});

// notion-to-md 实例：将 Notion 页面正文块转换为 Markdown 字符串
export const n2m = new NotionToMarkdown({ notionClient: notion });

// Notion 数据库 ID，来自环境变量
export const databaseId = process.env.NOTION_DATABASE_ID as string;

// 开发模式下每次导航都会重新执行 getStaticProps，若每次都打 Notion API，
// 点击菜单会明显停顿。这里做一层进程内短期缓存（与页面 60s 增量再生对齐），
// 重复访问直接命中内存。
export const CONTENT_CACHE_TTL =
    process.env.NODE_ENV === 'development' ? 20_000 : 60_000;

// 带 TTL 的 key 级缓存，同时合并同一 key 的并发请求。
// 开发模式：过期后 stale-while-revalidate，先返回旧值、后台刷新，
// 点击菜单/文章不会因等待 Notion 接口而卡住。
// 生产模式：过期后阻塞刷新——刷新发生在 ISR 后台再生里，用户拿到的仍是旧页面，
// 这样 60 秒同步窗口不会被额外拉长。
const STALE_WHILE_REVALIDATE = process.env.NODE_ENV === 'development';

export function createKeyedCache<T>(
    ttlMs: number,
    staleWhileRevalidate: boolean = STALE_WHILE_REVALIDATE
) {
    const values = new Map<string, { at: number; value: T }>();
    const pending = new Map<string, Promise<T>>();

    const refresh = (key: string, load: () => Promise<T>): Promise<T> => {
        const inFlight = pending.get(key);
        if (inFlight) return inFlight;

        const promise = load()
            .then((value) => {
                values.set(key, { at: Date.now(), value });
                return value;
            })
            .finally(() => pending.delete(key));

        pending.set(key, promise);
        return promise;
    };

    return (key: string, load: () => Promise<T>): Promise<T> => {
        const hit = values.get(key);
        if (hit) {
            if (Date.now() - hit.at >= ttlMs) {
                if (staleWhileRevalidate) {
                    void refresh(key, load).catch(() => undefined);
                } else {
                    return refresh(key, load);
                }
            }
            return Promise.resolve(hit.value);
        }

        return refresh(key, load);
    };
}

// 判断返回对象是否为完整的 Page 对象（含 properties）
function isFullPage(
    page: QueryDataSourceResponse['results'][number]
): page is PageObjectResponse {
    return page.object === 'page' && 'properties' in page;
}

// 新版 Notion 一个数据库可以包含多个数据源（data source）。
// 这里按内容类型解析真正要查询的 data source ID：
// - 新闻、成员、设备共用同一个 NOTION_DATABASE_ID
// - 一个数据库里有多张表时，按列名（必要时按表名）自动区分
export type ContentKind =
    | 'news'
    | 'members'
    | 'equipment'
    | 'publications'
    | 'projects'
    | 'demo'
    | 'joinus';

const MEMBER_PROP_RE = /role|photo|avatar|头像|角色|研究方向|年级|year/i;
const NEWS_PROP_RE = /date|summary|picture|日期|摘要|封面|title/i;
const EQUIPMENT_PROP_RE =
    /equipment|device|model|brand|feature|spec(?:ification)?s?|serial|quantity|location|设备|仪器|型号|品牌|规格|参数|类别|分类|数量|位置/i;
const PUBLICATION_PROP_RE =
    /authors?|journal|venue|conference|doi|publication|论文|作者|期刊|会议|出版/i;
const PROJECT_PROP_RE =
    /project|funding|funder|grant|资助|项目|经费|立项/i;
const DEMO_PROP_RE = /demo|resource|dataset|video|演示|资源|视频|数据集/i;
const JOINUS_PROP_RE =
    /join|recruit|address|contact|map|招聘|加入|地址|联系|地图/i;

const dataSourceCache = new Map<ContentKind, Promise<string>>();

export function getDataSourceId(kind: ContentKind): Promise<string> {
    const cached = dataSourceCache.get(kind);
    if (cached) return cached;

    const promise = resolveDataSourceId(kind)
        .then((id) => {
            // 没找到对应表时不要永久缓存空结果：
            // 用户可能在站点运行期间新建 Members / Equipment 表
            if (!id) dataSourceCache.delete(kind);
            return id;
        })
        .catch((err) => {
            // 失败时移除缓存，避免一次临时错误导致整个进程都无法重试
            dataSourceCache.delete(kind);
            throw err;
        });
    dataSourceCache.set(kind, promise);
    return promise;
}

async function resolveDataSourceId(kind: ContentKind): Promise<string> {
    // 新闻与成员共用同一个 NOTION_DATABASE_ID（同一个数据库里的两张表）
    const configured = databaseId;

    if (!configured) return '';

    // 情况一：环境变量直接填的就是 data source ID
    try {
        await notion.dataSources.retrieve({ data_source_id: configured });
        return configured;
    } catch {
        // 不是 data source，继续按 database ID 处理
    }

    let database;
    try {
        database = await notion.databases.retrieve({
            database_id: configured,
        });
    } catch (err) {
        console.error(`无法读取 Notion 数据库 ${configured}:`, err);
        return '';
    }

    if (!('data_sources' in database)) return '';
    const sources = database.data_sources;
    if (sources.length === 0) return '';

    // 单数据源：新闻可直接使用；成员表还需要检查列名，避免把新闻表当成员表
    if (sources.length === 1 && kind === 'news') {
        return sources[0].id;
    }

    const details = await Promise.all(
        sources.map(async (source) => {
            try {
                const detail = await notion.dataSources.retrieve({
                    data_source_id: source.id,
                });
                const props =
                    'properties' in detail
                        ? Object.keys(detail.properties).join(' ')
                        : '';
                return { id: source.id, name: source.name, props };
            } catch {
                return { id: source.id, name: source.name, props: '' };
            }
        })
    );

    // 成员表要用“强特征”判断：Role / 研究方向 / 表名 Members。
    // 不能只看 Photo，因为设备、项目、论文表也可能有 Photo 列。
    const isMember = (d: { name: string; props: string }) =>
        /\brole\b|角色|研究方向|research\s*topic|年级/i.test(d.props) ||
        /members?\b/i.test(d.name);

    // 各类型互相排斥，避免一张表同时命中多个关键词
    const matchKind = (
        d: { props: string },
        own: RegExp,
        others: RegExp[]
    ) => own.test(d.props) && others.every((re) => !re.test(d.props));

    const memberHit =
        details.find((d) => isMember(d) && /\brole\b|角色|研究方向|research\s*topic/i.test(d.props)) ??
        details.find((d) => /members?\b/i.test(d.name));
    if (kind === 'members') {
        // 只有一个数据源时直接使用，避免列名不规范导致读不到成员
        return memberHit?.id ?? (sources.length === 1 ? sources[0].id : '');
    }

    const byName = (d: { name: string }, re: RegExp) =>
        re.test(d.name) && !isMember(d as { name: string; props: string });

    if (kind === 'equipment') {
        const equipmentHit =
            details.find(
                (d) =>
                    !isMember(d) &&
                    matchKind(d, EQUIPMENT_PROP_RE, [
                        PUBLICATION_PROP_RE,
                        PROJECT_PROP_RE,
                        DEMO_PROP_RE,
                        JOINUS_PROP_RE,
                    ])
            ) ??
            details.find((d) => byName(d, /equipment|devices?|设备|仪器/i));
        return equipmentHit?.id ?? '';
    }

    if (kind === 'publications') {
        const publicationHit =
            details.find(
                (d) =>
                    !isMember(d) &&
                    matchKind(d, PUBLICATION_PROP_RE, [
                        EQUIPMENT_PROP_RE,
                        PROJECT_PROP_RE,
                        DEMO_PROP_RE,
                        JOINUS_PROP_RE,
                    ])
            ) ??
            details.find((d) =>
                byName(d, /publications?|papers?|论文|文献/i)
            );
        return publicationHit?.id ?? '';
    }

    if (kind === 'projects') {
        const projectHit =
            details.find(
                (d) =>
                    !isMember(d) &&
                    matchKind(d, PROJECT_PROP_RE, [
                        EQUIPMENT_PROP_RE,
                        PUBLICATION_PROP_RE,
                        DEMO_PROP_RE,
                        JOINUS_PROP_RE,
                    ])
            ) ??
            details.find((d) => byName(d, /projects?|项目/i));
        return projectHit?.id ?? '';
    }

    if (kind === 'demo') {
        const demoHit =
            details.find(
                (d) =>
                    !isMember(d) &&
                    matchKind(d, DEMO_PROP_RE, [
                        EQUIPMENT_PROP_RE,
                        PUBLICATION_PROP_RE,
                        PROJECT_PROP_RE,
                        JOINUS_PROP_RE,
                    ])
            ) ??
            details.find((d) => byName(d, /demo|resources?|演示|资源/i));
        return demoHit?.id ?? '';
    }

    if (kind === 'joinus') {
        const joinHit =
            details.find(
                (d) =>
                    !isMember(d) &&
                    matchKind(d, JOINUS_PROP_RE, [
                        EQUIPMENT_PROP_RE,
                        PUBLICATION_PROP_RE,
                        PROJECT_PROP_RE,
                        DEMO_PROP_RE,
                    ])
            ) ??
            details.find((d) => byName(d, /join|recruit|招聘|加入/i));
        return joinHit?.id ?? '';
    }

    const isOtherTable = (props: string) =>
        MEMBER_PROP_RE.test(props) ||
        EQUIPMENT_PROP_RE.test(props) ||
        PUBLICATION_PROP_RE.test(props) ||
        PROJECT_PROP_RE.test(props) ||
        DEMO_PROP_RE.test(props) ||
        JOINUS_PROP_RE.test(props);

    const newsHit =
        details.find(
            (d) => NEWS_PROP_RE.test(d.props) && !isOtherTable(d.props)
        ) ??
        details.find((d) => d.id !== memberHit?.id && !isOtherTable(d.props)) ??
        details[0];
    return newsHit.id;
}

// 在页面属性里按「多个候选列名」查找属性，兼容不同命名（区分/不区分大小写）
export function findProperty(
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
export function isNotionHostedImage(url: string): boolean {
    if (!url) return false;
    return (
        url.includes('amazonaws.com') ||
        url.includes('notion.so') ||
        url.includes('notion-static.com')
    );
}

// 生成 Notion 图片代理地址。
// v = 页面最后编辑时间（毫秒），图片更新后 URL 会变化，代理端因此可以设置一年 immutable 缓存；
// w = 目标宽度，代理会用 sharp 转成 WebP 缩略图，避免卡片/头像下载原图。
export function notionImageProxyUrl(
    pageId: string,
    lastEdited: string,
    width = 1200
): string {
    const time = Date.parse(lastEdited);
    const version = Number.isFinite(time) ? time : 0;
    return `/api/notion-image?pageId=${pageId}&w=${width}&v=${version}`;
}

export function notionBlockImageProxyUrl(
    blockId: string,
    lastEdited: string,
    width = 1600
): string {
    const time = Date.parse(lastEdited);
    const version = Number.isFinite(time) ? time : 0;
    return `/api/notion-image?blockId=${blockId}&w=${width}&v=${version}`;
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
                ? notionImageProxyUrl(page.id, page.last_edited_time, 900)
                : file.external.url;
        }
        if (file.type === 'file') {
            return notionImageProxyUrl(page.id, page.last_edited_time, 900);
        }
    }
    // 回退到页面封面
    if (page.cover) {
        if (page.cover.type === 'external') {
            return isNotionHostedImage(page.cover.external.url)
                ? notionImageProxyUrl(page.id, page.last_edited_time, 900)
                : page.cover.external.url;
        }
        if (page.cover.type === 'file') {
            return notionImageProxyUrl(page.id, page.last_edited_time, 900);
        }
    }
    return '';
}

// 把 Notion 里手填的 Slug 规范化成 URL 片段：
// 允许填 "/qiaoyutong"、"HO Man Hin"，统一成 "qiaoyutong"、"ho-man-hin"。
export function normalizeSlug(value: string): string {
    return value
        .trim()
        .replace(/^\/+|\/+$/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\u4e00-\u9fa5-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// 读取 Slug（用于 URL 的 id）；若无 Slug 属性则回退用 Notion 页面 id
function getSlug(page: PageObjectResponse): string {
    const slugProp = findProperty(page, ['Slug', 'slug', '链接']);
    const slug = normalizeSlug(getPlainText(slugProp));
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
async function fetchPublishedPosts(): Promise<NotionPostMeta[]> {
    if (!databaseId) {
        console.error('缺少环境变量 NOTION_DATABASE_ID');
        return [];
    }

    // 不在 API 层做 filter/sort（列名不匹配会直接报错），改为拉取全部后在代码里处理，更健壮
    const dataSourceId = await getDataSourceId('news');
    if (!dataSourceId) {
        console.error('未找到可用的新闻数据源，请检查 NOTION_DATABASE_ID');
        return [];
    }

    const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
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

// 已发布新闻列表（带短缓存：导航到 /news、文章页时避免重复查询 Notion）
const publishedPostsCache = createKeyedCache<NotionPostMeta[]>(CONTENT_CACHE_TTL);

export function getPublishedPosts(): Promise<NotionPostMeta[]> {
    return publishedPostsCache('all', fetchPublishedPosts);
}

// 根据 slug/id 查找对应的页面元数据
export async function getPostMetaById(
    id: string
): Promise<NotionPostMeta | null> {
    const posts = await getPublishedPosts();
    return posts.find((p) => p.id === id) ?? null;
}

// 将指定页面的正文块转换为 Markdown 字符串（按 pageId 缓存）
const pageMarkdownCache = createKeyedCache<string>(CONTENT_CACHE_TTL);

export function getPageMarkdown(pageId: string): Promise<string> {
    return pageMarkdownCache(pageId, async () => {
        const mdBlocks = await n2m.pageToMarkdown(pageId);
        const mdString = n2m.toMarkdownString(mdBlocks);
        // notion-to-md 返回 { parent: string } 结构
        return mdString.parent ?? '';
    });
}

// 把单元格内容转义成 Markdown 表格的一格
function toTableCell(value: string): string {
    return value.replace(/\|/g, '\\|').replace(/\s*\r?\n\s*/g, ' ').trim();
}

// 把 Notion 属性值转成纯文本（用于内嵌数据库表格）
function propertyToPlainText(
    property: PageObjectResponse['properties'][string] | undefined
): string {
    if (!property) return '';

    switch (property.type) {
        case 'title':
            return property.title.map((t) => t.plain_text).join('');
        case 'rich_text':
            return property.rich_text.map((t) => t.plain_text).join('');
        case 'select':
            return property.select?.name ?? '';
        case 'multi_select':
            return property.multi_select.map((o) => o.name).join(', ');
        case 'status':
            return property.status?.name ?? '';
        case 'date':
            return property.date
                ? [property.date.start, property.date.end]
                      .filter(Boolean)
                      .join(' → ')
                : '';
        case 'number':
            return property.number === null ? '' : String(property.number);
        case 'checkbox':
            return property.checkbox ? '✓' : '';
        case 'url':
            return property.url ?? '';
        case 'email':
            return property.email ?? '';
        case 'phone_number':
            return property.phone_number ?? '';
        case 'people':
            return property.people
                .map((person) => ('name' in person ? person.name ?? '' : ''))
                .filter(Boolean)
                .join(', ');
        case 'files':
            return property.files.map((file) => file.name).join(', ');
        case 'formula':
            return property.formula.type === 'string'
                ? property.formula.string ?? ''
                : '';
        default:
            return '';
    }
}

// Notion 内嵌数据库（child_database）默认只输出一行标题文字。
// 这里把它查出来渲染成 Markdown 表格，让个人主页里插入的表格/数据库能正常显示。
n2m.setCustomTransformer('child_database', async (block) => {
    const { id, child_database: meta } = block as {
        id: string;
        child_database?: { title?: string };
    };
    const title = meta?.title ?? '';

    try {
        const database = await notion.databases.retrieve({ database_id: id });
        const sources = 'data_sources' in database ? database.data_sources : [];
        const tables: string[] = [];

        for (const source of sources) {
            const detail = await notion.dataSources.retrieve({
                data_source_id: source.id,
            });
            if (!('properties' in detail)) continue;

            const columns = Object.keys(detail.properties);
            if (columns.length === 0) continue;

            const rows: string[] = [];
            let cursor: string | undefined;
            do {
                const response = await notion.dataSources.query({
                    data_source_id: source.id,
                    start_cursor: cursor,
                    page_size: 100,
                });
                for (const row of response.results) {
                    if (!('properties' in row)) continue;
                    const page = row as PageObjectResponse;
                    rows.push(
                        `| ${columns
                            .map((column) =>
                                toTableCell(
                                    propertyToPlainText(page.properties[column])
                                )
                            )
                            .join(' | ')} |`
                    );
                }
                cursor = response.has_more
                    ? response.next_cursor ?? undefined
                    : undefined;
            } while (cursor);

            // 空数据库不渲染，避免页面上只剩一个无意义的标题
            if (rows.length === 0) continue;

            tables.push(
                [
                    title ? `**${title}**` : '',
                    `| ${columns.map(toTableCell).join(' | ')} |`,
                    `| ${columns.map(() => '---').join(' | ')} |`,
                    ...rows,
                ]
                    .filter(Boolean)
                    .join('\n')
            );
        }

        return tables.join('\n\n');
    } catch (err) {
        console.error('读取内嵌数据库失败:', err);
        return '';
    }
});

// ============================================================
// 正文图片：直接输出站内图片代理地址
// Notion 上传的图片是约 1 小时过期的签名 URL，之前是“先渲染签名地址、
// 再遍历整页 block 把地址替换掉”，每次渲染都要多走一遍 Notion API。
// 这里在 notion-to-md 的转换阶段就拿到 blockId，直接写成稳定代理，
// 渲染更快，也不再依赖容易失配的正则替换。
// ============================================================
n2m.setCustomTransformer('image', async (block) => {
    const image = (block as {
        id: string;
        image?: { caption?: Array<{ plain_text: string }> };
    }).image;
    if (!image) return '';

    const caption = (image.caption ?? [])
        .map((item) => item.plain_text)
        .join('')
        .trim()
        .replace(/\s+/g, ' ');

    // 图片的替代文本用 Notion 里写的图注；没有就留空，避免把文件名当说明文字
    const alt = caption.replace(/[[\]()]/g, '');
    const title = caption.replace(/"/g, '&quot;');

    return `![${alt}](${notionBlockImageProxyUrl(
        block.id,
        (block as { last_edited_time?: string }).last_edited_time ?? ''
    )}${title ? ` "${title}"` : ''})`;
});

// ============================================================
// Notion 书签 / 链接预览 -> 链接卡片
// notion-to-md 默认只输出一个 [bookmark](url) 文本链接，标题会丢失。
// 这里先输出一个占位符，等 HTML 清洗完成后再替换成带样式的链接卡片。
// ============================================================
const LINK_CARD_PATTERN = /<p>\s*@@NLINK:([0-9a-f]+)@@\s*<\/p>/gi;

function cleanRichText(
    rich?: Array<{ plain_text: string }>
): string {
    return (rich ?? [])
        .map((item) => item.plain_text)
        .join('')
        .replace(/\s+/g, ' ')
        .trim();
}

function linkCardPlaceholder(
    url: string,
    caption?: Array<{ plain_text: string }>
): string {
    const payload = JSON.stringify({ url, title: cleanRichText(caption) });
    return `@@NLINK:${Buffer.from(payload, 'utf8').toString('hex')}@@`;
}

n2m.setCustomTransformer('bookmark', async (block) => {
    const bookmark = (block as {
        bookmark?: {
            url?: string;
            caption?: Array<{ plain_text: string }>;
        };
    }).bookmark;
    if (!bookmark?.url) return '';
    return linkCardPlaceholder(bookmark.url, bookmark.caption);
});

n2m.setCustomTransformer('link_preview', async (block) => {
    const preview = (block as { link_preview?: { url?: string } })
        .link_preview;
    if (!preview?.url) return '';
    return linkCardPlaceholder(preview.url);
});

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 从 URL 推断展示信息：标题默认用域名，路径放在第二行（无法联网抓 OG，保持克制）
function describeLink(url: string): {
    title: string;
    label: string;
    href: string;
} | null {
    try {
        const parsed = new URL(url);
        if (!/^https?:$/.test(parsed.protocol)) return null;

        const host = parsed.hostname.replace(/^www\./, '');
        const path = decodeURIComponent(parsed.pathname).replace(/\/$/, '');

        return {
            title: host,
            label: `${host}${path}`,
            href: url,
        };
    } catch {
        return null;
    }
}

function renderLinkCard(encoded: string): string {
    let payload: { url?: string; title?: string };
    try {
        payload = JSON.parse(
            Buffer.from(encoded, 'hex').toString('utf8')
        ) as { url?: string; title?: string };
    } catch {
        return '';
    }

    if (!payload.url) return '';
    const info = describeLink(payload.url);
    if (!info) return '';

    const title = (payload.title?.trim() || info.title).slice(0, 180);
    const label = info.label || info.href;

    return `<a class="md-link-card" href="${escapeHtml(info.href)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(info.href)}">
<span class="md-link-card__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 5"/><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19"/></svg></span>
<span class="md-link-card__body"><span class="md-link-card__title">${escapeHtml(title)}</span><span class="md-link-card__url">${escapeHtml(label)}</span></span>
<span class="md-link-card__arrow" aria-hidden="true">↗</span>
</a>`;
}

function convertLinkCards(html: string): string {
    return html.replace(LINK_CARD_PATTERN, (_match, encoded: string) =>
        renderLinkCard(encoded)
    );
}

// ============================================================
// Notion 链接优化
// 1. Notion 页面互链（notion.so/xxx-<pageId>）能对上站内成员/新闻时，改写成站内路由
// 2. 站外链接统一新窗口打开，并带 rel="noopener noreferrer"
// 3. 站内链接打上标记，交给客户端做无刷新跳转
// ============================================================
const PAGE_ROUTE_TTL = CONTENT_CACHE_TTL;
const pageRouteIndexCache = createKeyedCache<Map<string, string>>(PAGE_ROUTE_TTL);

function normalizePageId(value: string): string {
    return value.replace(/-/g, '').toLowerCase();
}

// 建立 Notion 页面 id -> 站内路由 的索引（新闻 -> /posts/<slug>，成员 -> /members/<slug>）
async function buildPageRouteIndex(): Promise<Map<string, string>> {
    const index = new Map<string, string>();

    const collect = async (
        kind: ContentKind,
        toRoute: (page: PageObjectResponse) => string
    ) => {
        try {
            const dataSourceId = await getDataSourceId(kind);
            if (!dataSourceId) return;

            let cursor: string | undefined;
            do {
                const response = await notion.dataSources.query({
                    data_source_id: dataSourceId,
                    start_cursor: cursor,
                    page_size: 100,
                });
                for (const page of response.results.filter(isFullPage)) {
                    const route = toRoute(page);
                    if (route) index.set(normalizePageId(page.id), route);
                }
                cursor = response.has_more
                    ? response.next_cursor ?? undefined
                    : undefined;
            } while (cursor);
        } catch (err) {
            console.error(`建立 ${kind} 页面链接索引失败:`, err);
        }
    };

    await collect('news', (page) => {
        const slug = normalizeSlug(
            getPlainText(findProperty(page, ['Slug', 'slug', '链接']))
        );
        return slug ? `/posts/${slug}` : '';
    });

    await collect('members', (page) => {
        const name = getPlainText(
            findProperty(page, ['Name', 'Title', '姓名', '名称', '标题'])
        );
        const slug =
            normalizeSlug(
                getPlainText(findProperty(page, ['Slug', 'slug', '链接']))
            ) || normalizeSlug(name);
        return slug ? `/members/${slug}` : '';
    });

    return index;
}

function getPageRouteIndex(): Promise<Map<string, string>> {
    return pageRouteIndexCache('all', buildPageRouteIndex);
}

// 从 Notion 链接里取出页面 id，命中索引就换成站内路由
function rewriteNotionUrl(
    href: string,
    routes: Map<string, string>
): string {
    if (!/notion\.(so|site)\//i.test(href)) return href;

    const rawId =
        href.match(/([0-9a-f]{32})(?:[/?#]|$)/i)?.[1] ??
        href.match(/[?&]p=([0-9a-f-]{32,36})/i)?.[1];
    if (!rawId) return href;

    return routes.get(normalizePageId(rawId)) ?? href;
}

const HIDDEN_ALT_RE = /\.(jpe?g|png|gif|webp|avif|svg|bmp)$/i;

// 给标题加 id（便于分享锚点），并在悬停时显示 § 链接
function addHeadingAnchors(html: string): string {
    const seen = new Map<string, number>();

    return html.replace(
        /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/g,
        (match, level: string, attrs: string, inner: string) => {
            if (/\bid=/.test(attrs)) return match;

            const text = inner
                .replace(/<[^>]+>/g, '')
                .replace(/&[a-z#0-9]+;/gi, '')
                .trim();
            if (!text) return match;

            let slug = text
                .toLowerCase()
                .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
                .replace(/^-+|-+$/g, '')
                .slice(0, 64);
            if (!slug) slug = `section-${seen.size + 1}`;

            const count = seen.get(slug) ?? 0;
            seen.set(slug, count + 1);
            if (count > 0) slug = `${slug}-${count + 1}`;

            return `<h${level}${attrs} id="${slug}"><a class="md-anchor" href="#${slug}" aria-label="Anchor">#</a>${inner}</h${level}>`;
        }
    );
}

// 图片单独成段时包成 figure，有图注就显示图注（学术排版里的图 1 / 图注样式）
function wrapFigures(html: string): string {
    return html.replace(
        /<p>\s*(<img\b[^>]*>)\s*<\/p>/g,
        (match, img: string) => {
            const alt = img.match(/\balt="([^"]*)"/)?.[1]?.trim() ?? '';
            const caption = alt && !HIDDEN_ALT_RE.test(alt) ? alt : '';
            const captionHtml = caption
                ? `<figcaption>${caption}</figcaption>`
                : '';
            return `<figure class="md-figure">${img}${captionHtml}</figure>`;
        }
    );
}

// 宽表格在窄屏上可横向滚动，不撑破正文
function wrapTables(html: string): string {
    return html
        .replace(/<table>/g, '<div class="md-table-wrap"><table>')
        .replace(/<\/table>/g, '</table></div>');
}

// 把 Notion 正文 HTML 清洗成可安全直出的文章 HTML（服务端完成，
// 首屏即有正文，也省掉客户端再跑一遍 DOMPurify）
function sanitizeContentHtml(
    html: string,
    routes: Map<string, string>
): string {
    let imageIndex = 0;

    const cleaned = sanitizeHtml(html, {
        allowedTags: [
            'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'strong', 'em', 'u', 's', 'del', 'ins',
            'sub', 'sup', 'code', 'pre', 'blockquote', 'a', 'img',
            'figure', 'figcaption', 'table', 'thead', 'tbody', 'tfoot',
            'tr', 'th', 'td', 'caption', 'div', 'span', 'details',
            'summary', 'video', 'audio', 'source', 'iframe', 'small',
            'mark', 'kbd', 'abbr', 'dl', 'dt', 'dd',
        ],
        allowedAttributes: {
            a: ['href', 'title', 'target', 'rel', 'class'],
            img: [
                'src', 'alt', 'title', 'loading', 'decoding',
                'class', 'width', 'height', 'fetchpriority',
            ],
            iframe: [
                'src', 'title', 'width', 'height', 'allow',
                'allowfullscreen', 'frameborder', 'loading', 'class',
            ],
            video: [
                'src', 'controls', 'poster', 'width', 'height',
                'preload', 'class',
            ],
            audio: ['src', 'controls', 'preload', 'class'],
            source: ['src', 'type', 'media'],
            td: ['colspan', 'rowspan', 'align'],
            th: ['colspan', 'rowspan', 'align', 'scope'],
            details: ['open'],
            code: ['class'],
            pre: ['class'],
        },
        allowedSchemes: ['http', 'https', 'mailto', 'tel'],
        allowedSchemesByTag: {
            img: ['http', 'https'],
            iframe: ['https'],
            video: ['https'],
            audio: ['https'],
            source: ['https'],
        },
        allowProtocolRelative: false,
        transformTags: {
            a: (tagName, attribs) => {
                const rawHref = (attribs.href ?? '').trim();
                const scheme = rawHref
                    .replace(/[\u0000-\u0020]/g, '')
                    .match(/^[a-z][a-z0-9+.-]*:/i)?.[0]
                    .toLowerCase();
                // 没有地址或使用了危险协议的链接不渲染成可点击文本
                if (
                    !rawHref ||
                    (scheme &&
                        !['http:', 'https:', 'mailto:', 'tel:'].includes(scheme))
                ) {
                    return { tagName: 'span', attribs: {} };
                }

                const href = rewriteNotionUrl(rawHref, routes);
                const isHash = href.startsWith('#');
                const isInternal = !isHash && href.startsWith('/');
                const isExternal = /^https?:\/\//i.test(href);

                return {
                    tagName,
                    attribs: {
                        ...attribs,
                        href,
                        ...(isExternal
                            ? {
                                  target: '_blank',
                                  rel: 'noopener noreferrer',
                                  class: 'md-link md-link--external',
                              }
                            : isInternal
                            ? {
                                  rel: 'noopener',
                                  class: 'md-link md-link--internal',
                              }
                            : { class: 'md-link' }),
                    },
                };
            },
            img: (tagName, attribs) => {
                // 第一张图通常是题图，立即加载；其余走懒加载
                const eager = imageIndex++ === 0;
                return {
                    tagName,
                    attribs: {
                        ...attribs,
                        loading: eager ? 'eager' : 'lazy',
                        decoding: 'async',
                        ...(eager ? { fetchpriority: 'high' } : {}),
                        class: 'md-image',
                    },
                };
            },
        },
    });

    return addHeadingAnchors(
        wrapTables(wrapFigures(convertLinkCards(cleaned)))
    );
}

// 把页面正文 Markdown 渲染成可直接输出的 HTML
export async function markdownToHtml(markdown: string): Promise<string> {
    if (!markdown.trim()) return '';

    // remark-gfm 支持表格、删除线、任务列表、自动链接等 GitHub 风格语法；
    // allowDangerousHtml 让 Notion 的下划线 / 视频 / 嵌入等原始 HTML 不被丢弃，
    // 随后统一经过 sanitize-html 白名单清洗。
    // 只有正文里真的出现 Notion 页面链接时才去查路由索引，避免白跑接口。
    const needsRouteIndex = /\]\(https?:\/\/(?:www\.)?notion\.(?:so|site)\//i.test(
        markdown
    );

    const [processed, routes] = await Promise.all([
        remark().use(gfm).use(html, { allowDangerousHtml: true }).process(markdown),
        needsRouteIndex
            ? getPageRouteIndex().catch(() => new Map<string, string>())
            : Promise.resolve(new Map<string, string>()),
    ]);

    return sanitizeContentHtml(processed.toString(), routes);
}


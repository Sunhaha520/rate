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
    getPageMarkdown,
    markdownToHtml,
    createKeyedCache,
    CONTENT_CACHE_TTL,
    normalizeSlug,
    withRetry,
} from './notion';

// 成员页面展示所需的字段
export interface WebsiteMember {
    id: string; // Slug，用作 React key 与个人主页地址
    name: string;
    year: string;
    role: string;
    photo: string; // 头像地址（Notion 托管图片会自动走代理）
    github?: string;
    homepage?: string; // 个人主页链接（外链或站内路径）
    email?: string;
    researchTopic: string[];
    company?: string; // 毕业去向 / 公司（Former Members 卡片使用）
    position?: string; // 职位
    former?: boolean; // 是否已毕业 / 离开课题组
}

type Property = PageObjectResponse['properties'][string];

// Undergraduate 默认归入 Former Members（毕业成员）。
// 如果以后希望本科生留在 Current Members，把这里改成 false 即可。
const UNDERGRADUATE_AS_FORMER = true;

// 判断返回对象是否为完整的 Page 对象（含 properties）
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
        case 'email':
            return property.email ?? '';
        case 'number':
            return property.number !== null ? String(property.number) : '';
        case 'formula':
            return property.formula.type === 'string'
                ? property.formula.string ?? ''
                : '';
        default:
            return '';
    }
}

// 研究方向：优先多选，其次文本（支持换行、分号、逗号分隔）
function getTopics(property: Property | undefined): string[] {
    if (!property) return [];
    if (property.type === 'multi_select') {
        return property.multi_select.map((o) => o.name).filter(Boolean);
    }
    const text = getText(property);
    // Text 类型时：一行一个即可，也兼容分号、逗号、顿号、竖线分隔；
    // 行首的 • - * 会自动去掉。
    return text
        .split(/[\n;；,，、|]+/)
        .map((s) => s.replace(/^\s*[•·\-*]\s*/, '').trim())
        .filter(Boolean);
}

// 兼容中英文角色写法，统一成页面上分组使用的名称
const ROLE_MAP: Record<string, string> = {
    '导师': 'Supervisor',
    '教授': 'Supervisor',
    supervisor: 'Supervisor',
    '博士': 'PhD',
    '博士生': 'PhD',
    phd: 'PhD',
    '硕士': 'Master',
    '硕士生': 'Master',
    master: 'Master',
    '本科': 'Undergraduate',
    '本科生': 'Undergraduate',
    undergraduate: 'Undergraduate',
    ug: 'Undergraduate',
    '研究助理': 'RA',
    ra: 'RA',
};

function normalizeRole(role: string): string {
    const key = role.trim();
    if (!key) return 'Member';

    const exact = ROLE_MAP[key.toLowerCase()] ?? ROLE_MAP[key];
    if (exact) return exact;

    // Role 改成 Text 后可能写成 “PhD Student”“Master Student” 等，
    // 这里按关键词兜底识别。
    if (/supervisor|advisor|导师|教授|\bpi\b/i.test(key)) {
        return 'Supervisor';
    }
    if (/ph\.?\s?d|doctor|博士/i.test(key)) return 'PhD';
    if (/master|硕士/i.test(key)) return 'Master';
    if (/undergrad|\bug\b|bachelor|本科/i.test(key)) {
        return 'Undergraduate';
    }
    if (/\bra\b|research assistant|研究助理/i.test(key)) return 'RA';

    return key;
}

// 头像：Notion 上传的图片是 S3 临时签名地址，统一返回 /api/notion-image?pageId=...
// 由代理在请求时实时换取最新签名，避免过期；外部图片链接则直接使用。
function getPhoto(page: PageObjectResponse): string {
    const proxyUrl = notionImageProxyUrl(
        page.id,
        page.last_edited_time,
        480
    );
    const photoProp = findProperty(page, [
        'Photo',
        'Picture',
        'Avatar',
        '头像',
        '照片',
        '个人照片',
    ]);

    if (
        photoProp &&
        photoProp.type === 'files' &&
        photoProp.files.length > 0
    ) {
        const file = photoProp.files[0];
        if (file.type === 'external') {
            return isNotionHostedImage(file.external.url)
                ? proxyUrl
                : file.external.url;
        }
        if (file.type === 'file') {
            return proxyUrl;
        }
    }

    // 回退到页面封面
    if (page.cover) {
        if (page.cover.type === 'external') {
            return isNotionHostedImage(page.cover.external.url)
                ? proxyUrl
                : page.cover.external.url;
        }
        if (page.cover.type === 'file') {
            return proxyUrl;
        }
    }

    return '';
}

// 读取 Slug；留空则用姓名生成（如 WONG Mun On → wong-mun-on），最后才用页面 ID。
// 允许在 Notion 里直接填 "/qiaoyutong" 这类带斜杠的写法，统一规范化成 URL 片段。
function getSlug(page: PageObjectResponse, name: string): string {
    const slug = normalizeSlug(
        getText(findProperty(page, ['Slug', 'slug', '链接']))
    );
    if (slug) return slug;

    return normalizeSlug(name) || page.id.replace(/-/g, '');
}

// 分页拉取数据源中的全部记录
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

// 排序优先级：导师 → 博士 → 硕士 → 本科 → 其他
const ROLE_ORDER = ['Supervisor', 'PhD', 'Master', 'Undergraduate', 'RA'];

function roleRank(role: string): number {
    const index = ROLE_ORDER.indexOf(role);
    return index === -1 ? ROLE_ORDER.length : index;
}

// 成员信息 + 对应的 Notion 页面（页面 id 用于拉取个人主页正文）
interface MemberEntry {
    page: PageObjectResponse;
    member: WebsiteMember;
}

// 判断某个属性是否为勾选状态
function isChecked(property: Property | undefined): boolean {
    return property?.type === 'checkbox' ? property.checkbox : false;
}

// 状态列里出现这些词时视为已毕业 / 已离开
const FORMER_STATUS_RE = /former|alumni|graduat|毕业|离组|离校/i;

// 查询成员表中所有已发布成员（未建 Published 列时默认视为已发布）
async function fetchPublishedMemberEntries(): Promise<MemberEntry[]> {
    const dataSourceId = await getDataSourceId('members');
    if (!dataSourceId) {
        console.warn(
            '未找到成员数据源：请确认 Notion 数据库里已有 Members 表，且集成有访问权限'
        );
        return [];
    }

    const pages = await queryAllPages(dataSourceId);

    const publishedPages = pages.filter((page) => {
        const publishedProp = findProperty(page, [
            'Published',
            'published',
            '发布',
            '已发布',
        ]);
        if (!publishedProp) return true;
        return publishedProp.type === 'checkbox' ? publishedProp.checkbox : true;
    });

    const entries = publishedPages.map((page) => {
        const name = getText(
            findProperty(page, ['Name', 'Title', '姓名', '名称', '标题'])
        );
        const role = normalizeRole(
            getText(findProperty(page, ['Role', '角色', '身份']))
        );
        const statusText = getText(
            findProperty(page, ['Status', '状态', 'Member Status', '类别', '类型'])
        );
        const former =
            (UNDERGRADUATE_AS_FORMER && role === 'Undergraduate') ||
            isChecked(
                findProperty(page, ['Former', 'Alumni', 'Graduated', '已毕业', '毕业'])
            ) ||
            FORMER_STATUS_RE.test(statusText);

        return {
            page,
            member: {
                id: getSlug(page, name),
                name,
                year: getText(
                    findProperty(page, ['Year', '年份', '年级', '入学年份'])
                ),
                role,
                photo: getPhoto(page),
                github: getText(
                    findProperty(page, ['GitHub', 'Github', 'github'])
                ),
                homepage: getText(
                    findProperty(page, [
                        'Homepage',
                        'Home Page',
                        'Personal Page',
                        '个人主页',
                        '主页',
                    ])
                ),
                email: getText(findProperty(page, ['Email', 'email', '邮箱'])),
                company: getText(
                    findProperty(page, [
                        'Company',
                        'Employer',
                        'Destination',
                        '公司',
                        '单位',
                        '去向',
                    ])
                ),
                position: getText(
                    findProperty(page, [
                        'Position',
                        'Job Title',
                        '职位',
                        '岗位',
                        '职务',
                    ])
                ),
                former,
                researchTopic: getTopics(
                    findProperty(page, [
                        'Research Topic',
                        'Research Topics',
                        '研究主题',
                        '研究方向',
                    ])
                ),
            } as WebsiteMember,
        };
    });

    return entries
        .filter((entry) => entry.member.name.trim() !== '')
        .sort((a, b) => {
            const byRole =
                roleRank(a.member.role) - roleRank(b.member.role);
            if (byRole !== 0) return byRole;
            if (a.member.year !== b.member.year) {
                return a.member.year.localeCompare(b.member.year);
            }
            return a.member.name.localeCompare(b.member.name);
        });
}

// 成员表查询带短缓存：/current-members、/former-members、成员主页、预渲染路径
// 都会用到同一份数据，避免每次导航都重新请求 Notion。
const memberEntriesCache = createKeyedCache<MemberEntry[]>(CONTENT_CACHE_TTL);

function getPublishedMemberEntries(): Promise<MemberEntry[]> {
    return memberEntriesCache('all', fetchPublishedMemberEntries);
}

// 当前成员列表（`/current-members` 使用）：不含已毕业 / 离开的成员
export async function getPublishedMembers(): Promise<WebsiteMember[]> {
    const entries = await getPublishedMemberEntries();
    return entries
        .filter((entry) => !entry.member.former)
        .map((entry) => entry.member);
}

// 已毕业 / 离开课题组的成员（`/former-members` 使用），按毕业年份倒序
export async function getFormerMembers(): Promise<WebsiteMember[]> {
    const entries = await getPublishedMemberEntries();
    return entries
        .filter((entry) => entry.member.former)
        .map((entry) => entry.member)
        .sort((a, b) => {
            if (a.year !== b.year) return (b.year || '').localeCompare(a.year || '');
            return a.name.localeCompare(b.name);
        });
}

// 所有已发布成员的 slug（用于构建期预渲染个人主页）
export async function getAllMemberSlugs(): Promise<string[]> {
    const entries = await getPublishedMemberEntries();
    return entries.map((entry) => entry.member.id).filter(Boolean);
}

// 单个成员的个人主页：基本信息 + Notion 页面正文渲染出的 HTML
export interface MemberProfile extends WebsiteMember {
    contentHtml: string;
}

async function entryToProfile(hit: MemberEntry): Promise<MemberProfile> {
    const markdown = await getPageMarkdown(hit.page.id);
    const contentHtml = await markdownToHtml(markdown);
    return { ...hit.member, contentHtml };
}

export async function getMemberBySlug(
    slug: string
): Promise<MemberProfile | null> {
    const entries = await getPublishedMemberEntries();
    // URL 里可能出现 /HO%20Man%20Hin、/HO-Man-Hin 等写法，先规范化再匹配
    const requested = normalizeSlug(slug);
    const hit = entries.find((entry) => entry.member.id === requested);
    if (!hit) return null;

    return entryToProfile(hit);
}

// 导师主页（/supervisor 使用）：取成员表里 Role=Supervisor 的那一行 + 页面正文。
// 不需要单独建表，维护方式与普通成员完全一致。
export async function getSupervisor(): Promise<MemberProfile | null> {
    const entries = await getPublishedMemberEntries();
    const hit = entries.find(
        (entry) => entry.member.role === 'Supervisor' && !entry.member.former
    );
    if (!hit) return null;

    return entryToProfile(hit);
}

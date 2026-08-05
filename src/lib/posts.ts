import { remark } from 'remark';
import html from 'remark-html';
import {
    getPublishedPosts,
    getPostMetaById,
    getPageMarkdown,
    getPageImageBlocks,
} from './notion';

// 保持原有接口不变，页面代码无需修改
export interface PostData {
    id: string;
    title: string;
    date: string;
    summary: string;
    picture: string;
    contentHtml?: string;
    readingTime?: number;
}

// 根据正文估算阅读时长（分钟）：英文按 200 词/分钟，中文按 400 字/分钟
function estimateReadingTime(content: string): number {
    const text = content.replace(/[#>*`_\-\[\]()!]/g, ' ');
    const cjkChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const words = (text.replace(/[\u4e00-\u9fa5]/g, ' ').match(/\b\w+\b/g) || []).length;
    const minutes = Math.ceil(cjkChars / 400 + words / 200);
    return Math.max(1, minutes);
}

// 获取所有已发布新闻的列表（按日期降序，Notion 已排序）
export async function getSortedPostsData(): Promise<PostData[]> {
    const posts = await getPublishedPosts();

    // 列表页需要 readingTime，因此逐条拉取正文估算（页面数量不多时可接受）
    const withReadingTime = await Promise.all(
        posts.map(async (post) => {
            const markdown = await getPageMarkdown(post.pageId);
            return {
                id: post.id,
                title: post.title,
                date: post.date,
                summary: post.summary,
                picture: post.picture,
                readingTime: estimateReadingTime(markdown),
            } as PostData;
        })
    );

    return withReadingTime;
}

// 根据 id/slug 获取单篇新闻详情（含正文 HTML）
export async function getPostData(id: string): Promise<PostData> {
    const meta = await getPostMetaById(id);

    // 未找到对应新闻时返回占位内容
    if (!meta) {
        console.error(`Post not found in Notion: ${id}`);
        return {
            id,
            title: 'Not Found',
            date: '',
            summary: 'The requested post was not found.',
            picture: '',
        };
    }

    // 拉取 Notion 正文并转成 Markdown
    const markdown = await getPageMarkdown(meta.pageId);

    // 复用现有 remark 流水线，将 Markdown 转成 HTML
    const processedContent = await remark().use(html).process(markdown);
    let contentHtml = processedContent.toString();

    // 将正文中会过期的 Notion S3 签名图片地址替换成稳定的 blockId 代理地址，
    // 使正文图片和封面图一样永不失效（无需刷新即可显示）。
    const imageBlocks = await getPageImageBlocks(meta.pageId);
    for (const img of imageBlocks) {
        const proxyUrl = `/api/notion-image?blockId=${img.blockId}`;
        // Notion 图片 URL 常带查询串（签名），且 HTML 里可能被 HTML 转义，
        // 因此按“去掉查询串后的基础地址”做匹配替换，覆盖同一张图片的所有变体。
        const base = img.url.split('?')[0];
        // 转义正则特殊字符
        const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // 匹配 src="<base>..." 直到下一个引号，整体替换为代理地址
        const re = new RegExp(`(src=")${escaped}[^"]*(")`, 'g');
        contentHtml = contentHtml.replace(re, `$1${proxyUrl}$2`);
    }

    return {
        id: meta.id,
        contentHtml,
        title: meta.title,
        date: meta.date,
        summary: meta.summary,
        picture: meta.picture,
        readingTime: estimateReadingTime(markdown),
    };
}

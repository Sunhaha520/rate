import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// 调整路径为 src/content
const postsDirectory = path.join(process.cwd(), 'src', 'content');

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

export function getSortedPostsData(): PostData[] {
    // 检查目录是否存在
    if (!fs.existsSync(postsDirectory)) {
        console.error(`Directory not found: ${postsDirectory}`);
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date,
            summary: matterResult.data.summary,
            picture: matterResult.data.picture,
            readingTime: estimateReadingTime(matterResult.content),
        };
    });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, `${id}.md`);

    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
        console.error(`File not found: ${fullPath}`);
        return {
            id,
            title: 'Not Found',
            date: '',
            summary: 'The requested post was not found.',
            picture: '',
        };
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        title: matterResult.data.title,
        date: matterResult.data.date,
        summary: matterResult.data.summary,
        picture: matterResult.data.picture,
        readingTime: estimateReadingTime(matterResult.content),
    };
}
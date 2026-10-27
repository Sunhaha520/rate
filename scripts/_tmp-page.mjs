// 临时脚本：打印某个成员的 Notion 页面 Markdown，用于排查表格渲染
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import { readFileSync } from 'fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getVar = (key) => {
    const line = env.split(/\r?\n/).find((l) => l.trim().startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
};

const notion = new Client({ auth: getVar('NOTION_TOKEN') });
const n2m = new NotionToMarkdown({ notionClient: notion });

const db = await notion.databases.retrieve({ database_id: getVar('NOTION_DATABASE_ID') });
for (const source of db.data_sources) {
    const detail = await notion.dataSources.retrieve({ data_source_id: source.id });
    const props = Object.keys(detail.properties);
    if (!/members?/i.test(source.name) && !props.some((p) => /role|photo|头像|角色/i.test(p))) continue;

    const res = await notion.dataSources.query({ data_source_id: source.id });
    for (const page of res.results) {
        const title = Object.values(page.properties).find((p) => p.type === 'title');
        const name = title?.title?.map((t) => t.plain_text).join('') ?? '';
        if (!/qiao/i.test(name)) continue;

        const blocks = await notion.blocks.children.list({ block_id: page.id, page_size: 100 });
        console.log('=== blocks ===');
        for (const b of blocks.results) {
            console.log(b.type, JSON.stringify(b[b.type]).slice(0, 400));
        }

        const md = await n2m.pageToMarkdown(page.id);
        console.log('\n=== markdown ===');
        console.log(n2m.toMarkdownString(md).parent);
    }
}

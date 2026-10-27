// 临时脚本：检查页面内嵌数据库是否可读
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getVar = (key) => {
    const line = env.split(/\r?\n/).find((l) => l.trim().startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
};

const notion = new Client({ auth: getVar('NOTION_TOKEN') });

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
        const childDb = blocks.results.find((b) => b.type === 'child_database');
        console.log('child_database block id:', childDb.id);

        try {
            const inner = await notion.databases.retrieve({ database_id: childDb.id });
            console.log('sources:', inner.data_sources);
            for (const s of inner.data_sources) {
                const rows = await notion.dataSources.query({ data_source_id: s.id });
                console.log('rows:', rows.results.length);
                for (const row of rows.results.slice(0, 3)) {
                    console.log(JSON.stringify(row.properties));
                }
            }
        } catch (err) {
            console.log('retrieve failed:', err.message);
        }
    }
}

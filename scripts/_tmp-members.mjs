// 临时脚本：打印成员表的字段与记录，用于排查个人主页链接
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getVar = (key) => {
    const line = env.split(/\r?\n/).find((l) => l.trim().startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const notion = new Client({ auth: getVar('NOTION_TOKEN') });

const db = await notion.databases.retrieve({ database_id: getVar('NOTION_DATABASE_ID') });
for (const source of db.data_sources) {
    const detail = await notion.dataSources.retrieve({ data_source_id: source.id });
    const propNames = Object.keys(detail.properties);
    console.log(`\n=== ${source.name} (${source.id}) ===`);
    console.log('properties:', propNames.join(' | '));

    if (!/members?/i.test(source.name) && !propNames.some((p) => /role|photo|头像|角色/i.test(p))) {
        continue;
    }

    const res = await notion.dataSources.query({ data_source_id: source.id });
    for (const page of res.results) {
        const props = page.properties ?? {};
        const out = {};
        for (const [key, prop] of Object.entries(props)) {
            if (prop.type === 'title') out[key] = prop.title.map((t) => t.plain_text).join('');
            else if (prop.type === 'rich_text') out[key] = prop.rich_text.map((t) => t.plain_text).join('');
            else if (prop.type === 'select') out[key] = prop.select?.name ?? '';
            else if (prop.type === 'multi_select') out[key] = prop.multi_select.map((o) => o.name).join(', ');
            else if (prop.type === 'url') out[key] = prop.url ?? '';
            else if (prop.type === 'email') out[key] = prop.email ?? '';
            else if (prop.type === 'checkbox') out[key] = prop.checkbox;
        }
        console.log(JSON.stringify(out));
    }
}

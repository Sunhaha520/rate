// Notion 连接诊断脚本：列出当前 Token 能访问的所有数据库与页面
// 运行：node scripts/diagnose-notion.mjs
import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

// 手动解析 .env.local（脚本不经过 Next.js，需自己读取）
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const getVar = (key) => {
    const line = env.split(/\r?\n/).find((l) => l.trim().startsWith(key + '='));
    return line ? line.slice(line.indexOf('=') + 1).trim() : '';
};

const token = getVar('NOTION_TOKEN');
const dbId = getVar('NOTION_DATABASE_ID');

// 企业代理环境下忽略自签名证书
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('使用的 Token 前缀:', token.slice(0, 12) + '...');
console.log('配置的 Database ID:', dbId);
console.log('----------------------------------------');

const notion = new Client({ auth: token });

try {
    // 1) 用 search 列出该集成能访问的所有对象
    console.log('\n[1] 该集成当前能访问的对象列表：');
    const search = await notion.search({ page_size: 50 });
    if (search.results.length === 0) {
        console.log('  ⚠️ 该集成目前没有任何可访问的页面/数据库！');
        console.log('     说明 Token 对应的集成没有被授权任何内容，请检查：');
        console.log('     - .env.local 里的 Token 是否来自「导师博客」这个集成');
        console.log('     - 数据库是否确实共享给了 Token 对应的集成');
    }
    for (const item of search.results) {
        const type = item.object; // 'database' | 'page'
        let title = '(无标题)';
        if (type === 'database' && item.title) {
            title = item.title.map((t) => t.plain_text).join('');
        } else if (type === 'page' && item.properties) {
            const titleProp = Object.values(item.properties).find((p) => p.type === 'title');
            if (titleProp) title = titleProp.title.map((t) => t.plain_text).join('');
        }
        console.log(`  - [${type}] ${title}`);
        console.log(`      id: ${item.id}`);
        console.log(`      id(去连字符): ${item.id.replace(/-/g, '')}`);
    }

    // 2) 直接尝试用配置的 ID 检索数据库
    console.log('\n[2] 用配置的 Database ID 直接检索：');
    try {
        const db = await notion.databases.retrieve({ database_id: dbId });
        const dbTitle = db.title?.map((t) => t.plain_text).join('') || '(无标题)';
        console.log(`  ✅ 成功找到数据库：${dbTitle}`);
    } catch (e) {
        console.log(`  ❌ 检索失败：${e.code} - ${e.message}`);
        console.log('     → 这个 ID 不是该集成可访问的数据库。请对照上面 [1] 列表里 type=database 的 id。');
    }
} catch (err) {
    console.error('诊断请求失败：', err.code, err.message);
}

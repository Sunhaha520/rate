import type { NextApiRequest, NextApiResponse } from 'next';

// 临时诊断接口：部署后访问 /api/debug-notion 查看运行时各模块与 Notion 调用状态。
// 排查完成后可以删除此文件。
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const steps: Record<string, unknown> = {};

    const run = async (name: string, fn: () => Promise<unknown>) => {
        try {
            steps[name] = await fn();
        } catch (err) {
            steps[name] = {
                error: err instanceof Error ? err.message : String(err),
                stack: err instanceof Error ? err.stack?.split('\n').slice(0, 3) : undefined,
            };
        }
    };

    await run('import_client', async () => {
        await import('@notionhq/client');
        return 'ok';
    });
    await run('import_n2m', async () => {
        await import('notion-to-md');
        return 'ok';
    });
    await run('import_sanitize', async () => {
        await import('sanitize-html');
        return 'ok';
    });
    await run('import_remark', async () => {
        await import('remark');
        return 'ok';
    });
    await run('import_remark_gfm', async () => {
        await import('remark-gfm');
        return 'ok';
    });
    await run('import_remark_html', async () => {
        await import('remark-html');
        return 'ok';
    });
    await run('import_notion_lib', async () => {
        const lib = await import('@/lib/notion');
        return { databaseId: Boolean(lib.databaseId) };
    });
    await run('data_source', async () => {
        const lib = await import('@/lib/notion');
        return (await lib.getDataSourceId('news')) || 'EMPTY';
    });
    await run('published_posts', async () => {
        const lib = await import('@/lib/notion');
        const posts = await lib.getPublishedPosts();
        return posts.length;
    });
    await run('published_members', async () => {
        const lib = await import('@/lib/notion-members');
        const members = await lib.getPublishedMembers();
        return members.length;
    });

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({
        node: process.version,
        env: {
            token: Boolean(process.env.NOTION_TOKEN),
            databaseId: Boolean(process.env.NOTION_DATABASE_ID),
        },
        steps,
    });
}

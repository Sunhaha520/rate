import type { ComponentType } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MemberHomepageView } from '@/components/MemberHomepageView';
import { getMemberBySlug, getAllMemberSlugs, MemberProfile } from '@/lib/notion-members';
import SunYifengPage from '@/components/legacy-members/SunYifengPage';
import LychEePage from '@/components/legacy-members/LychEePage';
import QiaoYutongPage from '@/components/legacy-members/QiaoYutongPage';
import ZhouShaobinPage from '@/components/legacy-members/ZhouShaobinPage';
import HoManHinPage from '@/components/legacy-members/HoManHinPage';

interface MemberHomepageProps {
    member: MemberProfile | null;
    legacySlug: string | null;
}

// 旧版写死在代码里的成员主页：Notion 里还没有对应成员时兜底使用
const LEGACY_PAGES: Record<string, ComponentType> = {
    sunyifeng: SunYifengPage,
    lychee: LychEePage,
    qiaoyutong: QiaoYutongPage,
    zhoushaobin: ZhouShaobinPage,
    homanhin: HoManHinPage,
};

export default function MemberHomepage({
    member,
    legacySlug,
}: MemberHomepageProps) {
    if (member) {
        return (
            <MemberHomepageView
                member={member}
                canonicalPath={`/members/${member.id}`}
            />
        );
    }

    const LegacyPage = legacySlug ? LEGACY_PAGES[legacySlug] : undefined;
    return LegacyPage ? <LegacyPage /> : null;
}

export const getStaticPaths: GetStaticPaths = async () => {
    // 预渲染所有成员主页：避免首次访问时再现场请求 Notion（fallback 只兜底新增成员）
    let notionSlugs: string[] = [];
    try {
        notionSlugs = await getAllMemberSlugs();
    } catch (err) {
        console.error('读取成员 slug 失败，将在访问时按需生成:', err);
    }

    const slugs = Array.from(
        new Set([...notionSlugs, ...Object.keys(LEGACY_PAGES)])
    );

    return {
        paths: slugs.map((slug) => ({ params: { slug } })),
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps<MemberHomepageProps> = async ({
    params,
}) => {
    const slug = params?.slug as string;

    // Notion 优先：成员表里有这个人就用 Notion 页面正文生成主页
    const member = await getMemberBySlug(slug);
    if (member) {
        // /HO%20Man%20Hin、/Qiaoyutong 这类非规范写法统一跳到规范地址
        if (slug !== member.id) {
            return {
                redirect: {
                    destination: `/members/${member.id}`,
                    permanent: false,
                },
            };
        }
        return {
            props: { member, legacySlug: null },
            revalidate: 60,
        };
    }

    const legacySlug = LEGACY_PAGES[slug.toLowerCase()] ? slug.toLowerCase() : null;
    if (!legacySlug) {
        return { notFound: true };
    }

    return { props: { member: null, legacySlug } };
};

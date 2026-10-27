import { GetStaticPaths, GetStaticProps } from 'next';
import { MemberHomepageView } from '@/components/MemberHomepageView';
import { getMemberBySlug, getAllMemberSlugs, MemberProfile } from '@/lib/notion-members';

interface MemberHomepageProps {
    member: MemberProfile;
}

// 根路径上的成员个人主页：/qiaoyutong 这类链接直接渲染 Notion 里该成员的页面正文。
// 已有静态页面（/supervisor、/news 等）优先匹配，不会被这里覆盖。
export default function MemberHomepage({ member }: MemberHomepageProps) {
    return (
        <MemberHomepageView
            member={member}
            canonicalPath={`/members/${member.id}`}
        />
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    // 根路径别名（/qiaoyutong）与 /members/<slug> 一样预渲染
    let slugs: string[] = [];
    try {
        slugs = await getAllMemberSlugs();
    } catch (err) {
        console.error('读取成员 slug 失败，将在访问时按需生成:', err);
    }

    return {
        paths: slugs.map((slug) => ({ params: { slug } })),
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps<MemberHomepageProps> = async ({
    params,
}) => {
    const slug = params?.slug as string;
    const member = await getMemberBySlug(slug);

    if (!member) {
        return { notFound: true };
    }

    // /HO%20Man%20Hin、/Qiaoyutong 这类非规范写法统一跳到规范地址
    if (slug !== member.id) {
        return {
            redirect: {
                destination: `/${member.id}`,
                permanent: false,
            },
        };
    }

    return {
        props: { member },
        revalidate: 60,
    };
};

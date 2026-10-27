import React, { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface ArticleContentProps {
    html: string;
    className?: string;
}

// Notion 正文的统一渲染容器：
// - 站内链接用 Next 路由无刷新跳转，站外链接已在服务端加上 target="_blank"
// - 图片解码完成后淡入，避免正文高度突变与闪烁
// - 正文 HTML 已在 getStaticProps 阶段清洗，这里直接输出，首屏即可见
export function ArticleContent({ html, className = '' }: ArticleContentProps) {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target as HTMLElement;
            const anchor = target.closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href') ?? '';
            if (!href.startsWith('/')) return;

            // 锚点链接（#section）交给浏览器原生滚动
            event.preventDefault();
            router.push(href);
        },
        [router]
    );

    useEffect(() => {
        const root = containerRef.current;
        if (!root) return;

        // 仅在 JS 可用时启用“加载后淡入”，禁用 JS 时图片保持可见
        root.classList.add('js-images');

        const images = Array.from(root.querySelectorAll('img'));
        const cleanups: Array<() => void> = [];

        images.forEach((img) => {
            if (img.complete) {
                img.classList.add('is-loaded');
                return;
            }
            const onLoad = () => img.classList.add('is-loaded');
            img.addEventListener('load', onLoad);
            cleanups.push(() => img.removeEventListener('load', onLoad));
        });

        return () => cleanups.forEach((cleanup) => cleanup());
    }, [html]);

    return (
        <div
            ref={containerRef}
            className={`article-body prose prose-slate dark:prose-invert max-w-none ${className}`}
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default ArticleContent;

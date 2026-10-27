import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

// 顶部路由进度条：Next 的客户端跳转在取数期间没有浏览器原生进度反馈，
// 这里给一个细的青碧色进度提示，避免“点了没反应”的错觉。
export function RouteProgress() {
    const router = useRouter();
    const [active, setActive] = useState(false);
    const [width, setWidth] = useState(0);
    const trickleRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const finishRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const clearTimers = () => {
            if (trickleRef.current) {
                clearInterval(trickleRef.current);
                trickleRef.current = null;
            }
            if (finishRef.current) {
                clearTimeout(finishRef.current);
                finishRef.current = null;
            }
        };

        const start = () => {
            clearTimers();
            setActive(true);
            setWidth(8);

            trickleRef.current = setInterval(() => {
                setWidth((current) =>
                    current >= 90 ? current : current + (90 - current) * 0.18
                );
            }, 180);
        };

        const done = () => {
            clearTimers();
            setWidth(100);
            finishRef.current = setTimeout(() => {
                setActive(false);
                finishRef.current = setTimeout(() => setWidth(0), 260);
            }, 200);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            clearTimers();
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
        };
    }, [router.events]);

    return (
        <div
            className={`route-progress ${active ? 'is-active' : ''}`}
            aria-hidden="true"
        >
            <div className="route-progress__bar" style={{ width: `${width}%` }} />
        </div>
    );
}

export default RouteProgress;

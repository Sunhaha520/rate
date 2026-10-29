import React from 'react';
import { Rss } from 'lucide-react';

// 页脚：纯静态输出（不依赖主题挂载），服务端即可渲染，避免页面底部跳动
const Footer: React.FC = () => {
    return (
        <footer className="backdrop-blur-sm border-t py-55 shadow-sm bg-white/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            {/* 底部多留一点空间，避免悬浮的主题切换按钮压住版权文字 */}
            <div className="container mx-auto px-4 pb-16 sm:pb-0">
                <div className="flex flex-col items-center space-y-4">
                    {/* 版权信息 */}
                    <p className="text-sm font-medium tracking-wide text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                        &copy; {new Date().getFullYear()} RATE@UM. All rights reserved.
                    </p>

                    {/* RSS 订阅入口 */}
                    <a
                        href="/feed.xml"
                        type="application/rss+xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Subscribe to RATE@UM News via RSS"
                        aria-label="RSS feed"
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium tracking-wide text-slate-600 transition-colors hover:border-teal-600/40 hover:text-teal-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-teal-400/40 dark:hover:text-teal-300"
                    >
                        <Rss
                            size={13}
                            strokeWidth={2.2}
                            className="text-teal-600 dark:text-teal-400"
                        />
                        RSS Feed
                    </a>

                    {/* 装饰性分割线 */}
                    <div className="w-16 h-px my-2 bg-gray-300 dark:bg-gray-600"></div>

                    {/* 额外的装饰性文字或元素 */}
                    <p className="text-xs font-light italic text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        Innovating Civil Engineering, Building a Safer Future.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

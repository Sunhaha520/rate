import React from 'react';

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

"use client"; // 确保在客户端渲染
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子

const Footer: React.FC = () => {
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false); // 用于确保组件在客户端渲染后再应用主题

    useEffect(() => {
        setMounted(true); // 组件挂载后设置为 true
    }, []);

    if (!mounted) {
        return null; // 在服务器端渲染时不渲染内容，避免闪烁
    }

    return (
        <footer className={`backdrop-blur-sm border-t py-55 shadow-sm ${theme === 'dark' ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* 版权信息 */}
                    <p className={`text-sm font-medium tracking-wide transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}>
                        &copy; {new Date().getFullYear()} RATE@UM. All rights reserved.
                    </p>

                    {/* 装饰性分割线 */}
                    <div className={`w-16 h-px my-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                    {/* 额外的装饰性文字或元素 */}
                    <p className={`text-xs font-light italic transition-colors duration-300 ${theme === 'dark' ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
                    Innovating Civil Engineering, Building a Safer Future.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
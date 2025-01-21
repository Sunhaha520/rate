import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-55 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-4">
                    {/* 版权信息 */}
                    <p className="text-gray-600 text-sm font-medium tracking-wide hover:text-gray-800 transition-colors duration-300">
                        &copy; {new Date().getFullYear()} RATE@UM. All rights reserved.
                    </p>

                    {/* 装饰性分割线 */}
                    <div className="w-16 h-px bg-gray-300 my-2"></div>

                    {/* 额外的装饰性文字或元素 */}
                    <p className="text-gray-500 text-xs font-light italic hover:text-gray-700 transition-colors duration-300">
                        Designed with ❤️ for a better experience.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes'; // 引入 useTheme 钩子
import Head from 'next/head';

interface SubNavItem {
    id: number;
    name: string;
    href: string;
}

interface NavItem {
    id: number;
    name: string;
    href?: string;
    children?: SubNavItem[];
}

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { theme } = useTheme(); // 获取当前主题
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // 用于引用菜单面板

    useEffect(() => {
        setMounted(true);
    }, []);

    // 监听点击事件，关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false); // 点击菜单面板外部时关闭菜单
            }
        };

        // 添加点击事件监听器
        document.addEventListener('mousedown', handleClickOutside);

        // 清理监听器
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    if (!mounted) {
        return null; // 或者返回一个加载中的占位符
    }

    const navItems: NavItem[] = [
        { id: 1, name: 'Home', href: '/' },
        { 
            id: 2, 
            name: 'Research Team',
            children: [
                { id: 21, name: 'Supervisor', href: '/supervisor' },
                { id: 22, name: 'Current Members', href: '/current-members' },
                { id: 23, name: 'Former Members', href: '/former-members' },
            ]
        },
        { id: 3, name: 'Publish', href: '/publish' },
        { id: 4, name: 'Project', href: '/project' },
        { id: 5, name: 'News', href: '/news' },
        { id: 6, name: 'Equipment', href: '/equipment' },
        { id: 7, name: 'Join Us', href: '/join-us' },
    ];

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 shadow-md z-50 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/">
                            <div className={`font-bold text-xl cursor-pointer hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                RATE@UM
                            </div>
                        </Link>

                        {/* 桌面端菜单 */}
                        <ul className="hidden lg:flex space-x-8">
                            {navItems.map(item => (
                                <li key={item.id} className="relative group">
                                    <a href={item.href} 
                                       className={`block py-2 hover:text-blue-500 transition-colors ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {item.name}
                                        {item.children && (
                                            <span className="ml-1 inline-block">
                                                <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        )}
                                    </a>
                                    {/* 子菜单 */}
                                    {item.children && (
                                        <ul className={`absolute left-0 top-full pt-5 min-w-[200px]
                                                      invisible opacity-0 translate-y-2
                                                      group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                                                      transition-all duration-300 ease-out `}>
                                            <div className={`rounded-lg shadow-lg py-2 border ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200' }`}>
                                                {item.children.map(child => (
                                                    <li key={child.id}>
                                                        <a href={child.href}
                                                           className={`block px-4 py-2 hover:bg-gray-100 whitespace-nowrap ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'}`}>
                                                            {child.name}
                                                        </a>
                                                    </li>
                                                ))}
                                            </div>
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* 移动端和平板端菜单按钮 */}
                        <button 
                            onClick={toggleMenu} 
                            className="lg:hidden focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* 移动端和平板端菜单面板 */}
                <div 
                    className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    onClick={toggleMenu} // 点击空白区域关闭菜单
                >
                    <div 
                        ref={menuRef} // 绑定菜单面板的引用
                        className={`fixed top-0 left-0 h-full w-64 shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
                        onClick={(e) => e.stopPropagation()} // 阻止点击菜单面板内部时冒泡
                    >
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold"> Menu</span>
                                <button onClick={toggleMenu} aria-label="Close Menu">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ul className="space-y-4 overflow-y-auto">
                                {navItems.map(item => (
                                    <li key={item.id}>
                                        {item.children ? (
                                            <div>
                                                <span className="block py-2 border-b">{item.name}</span>
                                                <ul className="pl-4 mt-2 space-y-2">
                                                    {item.children.map(child => (
                                                        <li key={child.id}>
                                                            <a href={child.href} 
                                                               className={`block py-2 hover:text-blue-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                                {child.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <a href={item.href} 
                                               className={`block py-2 hover:text-blue-500 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                {item.name}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
            {/* 占位符 */}
            <div className="h-16"></div>
        </>
    );
};

export default Header;
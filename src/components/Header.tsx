"use client";
import React, { useState } from 'react';
import Link from 'next/link'; // 引入 Link 组件

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
    const [activeMenu, setActiveMenu] = useState<number | null>(null);

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
            <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
                <nav className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/">
                            <div className="font-bold text-xl cursor-pointer hover:text-blue-500 transition-colors">
                                RATE@UM
                            </div>
                        </Link>

                        {/* 桌面端菜单 */}
                        <ul className="hidden lg:flex space-x-8">
                            {navItems.map(item => (
                                <li key={item.id} 
                                    className="relative group"
                                    onMouseEnter={() => setActiveMenu(item.id)}
                                    onMouseLeave={() => setActiveMenu(null)}
                                >
                                    <a href={item.href} 
                                       className="block py-2 hover:text-blue-500 transition-colors">
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
                                        <ul className="absolute left-0 top-full pt-5 min-w-[200px]
                                                      invisible opacity-0 translate-y-2
                                                      group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                                                      transition-all duration-300 ease-out">
                                            <div className="bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                                                {item.children.map(child => (
                                                    <li key={child.id}>
                                                        <a href={child.href}
                                                           className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap">
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
                        <button onClick={toggleMenu} className="lg:hidden focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </nav>

                {/* 移动端和平板端菜单面板 */}
                <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-bold">菜单</span>
                                <button onClick={toggleMenu}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ul className="space-y-4">
                                {navItems.map(item => (
                                    <li key={item.id}>
                                        {item.children ? (
                                            <div>
                                                <span className="block py-2 border-b">{item.name}</span>
                                                <ul className="pl-4 mt-2 space-y-2">
                                                    {item.children.map(child => (
                                                        <li key={child.id}>
                                                            <a href={child.href} 
                                                               className="block py-2 hover:text-blue-500">
                                                                {child.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <a href={item.href} 
                                               className="block py-2 hover:text-blue-500">
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
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import {
    Home,
    Users,
    BookOpen,
    FolderKanban,
    MonitorPlay,
    Newspaper,
    Cpu,
    UserPlus,
    GraduationCap,
    UserRound,
    UsersRound,
    FlaskConical,
    ChevronDown,
    Menu as MenuIcon,
    X as CloseIcon,
    type LucideIcon,
} from 'lucide-react';

interface SubNavItem {
    id: number;
    name: string;
    href: string;
    icon: LucideIcon;
}

interface NavItem {
    id: number;
    name: string;
    href?: string;
    icon: LucideIcon;
    children?: SubNavItem[];
}

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState<number | null>(null);
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // 监听点击事件，关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    if (!mounted) {
        return null;
    }

    const isDark = theme === 'dark';

    const navItems: NavItem[] = [
        { id: 1, name: 'Home', href: '/', icon: Home },
        {
            id: 2,
            name: 'Research Team',
            icon: Users,
            children: [
                { id: 21, name: 'Supervisor', href: '/supervisor', icon: GraduationCap },
                { id: 22, name: 'Current Members', href: '/current-members', icon: UserRound },
                { id: 23, name: 'Former Members', href: '/former-members', icon: UsersRound },
            ],
        },
        {
            id: 3,
            name: 'Research',
            icon: FlaskConical,
            children: [
                { id: 31, name: 'Publications', href: '/publications', icon: BookOpen },
                { id: 32, name: 'Projects', href: '/project', icon: FolderKanban },
                { id: 33, name: 'Demo&Resources', href: '/demo', icon: MonitorPlay },
            ],
        },
        { id: 5, name: 'News', href: '/news', icon: Newspaper },
        { id: 6, name: 'Equipment', href: '/equipment', icon: Cpu },
        { id: 7, name: 'Join Us', href: '/join-us', icon: UserPlus },
    ];

    // 判断单个路由是否为激活状态
    const isActive = (href: string) => {
        if (href === '/') return router.pathname === '/';
        return router.pathname.startsWith(href);
    };

    // 判断带子菜单的项是否有任一子项激活
    const isGroupActive = (item: NavItem) => {
        if (item.href) return isActive(item.href);
        return item.children?.some((c) => isActive(c.href)) ?? false;
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b transition-colors duration-300 ${
                    isDark
                        ? 'bg-slate-900/75 border-slate-700/60 text-white shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
                        : 'bg-white/75 border-slate-200/70 text-slate-900 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)]'
                }`}
            >
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="group flex items-center gap-2 shrink-0">
                            <span
                                className={`font-extrabold text-xl tracking-tight transition-colors duration-300 group-hover:text-indigo-500 ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                }`}
                            >
                                RATE<span className="transition-transform duration-300 inline-block group-hover:rotate-12">@</span>UM
                            </span>
                        </Link>

                        {/* 桌面端菜单 */}
                        <ul className="hidden xl:flex items-center gap-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isGroupActive(item);
                                const hasChildren = !!item.children;

                                return (
                                    <li key={item.id} className="relative group/nav">
                                        {hasChildren ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        active
                                                            ? isDark
                                                                ? 'bg-indigo-500/15 text-indigo-300'
                                                                : 'bg-indigo-50 text-indigo-700'
                                                            : isDark
                                                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                                    }`}
                                                >
                                                    <Icon
                                                        size={17}
                                                        strokeWidth={active ? 2.4 : 2}
                                                        className={`transition-all duration-200 group-hover:scale-110 ${
                                                            active ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'
                                                        }`}
                                                    />
                                                    <span>{item.name}</span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-200 group-hover/nav:rotate-180 ${
                                                            active ? 'text-indigo-500' : 'text-slate-400'
                                                        }`}
                                                    />
                                                    <span
                                                        className={`absolute -bottom-[1px] left-3.5 right-3.5 h-0.5 rounded-full bg-indigo-500 transition-transform duration-300 ease-out origin-center ${
                                                            active ? 'scale-x-100' : 'scale-x-0 group-hover/nav:scale-x-100'
                                                        }`}
                                                    />
                                                </button>

                                                {/* 二级下拉菜单 */}
                                                <div
                                                    className={`absolute left-0 top-full pt-4 min-w-[220px] invisible opacity-0 translate-y-3 group-hover/nav:visible group-hover/nav:opacity-100 group-hover/nav:translate-y-0 transition-all duration-200 ease-out`}
                                                >
                                                    <ul
                                                        className={`rounded-xl border p-2 space-y-1.5 shadow-xl backdrop-blur-xl ${
                                                            isDark
                                                                ? 'bg-slate-900/95 border-slate-700/60'
                                                                : 'bg-white/95 border-slate-200/70'
                                                        }`}
                                                    >
                                                        {item.children!.map((child) => {
                                                            const ChildIcon = child.icon;
                                                            const childActive = isActive(child.href);
                                                            return (
                                                                <li key={child.id}>
                                                                    <Link
                                                                        href={child.href}
                                                                        className={`group/child flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                                                                            childActive
                                                                                ? isDark
                                                                                    ? 'bg-indigo-500/15 text-indigo-300'
                                                                                    : 'bg-indigo-50 text-indigo-700'
                                                                                : isDark
                                                                                ? 'text-slate-300 hover:bg-white/5 hover:text-white'
                                                                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                                                        }`}
                                                                    >
                                                                        <ChildIcon
                                                                            size={16}
                                                                            strokeWidth={childActive ? 2.4 : 2}
                                                                            className={`transition-colors duration-200 ${
                                                                                childActive
                                                                                    ? 'text-indigo-500'
                                                                                    : 'text-slate-400 group-hover/child:text-indigo-500'
                                                                            }`}
                                                                        />
                                                                        <span>{child.name}</span>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href!}
                                                className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    active
                                                        ? isDark
                                                            ? 'bg-indigo-500/15 text-indigo-300'
                                                            : 'bg-indigo-50 text-indigo-700'
                                                        : isDark
                                                        ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                                                }`}
                                            >
                                                <Icon
                                                    size={17}
                                                    strokeWidth={active ? 2.4 : 2}
                                                    className={`transition-all duration-200 group-hover:scale-110 group-active:scale-95 ${
                                                        active ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'
                                                    }`}
                                                />
                                                <span>{item.name}</span>
                                                <span
                                                    className={`absolute -bottom-[1px] left-3.5 right-3.5 h-0.5 rounded-full bg-indigo-500 transition-transform duration-300 ease-out origin-center ${
                                                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                                    }`}
                                                />
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {/* 移动端和平板端菜单按钮 */}
                        <button
                            onClick={toggleMenu}
                            className={`xl:hidden p-2 rounded-lg transition-colors duration-200 ${
                                isDark ? 'hover:bg-white/10 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                            }`}
                            aria-label="Toggle Menu"
                        >
                            <MenuIcon size={24} />
                        </button>
                    </div>
                </nav>
            </header>

            {/* 移动端和平板端菜单面板（放在 header 外，确保固定在视口顶层） */}
            <div
                className={`xl:hidden fixed inset-0 z-[110] bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 ${
                    menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleMenu}
            >
                <div
                    ref={menuRef}
                    className={`fixed top-0 left-0 h-full w-72 max-w-[80vw] shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${
                        menuOpen ? 'translate-x-0' : '-translate-x-full'
                    } ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-4">
                        <div
                            className={`flex justify-between items-center mb-6 px-2 pb-4 border-b ${
                                isDark ? 'border-slate-700/60' : 'border-slate-200'
                            }`}
                        >
                            <span className="font-extrabold text-lg tracking-tight">
                                RATE<span>@</span>UM
                            </span>
                            <button
                                onClick={toggleMenu}
                                aria-label="Close Menu"
                                className={`p-2 rounded-lg transition-colors duration-200 ${
                                    isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'
                                }`}
                            >
                                <CloseIcon size={22} />
                            </button>
                        </div>
                        <ul className="space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isGroupActive(item);
                                const hasChildren = !!item.children;
                                const expanded = expandedMobile === item.id;

                                if (hasChildren) {
                                    return (
                                        <li key={item.id}>
                                            <button
                                                type="button"
                                                onClick={() => setExpandedMobile(expanded ? null : item.id)}
                                                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                    active
                                                        ? isDark
                                                            ? 'bg-indigo-500/15 text-indigo-300'
                                                            : 'bg-indigo-50 text-indigo-700'
                                                        : isDark
                                                        ? 'text-slate-300 hover:bg-white/5'
                                                        : 'text-slate-600 hover:bg-slate-100/80'
                                                }`}
                                            >
                                                <Icon
                                                    size={18}
                                                    strokeWidth={active ? 2.4 : 2}
                                                    className={`transition-colors duration-200 ${
                                                        active ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'
                                                    }`}
                                                />
                                                <span className="flex-1 text-left">{item.name}</span>
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-200 ${
                                                        expanded ? 'rotate-180' : ''
                                                    } ${active ? 'text-indigo-500' : 'text-slate-400'}`}
                                                />
                                            </button>
                                            {/* 移动端二级菜单 */}
                                            <ul
                                                className={`overflow-hidden transition-all duration-300 ease-out ${
                                                    expanded ? 'max-h-60 mt-1' : 'max-h-0'
                                                }`}
                                            >
                                                {item.children!.map((child) => {
                                                    const ChildIcon = child.icon;
                                                    const childActive = isActive(child.href);
                                                    return (
                                                        <li key={child.id}>
                                                            <Link
                                                                href={child.href}
                                                                onClick={toggleMenu}
                                                                className={`group flex items-center gap-2.5 pl-11 pr-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                                    childActive
                                                                        ? isDark
                                                                            ? 'bg-indigo-500/15 text-indigo-300'
                                                                            : 'bg-indigo-50 text-indigo-700'
                                                                        : isDark
                                                                        ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                                                                        : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-900'
                                                                }`}
                                                            >
                                                                <ChildIcon
                                                                    size={16}
                                                                    strokeWidth={childActive ? 2.4 : 2}
                                                                    className={`transition-colors duration-200 ${
                                                                        childActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'
                                                                    }`}
                                                                />
                                                                <span>{child.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    );
                                }

                                return (
                                    <li key={item.id}>
                                        <Link
                                            href={item.href!}
                                            onClick={toggleMenu}
                                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                active
                                                    ? isDark
                                                        ? 'bg-indigo-500/15 text-indigo-300'
                                                        : 'bg-indigo-50 text-indigo-700'
                                                    : isDark
                                                    ? 'text-slate-300 hover:bg-white/5 hover:translate-x-1'
                                                    : 'text-slate-600 hover:bg-slate-100/80 hover:translate-x-1'
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                strokeWidth={active ? 2.4 : 2}
                                                className={`transition-colors duration-200 ${
                                                    active ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'
                                                }`}
                                            />
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 占位符 */}
            <div className="h-16"></div>
        </>
    );
};

export default Header;

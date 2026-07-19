'use client'; // 标记为客户端组件

import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // 监听系统主题变化
  useEffect(() => {
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      setTheme(systemTheme);
    };

    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    systemThemeQuery.addEventListener('change', handleSystemThemeChange);

    // 初始化时设置系统主题
    if (theme === 'system' || theme === undefined) {
      setTheme(systemThemeQuery.matches ? 'dark' : 'light');
    }

    return () => {
      systemThemeQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, setTheme]);

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-full shadow-lg border border-slate-200/60 dark:border-slate-700/60 hover:scale-110 hover:shadow-xl active:scale-95 transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      {/* 图标容器：太阳/月亮交叉淡入淡出 */}
      <span className="relative flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6">
        <Sun
          className={`absolute text-amber-500 transition-all duration-500 ease-out ${
            isDark ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          size={22}
          strokeWidth={2.2}
        />
        <Moon
          className={`absolute text-indigo-400 transition-all duration-500 ease-out ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
          size={20}
          strokeWidth={2.2}
        />
      </span>
    </button>
  );
}

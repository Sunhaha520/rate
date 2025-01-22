'use client'; // 标记为客户端组件

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // 如果 theme 为 undefined，默认显示 ☀️
  const currentTheme = theme === 'dark' ? '🌙' : '☀️';

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 p-3 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-lg rounded-full shadow-lg border border-gray-300/20 dark:border-gray-600/20 hover:bg-gray-300/50 dark:hover:bg-gray-600/50 transition-colors duration-300"
      aria-label="Toggle dark mode"
    >
      <span className="text-xl">{currentTheme}</span>
    </button>
  );
}
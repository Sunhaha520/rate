'use client'; // 标记为客户端组件

import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // 如果 theme 为 undefined，默认显示 ☀️
  const currentTheme = theme === 'dark' ? '🌙' : '☀️';

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-4 right-4 p-3 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg"
      aria-label="Toggle dark mode"
    >
      {currentTheme}
    </button>
  );
}
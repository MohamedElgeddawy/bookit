'use client';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '@/context/themeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        aria-label="Loading theme toggle"
      >
        <div className="h-5 w-5 animate-pulse bg-gray-300 rounded"></div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
    >
      {theme === 'dark' ? (
        <FaSun className="h-5 w-5" />
      ) : (
        <FaMoon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;

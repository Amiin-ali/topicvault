"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon
          size={18}
          className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
        />
      ) : (
        <Sun
          size={18}
          className="text-gray-600 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
        />
      )}
    </button>
  )
}

export default ThemeToggle

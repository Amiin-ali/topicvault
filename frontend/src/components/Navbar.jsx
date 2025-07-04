"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, Search, Home } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/siu-logo.png" alt="SIU Logo" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">TopicVault</span>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium hidden sm:block">
                  Somali International University
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/5 dark:hover:bg-blue-400/5"
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/search")
                  ? "bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/5 dark:hover:bg-blue-400/5"
              }`}
            >
              <Search size={18} />
              <span>Search Topics</span>
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/5 dark:hover:bg-blue-400/5"
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/search"
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive("/search")
                  ? "bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/5 dark:hover:bg-blue-400/5"
              }`}
            >
              <Search size={18} />
              <span>Search Topics</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}


export default Navbar

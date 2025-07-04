"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronDown, Check, X } from "lucide-react"

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Search or select...",
  allowCustom = false,
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option)
    setSearchTerm("")
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  // Handle custom input (when allowCustom is true)
  const handleCustomInput = () => {
    if (allowCustom && searchTerm.trim() && !options.includes(searchTerm.trim())) {
      onChange(searchTerm.trim())
      setSearchTerm("")
      setIsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev))
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        }
        break
      case "Enter":
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(filteredOptions[highlightedIndex])
        } else if (allowCustom && searchTerm.trim()) {
          handleCustomInput()
        }
        break
      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        setSearchTerm("")
        break
      case "Tab":
        if (isOpen) {
          setIsOpen(false)
          setHighlightedIndex(-1)
        }
        break
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    setIsOpen(true)
    setHighlightedIndex(-1)
  }

  // Handle input focus
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true)
    }
  }

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation()
    onChange("")
    setSearchTerm("")
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm || (isOpen ? "" : value)}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-12 pr-12 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {value && !disabled && (
            <button onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors" type="button">
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="py-2">
              {filteredOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50/80 transition-colors flex items-center justify-between ${
                    index === highlightedIndex ? "bg-blue-50/80" : ""
                  } ${value === option ? "bg-blue-100/80 text-blue-700" : "text-gray-900"}`}
                >
                  <span className="truncate">{option}</span>
                  {value === option && <Check size={16} className="text-blue-600 ml-2 flex-shrink-0" />}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-4 px-4 text-gray-500 text-center">
              {searchTerm ? (
                <div>
                  <p>No matches found</p>
                  {allowCustom && (
                    <button
                      type="button"
                      onClick={handleCustomInput}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Add "{searchTerm}"
                    </button>
                  )}
                </div>
              ) : (
                "No options available"
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchableSelect

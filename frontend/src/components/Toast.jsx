"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"

const Toast = ({ message, type = "info", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-500 border-green-600"
      case "error":
        return "bg-red-500 border-red-600"
      case "warning":
        return "bg-orange-500 border-orange-600"
      default:
        return "bg-blue-500 border-blue-600"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />
      case "error":
        return <AlertCircle size={20} />
      case "warning":
        return <AlertCircle size={20} />
      default:
        return <Info size={20} />
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-up">
      <div className={`${getToastStyles()} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 max-w-md min-w-80`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1">
              <p className="text-sm font-medium leading-relaxed">{message}</p>
            </div>
          </div>
          <button onClick={onClose} className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast

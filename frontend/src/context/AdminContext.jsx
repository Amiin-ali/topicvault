"use client"

import { createContext, useState, useEffect } from "react"

export const AdminContext = createContext()

export const AdminProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if admin is logged in from localStorage
    const adminLoggedIn = localStorage.getItem("adminLoggedIn")
    if (adminLoggedIn === "true") {
      setIsLoggedIn(true)
    }
  }, [])

  const login = () => {
    setIsLoggedIn(true)
    localStorage.setItem("adminLoggedIn", "true")
  }

  const logout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("adminLoggedIn")
  }

  return <AdminContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AdminContext.Provider>
}

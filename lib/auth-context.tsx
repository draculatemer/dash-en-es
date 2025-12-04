"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  photo: string
}

interface AuthContextType {
  user: User | null
  language: "en" | "es"
  setLanguage: (lang: "en" | "es") => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [language, setLanguageState] = useState<"en" | "es">("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Mock user data from localStorage
    const storedUser = localStorage.getItem("dashboardUser")
    const storedLanguage = (localStorage.getItem("language") as "en" | "es") || "en"

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Default mock user
      const mockUser: User = {
        id: "1",
        username: "John Doe",
        email: "john@example.com",
        photo: "/diverse-user-avatars.png",
      }
      setUser(mockUser)
      localStorage.setItem("dashboardUser", JSON.stringify(mockUser))
    }

    setLanguageState(storedLanguage)
    setIsLoaded(true)
  }, [])

  const setLanguage = (lang: "en" | "es") => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const logout = () => {
    localStorage.removeItem("dashboardUser")
    setUser(null)
  }

  if (!isLoaded) return <>{children}</>

  return <AuthContext.Provider value={{ user, language, setLanguage, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

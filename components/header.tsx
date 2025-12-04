"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import { Menu, LogOut, Settings, Globe } from "lucide-react"
import Image from "next/image"

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, language, setLanguage, logout } = useAuth()
  const t = translations[language]
  const [showMenu, setShowMenu] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuToggle} className="p-2 hover:bg-secondary rounded-md transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">{t.dashboard}</h1>
        </div>

        {/* Right side - User menu and Language */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguage(!showLanguage)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-md transition-colors"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium uppercase">{language}</span>
            </button>
            {showLanguage && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setLanguage("en")
                    setShowLanguage(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-secondary ${
                    language === "en" ? "bg-secondary" : ""
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage("es")
                    setShowLanguage(false)
                  }}
                  className={`block w-full text-left px-4 py-2 hover:bg-secondary ${
                    language === "es" ? "bg-secondary" : ""
                  }`}
                >
                  Español
                </button>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center gap-3 border-l border-border pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors"
            >
              <Image
                src={user?.photo || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                alt="User avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </button>

            {/* User Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-16 w-48 bg-white border border-border rounded-md shadow-lg z-50">
                <a href="#" className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary">
                  <Settings className="w-4 h-4" />
                  {t.profile}
                </a>
                <a href="#" className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary">
                  <Settings className="w-4 h-4" />
                  {t.settings}
                </a>
                <button
                  onClick={() => {
                    logout()
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                  {t.logout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

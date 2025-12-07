"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import { Menu, LogOut, Settings, Globe, ChevronDown } from "lucide-react"
import Image from "next/image"

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, language, setLanguage, logout } = useAuth()
  const t = translations[language]
  const [showMenu, setShowMenu] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-20">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 gap-4">
        {/* Left side - Menu button and Logo */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-secondary rounded-md transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">{t.dashboard}</h1>
        </div>

        {/* Right side - User menu and Language */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguage(!showLanguage)}
              className="flex items-center gap-1 px-2 md:px-3 py-2 hover:bg-secondary rounded-md transition-colors text-sm md:text-base flex-shrink-0"
              aria-label="Language selector"
            >
              <Globe className="w-4 md:w-5 h-4 md:h-5" />
              <span className="text-sm font-medium uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 hidden md:block" />
            </button>
            {showLanguage && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    setLanguage("en")
                    setShowLanguage(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-secondary ${
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
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-secondary ${
                    language === "es" ? "bg-secondary" : ""
                  }`}
                >
                  Español
                </button>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative flex items-center gap-2 md:gap-3 border-l border-border pl-2 md:pl-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-foreground truncate max-w-[100px]">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[100px]">{user?.email}</p>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors flex-shrink-0"
              aria-label="User menu"
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
              <div className="absolute right-0 top-14 w-48 bg-white border border-border rounded-md shadow-lg z-50">
                <a
                  href="#"
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  {t.profile}
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary text-sm"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="w-4 h-4" />
                  {t.settings}
                </a>
                <button
                  onClick={() => {
                    logout()
                    setShowMenu(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-secondary text-red-500 text-sm"
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

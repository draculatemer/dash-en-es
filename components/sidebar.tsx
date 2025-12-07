"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import {
  Instagram,
  MessageCircle,
  Heart,
  MessageSquare,
  Sigma as SMS,
  MapPin,
  Globe,
  ChevronRight,
  Lock,
  X,
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  activeTab: string
}

export default function Sidebar({ open, onToggle, activeTab }: SidebarProps) {
  const { language } = useAuth()
  const t = translations[language]

  const menuItems = [
    {
      id: "instagram",
      label: t.instagramScanner,
      icon: Instagram,
      path: "/dashboard/instagram",
      blocked: false,
    },
    {
      id: "whatsapp",
      label: t.whatsappScanner,
      icon: MessageCircle,
      path: "/dashboard/whatsapp",
      blocked: false,
    },
    {
      id: "dating",
      label: t.dateAppsScanner,
      icon: Heart,
      path: "/dashboard/dating",
      blocked: false,
    },
    {
      id: "messenger",
      label: t.messenger,
      icon: MessageSquare,
      path: "#",
      blocked: true,
    },
    {
      id: "sms",
      label: t.sms,
      icon: SMS,
      path: "#",
      blocked: true,
    },
    {
      id: "gps",
      label: t.gps,
      icon: MapPin,
      path: "#",
      blocked: true,
    },
    {
      id: "historical",
      label: t.historicalWeb,
      icon: Globe,
      path: "#",
      blocked: true,
    },
  ]

  return (
    <aside
      className={`w-64 md:w-64 bg-white border-r border-border transition-all duration-300 flex flex-col overflow-hidden md:relative ${
        open ? "relative" : ""
      }`}
    >
      {/* Logo/Brand Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <div className="text-2xl font-bold text-primary">Scanner</div>
        <button onClick={onToggle} className="md:hidden p-1 hover:bg-secondary rounded-md" aria-label="Close sidebar">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <div key={item.id}>
              {item.blocked ? (
                <button
                  disabled
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground opacity-50 cursor-not-allowed mb-2 transition-all text-sm md:text-sm"
                  title={t.featureUnavailable}
                >
                  <div className="relative flex-shrink-0">
                    <Icon className="w-5 h-5" />
                    <Lock className="w-3 h-3 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                </button>
              ) : (
                <Link
                  href={item.path}
                  onClick={onToggle}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all mb-2 text-sm md:text-sm ${
                    isActive ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
        <p>© 2025 Dashboard</p>
      </div>
    </aside>
  )
}

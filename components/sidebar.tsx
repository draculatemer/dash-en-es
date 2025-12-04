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
} from "lucide-react"

interface SidebarProps {
  open: boolean
  onToggle: () => void
  activeTab: string
}

export default function Sidebar({ open, activeTab }: SidebarProps) {
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
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r border-border transition-all duration-300 flex flex-col overflow-hidden`}
    >
      {/* Logo/Brand Area */}
      <div className="h-16 flex items-center justify-center border-b border-border">
        <div className="text-2xl font-bold text-primary">{open ? "Scanner" : "S"}</div>
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
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-muted-foreground opacity-50 cursor-not-allowed mb-2 transition-all"
                  title={t.featureUnavailable}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    <Lock className="w-3 h-3 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" />
                  </div>
                  {open && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all mb-2 ${
                    isActive ? "bg-primary text-white" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {open && (
                    <>
                      <span className="text-sm font-medium">{item.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </>
                  )}
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 text-center text-xs text-muted-foreground">
        {open && <p>© 2025 Dashboard</p>}
      </div>
    </aside>
  )
}

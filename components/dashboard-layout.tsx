"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import Header from "./header"
import Sidebar from "./sidebar"

export default function DashboardLayout({
  children,
  activeTab,
}: {
  children: React.ReactNode
  activeTab: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { language } = useAuth()
  const t = translations[language]

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div
        className={`${
          sidebarOpen ? "fixed inset-0 z-40 md:relative md:z-auto md:inset-auto" : "hidden md:flex"
        } md:flex flex-col`}
      >
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setSidebarOpen(false)} />
        )}
        <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} activeTab={activeTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

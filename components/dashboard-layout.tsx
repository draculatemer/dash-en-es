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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { language } = useAuth()
  const t = translations[language]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} activeTab={activeTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

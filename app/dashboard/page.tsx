"use client"

// 👇 1. ESTA LINHA É OBRIGATÓRIA PARA CORRIGIR O ERRO DE BUILD
export const dynamic = "force-dynamic"

import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import DashboardLayout from "@/components/dashboard-layout"
import { Activity, TrendingUp, Users, Zap } from "lucide-react"

export default function DashboardHome() {
  const { language } = useAuth()

  // 👇 2. Proteção contra falha no carregamento do idioma
  const currentLang = language || "en"
  const t = translations[currentLang] || translations["en"]

  const stats = [
    {
      icon: Activity,
      label: "Instagram Scans",
      value: "0",
      color: "text-pink-600",
    },
    {
      icon: Users,
      label: "WhatsApp Profiles",
      value: "0",
      color: "text-green-600",
    },
    {
      icon: Zap,
      label: "Dating Profiles",
      value: "0",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Total Scanned",
      value: "0",
      color: "text-blue-600",
    },
  ]

  return (
    <DashboardLayout activeTab="">
      <div className="space-y-4 md:space-y-6">
        <div>
          {/* 👇 3. Uso do operador ?. para evitar crash se 't' for undefined */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t?.welcome}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">{t?.selectFeature}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg border border-border shadow-sm p-4 md:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 md:w-10 h-8 md:h-10 ${stat.color} opacity-20 flex-shrink-0`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Start Scanning</h2>
          <p className="text-sm md:text-base opacity-90">
            Select a scanner from the sidebar to begin analyzing profiles. Each scanner provides detailed insights and
            information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

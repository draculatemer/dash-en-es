"use client"

// 1. Add this line to disable static prerendering for the dashboard
export const dynamic = "force-dynamic";

import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import DashboardLayout from "@/components/dashboard-layout"
import { Activity, TrendingUp, Users, Zap } from "lucide-react"

export default function DashboardHome() {
  const { language } = useAuth()
  
  // Safety check: Fallback to 'en' if language isn't loaded yet to prevent crashes
  const t = translations[language || 'en'] 

  const stats = [
    {
      icon: Activity,
      label: "Instagram Scans",
      value: "24",
      color: "text-pink-600",
    },
    {
      icon: Users,
      label: "WhatsApp Profiles",
      value: "18",
      color: "text-green-600",
    },
    {
      icon: Zap,
      label: "Dating Profiles",
      value: "12",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Total Scanned",
      value: "54",
      color: "text-blue-600",
    },
  ]

  return (
    <DashboardLayout activeTab="">
      <div className="space-y-6">
        <div>
          {/* Add optional chaining (?) just in case t is undefined momentarily */}
          <h1 className="text-3xl font-bold text-foreground">{t?.welcome}</h1>
          <p className="text-muted-foreground mt-2">{t?.selectFeature}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg border border-border shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`w-10 h-10 ${stat.color} opacity-20`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Start Scanning</h2>
          <p className="opacity-90">
            Select a scanner from the sidebar to begin analyzing profiles. Each scanner provides detailed insights and
            information.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}

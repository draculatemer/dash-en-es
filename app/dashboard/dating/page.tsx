"use client"

import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import BlockedFeature from "@/components/blocked-feature"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"

export default function DatingAppScannerPage() {
  const { language } = useAuth()
  const t = translations[language]

  return (
    <DashboardLayout activeTab="dating">
      <div className="space-y-6">
        <FeatureCard title={t.dateAppsScannerTitle} description={t.dateAppsScannerDesc}>
          <BlockedFeature />
        </FeatureCard>

        {/* Info Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="text-purple-600 flex-shrink-0 text-2xl">❤️</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Dating Apps Scanner Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                This feature will scan across multiple dating platforms including Tinder, Bumble, Hinge, and others. It
                will identify active profiles and provide detailed match information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import BlockedFeature from "@/components/blocked-feature"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"

export default function WhatsAppScannerPage() {
  const { language } = useAuth()
  const t = translations[language]

  return (
    <DashboardLayout activeTab="whatsapp">
      <div className="space-y-6">
        <FeatureCard title={t.whatsappScannerTitle} description={t.whatsappScannerDesc}>
          <BlockedFeature />
        </FeatureCard>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="text-blue-600 flex-shrink-0 text-2xl">💬</div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">WhatsApp Scanner Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                This feature will allow you to analyze WhatsApp chat patterns, message frequency, and user activity.
                More details will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

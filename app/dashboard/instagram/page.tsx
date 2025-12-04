"use client"

import { useState, useRef, useEffect } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import FeatureCard from "@/components/feature-card"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/translations"
import { Input } from "@/components/ui/input"
import { User, Instagram } from "lucide-react"

export const dynamic = "force-dynamic"

export default function InstagramScannerPage() {
  const { language } = useAuth()
  const t = translations[language]
  const [instagramHandle, setInstagramHandle] = useState("")
  const [profileData, setProfileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const sanitizeUsername = (username: string): string => {
    let u = (username || "").trim()
    if (u.startsWith("@")) u = u.slice(1)
    u = u.toLowerCase()
    return u.replace(/[^a-z0-9._]/g, "")
  }

  const handleInstagramChange = (value: string) => {
    setInstagramHandle(value)
    const sanitizedUser = sanitizeUsername(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    setError("")
    setProfileData(null)

    if (sanitizedUser.length < 3) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch("/api/instagram/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: sanitizedUser }),
        })
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Profile not found or private.")
        }

        setProfileData(result.profile)
      } catch (err: any) {
        setError(err.message)
        setProfileData(null)
      } finally {
        setIsLoading(false)
      }
    }, 1200)
  }

  useEffect(
    () => () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    },
    [],
  )

  return (
    <DashboardLayout activeTab="instagram">
      <div className="space-y-6">
        <FeatureCard title={t.instagramScannerTitle} description={t.instagramScannerDesc}>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Enter Instagram username"
                className="pl-12"
                value={instagramHandle}
                onChange={(e) => handleInstagramChange(e.target.value)}
              />
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-400 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                    <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {!isLoading && error && <p className="text-red-600 font-semibold p-4 bg-red-50 rounded-lg">{error}</p>}

            {/* Profile Card */}
            {!isLoading && profileData && (
              <div className="p-4 rounded-lg border-2 border-green-500/50 bg-green-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {profileData.profile_pic_url && (
                      <img
                        src={profileData.profile_pic_url || "/placeholder.svg"}
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-green-700 font-bold text-sm">Instagram Profile</p>
                      <p className="font-bold text-lg text-foreground">@{profileData.username}</p>
                      <p className="text-muted-foreground text-sm">
                        {profileData.media_count} posts • {profileData.follower_count} followers
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full border-2 border-green-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                {profileData.biography && (
                  <div className="border-t border-green-200 mt-3 pt-3">
                    <p className="text-muted-foreground text-sm">{profileData.biography}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </FeatureCard>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex gap-4">
            <Instagram className="text-blue-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-foreground mb-1">How Instagram Scanner Works</h3>
              <p className="text-sm text-muted-foreground">
                Enter any public Instagram username to retrieve profile information including follower count, post
                count, bio, and profile picture. The scanner uses the Instagram API to gather publicly available data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

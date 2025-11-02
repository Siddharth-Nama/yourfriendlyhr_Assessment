"use client"

import { useState, useEffect } from "react"
import { UserProfileForm } from "@/components/user-profile-form"
import { PlanDisplay } from "@/components/plan-display"
import { HomeHeader } from "@/components/home-header"
import { GalaxyBackground } from "@/components/galaxy-background"

export default function Home() {
  const [userProfile, setUserProfile] = useState(null)
  const [showPlan, setShowPlan] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleProfileSubmit = (profile: any) => {
    setUserProfile(profile)
    setShowPlan(true)
  }

  if (!isHydrated) {
    return null
  }

  if (showPlan && userProfile) {
    return <PlanDisplay profile={userProfile} onBack={() => setShowPlan(false)} />
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <GalaxyBackground />

      {/* Content overlay */}
      <div className="relative z-10 max-w-2xl mx-auto p-4 md:p-8 min-h-screen flex flex-col justify-center">
        <HomeHeader />
        <UserProfileForm onSubmit={handleProfileSubmit} />
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { DashboardStatCards } from "@/components/dashboard/dashboard-stat-cards"
import { AdaptiveEngineChart } from "@/components/dashboard/adaptive-engine-chart"
import { DevelopmentalProgressChart } from "@/components/dashboard/developmental-progress-chart"
import { ActivityPerformanceAlerts } from "@/components/dashboard/activity-performance-alerts"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        // Not logged in, redirect to login
        window.location.href = "/login"
        return
      }

      const role = session.user?.user_metadata?.role
      if (role !== "admin") {
        // Not an admin, sign out and redirect to login
        await supabase.auth.signOut()
        window.location.href = "/login"
        return
      }

      setUser(session.user)
      setLoading(false)
    }

    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getDisplayName = () => {
    const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || "Admin"
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        <p className="text-lg font-medium" style={{ color: "#4B5161" }}>Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {getFormattedDate()}
        </span>
        <h1 className="text-2xl font-bold md:text-3xl font-fredoka mt-1" style={{ color: "#4B5161" }}>
          {getGreeting()}, {getDisplayName()}!
        </h1>
      </div>

      {/* 4 Stat Cards */}
      <DashboardStatCards />

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        <div className="lg:col-span-1">
          <AdaptiveEngineChart />
        </div>
        <div className="lg:col-span-2">
          <DevelopmentalProgressChart />
        </div>
      </div>

      {/* Activity Performance Alerts Table */}
      <ActivityPerformanceAlerts />
    </div>
  )
}

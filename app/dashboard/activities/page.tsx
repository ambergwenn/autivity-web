"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import { ActivityCards } from "@/components/dashboard/activities/activity-cards"
import { ActivityCategoryDonut } from "@/components/dashboard/activities/activity-category-donut"
import { ActivityMostAssigned } from "@/components/dashboard/activities/activity-most-assigned"
import { ActivityTable } from "@/components/dashboard/activities/activity-table"

export default function ActivitiesPage() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                window.location.href = "/login"
                return
            }

            const role = session.user?.user_metadata?.role
            if (role !== "admin") {
                await supabase.auth.signOut()
                window.location.href = "/login"
                return
            }

            setUser(session.user)
            setLoading(false)
        }

        checkUser()
    }, [])

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
                <p className="text-lg font-medium" style={{ color: "#4B5161" }}>Loading Activities...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl font-fredoka" style={{ color: "#4B5161" }}>
                        Activities
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                        Manage activities
                    </p>
                </div>
            </div>

            {/* Activity Stat KPI Cards */}
            <ActivityCards />

            {/* Activity Charts Section */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
                <div className="lg:col-span-1">
                    <ActivityCategoryDonut />
                </div>
                <div className="lg:col-span-2">
                    <ActivityMostAssigned />
                </div>
            </div>

            {/* Activities Table Section */}
            <ActivityTable />
        </div>
    )
}

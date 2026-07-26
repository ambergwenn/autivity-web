"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { ClassCards } from "@/components/dashboard/classes/class-cards"
import { ClassKpiCards } from "@/components/dashboard/classes/class-kpi-cards"
import { ClassCreateDialog } from "@/components/dashboard/classes/class-create"

export default function ClassPage() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)

    // State for Add New Class modal & automatic grid refresh
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

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
                <p className="text-lg font-medium" style={{ color: "#4B5161" }}>Loading Classes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl font-fredoka" style={{ color: "#4B5161" }}>
                        Class Management
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                        Manage and create classes
                    </p>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="bg-[#62A9E6] hover:bg-[#5299D6] text-white font-bold rounded-xl px-4 py-2.5 text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
                >
                    <Plus className="size-4" />
                    <span>Add New Class</span>
                </Button>
            </div>

            {/* Class KPI Summary Cards */}
            <ClassKpiCards refreshTrigger={refreshTrigger} />

            {/* Class Cards Grid & Toolbar */}
            <ClassCards refreshTrigger={refreshTrigger} />

            {/* Add New Class Dialog */}
            <ClassCreateDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreated={() => setRefreshTrigger((prev) => prev + 1)}
            />
        </div>
    )
}

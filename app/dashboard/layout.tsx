import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import DashboardLayoutClient from "./dashboard-layout-client"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    // Fetch current user and session via getUser()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect("/login")
    }

    // Role check: Only allow users with the 'admin' role
    let role = user.user_metadata?.role

    if (role !== "admin") {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
        
        role = profile?.role
    }

    if (role !== "admin") {
        // Log out the session cleanly
        await supabase.auth.signOut()
        redirect("/login?error=unauthorized")
    }

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
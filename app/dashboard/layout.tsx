"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/dashboard/sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const getHeaderTitle = () => {
        if (pathname.startsWith("/dashboard/user")) return "Users"
        if (pathname.startsWith("/dashboard/class")) return "Classes"
        if (pathname.startsWith("/dashboard/activities")) return "Content"
        if (pathname.startsWith("/dashboard/content")) return "Content"
        if (pathname.startsWith("/dashboard/admin")) return "Admins"
        if (pathname.startsWith("/dashboard/profile")) return "Profile"
        return "Dashboard"
    }

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4">
                    <SidebarTrigger className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors" />
                    <Separator orientation="vertical" className="h-5 bg-slate-200" />
                    <span className="font-quicksand text-sm text-slate-500">
                        {getHeaderTitle()}
                    </span>
                </header>

                <main className="flex-1 bg-[#F5F7FA] p-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
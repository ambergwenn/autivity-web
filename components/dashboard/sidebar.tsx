"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarSeparator,
} from "@/components/ui/sidebar"

import {
    LayoutDashboard,
    Users,
    BarChart3,
    BookOpen,
    Settings,
    ShieldCheck,
    Bell,
    Puzzle,
} from "lucide-react"

import { NavUser } from "../nav-user"
import { cn } from "@/lib/utils"

const navItems = [
    {
        label: "Overview",
        items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
        ],
    },
    {
        label: "Management",
        items: [
            { title: "Users", href: "/dashboard/user", icon: Users },
            { title: "Classes", href: "/dashboard/class", icon: BookOpen },
            { title: "Content", href: "/dashboard/activities", icon: Puzzle },
        ],
    },
    {
        label: "System",
        items: [
            { title: "Admins", href: "/dashboard/admins", icon: ShieldCheck },
        ],
    },
]

export function AppSidebar() {
    const pathname = usePathname()
    const [hoveredHref, setHoveredHref] = useState<string | null>(null)

    return (
        <Sidebar collapsible="icon">
            {/* Header — Logo */}
            <SidebarHeader className="px-3 py-4 border-b border-sidebar-border group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-3">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center"
                >
                    <Image
                        src="/images/logo.svg"
                        alt="Autivity"
                        width={40}
                        height={40}
                        className="shrink-0 size-10 object-contain group-data-[collapsible=icon]:size-10"
                    />
                    <Image
                        src="/images/text-logo.svg"
                        alt="Autivity"
                        width={96}
                        height={26}
                        className="shrink-0 group-data-[collapsible=icon]:hidden"
                    />
                </Link>
            </SidebarHeader>

            {/* Nav Groups */}
            <SidebarContent
                className="px-2.5 py-3 group-data-[collapsible=icon]:px-2"
                onMouseLeave={() => setHoveredHref(null)}
            >
                {navItems.map((group) => (
                    <SidebarGroup key={group.label} className="group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:my-1.5">
                        <SidebarGroupLabel className="font-quicksand text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-2 mb-1 group-data-[collapsible=icon]:hidden">
                            {group.label}
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive =
                                        item.href === "/dashboard"
                                            ? pathname === "/dashboard"
                                            : pathname.startsWith(item.href)

                                    const isHovered = hoveredHref === item.href

                                    return (
                                        <SidebarMenuItem
                                            key={item.href}
                                            className="relative"
                                            onMouseEnter={() => setHoveredHref(item.href)}
                                        >
                                            {isHovered && (
                                                <motion.div
                                                    layoutId="sidebar-hover-pill"
                                                    className="absolute inset-0 rounded-xl bg-slate-100/90 pointer-events-none z-0"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                    }}
                                                />
                                            )}
                                            <SidebarMenuButton
                                                render={<Link href={item.href} />}
                                                isActive={isActive}
                                                size="lg"
                                                tooltip={item.title}
                                                className={cn(
                                                    "relative z-10 group/item transition-colors duration-150 ease-in-out",
                                                    isActive
                                                        ? "bg-[#62A9E6]/10 text-[#4B8AC9] font-semibold rounded-xl border border-[#62A9E6]/20 group-data-[collapsible=icon]:justify-center"
                                                        : "text-slate-600 hover:text-slate-900 rounded-xl group-data-[collapsible=icon]:justify-center"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "size-5 shrink-0 transition-transform duration-150 ease-in-out group-hover/item:translate-x-1 group-data-[collapsible=icon]:group-hover/item:translate-x-0",
                                                        isActive
                                                            ? "text-[#62A9E6]"
                                                            : "text-slate-400 group-hover/item:text-slate-700"
                                                    )}
                                                />
                                                <span className="font-quicksand text-sm inline-block transition-transform duration-150 ease-in-out group-hover/item:translate-x-1 group-data-[collapsible=icon]:hidden">
                                                    {item.title}
                                                </span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarSeparator />

            {/* Footer — User */}
            <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <NavUser
                    name="Admin"
                    email="admin@autivity.com"
                />
            </SidebarFooter>
        </Sidebar>
    )
}
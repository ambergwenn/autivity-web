"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
    ChevronsUpDown,
    LogOut,
    Settings,
    User,
} from "lucide-react"

type NavUserProps = {
    name: string
    email: string
    avatar?: string
}

export function NavUser({
    name,
    email,
    avatar,
}: NavUserProps) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="group/user w-full h-auto min-h-12 py-2.5 px-3 rounded-xl text-slate-700 hover:bg-slate-100 data-[state=open]:bg-slate-100 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center transition-all duration-150 ease-in-out"
                            />
                        }
                    >
                        <Avatar className="h-9 w-9 shrink-0 rounded-lg group-data-[collapsible=icon]:size-9 transition-transform duration-150 ease-in-out group-hover/user:translate-x-0.5">
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="rounded-lg bg-[#62A9E6]/20 text-[#4B8AC9] font-semibold font-fredoka">
                                {name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-1 flex-col text-left leading-tight group-data-[collapsible=icon]:hidden min-w-0 pr-1 transition-transform duration-150 ease-in-out group-hover/user:translate-x-1">
                            <span className="truncate font-semibold text-sm font-quicksand text-slate-800">
                                {name}
                            </span>
                            <span className="truncate text-xs text-slate-500 font-quicksand">
                                {email}
                            </span>
                        </div>

                        <ChevronsUpDown className="ml-auto size-4 text-slate-400 shrink-0 group-data-[collapsible=icon]:hidden transition-transform duration-150 ease-in-out group-hover/user:translate-x-0.5" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        side="top"
                        align="start"
                        sideOffset={8}
                        className="min-w-[220px] rounded-xl border border-slate-200 bg-white shadow-lg p-1"
                    >
                        {/* User info header */}
                        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
                            <Avatar className="h-9 w-9 rounded-lg">
                                <AvatarImage src={avatar} />
                                <AvatarFallback className="rounded-lg bg-[#62A9E6]/20 text-[#4B8AC9] font-semibold font-fredoka">
                                    {name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight min-w-0">
                                <span className="font-semibold text-sm text-slate-800 font-quicksand truncate">
                                    {name}
                                </span>
                                <span className="text-xs text-slate-500 font-quicksand truncate">
                                    {email}
                                </span>
                            </div>
                        </div>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 text-sm font-quicksand text-slate-700 cursor-pointer group/item transition-colors duration-150">
                            <User className="size-4 text-slate-400 transition-transform duration-150 group-hover/item:translate-x-0.5" />
                            <span className="transition-transform duration-150 inline-block group-hover/item:translate-x-1">Profile</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 text-sm font-quicksand text-slate-700 cursor-pointer group/item transition-colors duration-150">
                            <Settings className="size-4 text-slate-400 transition-transform duration-150 group-hover/item:translate-x-0.5" />
                            <span className="transition-transform duration-150 inline-block group-hover/item:translate-x-1">Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="gap-2 rounded-lg px-3 py-2 text-sm font-quicksand text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700 group/item transition-colors duration-150">
                            <LogOut className="size-4 transition-transform duration-150 group-hover/item:translate-x-0.5" />
                            <span className="transition-transform duration-150 inline-block group-hover/item:translate-x-1">Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
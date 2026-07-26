"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    GraduationCap,
    UserCheck,
    Clock,
    HeartHandshake,
    ShieldAlert,
    UserX,
} from "lucide-react";
import { getUserKPIs, type UserKPIStats } from "@/lib/queries/users";

export interface UserStatCardsProps {
    stats?: {
        totalUsers?: number;
        teachers?: number;
        parents?: number;
        pendingApprovals?: number;
        students?: number;
        inactiveTeachers?: number;
        inactiveParents?: number;
    };
}

export function UserStatCards({ stats }: UserStatCardsProps) {
    const [liveStats, setLiveStats] = useState<UserKPIStats | null>(null);

    useEffect(() => {
        async function loadUserStats() {
            const data = await getUserKPIs();
            setLiveStats(data);
        }

        loadUserStats();
    }, []);

    const data = {
        totalUsers: liveStats ? liveStats.totalUsers : (stats?.totalUsers ?? 0),
        teachers: liveStats ? liveStats.teachers : (stats?.teachers ?? 0),
        parents: liveStats ? liveStats.parents : (stats?.parents ?? 0),
        pendingApprovals: liveStats ? liveStats.pendingApprovals : (stats?.pendingApprovals ?? 0),
        students: liveStats ? liveStats.students : (stats?.students ?? 0),
        inactiveTeachers: (liveStats as unknown as { inactiveTeachers?: number })?.inactiveTeachers ?? (stats?.inactiveTeachers ?? 0),
        inactiveParents: (liveStats as unknown as { inactiveParents?: number })?.inactiveParents ?? (stats?.inactiveParents ?? 0),
    };

    const cardItems = [
        {
            id: "total-users",
            title: "Total Registered Users",
            mainMetric: data.totalUsers.toLocaleString(),
            icon: Users,
            bgColor: "bg-[#62A9E6]",
            borderColor: "border-[#62A9E6]",
            textColor: "text-[#62A9E6]",
            iconBg: "bg-[#62A9E6]/10",
            upperBg: "bg-[#F0F7FD]",
            shadowColor: "hover:shadow-[#62A9E6]/25",
            rotateHover: "-1deg",
            content: (
                <div className="flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1 rounded-xl bg-white/20 px-2 py-1 text-xs font-bold text-white border border-white/25 shadow-2xs">
                        <GraduationCap className="size-3" />
                        <span>{data.teachers} Teachers</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-xl bg-white/20 px-2 py-1 text-xs font-bold text-white border border-white/25 shadow-2xs">
                        <Users className="size-3" />
                        <span>{data.parents} Parents</span>
                    </div>
                    <div className="flex items-center gap-1 rounded-xl bg-white/20 px-2 py-1 text-xs font-bold text-white border border-white/25 shadow-2xs">
                        <UserCheck className="size-3" />
                        <span>{data.students} Students</span>
                    </div>
                </div>
            ),
        },
        {
            id: "active-teachers",
            title: "Active Teachers",
            mainMetric: data.teachers.toLocaleString(),
            icon: GraduationCap,
            bgColor: "bg-[#E8B00C]",
            borderColor: "border-[#E8B00C]",
            textColor: "text-[#E8B00C]",
            iconBg: "bg-[#E8B00C]/10",
            upperBg: "bg-[#FEFCE8]",
            shadowColor: "hover:shadow-[#E8B00C]/25",
            rotateHover: "1deg",
            content: (
                <div className="flex items-center justify-between text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <UserX className="size-3.5" />
                        <span>{data.inactiveTeachers} Inactive Teachers</span>
                    </div>
                </div>
            ),
        },
        {
            id: "active-parents",
            title: "Active Parents",
            mainMetric: data.parents.toLocaleString(),
            icon: HeartHandshake,
            bgColor: "bg-[#ED529B]",
            borderColor: "border-[#ED529B]",
            textColor: "text-[#ED529B]",
            iconBg: "bg-[#ED529B]/10",
            upperBg: "bg-[#FFF3F8]",
            shadowColor: "hover:shadow-[#ED529B]/25",
            rotateHover: "-1deg",
            content: (
                <div className="flex items-center justify-between text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <UserX className="size-3.5" />
                        <span>{data.inactiveParents} Inactive Parents</span>
                    </div>
                </div>
            ),
        },
        {
            id: "pending-verification",
            title: "Pending Verification",
            mainMetric: data.pendingApprovals.toLocaleString(),
            icon: Clock,
            bgColor: "bg-[#AD99E6]",
            borderColor: "border-[#AD99E6]",
            textColor: "text-[#AD99E6]",
            iconBg: "bg-[#AD99E6]/25",
            upperBg: "bg-[#F5F2FC]",
            shadowColor: "hover:shadow-[#AD99E6]/25",
            rotateHover: "1deg",
            content: (
                <div className="flex items-center justify-between text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <ShieldAlert className="size-3.5" />
                        <span>{data.pendingApprovals > 0 ? "Signups awaiting verification" : "All accounts verified"}</span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cardItems.map((card, index) => {
                const IconComponent = card.icon;

                return (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        whileHover={{ scale: 1.03, rotate: card.rotateHover }}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-[3px] ${card.borderColor} ${card.upperBg || "bg-white"} shadow-sm transition-colors duration-300 hover:shadow-xl ${card.shadowColor} cursor-pointer min-h-[240px]`}
                    >
                        {/* Top Section */}
                        <div className={`p-6 flex flex-col justify-between flex-1 ${card.upperBg || "bg-white"}`}>
                            {/* Icon */}
                            <div className="mb-3">
                                <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${card.iconBg} ${card.textColor}`}>
                                    <IconComponent className="size-6" />
                                </div>
                            </div>

                            {/* Main Metric */}
                            <div className={`text-4xl font-extrabold tracking-[0.06em] font-fredoka ${card.textColor}`}>
                                {card.mainMetric}
                            </div>

                            {/* Card Title */}
                            <h3 className={`mt-1 text-lg font-bold font-fredoka ${card.textColor}`}>
                                {card.title}
                            </h3>
                        </div>

                        {/* Bottom Section */}
                        <div className={`${card.bgColor} p-4 text-white flex flex-col justify-center min-h-[76px]`}>
                            {card.content}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default UserStatCards;

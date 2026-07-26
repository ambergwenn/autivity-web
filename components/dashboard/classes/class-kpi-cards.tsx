"use client";

import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Archive, TrendingUp, Clock } from "lucide-react";
import { getClassKpiStats, type ClassKpiStatsData } from "@/lib/queries/classes";

export interface ClassKpiCardsProps {
    refreshTrigger?: number;
    initialStats?: ClassKpiStatsData;
}

export function ClassKpiCards({ refreshTrigger = 0, initialStats }: ClassKpiCardsProps) {
    const [stats, setStats] = React.useState<ClassKpiStatsData>(initialStats || {
        activeClassesCount: 0,
        archivedClassesCount: 0,
        activeClassesThisMonth: 0,
        archivedClassesThisMonth: 0,
    });
    const [loading, setLoading] = React.useState<boolean>(!initialStats);

    React.useEffect(() => {
        let isMounted = true;
        async function loadStats() {
            setLoading(true);
            const dbStats = await getClassKpiStats();
            if (isMounted) {
                setStats(dbStats);
                setLoading(false);
            }
        }
        loadStats();
        return () => {
            isMounted = false;
        };
    }, [refreshTrigger]);

    const cardItems = [
        {
            id: "active-classes",
            title: "Active Classes",
            mainMetric: loading ? "..." : stats.activeClassesCount.toLocaleString(),
            icon: GraduationCap,
            bgColor: "bg-[#62A9E6]",
            borderColor: "border-[#62A9E6]",
            textColor: "text-[#62A9E6]",
            iconBg: "bg-[#62A9E6]/10",
            upperBg: "bg-[#F0F7FD]",
            shadowColor: "hover:shadow-[#62A9E6]/25",
            rotateHover: "-1deg",
            content: (
                <div className="flex items-center text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <TrendingUp className="size-3.5" />
                        <span>
                            {loading ? "..." : `+${stats.activeClassesThisMonth} this month`}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "archived-classes",
            title: "Archived Classes",
            mainMetric: loading ? "..." : stats.archivedClassesCount.toLocaleString(),
            icon: Archive,
            bgColor: "bg-[#94A3B8]",
            borderColor: "border-[#94A3B8]",
            textColor: "text-[#64748B]",
            iconBg: "bg-slate-100",
            upperBg: "bg-slate-50/80",
            shadowColor: "hover:shadow-slate-300/40",
            rotateHover: "1deg",
            content: (
                <div className="flex items-center text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <Clock className="size-3.5" />
                        <span>
                            {loading ? "..." : `+${stats.archivedClassesThisMonth} this month`}
                        </span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {cardItems.map((card, index) => {
                const IconComponent = card.icon;

                return (
                    <motion.div
                        key={card.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        whileHover={{ scale: 1.02, rotate: card.rotateHover }}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-[3px] ${card.borderColor} ${card.upperBg || "bg-white"} shadow-sm transition-all duration-300 hover:shadow-xl ${card.shadowColor} cursor-pointer min-h-[220px]`}
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
                            <div className="text-4xl font-extrabold tracking-[0.06em] font-fredoka style={{ color: '#4B5161' }}">
                                <span className={card.textColor}>{card.mainMetric}</span>
                            </div>

                            {/* Card Title */}
                            <h3 className={`mt-1 text-lg font-bold font-fredoka ${card.textColor}`}>
                                {card.title}
                            </h3>
                        </div>

                        {/* Bottom Section */}
                        <div className={`${card.bgColor} p-4 text-white flex flex-col justify-center min-h-[70px]`}>
                            {card.content}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export default ClassKpiCards;

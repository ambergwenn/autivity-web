"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Puzzle,
    Sparkles,
    TrendingUp,
    User,
} from "lucide-react";

import { getActivityCardStats, type ActivityCardStatsData } from "@/lib/queries/activities";

export interface ActivityCardsProps {
    initialStats?: ActivityCardStatsData;
}

export function ActivityCards({ initialStats }: ActivityCardsProps) {
    const [stats, setStats] = React.useState<ActivityCardStatsData>(initialStats || {
        totalActivities: 0,
        activitiesCreatedThisMonth: 0,
        mostAssignedCategory: "",
        assignedStudentsCountForTopCategory: 0,
    });
    const [loading, setLoading] = React.useState<boolean>(!initialStats);

    React.useEffect(() => {
        let isMounted = true;
        async function loadStats() {
            setLoading(true);
            const dbStats = await getActivityCardStats();
            if (isMounted) {
                setStats(dbStats);
                setLoading(false);
            }
        }
        loadStats();
        return () => {
            isMounted = false;
        };
    }, []);

    const cardItems = [
        {
            id: "total-activities",
            title: "Total Activities",
            mainMetric: loading ? "..." : stats.totalActivities.toLocaleString(),
            isTextMetric: false,
            icon: Puzzle,
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
                            {loading ? "..." : `+${stats.activitiesCreatedThisMonth || 0} this month`}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            id: "most-assigned-category",
            title: "Most Assigned Category",
            mainMetric: loading ? "..." : (stats.mostAssignedCategory || "None"),
            isTextMetric: true,
            icon: Sparkles,
            bgColor: "bg-[#E8B00C]",
            borderColor: "border-[#E8B00C]",
            textColor: "text-[#E8B00C]",
            iconBg: "bg-[#E8B00C]/10",
            upperBg: "bg-[#FEFCE8]",
            shadowColor: "hover:shadow-[#E8B00C]/25",
            rotateHover: "1deg",
            content: (
                <div className="flex items-center text-xs font-bold text-white">
                    <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-2xs">
                        <User className="size-3.5" />
                        <span>
                            {loading
                                ? "Calculating student count..."
                                : `${stats.assignedStudentsCountForTopCategory} ${stats.assignedStudentsCountForTopCategory === 1 ? "Student has" : "Students have"} an activity under this category assigned`}
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
                            <div
                                className={`${card.isTextMetric
                                    ? "text-2xl sm:text-3xl font-bold tracking-tight"
                                    : "text-4xl font-extrabold tracking-[0.06em]"
                                    } font-fredoka ${card.textColor}`}
                            >
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

export default ActivityCards;

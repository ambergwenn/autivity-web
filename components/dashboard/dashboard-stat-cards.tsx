"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Activity,
  Trophy,
  TrendingUp,
  UserCheck,
  EyeOff,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getDashboardUserKPIs, getDashboardActivityKPIs, getDashboardSessionKPIs, getDashboardMilestoneKPIs, type UserKPIStats, type SessionKPIStats, type MilestoneKPIStats } from "@/lib/queries/dashboard";

export interface DashboardStatCardsProps {
  stats?: {
    users?: {
      students: number;
      teachers: number;
      parents: number;
    };
    activities?: {
      active: number;
      hidden: number;
    };
    sessions?: {
      total: number;
      thisWeek: number;
    };
    milestones?: {
      achieved: number;
      total: number;
    };
  };
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  const router = useRouter();
  const [liveUsers, setLiveUsers] = useState<UserKPIStats | null>(null);
  const [liveActivitiesCount, setLiveActivitiesCount] = useState<number | null>(null);
  const [liveSessions, setLiveSessions] = useState<SessionKPIStats | null>(null);
  const [liveMilestones, setLiveMilestones] = useState<MilestoneKPIStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const [userKPIs, activityCount, sessionKPIs, milestoneKPIs] = await Promise.all([
        getDashboardUserKPIs(),
        getDashboardActivityKPIs(),
        getDashboardSessionKPIs(),
        getDashboardMilestoneKPIs(),
      ]);
      setLiveUsers(userKPIs);
      setLiveActivitiesCount(activityCount);
      setLiveSessions(sessionKPIs);
      setLiveMilestones(milestoneKPIs);
    }
    loadStats();
  }, []);

  const data = {
    users: {
      students: liveUsers ? liveUsers.students : (stats?.users?.students ?? 0),
      teachers: liveUsers ? liveUsers.teachers : (stats?.users?.teachers ?? 0),
      parents: liveUsers ? liveUsers.parents : (stats?.users?.parents ?? 0),
    },
    activities: {
      active: stats?.activities?.active ?? 42,
      hidden: stats?.activities?.hidden ?? 8,
    },
    sessions: {
      total: liveSessions ? liveSessions.total : (stats?.sessions?.total ?? 0),
      thisWeek: liveSessions ? liveSessions.thisWeek : (stats?.sessions?.thisWeek ?? 0),
    },
    milestones: {
      achieved: liveMilestones ? liveMilestones.achieved : (stats?.milestones?.achieved ?? 0),
      total: liveMilestones ? liveMilestones.total : (stats?.milestones?.total ?? 0),
    },
  };

  const totalUsers = data.users.students + data.users.teachers + data.users.parents;
  const totalCurriculum = liveActivitiesCount !== null ? liveActivitiesCount : (data.activities.active + data.activities.hidden);
  const milestonePercentage = data.milestones.total > 0 ? Math.round((data.milestones.achieved / data.milestones.total) * 100) : 0;

  const cardItems = [
    {
      id: "users",
      title: "Users",
      mainMetric: totalUsers.toLocaleString(),
      icon: Users,
      href: "/dashboard/user",
      bgColor: "bg-[#62A9E6]",
      borderColor: "border-[#62A9E6]",
      textColor: "text-[#62A9E6]",
      iconBg: "bg-[#62A9E6]/10",
      upperBg: "bg-[#F0F7FD]",
      shadowColor: "hover:shadow-[#62A9E6]/25",
      rotateHover: "-1deg",
      content: (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1.5 text-xs font-bold text-white border border-white/25 shadow-sm">
            <GraduationCap className="size-3.5" />
            <span>{data.users.students} Students</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1.5 text-xs font-bold text-white border border-white/25 shadow-sm">
            <UserCheck className="size-3.5" />
            <span>{data.users.teachers} Teachers</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1.5 text-xs font-bold text-white border border-white/25 shadow-sm">
            <Users className="size-3.5" />
            <span>{data.users.parents} Parents</span>
          </div>
        </div>
      ),
    },
    {
      id: "activities",
      title: "Activities",
      mainMetric: totalCurriculum.toLocaleString(),
      icon: BookOpen,
      href: "/dashboard/activities",
      bgColor: "bg-[#E8B00C]",
      borderColor: "border-[#E8B00C]",
      textColor: "text-[#E8B00C]",
      iconBg: "bg-[#E8B00C]/10",
      upperBg: "bg-[#FEFCE8]",
      shadowColor: "hover:shadow-[#E8B00C]/25",
      rotateHover: "1deg",
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-sm">
              <CheckCircle2 className="size-3.5" />
              <span>{data.activities.active} Active</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-sm">
              <EyeOff className="size-3.5" />
              <span>{data.activities.hidden} Hidden</span>
            </div>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${totalCurriculum > 0 ? Math.round((data.activities.active / totalCurriculum) * 100) : 0}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: "sessions",
      title: "Sessions",
      mainMetric: data.sessions.total.toLocaleString(),
      icon: Activity,
      bgColor: "bg-[#ED529B]",
      borderColor: "border-[#ED529B]",
      textColor: "text-[#ED529B]",
      iconBg: "bg-[#ED529B]/10",
      upperBg: "bg-[#FFF3F8]",
      shadowColor: "hover:shadow-[#ED529B]/25",
      rotateHover: "-1deg",
      content: (
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold text-white border border-white/25 shadow-sm">
            <TrendingUp className="size-4" />
            <span>+{data.sessions.thisWeek} this week</span>
          </div>
        </div>
      ),
    },
    {
      id: "milestones",
      title: "Milestones",
      mainMetric: data.milestones.achieved.toLocaleString(),
      icon: Trophy,
      bgColor: "bg-[#AD99E6]",
      borderColor: "border-[#AD99E6]",
      textColor: "text-[#AD99E6]",
      iconBg: "bg-[#AD99E6]/25",
      upperBg: "bg-[#F5F2FC]",
      shadowColor: "hover:shadow-[#AD99E6]/25",
      rotateHover: "1deg",
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-2.5 py-1 border border-white/25 shadow-sm">
              <Trophy className="size-3.5" />
              {data.milestones.achieved} Achieved
            </span>
            <span className="text-white/90 font-bold">{milestonePercentage}% Rate</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-black/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${milestonePercentage}%` }}
            />
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
            whileHover={card.href ? { scale: 1.03, rotate: card.rotateHover } : undefined}
            onClick={() => {
              if (card.href) {
                router.push(card.href);
              }
            }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border-[3px] ${card.borderColor} ${card.upperBg || "bg-white"} shadow-sm transition-all duration-300 ${card.href ? `hover:shadow-xl ${card.shadowColor} cursor-pointer` : "cursor-default"} min-h-[240px]`}
          >
            {/* Top Section: Lighter background with Icon, Main Metric (with increased letter spacing), and Title */}
            <div className={`p-6 flex flex-col justify-between flex-1 ${card.upperBg || "bg-white"}`}>
              {/* Icon */}
              <div className="mb-3">
                <div className={`inline-flex size-11 items-center justify-center rounded-2xl ${card.iconBg} ${card.textColor}`}>
                  <IconComponent className="size-6" />
                </div>
              </div>

              {/* Main Metric with wider letter spacing */}
              <div className={`text-4xl font-extrabold tracking-[0.06em] font-fredoka ${card.textColor}`}>
                {card.mainMetric}
              </div>

              {/* Card Title */}
              <h3 className={`mt-1 text-lg font-bold font-fredoka ${card.textColor}`}>
                {card.title}
              </h3>
            </div>

            {/* Bottom Section: Solid Accent Color Block containing Detailed Statistics */}
            <div className={`${card.bgColor} p-4 text-white flex flex-col justify-center min-h-[76px]`}>
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default DashboardStatCards;

"use client";

import * as React from "react";
import { TrendingUp, Activity, ChevronDown, AlertTriangle, CheckCircle2, Sparkles, Check } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  getDashboardAdaptiveEngineStats,
  type AdaptiveEngineStats,
} from "@/lib/queries/dashboard";

const timeRangeDays: Record<string, number | undefined> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "6m": 180,
  "1y": 365,
};

const chartConfig = {
  count: {
    label: "Sessions",
  },
  standard: {
    label: "Standard",
    color: "#62A9E6",
  },
  upshifts: {
    label: "Upshifts",
    color: "#AEE295",
  },
  bailouts: {
    label: "Bailouts",
    color: "#E67A88",
  },
} satisfies ChartConfig;

export function AdaptiveEngineChart() {
  const [timeRange, setTimeRange] = React.useState<string>("30d");
  const [stats, setStats] = React.useState<AdaptiveEngineStats>({
    upshifts: 0,
    standard: 0,
    bailouts: 0,
    total: 0,
  });
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const days = timeRangeDays[timeRange];
      const res = await getDashboardAdaptiveEngineStats(days);
      if (isMounted) {
        setStats(res);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  const chartData = React.useMemo(() => {
    return [
      { adjustment: "standard", count: stats.standard, fill: "#62A9E6" },
      { adjustment: "upshifts", count: stats.upshifts, fill: "#AEE295" },
      { adjustment: "bailouts", count: stats.bailouts, fill: "#E67A88" },
    ];
  }, [stats]);

  const totalAdjustments = stats.total;
  const bailoutRateVal = totalAdjustments ? (stats.bailouts / totalAdjustments) * 100 : 0;
  const upshiftRateVal = totalAdjustments ? (stats.upshifts / totalAdjustments) * 100 : 0;
  const standardRateVal = totalAdjustments ? (stats.standard / totalAdjustments) * 100 : 0;

  const standardPct = standardRateVal.toFixed(1);
  const upshiftsPct = upshiftRateVal.toFixed(1);
  const bailoutsPct = bailoutRateVal.toFixed(1);

  const getEngineFeedback = () => {
    if (totalAdjustments === 0) {
      return {
        text: "No session activity recorded for this period.",
        textColor: "text-slate-600",
        icon: <Activity className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />,
      };
    }
    if (bailoutRateVal > 20) {
      return {
        text: `High Bailout Rate of ${bailoutsPct}%. Baseline curriculum is too difficult. Consider lowering difficulty tiers.`,
        textColor: "text-red-600",
        icon: <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />,
      };
    }
    if (upshiftRateVal > 35) {
      return {
        text: `High Upshift Rate of ${upshiftsPct}%. Students are mastering content instantly. Consider raising difficulty tiers.`,
        textColor: "text-amber-600",
        icon: <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />,
      };
    }
    return {
      text: "System Healthy. Bailout rate is within clinical limits. Difficulty is properly calibrated.",
      textColor: "text-emerald-600",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />,
    };
  };

  const feedback = getEngineFeedback();

  return (
    <Card className="w-full h-full flex flex-col border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      {/* Header with Title & Filter Selector */}
      <CardHeader className="items-start pb-2 px-6 pt-6">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#62A9E6]/10 text-[#62A9E6] shadow-sm shrink-0">
              <Activity className="size-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                Adaptive Engine Health
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                System-Wide AI Sessions
              </CardDescription>
            </div>
          </div>

          {/* Time Range Filter Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
              <span>
                {timeRange === "7d"
                  ? "7 Days"
                  : timeRange === "30d"
                    ? "30 Days"
                    : timeRange === "90d"
                      ? "90 Days"
                      : timeRange === "6m"
                        ? "6 Months"
                        : "1 Year"}
              </span>
              <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
              {[
                { value: "7d", label: "7 Days" },
                { value: "30d", label: "30 Days" },
                { value: "90d", label: "90 Days" },
                { value: "6m", label: "6 Months" },
                { value: "1y", label: "1 Year" },
              ].map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => setTimeRange(item.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                    timeRange === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>{item.label}</span>
                  {timeRange === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {/* Donut Chart Body */}
      <CardContent className="flex-1 pb-4 px-6 pt-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="adjustment"
              innerRadius={62}
              outerRadius={86}
              paddingAngle={3}
              cornerRadius={6}
              strokeWidth={2}
              stroke="#ffffff"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 8}
                          className="text-3xl font-extrabold font-fredoka tracking-wider"
                          style={{ fill: "#4B5161" }}
                        >
                          {loading ? "..." : totalAdjustments.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 16}
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ fill: "#94A3B8" }}
                        >
                          Sessions
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Dynamic Sleek Playful Legend Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <div className="flex items-center gap-1.5 rounded-xl bg-[#62A9E6]/10 px-3 py-1.5 text-xs font-bold border border-[#62A9E6]/20 text-[#2E79B9]">
            <span className="size-2.5 rounded-full bg-[#62A9E6]" />
            <span>Standard</span>
            <span className="text-[#62A9E6]/80 font-bold">{standardPct}%</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#AEE295]/20 px-3 py-1.5 text-xs font-bold border border-[#AEE295]/30 text-[#4D9E27]">
            <span className="size-2.5 rounded-full bg-[#7BC55A]" />
            <span>Upshifts</span>
            <span className="text-[#7BC55A]/80 font-bold">{upshiftsPct}%</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#E67A88]/15 px-3 py-1.5 text-xs font-bold border border-[#E67A88]/25 text-[#C04A59]">
            <span className="size-2.5 rounded-full bg-[#E67A88]" />
            <span>Bailouts</span>
            <span className="text-[#E67A88]/80 font-bold">{bailoutsPct}%</span>
          </div>
        </div>
      </CardContent>

      {/* Dynamic Footer */}
      <CardFooter className="flex-col items-start gap-1.5 text-xs px-6 py-4 border-t border-slate-100 bg-slate-50/60">
        <div className={`flex items-start gap-1.5 font-bold text-xs ${feedback.textColor}`}>
          {feedback.icon}
          <span className="leading-snug">{feedback.text}</span>
        </div>
        <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>
          Dynamically calculated from student sessions data.
        </div>
      </CardFooter>
    </Card>
  );
}

export default AdaptiveEngineChart;

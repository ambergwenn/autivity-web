"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, Minus, LineChart as LineChartIcon, ChevronDown } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
  getDashboardDevelopmentalProgressData,
  type DevelopmentalProgressPoint,
} from "@/lib/queries/dashboard";

const chartConfig = {
  motor: {
    label: "Motor Skills",
    color: "#FDE047",
  },
  cognitive: {
    label: "Cognitive & Sorting",
    color: "#62A9E6",
  },
  sensory: {
    label: "Sensory Regulation",
    color: "#7BC55A",
  },
  communication: {
    label: "Communication & AAC",
    color: "#E67A88",
  },
  social: {
    label: "Social & Turn-Taking",
    color: "#C084FC",
  },
} satisfies ChartConfig;

export function DevelopmentalProgressChart() {
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");
  const [dataAll, setDataAll] = React.useState<DevelopmentalProgressPoint[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const res = await getDashboardDevelopmentalProgressData();
      if (isMounted) {
        setDataAll(res);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredData = React.useMemo(() => {
    switch (selectedFilter) {
      case "h1":
        return dataAll.slice(0, 6);
      case "h2":
        return dataAll.slice(6, 12);
      case "q1":
        return dataAll.slice(0, 3);
      case "q2":
        return dataAll.slice(3, 6);
      case "q3":
        return dataAll.slice(6, 9);
      case "q4":
        return dataAll.slice(9, 12);
      case "last3":
        return dataAll.slice(9, 12);
      case "jan":
        return dataAll.slice(0, 1);
      case "feb":
        return dataAll.slice(1, 2);
      case "mar":
        return dataAll.slice(2, 3);
      case "apr":
        return dataAll.slice(3, 4);
      case "may":
        return dataAll.slice(4, 5);
      case "jun":
        return dataAll.slice(5, 6);
      case "jul":
        return dataAll.slice(6, 7);
      case "aug":
        return dataAll.slice(7, 8);
      case "sep":
        return dataAll.slice(8, 9);
      case "oct":
        return dataAll.slice(9, 10);
      case "nov":
        return dataAll.slice(10, 11);
      case "dec":
        return dataAll.slice(11, 12);
      case "all":
      default:
        return dataAll;
    }
  }, [selectedFilter, dataAll]);

  const footerFeedback = React.useMemo(() => {
    const activeMonths = dataAll.filter(
      (d) => d.motor > 0 || d.cognitive > 0 || d.sensory > 0 || d.communication > 0 || d.social > 0
    );

    if (activeMonths.length === 0) {
      return {
        text: "No student session activity recorded yet to track developmental progress trends.",
        textColor: "text-slate-600",
        icon: <Minus className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />,
      };
    }

    if (activeMonths.length === 1) {
      return {
        text: "Only 1 month of session activity recorded. At least 2 months are required to calculate monthly progress trends.",
        textColor: "text-slate-600",
        icon: <Minus className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />,
      };
    }

    const latest = activeMonths[activeMonths.length - 1];
    const prev = activeMonths[activeMonths.length - 2];

    const latestAvg = (latest.motor + latest.cognitive + latest.sensory + latest.communication + latest.social) / 5;
    const prevAvg = (prev.motor + prev.cognitive + prev.sensory + prev.communication + prev.social) / 5;
    const diff = latestAvg - prevAvg;

    if (diff > 0) {
      return {
        text: `Average overall mastery increased by +${diff.toFixed(1)}% across domains. The curriculum is working. Students are mastering skills.`,
        textColor: "text-emerald-600",
        icon: <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />,
      };
    } else if (diff < 0) {
      return {
        text: `Average overall mastery decreased by ${diff.toFixed(1)}% across domains. Students are struggling or regressing. The curriculum might be too hard, or teachers aren't intervening enough.`,
        textColor: "text-red-600",
        icon: <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />,
      };
    } else {
      return {
        text: "Average overall mastery remained flat (0.0%) across domains. Stagnation observed.",
        textColor: "text-amber-600",
        icon: <Minus className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />,
      };
    }
  }, [dataAll]);

  return (
    <Card className="w-full h-full flex flex-col border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      {/* Header with Title, Subtitle & Filter Selector */}
      <CardHeader className="items-start pb-2 px-6 pt-6">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#C084FC]/15 text-[#9333EA] shadow-sm shrink-0">
              <LineChartIcon className="size-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                Monthly Developmental Progress
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                Mastery Trends by Skill Domain
              </CardDescription>
            </div>
          </div>

          {/* Month Filter Selector */}
          <div className="relative shrink-0">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              aria-label="Filter month range"
              className="appearance-none h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-3 pr-7 py-1 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#C084FC] focus:outline-hidden cursor-pointer"
              style={{ color: "#4B5161" }}
            >
              <option value="all">All Months (Jan - Dec)</option>
              <option value="h1">First Half (Jan - Jun)</option>
              <option value="h2">Second Half (Jul - Dec)</option>
              <option value="q1">Q1 (Jan - Mar)</option>
              <option value="q2">Q2 (Apr - Jun)</option>
              <option value="q3">Q3 (Jul - Sep)</option>
              <option value="q4">Q4 (Oct - Dec)</option>
              <option value="last3">Last 3 Months (Oct - Dec)</option>
              <option value="jan">January</option>
              <option value="feb">February</option>
              <option value="mar">March</option>
              <option value="apr">April</option>
              <option value="may">May</option>
              <option value="jun">June</option>
              <option value="jul">July</option>
              <option value="aug">August</option>
              <option value="sep">September</option>
              <option value="oct">October</option>
              <option value="nov">November</option>
              <option value="dec">December</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 size-3.5 text-slate-400" />
          </div>
        </div>
      </CardHeader>

      {/* Chart Body */}
      <CardContent className="flex-1 pb-4 px-6 pt-2">
        <ChartContainer config={chartConfig} className="w-full aspect-auto h-[250px]">
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{ left: 0, right: 12, top: 12, bottom: 8 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tickFormatter={(val) => `${val}%`}
              tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
            />
            <ChartTooltip
              cursor={{ stroke: "#CBD5E1", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelClassName="font-bold text-slate-800 text-xs pb-1 border-b border-slate-100 mb-1"
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="font-semibold text-slate-600">
                        {chartConfig[name as keyof typeof chartConfig]?.label || name}:
                      </span>
                      <span className="font-mono font-bold text-slate-800">{value}%</span>
                    </div>
                  )}
                />
              }
            />
            <Line
              dataKey="motor"
              type="monotone"
              stroke="#FDE047"
              strokeWidth={3}
              dot={{ r: 4, fill: "#FDE047", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#FDE047", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
            <Line
              dataKey="cognitive"
              type="monotone"
              stroke="#62A9E6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#62A9E6", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#62A9E6", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
            <Line
              dataKey="sensory"
              type="monotone"
              stroke="#7BC55A"
              strokeWidth={3}
              dot={{ r: 4, fill: "#7BC55A", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#7BC55A", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
            <Line
              dataKey="communication"
              type="monotone"
              stroke="#E67A88"
              strokeWidth={3}
              dot={{ r: 4, fill: "#E67A88", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#E67A88", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
            <Line
              dataKey="social"
              type="monotone"
              stroke="#C084FC"
              strokeWidth={3}
              dot={{ r: 4, fill: "#C084FC", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#C084FC", strokeWidth: 2, stroke: "#FFFFFF" }}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend Badges matching adaptive-engine-chart colors */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <div className="flex items-center gap-1.5 rounded-xl bg-[#FDE047]/30 px-2.5 py-1 text-xs font-bold border border-[#FDE047]/60 text-[#854D0E]">
            <span className="size-2.5 rounded-full bg-[#EAB308]" />
            <span>Motor Skills</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#62A9E6]/10 px-2.5 py-1 text-xs font-bold border border-[#62A9E6]/20 text-[#2E79B9]">
            <span className="size-2.5 rounded-full bg-[#62A9E6]" />
            <span>Cognitive & Sorting</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#AEE295]/20 px-2.5 py-1 text-xs font-bold border border-[#AEE295]/30 text-[#4D9E27]">
            <span className="size-2.5 rounded-full bg-[#7BC55A]" />
            <span>Sensory Regulation</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#E67A88]/15 px-2.5 py-1 text-xs font-bold border border-[#E67A88]/25 text-[#C04A59]">
            <span className="size-2.5 rounded-full bg-[#E67A88]" />
            <span>Communication & AAC</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-[#C084FC]/20 px-2.5 py-1 text-xs font-bold border border-[#C084FC]/40 text-[#8A35E5]">
            <span className="size-2.5 rounded-full bg-[#A855F7]" />
            <span>Social & Turn-Taking</span>
          </div>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-col items-start gap-1 text-xs px-6 py-4 border-t border-slate-100 bg-slate-50/60">
        <div className={`flex items-start gap-1.5 font-bold text-xs ${footerFeedback.textColor}`}>
          <span className="leading-snug">{footerFeedback.text}</span>
          {footerFeedback.icon}
        </div>
        <div className="text-[11px] font-medium" style={{ color: "#6B7280" }}>
          Tracking developmental progress across 5 core skill domains over time.
        </div>
      </CardFooter>
    </Card>
  );
}

export default DevelopmentalProgressChart;

"use client";

import * as React from "react";
import { Puzzle, Sparkles, Info } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

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

import { getActivityCategoryBreakdown, getCategoryColor } from "@/lib/queries/activities";

const chartConfig = {
    count: {
        label: "Activities",
    },
} satisfies ChartConfig;

const ACTIVE_INDEX = 0;

export function ActivityCategoryDonut() {
    const [counts, setCounts] = React.useState<Record<string, number>>({});
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        let isMounted = true;
        async function loadBreakdown() {
            setLoading(true);
            const data = await getActivityCategoryBreakdown();
            if (isMounted) {
                if (data && Object.keys(data).length > 0) {
                    setCounts(data);
                } else {
                    // Fallback to static mock data if empty
                    setCounts({
                        "Tracing": 24,
                        "Bubble-Pop": 15,
                        "Drag-Drop": 9,
                    });
                }
                setLoading(false);
            }
        }
        loadBreakdown();
        return () => {
            isMounted = false;
        };
    }, []);

    const totalActivities = React.useMemo(() => {
        return Object.values(counts).reduce((sum, val) => sum + val, 0);
    }, [counts]);

    const chartData = React.useMemo(() => {
        return Object.entries(counts).map(([category, count], index) => ({
            category,
            label: category,
            count,
            fill: getCategoryColor(category, index),
        }));
    }, [counts]);

    // Find the most prevalent category for the footer message
    const mostPrevalent = React.useMemo(() => {
        if (chartData.length === 0) return null;
        return [...chartData].sort((a, b) => b.count - a.count)[0];
    }, [chartData]);

    const mostPrevalentPct = React.useMemo(() => {
        if (!totalActivities || !mostPrevalent) return "0.0";
        return ((mostPrevalent.count / totalActivities) * 100).toFixed(1);
    }, [totalActivities, mostPrevalent]);

    return (
        <Card className="w-full h-full flex flex-col border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
            {/* Header with Title */}
            <CardHeader className="items-start pb-2 px-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#62A9E6]/10 text-[#62A9E6] shadow-sm shrink-0">
                        <Puzzle className="size-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                            Activity Breakdown
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                            Distribution of activities per category
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            {/* Donut Chart Body */}
            <CardContent className="flex-1 pb-4 px-6 pt-2">
                {loading ? (
                    <div className="flex aspect-square max-h-[220px] items-center justify-center text-xs font-bold text-slate-400">
                        Loading breakdown data...
                    </div>
                ) : (
                    <>
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
                                    nameKey="label"
                                    innerRadius={60}
                                    strokeWidth={5}
                                    shape={({
                                        index,
                                        outerRadius = 0,
                                        ...props
                                    }: PieSectorShapeProps) =>
                                        index === ACTIVE_INDEX ? (
                                            <Sector {...props} outerRadius={outerRadius + 8} />
                                        ) : (
                                            <Sector {...props} outerRadius={outerRadius} />
                                        )
                                    }
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
                                                            {totalActivities.toLocaleString()}
                                                        </tspan>
                                                        <tspan
                                                            x={viewBox.cx}
                                                            y={(viewBox.cy || 0) + 16}
                                                            className="text-xs font-bold uppercase tracking-wider"
                                                            style={{ fill: "#94A3B8" }}
                                                        >
                                                            Activities
                                                        </tspan>
                                                    </text>
                                                );
                                            }
                                        }}
                                    />
                                </Pie>
                            </PieChart>
                        </ChartContainer>

                        {/* Dynamic Legend Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                            {chartData.map((item) => {
                                const pct = totalActivities ? ((item.count / totalActivities) * 100).toFixed(1) : "0.0";

                                return (
                                    <div
                                        key={item.category}
                                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border"
                                        style={{
                                            backgroundColor: `${item.fill}12`,
                                            borderColor: `${item.fill}35`,
                                            color: item.fill,
                                        }}
                                    >
                                        <span className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                        <span>{item.label}</span>
                                        <span className="opacity-80 font-bold ml-0.5">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </CardContent>

            {/* Dynamic Footer */}
            {!loading && (
                <CardFooter className="flex-col items-start gap-1.5 text-xs px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                    {totalActivities > 0 && mostPrevalent ? (
                        <>
                            <div
                                className="flex items-start gap-1.5 font-bold text-xs"
                                style={{ color: mostPrevalent.fill || "#2E79B9" }}
                            >
                                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: mostPrevalent.fill || "#62A9E6" }} />
                                <span className="leading-snug">
                                    {mostPrevalent.label} is the most prevalent activity category ({mostPrevalentPct}% of total content).
                                </span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                                Based on total activity entries in directory.
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start gap-1.5 font-bold text-xs text-slate-500">
                                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                    There is no activity data yet.
                                </span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-400">
                                Create activities to start tracking category distribution.
                            </div>
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default ActivityCategoryDonut;

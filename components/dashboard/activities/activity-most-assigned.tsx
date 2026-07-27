"use client";

import * as React from "react";
import { Sparkles, Award, Info } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
    getMostAssignedCategories,
    getCategoryColor,
    type MostAssignedCategoryItem,
} from "@/lib/queries/activities";

export interface ActivityMostAssignedProps {
    initialData?: MostAssignedCategoryItem[];
}

const chartConfig = {
    assignments: {
        label: "Assignments",
    },
} satisfies ChartConfig;

export function ActivityMostAssigned({ initialData }: ActivityMostAssignedProps) {
    const [data, setData] = React.useState<MostAssignedCategoryItem[]>(initialData || []);
    const [loading, setLoading] = React.useState<boolean>(!initialData || initialData.length === 0);

    React.useEffect(() => {
        let isMounted = true;
        async function loadMostAssigned() {
            setLoading(true);
            const dbItems = await getMostAssignedCategories();
            if (isMounted) {
                setData(dbItems || []);
                setLoading(false);
            }
        }
        loadMostAssigned();
        return () => {
            isMounted = false;
        };
    }, []);

    // Ranked from highest to lowest based on assignments
    const chartData = React.useMemo(() => {
        const list = [...data];
        list.sort((a, b) => b.assignments - a.assignments);
        return list.map((item, index) => ({
            ...item,
            fill: item.fill || getCategoryColor(item.category, index),
        }));
    }, [data]);

    const topCategory = chartData[0];
    const hasAssignments = topCategory && topCategory.assignments > 0;

    return (
        <Card className="w-full h-full flex flex-col border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <CardHeader className="items-start pb-2 px-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#E8B00C]/10 text-[#E8B00C] shadow-sm shrink-0">
                        <Award className="size-6" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                            Most Assigned Categories
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                            Ranked from highest to lowest total assignments
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            {/* Horizontal Bar Chart Body */}
            <CardContent className="flex-1 pb-4 px-6 pt-2">
                {loading ? (
                    <div className="flex aspect-square max-h-[250px] items-center justify-center text-xs font-bold text-slate-400">
                        Loading assignment data...
                    </div>
                ) : (
                    <>
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto max-h-[250px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                layout="vertical"
                                margin={{
                                    left: 20,
                                    right: 20,
                                    top: 10,
                                    bottom: 10,
                                }}
                            >
                                <XAxis type="number" dataKey="assignments" hide />
                                <YAxis
                                    dataKey="category"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    className="text-xs font-bold fill-[#4B5161]"
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="assignments" radius={6} />
                            </BarChart>
                        </ChartContainer>

                        {/* Legend Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                            {chartData.map((item) => {
                                return (
                                    <div
                                        key={item.category}
                                        className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors"
                                        style={{
                                            backgroundColor: `${item.fill}15`,
                                            borderColor: `${item.fill}40`,
                                            color: item.fill,
                                        }}
                                    >
                                        <span
                                            className="size-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        <span>{item.category}</span>
                                        <span className="font-extrabold opacity-90">{item.assignments}</span>
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
                    {hasAssignments ? (
                        <>
                            <div
                                className="flex items-start gap-1.5 font-bold text-xs"
                                style={{ color: topCategory.fill || "#A17904" }}
                            >
                                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: topCategory.fill || "#E8B00C" }} />
                                <span className="leading-snug">
                                    {topCategory.category} is the top assigned category with {topCategory.assignments} total assignments.
                                </span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                                Based on activities assigned to students currently.
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-start gap-1.5 font-bold text-xs text-slate-500">
                                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">
                                    There is no assignment data yet.
                                </span>
                            </div>
                            <div className="text-[11px] font-medium text-slate-400">
                                Assign activities to students to start tracking category statistics.
                            </div>
                        </>
                    )}
                </CardFooter>
            )}
        </Card>
    );
}

export default ActivityMostAssigned;

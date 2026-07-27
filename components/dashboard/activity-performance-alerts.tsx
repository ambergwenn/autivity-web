"use client";

import * as React from "react";
import { AlertTriangle, ChevronDown, Search, Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  getActivityPerformanceAlerts,
  type ActivityPerformanceAlertItem,
} from "@/src/services/dashboard";

const categoryStyles: Record<string, string> = {
  "Motor Skills": "bg-[#FDE047]/30 border border-[#FDE047]/60 text-[#854D0E]",
  "Cognitive & Sorting": "bg-[#62A9E6]/10 border border-[#62A9E6]/25 text-[#2E79B9]",
  "Sensory Regulation": "bg-[#AEE295]/20 border border-[#AEE295]/35 text-[#4D9E27]",
  "Communication & AAC": "bg-[#E67A88]/15 border border-[#E67A88]/25 text-[#C04A59]",
  "Social & Turn-Taking": "bg-[#C084FC]/20 border border-[#C084FC]/40 text-[#8A35E5]",
};

const difficultyBadgeStyles: Record<string, string> = {
  Easy: "bg-emerald-100/70 border border-emerald-300/60 text-emerald-700",
  Medium: "bg-amber-100/70 border border-amber-300/60 text-amber-700",
  Hard: "bg-rose-100/70 border border-rose-300/60 text-rose-700",
  Custom: "bg-slate-100 border border-slate-200 text-slate-700",
};

export function ActivityPerformanceAlerts() {
  const [data, setData] = React.useState<ActivityPerformanceAlertItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<string>("highest-bailout");

  React.useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      setLoading(true);
      const items = await getActivityPerformanceAlerts();
      if (isMounted) {
        setData(items);
        setLoading(false);
      }
    }
    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(data.map((item) => item.category).filter(Boolean)));
    return cats.sort();
  }, [data]);

  // Filter & Sort logic
  const processedData = React.useMemo(() => {
    let result = [...data];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter === "high-alerts") {
      result = result.filter((item) => item.bailoutRate > 30);
    } else if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "lowest-bailout":
          return a.bailoutRate - b.bailoutRate;
        case "most-sessions":
          return b.totalSessions - a.totalSessions;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "highest-bailout":
        default:
          return b.bailoutRate - a.bailoutRate;
      }
    });

    return result;
  }, [data, searchQuery, categoryFilter, sortBy]);

  return (
    <Card className="w-full flex flex-col gap-0 py-0 border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      {/* Header with Title, Description, and Select Filters */}
      <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 shrink-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#E67A88]/15 text-[#E67A88] shadow-sm shrink-0">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                Activity Performance Alerts
              </CardTitle>
              <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                Activities with a bailout rate over 30% require immediate redesign.
              </CardDescription>
            </div>
          </div>

          {/* Filter & Sort Dropdown controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Search Input Box */}
            <div className="relative w-64 sm:w-72 md:w-80 shrink-0">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search activity name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search activities"
                className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden"
                style={{ color: "#4B5161" }}
              />
            </div>

            {/* Category Filter Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#E67A88] focus:outline-hidden cursor-pointer flex items-center gap-2">
                <span>
                  {categoryFilter === "all"
                    ? "All Categories"
                    : categoryFilter === "high-alerts"
                      ? "High Alerts Only"
                      : categoryFilter}
                </span>
                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px] max-h-60 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                <DropdownMenuItem
                  onClick={() => setCategoryFilter("all")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                    categoryFilter === "all" ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>All Categories</span>
                  {categoryFilter === "all" && <Check className="size-3.5 text-[#2E79B9]" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setCategoryFilter("high-alerts")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                    categoryFilter === "high-alerts" ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>High Alerts Only</span>
                  {categoryFilter === "high-alerts" && <Check className="size-3.5 text-[#2E79B9]" />}
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                      categoryFilter === cat ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span className="truncate">{cat}</span>
                    {categoryFilter === cat && <Check className="size-3.5 text-[#2E79B9] shrink-0 ml-2" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#E67A88] focus:outline-hidden cursor-pointer flex items-center gap-2">
                <span>
                  {sortBy === "highest-bailout"
                    ? "Highest Bailout"
                    : sortBy === "lowest-bailout"
                      ? "Lowest Bailout"
                      : sortBy === "most-sessions"
                        ? "Most Sessions"
                        : "Alphabetical (A-Z)"}
                </span>
                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[150px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                {[
                  { value: "highest-bailout", label: "Highest Bailout" },
                  { value: "lowest-bailout", label: "Lowest Bailout" },
                  { value: "most-sessions", label: "Most Sessions" },
                  { value: "alphabetical", label: "Alphabetical (A-Z)" },
                ].map((item) => (
                  <DropdownMenuItem
                    key={item.value}
                    onClick={() => setSortBy(item.value)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                      sortBy === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                    )}
                  >
                    <span>{item.label}</span>
                    {sortBy === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {/* Fixed height scrollable content area */}
      <CardContent className="p-0">
        <Table containerClassName="max-h-[360px]">
          {/* Sticky Table Header */}
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs pl-6 border-b border-slate-200 shadow-2xs">
                Name
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                Category
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                Difficulty
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                Total Sessions
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                Bailout Rate
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                Avg. Mistakes
              </TableHead>
              <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs text-right pr-6 border-b border-slate-200 shadow-2xs">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-semibold">
                  Loading activity performance data...
                </TableCell>
              </TableRow>
            ) : processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-semibold">
                  No matching activities found.
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((item) => {
                const isHighBailout = item.bailoutRate > 30;
                const categoryBadgeClass =
                  categoryStyles[item.category] ||
                  "bg-slate-100 border border-slate-200 text-slate-600";

                return (
                  <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <TableCell className="pl-6 font-bold text-[#4B5161]">
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold ${categoryBadgeClass}`}>
                        {item.category}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold ${difficultyBadgeStyles[item.difficulty] || "bg-slate-100 border border-slate-200 text-slate-700"}`}>
                        {item.difficulty}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-slate-700">
                      {item.totalSessions.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {isHighBailout ? (
                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#E67A88]/15 border border-[#E67A88]/30 px-2.5 py-1 text-xs font-bold text-[#E67A88]">
                          <AlertTriangle className="size-3.5 shrink-0" />
                          <span>{item.bailoutRate}%</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-slate-700">
                          {item.bailoutRate}%
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-slate-600">
                      {item.avgMistakes}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl cursor-pointer"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ActivityPerformanceAlerts;

"use client"

import * as React from "react"
import {
    Search,
    ChevronDown,
    Users,
    Calendar,
    GraduationCap,
    Building2,
    MoreHorizontal,
    Palette,
    Eye,
    Archive,
    RotateCcw,
    BookOpen,
    Loader2,
    Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getClasses, ClassQueryResult, updateClassDetails } from "@/lib/queries/classes"
import { ClassEditDialog } from "@/components/dashboard/classes/class-edit"

// Theme palette styled consistently with developmental-progress-chart & autivity design tokens
const THEME_STYLES: Record<
    string,
    { barBg: string; badgeBg: string; textColor: string; borderColor: string }
> = {
    orange: {
        barBg: "bg-gradient-to-r from-[#F97316] to-[#EA580C]",
        badgeBg: "bg-[#F97316]/20",
        textColor: "text-[#C2410C]",
        borderColor: "border-[#F97316]/40",
    },
    green: {
        barBg: "bg-gradient-to-r from-[#AEE295] to-[#7BC55A]",
        badgeBg: "bg-[#AEE295]/20",
        textColor: "text-[#4D9E27]",
        borderColor: "border-[#AEE295]/40",
    },
    yellow: {
        barBg: "bg-gradient-to-r from-[#FDE047] to-[#F59E0B]",
        badgeBg: "bg-[#FDE047]/30",
        textColor: "text-[#854D0E]",
        borderColor: "border-[#FDE047]/60",
    },
    blue: {
        barBg: "bg-gradient-to-r from-[#62A9E6] to-[#4B8AC9]",
        badgeBg: "bg-[#62A9E6]/15",
        textColor: "text-[#2E79B9]",
        borderColor: "border-[#62A9E6]/30",
    },
}

// Status styles matching progress chart badge systems
const STATUS_STYLES: Record<
    ClassQueryResult["status"],
    { dotBg: string; badgeBg: string; textColor: string; borderColor: string; label: string }
> = {
    active: {
        dotBg: "bg-[#7BC55A]",
        badgeBg: "bg-[#AEE295]/20",
        textColor: "text-[#4D9E27]",
        borderColor: "border-[#AEE295]/40",
        label: "Active",
    },
    pending: {
        dotBg: "bg-[#EAB308]",
        badgeBg: "bg-[#FDE047]/30",
        textColor: "text-[#854D0E]",
        borderColor: "border-[#FDE047]/60",
        label: "Pending setup",
    },
    archived: {
        dotBg: "bg-slate-400",
        badgeBg: "bg-slate-100",
        textColor: "text-slate-500",
        borderColor: "border-slate-200",
        label: "Archived",
    },
}

export interface ClassCardsProps {
    refreshTrigger?: number
}

export function ClassCards({ refreshTrigger }: ClassCardsProps = {}) {
    const [classes, setClasses] = React.useState<ClassQueryResult[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)

    const [searchQuery, setSearchQuery] = React.useState<string>("")
    const [teacherFilter, setTeacherFilter] = React.useState<string>("all")
    const [statusFilter, setStatusFilter] = React.useState<string>("all")
    const [universityFilter, setUniversityFilter] = React.useState<string>("all")

    // State for View/Edit Dialog Modal
    const [selectedClass, setSelectedClass] = React.useState<ClassQueryResult | null>(null)
    const [editDialogOpen, setEditDialogOpen] = React.useState<boolean>(false)

    // Fetch classes data dynamically from Supabase
    const fetchClassesData = React.useCallback(async () => {
        setLoading(true)
        const data = await getClasses()
        setClasses(data)
        setLoading(false)
    }, [])

    React.useEffect(() => {
        fetchClassesData()
    }, [fetchClassesData, refreshTrigger])

    // Extract unique options for filter dropdowns dynamically from real data
    const teacherOptions = React.useMemo(() => {
        const teachers = Array.from(new Set(classes.map((c) => c.teacher).filter(Boolean)))
        return teachers.sort()
    }, [classes])

    const universityOptions = React.useMemo(() => {
        const unis = Array.from(new Set(classes.map((c) => c.university).filter(Boolean)))
        return unis.sort()
    }, [classes])

    // Filter classes logic
    const filteredClasses = React.useMemo(() => {
        return classes.filter((cls) => {
            const matchesSearch =
                searchQuery === "" ||
                cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.grade.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesTeacher =
                teacherFilter === "all" || cls.teacher === teacherFilter

            const matchesStatus =
                statusFilter === "all" || cls.status === statusFilter

            const matchesUniversity =
                universityFilter === "all" || cls.university === universityFilter

            return matchesSearch && matchesTeacher && matchesStatus && matchesUniversity
        })
    }, [classes, searchQuery, teacherFilter, statusFilter, universityFilter])

    const hasActiveFilters =
        searchQuery !== "" ||
        teacherFilter !== "all" ||
        statusFilter !== "all" ||
        universityFilter !== "all"

    const resetFilters = () => {
        setSearchQuery("")
        setTeacherFilter("all")
        setStatusFilter("all")
        setUniversityFilter("all")
    }

    const handleViewClass = (cls: ClassQueryResult) => {
        setSelectedClass(cls)
        setEditDialogOpen(true)
    }

    const handleToggleArchive = async (cls: ClassQueryResult) => {
        const newArchivedState = !cls.is_archived
        const res = await updateClassDetails(cls.id, { is_archived: newArchivedState })
        if (res.success) {
            fetchClassesData()
        }
    }

    return (
        <div className="space-y-6">
            {/* Toolbar Card matching developmental-progress-chart border & background design */}
            <div className="rounded-3xl border-[2px] border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Search Bar */}
                    <div className="relative flex-1 min-w-[260px]">
                        <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search class name, teacher, or grade..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search classes"
                            style={{ color: "#4B5161" }}
                            className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Filter per Teacher */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                <span>{teacherFilter === "all" ? "All Teachers" : teacherFilter}</span>
                                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[160px] max-h-60 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                <DropdownMenuItem
                                    onClick={() => setTeacherFilter("all")}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                        teacherFilter === "all" ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    <span>All Teachers</span>
                                    {teacherFilter === "all" && <Check className="size-3.5 text-[#2E79B9]" />}
                                </DropdownMenuItem>
                                {teacherOptions.map((teacher) => (
                                    <DropdownMenuItem
                                        key={teacher}
                                        onClick={() => setTeacherFilter(teacher)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                            teacherFilter === teacher ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className="truncate">{teacher}</span>
                                        {teacherFilter === teacher && <Check className="size-3.5 text-[#2E79B9] shrink-0 ml-2" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filter per Status */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                <span>
                                    {statusFilter === "all"
                                        ? "All Statuses"
                                        : statusFilter === "active"
                                        ? "Active"
                                        : statusFilter === "pending"
                                        ? "Pending Setup"
                                        : "Archived"}
                                </span>
                                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[150px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                {[
                                    { value: "all", label: "All Statuses" },
                                    { value: "active", label: "Active" },
                                    { value: "pending", label: "Pending Setup" },
                                    { value: "archived", label: "Archived" },
                                ].map((item) => (
                                    <DropdownMenuItem
                                        key={item.value}
                                        onClick={() => setStatusFilter(item.value)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                            statusFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <span>{item.label}</span>
                                        {statusFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filter per University */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                <span>{universityFilter === "all" ? "All Universities" : universityFilter}</span>
                                <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="min-w-[160px] max-h-60 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                <DropdownMenuItem
                                    onClick={() => setUniversityFilter("all")}
                                    className={cn(
                                        "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                        universityFilter === "all" ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    <span>All Universities</span>
                                    {universityFilter === "all" && <Check className="size-3.5 text-[#2E79B9]" />}
                                </DropdownMenuItem>
                                {universityOptions.map((uni) => (
                                    <DropdownMenuItem
                                        key={uni}
                                        onClick={() => setUniversityFilter(uni)}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                            universityFilter === uni ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                        )}
                                    >
                                        <span className="truncate">{uni}</span>
                                        {universityFilter === uni && <Check className="size-3.5 text-[#2E79B9] shrink-0 ml-2" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Reset Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={resetFilters}
                                className="h-8.5 px-3 text-xs font-bold text-slate-500 hover:text-[#4B5161] hover:bg-slate-100 rounded-xl flex items-center gap-1.5 cursor-pointer"
                            >
                                <RotateCcw className="size-3.5" />
                                <span>Reset</span>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sub-bar showing result count */}
                <div className="flex items-center justify-between text-xs font-semibold pt-2 border-t border-slate-100" style={{ color: "#6B7280" }}>
                    <span>
                        Showing <strong style={{ color: "#4B5161" }}>{filteredClasses.length}</strong> of{" "}
                        {classes.length} classes
                    </span>
                </div>
            </div>

            {/* Class Cards Grid / Loading / Empty state */}
            {loading ? (
                <div className="rounded-3xl border-[2px] border-slate-200/80 bg-white p-12 text-center space-y-3 shadow-sm flex flex-col items-center justify-center">
                    <Loader2 className="size-8 animate-spin text-[#62A9E6]" />
                    <p className="text-sm font-bold" style={{ color: "#4B5161" }}>Loading classes from database...</p>
                </div>
            ) : filteredClasses.length === 0 ? (
                <div className="rounded-3xl border-[2px] border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-sm">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <BookOpen className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold font-fredoka" style={{ color: "#4B5161" }}>
                        No classes found
                    </h3>
                    <p className="text-xs font-medium max-w-sm mx-auto" style={{ color: "#6B7280" }}>
                        No class records match your search or filter parameters. Try clearing your search query or changing filters.
                    </p>
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={resetFilters}
                            className="mt-2 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100"
                        >
                            Reset All Filters
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((cls) => {
                        const themeConfig = THEME_STYLES[cls.theme_name] || THEME_STYLES.blue
                        const statusConfig = STATUS_STYLES[cls.status] || STATUS_STYLES.active

                        return (
                            <div
                                key={cls.id}
                                className="group relative rounded-3xl border-[2px] border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
                            >
                                {/* Dynamic Mobile Header Accent Bar */}
                                <div className={cn("h-2.5 w-full", (cls.is_archived || cls.status === "archived") ? "bg-slate-400" : themeConfig.barBg)} />

                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    {/* Top Section */}
                                    <div className="space-y-3">
                                        {/* Header Row: Title & Actions */}
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="space-y-1">
                                                <h3
                                                    className="font-fredoka text-xl font-bold tracking-wide transition-colors leading-snug"
                                                    style={{ color: "#4B5161" }}
                                                >
                                                    {cls.title}
                                                </h3>
                                                {/* Grade & University Tag */}
                                                <div className="flex items-center gap-2 flex-wrap text-slate-500 pt-0.5">
                                                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600">
                                                        <GraduationCap className="size-3.5 text-slate-400" />
                                                        {cls.grade}
                                                    </span>
                                                    <span
                                                        className="inline-flex items-center gap-1 text-xs font-semibold"
                                                        style={{ color: "#6B7280" }}
                                                    >
                                                        <Building2 className="size-3.5 text-slate-400" />
                                                        {cls.university}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Menu */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="h-8.5 w-8.5 inline-flex items-center justify-center text-slate-400 hover:text-[#4B5161] hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                                                        <MoreHorizontal className="size-4" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="w-40 rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewClass(cls)}
                                                            style={{ color: "#4B5161" }}
                                                            className="text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <Eye className="size-3.5 mr-2 text-slate-400" /> View Class
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleToggleArchive(cls)}
                                                            style={{ color: "#4B5161" }}
                                                            className="text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <Archive className="size-3.5 mr-2 text-slate-400" />
                                                            <span>{cls.is_archived ? "Unarchive Class" : "Archive Class"}</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Teacher Row */}
                                        <div
                                            className="text-xs font-semibold flex items-center gap-1.5 pt-1"
                                            style={{ color: "#6B7280" }}
                                        >
                                             <span>Teacher:</span>
                                            <span
                                                className={cn(
                                                    "font-bold",
                                                    cls.teacher.toLowerCase() === "unassigned"
                                                        ? "text-[#854D0E] italic bg-[#FDE047]/30 px-2 py-0.5 rounded-lg border border-[#FDE047]/60"
                                                        : ""
                                                )}
                                                style={cls.teacher.toLowerCase() !== "unassigned" ? { color: "#4B5161" } : undefined}
                                            >
                                                {cls.teacher}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Section: Students Count & Schedule */}
                                    <div
                                        className="flex items-center justify-between text-xs font-bold pt-3 border-t border-slate-100"
                                        style={{ color: "#4B5161" }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-lg bg-[#62A9E6]/10 flex items-center justify-center text-[#2E79B9]">
                                                <Users className="size-3.5 shrink-0" />
                                            </div>
                                            <span>
                                                {cls.studentsCount}{" "}
                                                {cls.studentsCount === 1 ? "student" : "students"}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 max-w-[55%]">
                                            <div className="size-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Calendar className="size-3.5 shrink-0" />
                                            </div>
                                            <span className="truncate" style={{ color: "#6B7280" }}>
                                                {cls.schedule}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Section: Status & Theme Name Tag */}
                                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                                    {/* Status Dot & Label */}
                                    <div
                                        className={cn(
                                            "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border",
                                            statusConfig.badgeBg,
                                            statusConfig.borderColor,
                                            statusConfig.textColor
                                        )}
                                    >
                                        <span className={cn("size-2 rounded-full", statusConfig.dotBg)} />
                                        <span>{statusConfig.label}</span>
                                    </div>

                                    {/* Mobile App Theme Name Tag */}
                                    <div
                                        className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border",
                                            themeConfig.badgeBg,
                                            themeConfig.textColor,
                                            themeConfig.borderColor
                                        )}
                                        title={`Mobile App Card Header Theme: ${cls.theme_name}`}
                                    >
                                        <Palette className="size-3" />
                                        <span>{cls.theme_name} theme</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* View & Edit Class Details Dialog Modal */}
            <ClassEditDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                classItem={selectedClass}
                onSaved={fetchClassesData}
            />
        </div>
    )
}

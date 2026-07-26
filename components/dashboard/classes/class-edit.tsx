"use client"

import * as React from "react"
import {
    BookOpen,
    Users,
    Calendar as CalendarIcon,
    Clock,
    GraduationCap,
    Building2,
    Palette,
    CheckCircle2,
    Archive,
    Loader2,
    Save,
    ChevronDown,
    Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    ClassQueryResult,
    TeacherOption,
    getTeachersList,
    updateClassDetails,
} from "@/lib/queries/classes"
import { cn } from "@/lib/utils"

export interface ClassEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    classItem: ClassQueryResult | null
    onSaved: () => void
}

const THEME_OPTIONS: Array<{ value: string; label: string; bgClass: string; textClass: string; borderClass: string }> = [
    { value: "orange", label: "Orange", bgClass: "bg-[#F97316]", textClass: "text-[#C2410C]", borderClass: "border-[#F97316]" },
    { value: "green", label: "Green", bgClass: "bg-[#7BC55A]", textClass: "text-[#4D9E27]", borderClass: "border-[#7BC55A]" },
    { value: "yellow", label: "Yellow", bgClass: "bg-[#F59E0B]", textClass: "text-[#854D0E]", borderClass: "border-[#F59E0B]" },
    { value: "blue", label: "Blue", bgClass: "bg-[#62A9E6]", textClass: "text-[#2E79B9]", borderClass: "border-[#62A9E6]" },
]

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const GRADE_OPTIONS = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"]

// Helpers for schedule parsing and formatting
const parseScheduleDays = (schedStr: string) => {
    let startDay = "Monday"
    let endDay = "Wednesday"
    let parsedTime = "10:00"

    if (schedStr) {
        // Find time pattern e.g. "10:00 AM" or "10:00"
        const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i
        const timeMatch = schedStr.match(timeRegex)
        if (timeMatch) {
            let hours = parseInt(timeMatch[1], 10)
            const minutes = timeMatch[2]
            const ampm = timeMatch[3]
            if (ampm) {
                if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12
                if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0
            }
            parsedTime = `${String(hours).padStart(2, '0')}:${minutes}`
        }

        // Extract days
        const matchedDays: string[] = []
        DAYS_OF_WEEK.forEach((day) => {
            if (
                new RegExp(day, "i").test(schedStr) ||
                new RegExp(day.substring(0, 3), "i").test(schedStr)
            ) {
                matchedDays.push(day)
            }
        })

        if (matchedDays.length >= 2) {
            startDay = matchedDays[0]
            endDay = matchedDays[matchedDays.length - 1]
        } else if (matchedDays.length === 1) {
            startDay = matchedDays[0]
            endDay = matchedDays[0]
        }
    }
    return { startDay, endDay, time: parsedTime }
}

const formatTime12h = (time24: string): string => {
    if (!time24) return ""
    const [hoursStr, minutesStr] = time24.split(":")
    let hours = parseInt(hoursStr, 10)
    const minutes = minutesStr || "00"
    const ampm = hours >= 12 ? "PM" : "AM"
    hours = hours % 12
    hours = hours ? hours : 12
    return `${hours}:${minutes} ${ampm}`
}

const getFormattedSchedule = (startDay: string, endDay: string, time24: string): string => {
    const formattedTime = formatTime12h(time24)
    if (!startDay) return formattedTime
    if (!endDay || startDay === endDay) {
        return `${startDay} ${formattedTime}`
    }
    return `${startDay} - ${endDay} ${formattedTime}`
}

export function ClassEditDialog({
    open,
    onOpenChange,
    classItem,
    onSaved,
}: ClassEditDialogProps) {
    const [title, setTitle] = React.useState<string>("")
    const [grade, setGrade] = React.useState<string>("")
    const [themeName, setThemeName] = React.useState<string>("blue")
    const [teacherId, setTeacherId] = React.useState<string>("unassigned")
    const [isArchived, setIsArchived] = React.useState<boolean>(false)

    // Schedule Picker States (Restricted to Monday - Friday)
    const [startDay, setStartDay] = React.useState<string>("Monday")
    const [endDay, setEndDay] = React.useState<string>("Wednesday")
    const [scheduleTime, setScheduleTime] = React.useState<string>("10:00")

    const [teachers, setTeachers] = React.useState<TeacherOption[]>([])
    const [loadingTeachers, setLoadingTeachers] = React.useState<boolean>(false)
    const [saving, setSaving] = React.useState<boolean>(false)
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

    // Load available teachers on mount / dialog open
    React.useEffect(() => {
        if (open) {
            let isMounted = true
            async function loadTeachers() {
                setLoadingTeachers(true)
                const list = await getTeachersList()
                if (isMounted) {
                    setTeachers(list)
                    setLoadingTeachers(false)
                }
            }
            loadTeachers()
            return () => {
                isMounted = false
            }
        }
    }, [open])

    // Populate form inputs whenever classItem changes or dialog opens
    React.useEffect(() => {
        if (classItem) {
            setTitle(classItem.title || "")
            setGrade(classItem.grade || "")
            setThemeName((classItem.theme_name || "blue").toLowerCase())
            setTeacherId(classItem.teacher_id || "unassigned")
            setIsArchived(Boolean(classItem.is_archived))
            setErrorMsg(null)

            // Extract schedule start day, end day, and time
            const parsed = parseScheduleDays(classItem.schedule || "")
            setStartDay(parsed.startDay)
            setEndDay(parsed.endDay)
            setScheduleTime(parsed.time)
        }
    }, [classItem, open])

    if (!classItem) return null

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            setErrorMsg("Class title cannot be empty.")
            return
        }

        setSaving(true)
        setErrorMsg(null)

        // Construct formatted schedule string (e.g. "Monday - Wednesday 10:00 AM")
        const formattedSchedule = getFormattedSchedule(startDay, endDay, scheduleTime)

        const updates = {
            title: title.trim(),
            grade: grade.trim(),
            schedule: formattedSchedule,
            theme_name: themeName.toLowerCase(),
            teacher_id: teacherId === "unassigned" ? null : teacherId,
            is_archived: isArchived,
        }

        const res = await updateClassDetails(classItem.id, updates)

        setSaving(false)

        if (res.success) {
            onSaved()
            onOpenChange(false)
        } else {
            setErrorMsg("Failed to update class details. Please try again.")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader className="pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#62A9E6]/15 text-[#2E79B9] font-bold text-lg font-fredoka shrink-0">
                            <BookOpen className="size-6 text-[#2E79B9]" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold font-fredoka text-slate-800">
                                View & Edit Class Details
                            </DialogTitle>
                            <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">
                                Modify class details
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSave} className="space-y-4 py-2">
                    {errorMsg && (
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600">
                            {errorMsg}
                        </div>
                    )}

                    {/* Class Summary Banner */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                                Enrolled Students
                            </span>
                            <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <Users className="size-4 text-[#2E79B9]" />
                                {classItem.studentsCount} {classItem.studentsCount === 1 ? "student" : "students"}
                            </span>
                        </div>
                    </div>

                    {/* Form Input Fields */}
                    <div className="space-y-3">
                        {/* Class Title */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Class Name / Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Butterfly Class"
                                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs focus:border-[#62A9E6] focus:outline-hidden"
                                required
                            />
                        </div>

                        {/* Grade & Assigned Teacher Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Grade */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                    <GraduationCap className="size-3.5 text-slate-400" />
                                    Grade Level
                                </label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-between hover:bg-slate-50 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer">
                                        <span>{grade || "Grade 1"}</span>
                                        <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[var(--anchor-width)] min-w-[160px] max-h-56 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50"
                                    >
                                        {GRADE_OPTIONS.map((g) => {
                                            const isSelected = grade === g
                                            return (
                                                <DropdownMenuItem
                                                    key={g}
                                                    onClick={() => setGrade(g)}
                                                    className={cn(
                                                        "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                        isSelected ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span>{g}</span>
                                                    {isSelected && <Check className="size-3.5 text-[#2E79B9]" />}
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Assigned Teacher */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                    <Building2 className="size-3.5 text-slate-400" />
                                    Assigned Teacher
                                </label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        disabled={loadingTeachers}
                                        className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-between hover:bg-slate-50 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer disabled:opacity-50"
                                    >
                                        <span className="truncate">
                                            {loadingTeachers
                                                ? "Loading teachers..."
                                                : teacherId === "unassigned" || !teachers.find((t) => t.id === teacherId)
                                                    ? "Unassigned"
                                                    : `${teachers.find((t) => t.id === teacherId)?.name}${teachers.find((t) => t.id === teacherId)?.university
                                                        ? ` (${teachers.find((t) => t.id === teacherId)?.university})`
                                                        : ""
                                                    }`}
                                        </span>
                                        <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-[var(--anchor-width)] min-w-[240px] max-h-60 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => setTeacherId("unassigned")}
                                            className={cn(
                                                "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                teacherId === "unassigned" ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                            )}
                                        >
                                            <span>Unassigned</span>
                                            {teacherId === "unassigned" && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                        {teachers.map((t) => {
                                            const isSelected = teacherId === t.id
                                            const label = `${t.name}${t.university ? ` (${t.university})` : ""}`
                                            return (
                                                <DropdownMenuItem
                                                    key={t.id}
                                                    onClick={() => setTeacherId(t.id)}
                                                    className={cn(
                                                        "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                        isSelected ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span className="truncate">{label}</span>
                                                    {isSelected && <Check className="size-3.5 text-[#2E79B9] shrink-0 ml-2" />}
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Schedule Section: Start Day, End Day (Monday - Friday) and Time */}
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                    <CalendarIcon className="size-3.5 text-slate-400" />
                                    Class Schedule
                                </label>
                                <span className="text-[11px] font-bold text-[#2E79B9] bg-[#62A9E6]/10 px-2 py-0.5 rounded-lg border border-[#62A9E6]/20">
                                    {getFormattedSchedule(startDay, endDay, scheduleTime)}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {/* Start Day Dropdown */}
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                        From (Start Day)
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                                            <span>{startDay}</span>
                                            <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-1" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-36 rounded-2xl p-1 bg-white border border-slate-200 shadow-xl z-50">
                                            {DAYS_OF_WEEK.map((d) => (
                                                <DropdownMenuItem
                                                    key={d}
                                                    onClick={() => setStartDay(d)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between",
                                                        startDay === d ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span>{d}</span>
                                                    {startDay === d && <Check className="size-3.5 text-[#2E79B9]" />}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* End Day Dropdown */}
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                        To (End Day)
                                    </span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                                            <span>{endDay}</span>
                                            <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-1" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-36 rounded-2xl p-1 bg-white border border-slate-200 shadow-xl z-50">
                                            {DAYS_OF_WEEK.map((d) => (
                                                <DropdownMenuItem
                                                    key={d}
                                                    onClick={() => setEndDay(d)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between",
                                                        endDay === d ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                                    )}
                                                >
                                                    <span>{d}</span>
                                                    {endDay === d && <Check className="size-3.5 text-[#2E79B9]" />}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Time Picker */}
                                <div>
                                    <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                                        Time
                                    </span>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            className="w-full h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs focus:border-[#62A9E6] focus:outline-hidden cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile App Theme Name Selection */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                                <Palette className="size-3.5 text-slate-400" />
                                Theme
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {THEME_OPTIONS.map((theme) => {
                                    const isSelected = themeName === theme.value
                                    return (
                                        <button
                                            key={theme.value}
                                            type="button"
                                            onClick={() => setThemeName(theme.value)}
                                            className={cn(
                                                "h-9 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer",
                                                isSelected
                                                    ? `${theme.borderClass} bg-slate-100 ring-2 ring-offset-1 ring-[#62A9E6]`
                                                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            <span className={cn("size-3 rounded-full", theme.bgClass)} />
                                            <span className="capitalize">{theme.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Status (Archived toggle) */}
                        <div className="pt-1">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                Class Status
                            </label>
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setIsArchived(false)}
                                    className={cn(
                                        "flex-1 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                                        !isArchived
                                            ? "bg-[#AEE295]/30 text-[#3B7A1E] border border-[#AEE295]/60"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <CheckCircle2 className="size-3.5" />
                                    <span>Active</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsArchived(true)}
                                    className={cn(
                                        "flex-1 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                                        isArchived
                                            ? "bg-slate-200 text-slate-700 border border-slate-300"
                                            : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    <Archive className="size-3.5" />
                                    <span>Archived</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dialog Actions */}
                    <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={saving}
                            className="h-9 px-4 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving}
                            className="h-9 px-5 bg-[#62A9E6] hover:bg-[#5299D6] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="size-3.5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="size-3.5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

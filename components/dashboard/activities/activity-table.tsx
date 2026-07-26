"use client";

import * as React from "react";
import {
    Puzzle,
    ChevronDown,
    Search,
    Eye,
    MoreHorizontal,
    Check,
    AlertCircle,
    EyeOff,
    Sparkles,
    Save,
    Loader2,
    CheckCircle2,
    Tag,
    Gauge,
    Layers,
    Plus,
    X,
} from "lucide-react";

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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import {
    getActivities,
    getActivityCategories,
    getActivitySubCategories,
    getAllSkillDomains,
    toggleHideActivity,
    updateActivityDetails,
    getDifficultyLabel,
    getCategoryBase,
    getRelativeDifficulty,
    calculateNewDifficulty,
    type ActivityItem,
} from "@/lib/queries/activities";

const mockActivities: ActivityItem[] = [
    {
        id: "act-01",
        title: "Basic Alphabet Line Tracing",
        category: "Tracing",
        sub_category: "Letter Tracing",
        skill_domain: ["Fine Motor", "Hand-Eye Coordination", "Letter Recognition"],
        difficulty_level: 11,
        difficulty_label: "Easy",
        createdAt: "2026-07-24",
        assignedStudentsCount: 24,
        is_hidden: false,
    },
    {
        id: "act-02",
        title: "Colorful Shapes Bubble Pop",
        category: "Bubble-Pop",
        sub_category: "Shape Pop",
        skill_domain: ["Visual Perception", "Reaction Speed", "Focus & Attention"],
        difficulty_level: 11,
        difficulty_label: "Easy",
        createdAt: "2026-07-22",
        assignedStudentsCount: 18,
        is_hidden: false,
    },
    {
        id: "act-03",
        title: "Object Category Drag & Drop",
        category: "Drag-Drop",
        sub_category: "Object Matching",
        skill_domain: ["Cognitive Categorization", "Spatial Reasoning", "Fine Motor"],
        difficulty_level: 12,
        difficulty_label: "Medium",
        createdAt: "2026-07-20",
        assignedStudentsCount: 15,
        is_hidden: false,
    },
    {
        id: "act-04",
        title: "Curved & Zig-Zag Path Tracing",
        category: "Tracing",
        sub_category: "Line Tracing",
        skill_domain: ["Fine Motor Precision", "Pencil Control", "Bilateral Coordination"],
        difficulty_level: 12,
        difficulty_label: "Medium",
        createdAt: "2026-07-18",
        assignedStudentsCount: 12,
        is_hidden: false,
    },
    {
        id: "act-05",
        title: "Fast Number Sequence Pop",
        category: "Bubble-Pop",
        sub_category: "Target Pop",
        skill_domain: ["Number Recognition", "Sequential Memory", "Speed"],
        difficulty_level: 13,
        difficulty_label: "Hard",
        createdAt: "2026-07-15",
        assignedStudentsCount: 9,
        is_hidden: false,
    },
    {
        id: "act-06",
        title: "Color & Shape Pattern Match",
        category: "Patterning",
        sub_category: "Sequence Pattern",
        skill_domain: ["Logical Reasoning", "Pattern Completion", "Problem Solving"],
        difficulty_level: 13,
        difficulty_label: "Hard",
        createdAt: "2026-07-12",
        assignedStudentsCount: 14,
        is_hidden: false,
    },
    {
        id: "act-07",
        title: "Animal Shadow Matching",
        category: "Matching",
        sub_category: "Object Matching",
        skill_domain: ["Visual Discrimination", "Shape Recognition"],
        difficulty_level: 11,
        difficulty_label: "Easy",
        createdAt: "2026-07-10",
        assignedStudentsCount: 20,
        is_hidden: false,
    },
];

const categoryBadgeStyles: Record<string, string> = {
    Tracing: "bg-[#62A9E6]/15 border border-[#62A9E6]/30 text-[#2E79B9]",
    "Bubble-Pop": "bg-[#ED529B]/15 border border-[#ED529B]/30 text-[#C22971]",
    "Drag-Drop": "bg-[#E8B00C]/15 border border-[#E8B00C]/30 text-[#A67C00]",
    Matching: "bg-[#AD99E6]/15 border border-[#AD99E6]/30 text-[#6444B8]",
    Patterning: "bg-[#AEE295]/20 border border-[#AEE295]/35 text-[#3B7A1E]",
    "Sensory Play": "bg-[#E8B00C]/15 border border-[#E8B00C]/30 text-[#A67C00]",
};

const difficultyBadgeStyles: Record<string, string> = {
    Easy: "bg-emerald-100/70 border border-emerald-300/60 text-emerald-700",
    Medium: "bg-amber-100/70 border border-amber-300/60 text-amber-700",
    Hard: "bg-rose-100/70 border border-rose-300/60 text-rose-700",
    Custom: "bg-slate-100 border border-slate-200 text-slate-700",
};

const RELATIVE_DIFFICULTY_OPTIONS = [
    { value: 1, label: "Easy" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Hard" },
];

const FALLBACK_CATEGORIES = ["Tracing", "Bubble-Pop", "Drag-Drop", "Matching", "Patterning"];
const FALLBACK_SUBCATEGORIES = [
    "Letter Tracing",
    "Line Tracing",
    "Shape Pop",
    "Target Pop",
    "Object Matching",
    "Sequence Pattern",
];

const DEFAULT_SKILLS_CATALOG = [
    "Fine Motor",
    "Hand-Eye Coordination",
    "Letter Recognition",
    "Visual Perception",
    "Reaction Speed",
    "Focus & Attention",
    "Cognitive Categorization",
    "Spatial Reasoning",
    "Fine Motor Precision",
    "Pencil Control",
    "Bilateral Coordination",
    "Number Recognition",
    "Sequential Memory",
    "Speed",
    "Logical Reasoning",
    "Pattern Completion",
    "Problem Solving",
    "Visual Discrimination",
    "Shape Recognition",
];

export function ActivityTable() {
    const [activities, setActivities] = React.useState<ActivityItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
    const [difficultyFilter, setDifficultyFilter] = React.useState<string>("all");
    const [visibilityFilter, setVisibilityFilter] = React.useState<string>("all");
    const [sortBy, setSortBy] = React.useState<string>("newest");

    // Dynamic Categories, Subcategories & Skill domains fetched from DB
    const [availableCategories, setAvailableCategories] = React.useState<string[]>(FALLBACK_CATEGORIES);
    const [availableSubCategories, setAvailableSubCategories] = React.useState<string[]>(FALLBACK_SUBCATEGORIES);
    const [skillsCatalog, setSkillsCatalog] = React.useState<string[]>(DEFAULT_SKILLS_CATALOG);

    // Edit Modal states
    const [selectedActivity, setSelectedActivity] = React.useState<ActivityItem | null>(null);
    const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);

    // Form inputs state inside Edit Modal
    const [editTitle, setEditTitle] = React.useState<string>("");
    const [editCategory, setEditCategory] = React.useState<string>("Tracing");
    const [editSubCategory, setEditSubCategory] = React.useState<string>("Letter Tracing");
    const [editRelativeDifficulty, setEditRelativeDifficulty] = React.useState<number>(1); // 1 = Easy, 2 = Medium, 3 = Hard
    const [editSkills, setEditSkills] = React.useState<string[]>([]);
    const [editIsHidden, setEditIsHidden] = React.useState<boolean>(false);

    const [saving, setSaving] = React.useState<boolean>(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    // Skills view dialog state
    const [skillsActivity, setSkillsActivity] = React.useState<ActivityItem | null>(null);
    const [skillsOpen, setSkillsOpen] = React.useState<boolean>(false);

    // Hide confirmation modal state
    const [pendingHideActivity, setPendingHideActivity] = React.useState<ActivityItem | null>(null);
    const [confirmHideOpen, setConfirmHideOpen] = React.useState<boolean>(false);
    const [hiding, setHiding] = React.useState<boolean>(false);

    // Fetch initial activities, categories, subcategories, and skill domains
    React.useEffect(() => {
        let isMounted = true;
        async function loadActivitiesData() {
            setLoading(true);
            const [dbData, catList, subCatList, dbSkillsList] = await Promise.all([
                getActivities(),
                getActivityCategories(),
                getActivitySubCategories(),
                getAllSkillDomains(),
            ]);

            if (isMounted) {
                if (dbData && dbData.length > 0) {
                    setActivities(dbData);
                } else {
                    setActivities(mockActivities);
                }

                if (catList && catList.length > 0) {
                    setAvailableCategories(catList);
                }
                if (subCatList && subCatList.length > 0) {
                    setAvailableSubCategories(subCatList);
                }
                if (dbSkillsList && dbSkillsList.length > 0) {
                    // Combine DB skills with default catalog for comprehensive options
                    const combined = Array.from(new Set([...DEFAULT_SKILLS_CATALOG, ...dbSkillsList])).sort();
                    setSkillsCatalog(combined);
                }

                setLoading(false);
            }
        }
        loadActivitiesData();
        return () => {
            isMounted = false;
        };
    }, []);

    // Dynamically fetch subcategories when editCategory changes
    React.useEffect(() => {
        if (editCategory) {
            let isMounted = true;
            async function fetchSubs() {
                const subCats = await getActivitySubCategories(editCategory);
                if (isMounted && subCats && subCats.length > 0) {
                    setAvailableSubCategories(subCats);
                }
            }
            fetchSubs();
            return () => {
                isMounted = false;
            };
        }
    }, [editCategory]);

    // Populate edit form when selectedActivity or detailsOpen changes
    React.useEffect(() => {
        if (selectedActivity) {
            setEditTitle(selectedActivity.title || "");
            setEditCategory(selectedActivity.category || "Tracing");
            setEditSubCategory(selectedActivity.sub_category || "General");
            setEditRelativeDifficulty(getRelativeDifficulty(selectedActivity.difficulty_level));
            setEditSkills(selectedActivity.skill_domain ? [...selectedActivity.skill_domain] : []);
            setEditIsHidden(Boolean(selectedActivity.is_hidden));
            setErrorMsg(null);
        }
    }, [selectedActivity, detailsOpen]);

    const handleViewDetails = (item: ActivityItem) => {
        setSelectedActivity(item);
        setDetailsOpen(true);
    };

    const handleViewSkills = (item: ActivityItem) => {
        setSkillsActivity(item);
        setSkillsOpen(true);
    };

    const handleToggleSkill = (skill: string) => {
        setEditSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setEditSkills((prev) => prev.filter((s) => s !== skillToRemove));
    };

    const requestHideActivity = (item: ActivityItem) => {
        setPendingHideActivity(item);
        setConfirmHideOpen(true);
    };

    const handleConfirmHideActivity = async () => {
        if (!pendingHideActivity) return;
        setHiding(true);
        const res = await toggleHideActivity(pendingHideActivity.id, true);
        if (res.success) {
            setActivities((prev) =>
                prev.map((a) =>
                    a.id === pendingHideActivity.id ? { ...a, is_hidden: true } : a
                )
            );
        }
        setHiding(false);
        setConfirmHideOpen(false);
        setPendingHideActivity(null);
    };

    const handleUnhideActivity = async (item: ActivityItem) => {
        const res = await toggleHideActivity(item.id, false);
        if (res.success) {
            setActivities((prev) =>
                prev.map((a) =>
                    a.id === item.id ? { ...a, is_hidden: false } : a
                )
            );
        }
    };

    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedActivity) return;

        if (!editTitle.trim()) {
            setErrorMsg("Activity name cannot be empty.");
            return;
        }

        setSaving(true);
        setErrorMsg(null);

        // Base-10 tier system calculation
        const categoryBase = getCategoryBase(selectedActivity.difficulty_level);
        const newDifficultyLevel = calculateNewDifficulty(categoryBase, editRelativeDifficulty);
        const newDifficultyLabel = getDifficultyLabel(newDifficultyLevel);

        const updates = {
            title: editTitle.trim(),
            category: editCategory,
            sub_category: editSubCategory,
            skill_domain: editSkills,
            difficulty_level: newDifficultyLevel,
            is_hidden: editIsHidden,
        };

        const res = await updateActivityDetails(selectedActivity.id, updates);

        setSaving(false);

        if (res.success) {
            // Update local component state
            setActivities((prev) =>
                prev.map((a) =>
                    a.id === selectedActivity.id
                        ? {
                            ...a,
                            ...updates,
                            difficulty_level: newDifficultyLevel,
                            difficulty_label: newDifficultyLabel,
                        }
                        : a
                )
            );
            setDetailsOpen(false);
        } else {
            setErrorMsg("Failed to update activity details. Please try again.");
        }
    };

    // Filter & sort logic
    const processedActivities = React.useMemo(() => {
        let result = [...activities];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (a) =>
                    a.title.toLowerCase().includes(q) ||
                    a.category.toLowerCase().includes(q) ||
                    a.sub_category.toLowerCase().includes(q) ||
                    a.skill_domain.some((s) => s.toLowerCase().includes(q))
            );
        }

        // Category filter
        if (categoryFilter !== "all") {
            result = result.filter((a) => a.category === categoryFilter);
        }

        // Difficulty filter
        if (difficultyFilter !== "all") {
            result = result.filter((a) => {
                const label = a.difficulty_label || getDifficultyLabel(a.difficulty_level);
                return label === difficultyFilter;
            });
        }

        // Visibility filter
        if (visibilityFilter === "active") {
            result = result.filter((a) => !a.is_hidden);
        } else if (visibilityFilter === "hidden") {
            result = result.filter((a) => a.is_hidden);
        }

        // Sort logic
        result.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return a.createdAt.localeCompare(b.createdAt);
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "title-desc":
                    return b.title.localeCompare(a.title);
                case "newest":
                default:
                    return b.createdAt.localeCompare(a.createdAt);
            }
        });

        return result;
    }, [activities, searchQuery, categoryFilter, difficultyFilter, visibilityFilter, sortBy]);

    return (
        <>
            <Card className="w-full flex flex-col gap-0 py-0 border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
                {/* Header with Title, Description & Search / Filters */}
                <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 shrink-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#62A9E6]/15 text-[#62A9E6] shadow-sm shrink-0">
                                <Puzzle className="size-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                                    Activities Directory
                                </CardTitle>
                                <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                                    Filter, search, and manage registered activities
                                </CardDescription>
                            </div>
                        </div>

                        {/* Filter & Sort Controls */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Search Input Box */}
                            <div className="relative w-64 sm:w-72 md:w-80 shrink-0">
                                <Search className="pointer-events-none absolute left-3 top-2.5 size-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search activity, category or skill"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search activities"
                                    className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden"
                                    style={{ color: "#4B5161" }}
                                />
                            </div>

                            {/* Category Filter Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {categoryFilter === "all" ? "All Categories" : categoryFilter}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[150px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    <DropdownMenuItem
                                        onClick={() => setCategoryFilter("all")}
                                        className={cn(
                                            "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                            categoryFilter === "all" ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                        )}
                                    >
                                        <span>All Categories</span>
                                        {categoryFilter === "all" && <Check className="size-3.5 text-[#2E79B9]" />}
                                    </DropdownMenuItem>
                                    {availableCategories.map((cat) => (
                                        <DropdownMenuItem
                                            key={cat}
                                            onClick={() => setCategoryFilter(cat)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                categoryFilter === cat ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{cat}</span>
                                            {categoryFilter === cat && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Difficulty Filter Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {difficultyFilter === "all" ? "All Difficulties" : difficultyFilter}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[140px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Difficulties" },
                                        { value: "Easy", label: "Easy" },
                                        { value: "Medium", label: "Medium" },
                                        { value: "Hard", label: "Hard" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setDifficultyFilter(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                difficultyFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {difficultyFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Visibility Filter Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {visibilityFilter === "all"
                                            ? "All Statuses"
                                            : visibilityFilter === "active"
                                                ? "Active"
                                                : "Hidden"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[140px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Statuses" },
                                        { value: "active", label: "Active" },
                                        { value: "hidden", label: "Hidden" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setVisibilityFilter(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                visibilityFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {visibilityFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Sort Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {sortBy === "newest"
                                            ? "Newest First"
                                            : sortBy === "oldest"
                                                ? "Oldest First"
                                                : sortBy === "title-asc"
                                                    ? "Title (A-Z)"
                                                    : "Title (Z-A)"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[150px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "newest", label: "Newest First" },
                                        { value: "oldest", label: "Oldest First" },
                                        { value: "title-asc", label: "Title (A-Z)" },
                                        { value: "title-desc", label: "Title (Z-A)" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setSortBy(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                sortBy === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
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

                {/* Content Table Area */}
                <CardContent className="p-0">
                    <Table containerClassName="max-h-[460px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs pl-6 border-b border-slate-200 shadow-2xs">
                                    Name
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Category
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Sub category
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Skills
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Difficulty Level
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs text-right pr-6 border-b border-slate-200 shadow-2xs">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-400 font-semibold">
                                        Loading activity records...
                                    </TableCell>
                                </TableRow>
                            ) : processedActivities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-400 font-semibold">
                                        No matching activities found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                processedActivities.map((item) => {
                                    const catStyle =
                                        categoryBadgeStyles[item.category] ||
                                        "bg-slate-100 border border-slate-200 text-[#4B5161]";

                                    const diffLabel = item.difficulty_label || getDifficultyLabel(item.difficulty_level);
                                    const diffStyle =
                                        difficultyBadgeStyles[diffLabel] ||
                                        "bg-slate-100 border border-slate-200 text-[#4B5161]";

                                    // Compact Skills handling: show up to 2 skills, click to view all skills
                                    const visibleSkills = item.skill_domain.slice(0, 2);
                                    const remainingCount = item.skill_domain.length - visibleSkills.length;

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className={cn(
                                                "hover:bg-slate-50/60 transition-colors",
                                                item.is_hidden && "opacity-60 bg-slate-50/40"
                                            )}
                                        >
                                            {/* Name */}
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-[#4B5161] text-sm">
                                                            {item.title}
                                                        </span>
                                                        {item.is_hidden && (
                                                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-200/80 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                                                                <EyeOff className="size-3" />
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-semibold mt-0.5">
                                                        Added {item.createdAt}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Category Pill */}
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold ${catStyle}`}>
                                                    {item.category}
                                                </span>
                                            </TableCell>

                                            {/* Sub category Pill */}
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-xl bg-slate-100/80 border border-slate-200/80 px-2.5 py-1 text-xs font-bold text-[#4B5161]">
                                                    {item.sub_category}
                                                </span>
                                            </TableCell>

                                            {/* Skills - Compact pill layout with click handler */}
                                            <TableCell>
                                                <div
                                                    onClick={() => handleViewSkills(item)}
                                                    className="flex flex-wrap items-center gap-1 max-w-[240px] cursor-pointer group/skills"
                                                    title="Click to view all skills"
                                                >
                                                    {visibleSkills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center rounded-lg bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 text-[11px] font-bold text-indigo-700 shrink-0 group-hover/skills:bg-indigo-100 transition-colors"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {remainingCount > 0 && (
                                                        <span
                                                            className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 shrink-0 group-hover/skills:bg-slate-200 transition-colors"
                                                        >
                                                            +{remainingCount} more
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>

                                            {/* Difficulty Level */}
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold ${diffStyle}`}>
                                                    {diffLabel}
                                                </span>
                                            </TableCell>

                                            {/* Actions 3-dot Button */}
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="size-8 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">
                                                        <MoreHorizontal className="size-4" />
                                                        <span className="sr-only">Open actions menu</span>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 rounded-2xl p-1.5 shadow-lg border border-slate-200/80 bg-white z-50">
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewDetails(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#4B5161] rounded-xl cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <Eye className="size-4 text-slate-500" />
                                                            <span>View Details</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator className="my-1 border-slate-100" />

                                                        {item.is_hidden ? (
                                                            <DropdownMenuItem
                                                                onClick={() => handleUnhideActivity(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus:text-emerald-700 focus:bg-emerald-50 rounded-xl cursor-pointer"
                                                            >
                                                                <Eye className="size-4 text-emerald-600" />
                                                                <span>Unhide Activity</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => requestHideActivity(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-xl cursor-pointer"
                                                            >
                                                                <EyeOff className="size-4 text-red-600" />
                                                                <span>Hide Activity</span>
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View & Edit Activity Details Modal (Editable Form) */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-[560px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl overflow-y-auto max-h-[90vh]">
                    {selectedActivity && (() => {
                        const currentBase = getCategoryBase(selectedActivity.difficulty_level);
                        const computedTargetTier = calculateNewDifficulty(currentBase, editRelativeDifficulty);
                        const relativeLabel = getDifficultyLabel(editRelativeDifficulty);

                        return (
                            <>
                                <DialogHeader className="pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#62A9E6]/15 text-[#2E79B9] font-bold text-lg shrink-0">
                                            <Puzzle className="size-6 text-[#2E79B9]" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-[#4B5161]">
                                                View & Edit Activity Details
                                            </DialogTitle>
                                            <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">
                                                Modify activity details
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>

                                <form onSubmit={handleSaveDetails} className="space-y-4 py-2">
                                    {errorMsg && (
                                        <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs font-bold text-red-600">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Form Input Fields */}
                                    <div className="space-y-3">
                                        {/* Activity Title */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                Activity Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="e.g. Basic Alphabet Line Tracing"
                                                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[#4B5161] shadow-2xs focus:border-[#62A9E6] focus:outline-hidden"
                                                required
                                            />
                                        </div>

                                        {/* Category & Sub Category Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Category Dropdown */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                                    <Tag className="size-3.5 text-slate-400" />
                                                    Category
                                                </label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[#4B5161] shadow-2xs flex items-center justify-between hover:bg-slate-50 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer">
                                                        <span>{editCategory}</span>
                                                        <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[var(--anchor-width)] min-w-[160px] max-h-56 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                                        {availableCategories.map((c) => {
                                                            const isSelected = editCategory === c;
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={c}
                                                                    onClick={() => setEditCategory(c)}
                                                                    className={cn(
                                                                        "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                                        isSelected ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                                                    )}
                                                                >
                                                                    <span>{c}</span>
                                                                    {isSelected && <Check className="size-3.5 text-[#2E79B9]" />}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Sub Category Dropdown */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                                                    <Layers className="size-3.5 text-slate-400" />
                                                    Sub Category
                                                </label>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[#4B5161] shadow-2xs flex items-center justify-between hover:bg-slate-50 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer">
                                                        <span>{editSubCategory}</span>
                                                        <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[var(--anchor-width)] min-w-[160px] max-h-56 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                                        {availableSubCategories.map((sc) => {
                                                            const isSelected = editSubCategory === sc;
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={sc}
                                                                    onClick={() => setEditSubCategory(sc)}
                                                                    className={cn(
                                                                        "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                                        isSelected ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                                                    )}
                                                                >
                                                                    <span>{sc}</span>
                                                                    {isSelected && <Check className="size-3.5 text-[#2E79B9]" />}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>

                                        {/* Difficulty Level & Visibility Status Row */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {/* Base-10 Relative Difficulty Dropdown */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                                                        <Gauge className="size-3.5 text-slate-400" />
                                                        Difficulty Level
                                                    </label>
                                                    {/* Helper Badge displaying full database code */}
                                                    <span className="text-[10px] font-bold text-[#2E79B9] bg-[#62A9E6]/10 px-2 py-0.5 rounded-md border border-[#62A9E6]/25">
                                                        Saves as Tier {computedTargetTier}
                                                    </span>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-[#4B5161] shadow-2xs flex items-center justify-between hover:bg-slate-50 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer">
                                                        <span>{relativeLabel}</span>
                                                        <ChevronDown className="size-4 text-slate-400 shrink-0 ml-2" />
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" className="w-[var(--anchor-width)] min-w-[160px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                                        {RELATIVE_DIFFICULTY_OPTIONS.map((opt) => {
                                                            const isSelected = editRelativeDifficulty === opt.value;
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={opt.value}
                                                                    onClick={() => setEditRelativeDifficulty(opt.value)}
                                                                    className={cn(
                                                                        "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                                        isSelected ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                                                    )}
                                                                >
                                                                    <span>{opt.label}</span>
                                                                    {isSelected && <Check className="size-3.5 text-[#2E79B9]" />}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Visibility Status (Active / Hidden) */}
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                    Visibility
                                                </label>
                                                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 h-10">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditIsHidden(false)}
                                                        className={cn(
                                                            "flex-1 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                                                            !editIsHidden
                                                                ? "bg-[#AEE295]/30 text-[#3B7A1E] border border-[#AEE295]/60"
                                                                : "text-slate-500 hover:text-slate-700"
                                                        )}
                                                    >
                                                        <CheckCircle2 className="size-3.5" />
                                                        <span>Active</span>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => setEditIsHidden(true)}
                                                        className={cn(
                                                            "flex-1 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5",
                                                            editIsHidden
                                                                ? "bg-slate-200 text-slate-700 border border-slate-300"
                                                                : "text-slate-500 hover:text-slate-700"
                                                        )}
                                                    >
                                                        <EyeOff className="size-3.5" />
                                                        <span>Hidden</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skill Domains Interactive Pills & Add Button */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Skill Domains
                                            </label>

                                            <div className="flex flex-wrap items-center gap-1.5 min-h-[44px] p-2 rounded-2xl border border-slate-200 bg-slate-50/50">
                                                {editSkills.length === 0 ? (
                                                    <span className="text-xs font-medium text-slate-400 px-1">
                                                        No skills selected
                                                    </span>
                                                ) : (
                                                    editSkills.map((skill, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 text-xs font-bold text-indigo-700 shadow-2xs"
                                                        >
                                                            <span>{skill}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveSkill(skill)}
                                                                className="size-4 inline-flex items-center justify-center rounded-full hover:bg-indigo-200/80 text-indigo-500 hover:text-indigo-900 transition-colors cursor-pointer ml-0.5"
                                                                title={`Remove ${skill}`}
                                                            >
                                                                <X className="size-3" />
                                                            </button>
                                                        </span>
                                                    ))
                                                )}

                                                {/* Add Skill Dropdown Menu Button */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="inline-flex items-center gap-1 h-7.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 px-2.5 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors cursor-pointer">
                                                        <Plus className="size-3.5 text-indigo-600" />
                                                        <span>Add Skill</span>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="start"
                                                        className="w-60 max-h-60 overflow-y-auto rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50"
                                                    >
                                                        {skillsCatalog.map((skill) => {
                                                            const isSelected = editSkills.includes(skill);
                                                            return (
                                                                <DropdownMenuItem
                                                                    key={skill}
                                                                    onClick={() => handleToggleSkill(skill)}
                                                                    className={cn(
                                                                        "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                                        isSelected ? "bg-indigo-50 text-indigo-700" : "text-[#4B5161] hover:bg-slate-50"
                                                                    )}
                                                                >
                                                                    <span>{skill}</span>
                                                                    {isSelected && <Check className="size-3.5 text-indigo-600" />}
                                                                </DropdownMenuItem>
                                                            );
                                                        })}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dialog Actions */}
                                    <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setDetailsOpen(false)}
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
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            {/* View All Skills Modal */}
            <Dialog open={skillsOpen} onOpenChange={setSkillsOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    {skillsActivity && (
                        <>
                            <DialogHeader className="pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold shrink-0">
                                        <Sparkles className="size-5" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-bold text-[#4B5161]">
                                            Target Skill Domains
                                        </DialogTitle>
                                        <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">
                                            {skillsActivity.title}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="py-3">
                                <div className="flex flex-wrap gap-2">
                                    {skillsActivity.skill_domain.map((skill, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-2xs"
                                        >
                                            <Sparkles className="size-3 text-indigo-500" />
                                            <span>{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Hide Activity Confirmation Modal */}
            <Dialog open={confirmHideOpen} onOpenChange={setConfirmHideOpen}>
                <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl z-50">
                    {pendingHideActivity && (
                        <>
                            <DialogHeader className="pb-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 font-bold shrink-0">
                                        <AlertCircle className="size-6" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-lg font-bold text-[#4B5161]">
                                            Hide Activity
                                        </DialogTitle>
                                        <DialogDescription className="text-xs font-medium text-slate-500 mt-0.5">
                                            Are you sure you want to hide this activity?
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="py-2">
                                <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                                    &quot;{pendingHideActivity.title}&quot; will be hidden from the directory and won&apos;t be assigned to student sessions.
                                </p>
                            </div>

                            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmHideOpen(false)}
                                    className="h-9 px-4 rounded-xl text-xs font-bold text-slate-600 border-slate-200 hover:bg-slate-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleConfirmHideActivity}
                                    disabled={hiding}
                                    className="h-9 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm"
                                >
                                    {hiding ? "Hiding..." : "Hide Activity"}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ActivityTable;

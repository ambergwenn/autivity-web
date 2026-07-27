"use client";

import * as React from "react";
import {
    ShieldCheck,
    ChevronDown,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Ban,
    MoreHorizontal,
    Check,
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import {
    getAdminUsers,
    toggleSuspendAdmin,
    type AdminItem,
} from "@/lib/queries/admin";

const statusBadgeStyles: Record<string, string> = {
    active: "bg-emerald-100/70 border border-emerald-300/60 text-emerald-700",
    inactive: "bg-slate-100 border border-slate-200 text-slate-600",
    suspended: "bg-rose-100/70 border border-rose-300/60 text-rose-700",
};

const MOCK_FALLBACK_ADMINS: AdminItem[] = [
    {
        id: "admin-01",
        name: "Gwenn Amber",
        email: "admin@autivity.com",
        status: "active",
        verificationStatus: "verified",
        createdAt: "2026-01-15",
        lastActive: "Today",
        university: "De La Salle University",
        isSuspended: false,
    },
    {
        id: "admin-02",
        name: "Sarah Jenkins",
        email: "sarah.admin@autivity.com",
        status: "active",
        verificationStatus: "verified",
        createdAt: "2026-02-10",
        lastActive: "Yesterday",
        university: "Ateneo de Manila University",
        isSuspended: false,
    },
    {
        id: "admin-03",
        name: "Michael Cruz",
        email: "michael.cruz@autivity.com",
        status: "inactive",
        verificationStatus: "pending",
        createdAt: "2026-03-01",
        lastActive: "3 weeks ago",
        university: "University of the Philippines",
        isSuspended: false,
    },
];

export function AdminTable() {
    const [admins, setAdmins] = React.useState<AdminItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [sortBy, setSortBy] = React.useState<string>("newest");

    // View Details Modal state (Read-only)
    const [selectedAdmin, setSelectedAdmin] = React.useState<AdminItem | null>(null);
    const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);

    // Suspend confirmation state
    const [pendingSuspendAdmin, setPendingSuspendAdmin] = React.useState<AdminItem | null>(null);
    const [confirmSuspendOpen, setConfirmSuspendOpen] = React.useState<boolean>(false);
    const [suspendDays, setSuspendDays] = React.useState<number>(7);
    const [suspending, setSuspending] = React.useState<boolean>(false);

    // Unsuspend confirmation state
    const [pendingUnsuspendAdmin, setPendingUnsuspendAdmin] = React.useState<AdminItem | null>(null);
    const [confirmUnsuspendOpen, setConfirmUnsuspendOpen] = React.useState<boolean>(false);
    const [unsuspending, setUnsuspending] = React.useState<boolean>(false);

    // Fetch admins on mount
    React.useEffect(() => {
        let isMounted = true;
        async function fetchAdmins() {
            setLoading(true);
            const data = await getAdminUsers();
            if (isMounted) {
                if (data && data.length > 0) {
                    setAdmins(data);
                } else {
                    setAdmins(MOCK_FALLBACK_ADMINS);
                }
                setLoading(false);
            }
        }
        fetchAdmins();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleViewDetails = (item: AdminItem) => {
        setSelectedAdmin(item);
        setDetailsOpen(true);
    };

    // Suspend trigger & handler
    const requestSuspendAdmin = (item: AdminItem) => {
        setPendingSuspendAdmin(item);
        setSuspendDays(7);
        setConfirmSuspendOpen(true);
    };

    const handleConfirmSuspendAdmin = async () => {
        if (!pendingSuspendAdmin) return;
        setSuspending(true);

        const res = await toggleSuspendAdmin(pendingSuspendAdmin.id, true, suspendDays);
        if (res.success) {
            setAdmins((prev) =>
                prev.map((a) =>
                    a.id === pendingSuspendAdmin.id
                        ? { ...a, status: "suspended", isSuspended: true }
                        : a
                )
            );
            if (selectedAdmin && selectedAdmin.id === pendingSuspendAdmin.id) {
                setSelectedAdmin((prev) => (prev ? { ...prev, status: "suspended", isSuspended: true } : null));
            }
        }
        setSuspending(false);
        setConfirmSuspendOpen(false);
        setPendingSuspendAdmin(null);
    };

    // Unsuspend trigger & handler
    const requestUnsuspendAdmin = (item: AdminItem) => {
        setPendingUnsuspendAdmin(item);
        setConfirmUnsuspendOpen(true);
    };

    const handleConfirmUnsuspendAdmin = async () => {
        if (!pendingUnsuspendAdmin) return;
        setUnsuspending(true);

        const res = await toggleSuspendAdmin(pendingUnsuspendAdmin.id, false);
        if (res.success) {
            setAdmins((prev) =>
                prev.map((a) =>
                    a.id === pendingUnsuspendAdmin.id
                        ? { ...a, status: "active", isSuspended: false }
                        : a
                )
            );
            if (selectedAdmin && selectedAdmin.id === pendingUnsuspendAdmin.id) {
                setSelectedAdmin((prev) => (prev ? { ...prev, status: "active", isSuspended: false } : null));
            }
        }
        setUnsuspending(false);
        setConfirmUnsuspendOpen(false);
        setPendingUnsuspendAdmin(null);
    };

    // Filtering & sorting logic
    const processedAdmins = React.useMemo(() => {
        let result = [...admins];

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (a) =>
                    a.name.toLowerCase().includes(q) ||
                    a.email.toLowerCase().includes(q) ||
                    (a.university && a.university.toLowerCase().includes(q))
            );
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter((a) => a.status === statusFilter);
        }

        // Sort logic
        result.sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return a.createdAt.localeCompare(b.createdAt);
                case "name-asc":
                    return a.name.localeCompare(b.name);
                case "name-desc":
                    return b.name.localeCompare(a.name);
                case "newest":
                default:
                    return b.createdAt.localeCompare(a.createdAt);
            }
        });

        return result;
    }, [admins, searchQuery, statusFilter, sortBy]);

    return (
        <>
            <Card className="w-full flex flex-col gap-0 py-0 border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
                {/* Header with Title, Description & Search / Filters */}
                <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 shrink-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#C084FC]/15 text-[#8A35E5] shadow-sm shrink-0">
                                <ShieldCheck className="size-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                                    Administrators Directory
                                </CardTitle>
                                <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                                    Filter, search, and manage registered administrators.
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
                                    placeholder="Search name or email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search administrators"
                                    className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden"
                                    style={{ color: "#4B5161" }}
                                />
                            </div>

                            {/* Status Filter Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {statusFilter === "all"
                                            ? "All Statuses"
                                            : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[140px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Statuses" },
                                        { value: "active", label: "Active" },
                                        { value: "inactive", label: "Inactive" },
                                        { value: "suspended", label: "Suspended" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setStatusFilter(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                statusFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-[#4B5161] hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {statusFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
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
                                                : sortBy === "name-asc"
                                                    ? "Name (A-Z)"
                                                    : "Name (Z-A)"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[150px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "newest", label: "Newest First" },
                                        { value: "oldest", label: "Oldest First" },
                                        { value: "name-asc", label: "Name (A-Z)" },
                                        { value: "name-desc", label: "Name (Z-A)" },
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

                {/* Table Content */}
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                <TableHead className="py-4 pl-6 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Admin Name
                                </TableHead>
                                <TableHead className="py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Email
                                </TableHead>
                                <TableHead className="py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Status
                                </TableHead>
                                <TableHead className="py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                                    Joined Date
                                </TableHead>
                                <TableHead className="py-4 text-xs font-extrabold uppercase tracking-wider text-slate-400 text-right pr-6">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-36 text-center text-xs font-bold text-slate-400">
                                        Loading administrators directory...
                                    </TableCell>
                                </TableRow>
                            ) : processedAdmins.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-36 text-center text-xs font-bold text-slate-400">
                                        No administrators found matching your filter.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                processedAdmins.map((item) => {
                                    const statusStyle = statusBadgeStyles[item.status] || statusBadgeStyles.inactive;

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors"
                                        >
                                            {/* Admin Name */}
                                            <TableCell className="py-3.5 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="inline-flex size-9 items-center justify-center rounded-xl bg-[#C084FC]/15 text-[#8A35E5] font-bold text-xs shrink-0">
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-semibold" style={{ color: "#4B5161" }}>
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            {/* Email */}
                                            <TableCell className="text-xs font-medium text-slate-600">
                                                {item.email}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                {item.isSuspended || item.status === "suspended" ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600">
                                                        <Ban className="size-3.5 shrink-0" />
                                                        <span>Suspended</span>
                                                    </div>
                                                ) : item.status === "active" ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#AEE295]/20 border border-[#AEE295]/35 px-2.5 py-1 text-xs font-bold text-[#3B7A1E]">
                                                        <CheckCircle2 className="size-3.5 shrink-0" />
                                                        <span>Active</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500">
                                                        <Clock className="size-3.5 shrink-0" />
                                                        <span>Inactive</span>
                                                    </div>
                                                )}
                                            </TableCell>

                                            {/* Joined Date */}
                                            <TableCell className="text-xs font-medium text-slate-500">
                                                {item.createdAt}
                                            </TableCell>

                                            {/* Actions 3-dot Button */}
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="size-8 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">
                                                        <MoreHorizontal className="size-4" />
                                                        <span className="sr-only">Open actions menu</span>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-lg border border-slate-200/80 bg-white z-50">
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewDetails(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#4B5161] rounded-xl cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <Eye className="size-4 text-slate-500" />
                                                            <span>View Details</span>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuSeparator className="my-1 border-slate-100" />

                                                        {item.isSuspended ? (
                                                            <DropdownMenuItem
                                                                onClick={() => requestUnsuspendAdmin(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 focus:text-emerald-700 focus:bg-emerald-50 rounded-xl cursor-pointer"
                                                            >
                                                                <CheckCircle2 className="size-4 text-emerald-600" />
                                                                <span>Unsuspend Admin</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => requestSuspendAdmin(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-xl cursor-pointer"
                                                            >
                                                                <Ban className="size-4 text-red-600" />
                                                                <span>Suspend Account</span>
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

            {/* View Details Dialog (Read-only view with Suspend / Unsuspend Action Button) */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7">
                    <DialogHeader className="pb-2">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#C084FC]/15 text-[#8A35E5] font-bold text-base shrink-0">
                                {selectedAdmin?.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-fredoka" style={{ color: "#4B5161" }}>
                                    Admin Details
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 mt-0.5">
                                    View administrator profile details.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedAdmin && (
                        <div className="space-y-4 mt-2">
                            {/* Status Badge */}
                            <div>
                                <span className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-bold ${statusBadgeStyles[selectedAdmin.status] || statusBadgeStyles.inactive}`}>
                                    <span className="capitalize">{selectedAdmin.status}</span>
                                </span>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-0.5 block uppercase tracking-wider">Full Name</label>
                                <p className="text-sm font-bold text-[#4B5161]">{selectedAdmin.name}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-0.5 block uppercase tracking-wider">Email Address</label>
                                <p className="text-sm font-semibold text-slate-600">{selectedAdmin.email}</p>
                            </div>



                            {/* Joined Date */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 mb-0.5 block uppercase tracking-wider">Joined Date</label>
                                <p className="text-sm font-semibold text-slate-600">{selectedAdmin.createdAt}</p>
                            </div>

                            {/* Action Buttons in Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                                {selectedAdmin.isSuspended ? (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setDetailsOpen(false);
                                            requestUnsuspendAdmin(selectedAdmin);
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                        <CheckCircle2 className="size-3.5 text-white" />
                                        <span>Unsuspend Account</span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setDetailsOpen(false);
                                            requestSuspendAdmin(selectedAdmin);
                                        }}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
                                    >
                                        <Ban className="size-3.5 text-red-600" />
                                        <span>Suspend Account</span>
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDetailsOpen(false)}
                                    className="rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-slate-200 cursor-pointer ml-auto"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Suspend Confirmation Modal */}
            <Dialog open={confirmSuspendOpen} onOpenChange={setConfirmSuspendOpen}>
                <DialogContent className="max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-red-100 text-red-600 shrink-0">
                                <Ban className="size-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold font-fredoka" style={{ color: "#4B5161" }}>
                                    Suspend Account
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500">
                                    Are you sure you want to suspend this admin account?
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {pendingSuspendAdmin && (
                        <div className="space-y-3 my-2">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                                <p className="text-sm font-bold text-[#4B5161]">{pendingSuspendAdmin.name}</p>
                                <p className="text-xs font-medium text-slate-500">{pendingSuspendAdmin.email}</p>
                            </div>

                            {/* Suspension Duration Selector */}
                            <div className="w-full text-left space-y-1.5">
                                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                                    Suspension Duration
                                </label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-10 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-bold text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 focus:border-red-400 focus:outline-hidden cursor-pointer flex items-center justify-between">
                                        <span>
                                            {suspendDays === 1
                                                ? "1 day"
                                                : suspendDays === 3
                                                    ? "3 days"
                                                    : suspendDays === 7
                                                        ? "7 days"
                                                        : suspendDays === 14
                                                            ? "14 days"
                                                            : suspendDays === 30
                                                                ? "30 days"
                                                                : "Indefinite"}
                                        </span>
                                        <ChevronDown className="size-4 text-slate-400 shrink-0" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-(--anchor-width) min-w-[200px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                        {[
                                            { value: 1, label: "1 day" },
                                            { value: 3, label: "3 days" },
                                            { value: 7, label: "7 days" },
                                            { value: 14, label: "14 days" },
                                            { value: 30, label: "30 days" },
                                            { value: 0, label: "Indefinite" },
                                        ].map((item) => (
                                            <DropdownMenuItem
                                                key={item.value}
                                                onClick={() => setSuspendDays(item.value)}
                                                className={cn(
                                                    "px-3 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                    suspendDays === item.value ? "bg-red-50 text-red-600 font-extrabold" : "text-slate-700 hover:bg-slate-50"
                                                )}
                                            >
                                                <span>{item.label}</span>
                                                {suspendDays === item.value && <Check className="size-3.5 text-red-600" />}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmSuspendOpen(false)}
                            className="rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-slate-200 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmSuspendAdmin}
                            disabled={suspending}
                            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            <Ban className="size-3.5" />
                            <span>Confirm Suspend</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Unsuspend Confirmation Modal */}
            <Dialog open={confirmUnsuspendOpen} onOpenChange={setConfirmUnsuspendOpen}>
                <DialogContent className="max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shrink-0">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold font-fredoka" style={{ color: "#4B5161" }}>
                                    Unsuspend Account
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500">
                                    Reactivate this administrator's access to the system.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {pendingUnsuspendAdmin && (
                        <div className="my-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                            <p className="text-sm font-bold text-[#4B5161]">{pendingUnsuspendAdmin.name}</p>
                            <p className="text-xs font-medium text-slate-500">{pendingUnsuspendAdmin.email}</p>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmUnsuspendOpen(false)}
                            className="rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border-slate-200 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmUnsuspendAdmin}
                            disabled={unsuspending}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl px-4 flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            <CheckCircle2 className="size-3.5" />
                            <span>Confirm Unsuspend</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default AdminTable;

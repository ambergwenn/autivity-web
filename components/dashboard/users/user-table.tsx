"use client";

import * as React from "react";
import {
    Users,
    ChevronDown,
    Search,
    CheckCircle2,
    Clock,
    XCircle,
    ShieldCheck,
    Eye,
    UserCog,
    Ban,
    MoreHorizontal,
    AlertCircle,
    Check,
    Copy,
    FileImage,
    ExternalLink,
    Maximize2,
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
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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
import { getUsers, updateUserRole, verifyUser, toggleSuspendUser, type UserItem } from "@/lib/queries/users";

const roleBadgeStyles: Record<string, string> = {
    teacher: "bg-[#E8B00C]/15 border border-[#E8B00C]/30 text-[#A67C00]",
    parent: "bg-[#ED529B]/15 border border-[#ED529B]/30 text-[#C22971]",
    student: "bg-[#62A9E6]/15 border border-[#62A9E6]/30 text-[#2E79B9]",
    admin: "bg-[#C084FC]/20 border border-[#C084FC]/40 text-[#8A35E5]",
};

export function UserTable() {
    const [users, setUsers] = React.useState<UserItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [roleFilter, setRoleFilter] = React.useState<string>("all");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [verificationFilter, setVerificationFilter] = React.useState<string>("all");
    const [sortBy, setSortBy] = React.useState<string>("newest");

    // Dialog state for viewing details & confirmation
    const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
    const [detailsOpen, setDetailsOpen] = React.useState<boolean>(false);

    // Verification confirmation state
    const [confirmVerifyOpen, setConfirmVerifyOpen] = React.useState<boolean>(false);
    const [verifying, setVerifying] = React.useState<boolean>(false);

    // Role change confirmation state
    const [pendingRoleChange, setPendingRoleChange] = React.useState<{
        user: UserItem;
        newRole: "teacher" | "parent" | "admin";
    } | null>(null);
    const [confirmRoleOpen, setConfirmRoleOpen] = React.useState<boolean>(false);
    const [changingRole, setChangingRole] = React.useState<boolean>(false);

    // Suspend confirmation state
    const [pendingSuspendUser, setPendingSuspendUser] = React.useState<UserItem | null>(null);
    const [confirmSuspendOpen, setConfirmSuspendOpen] = React.useState<boolean>(false);
    const [suspendDays, setSuspendDays] = React.useState<number>(7);
    const [suspending, setSuspending] = React.useState<boolean>(false);

    // Unsuspend confirmation state
    const [pendingUnsuspendUser, setPendingUnsuspendUser] = React.useState<UserItem | null>(null);
    const [confirmUnsuspendOpen, setConfirmUnsuspendOpen] = React.useState<boolean>(false);

    const [copiedPrc, setCopiedPrc] = React.useState<boolean>(false);
    const [previewImageUrl, setPreviewImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isMounted = true;
        async function loadUsersData() {
            setLoading(true);
            const res = await getUsers();
            if (isMounted) {
                setUsers(res);
                setLoading(false);
            }
        }
        loadUsersData();
        return () => {
            isMounted = false;
        };
    }, []);

    const requestRoleChange = (user: UserItem, newRole: "teacher" | "parent" | "admin") => {
        if (user.role === newRole) return;
        setPendingRoleChange({ user, newRole });
        setConfirmRoleOpen(true);
    };

    const handleConfirmRoleChange = async () => {
        if (!pendingRoleChange) return;
        setChangingRole(true);
        const { user, newRole } = pendingRoleChange;
        const res = await updateUserRole(user.id, newRole);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
            );
            if (selectedUser && selectedUser.id === user.id) {
                setSelectedUser((prev) => (prev ? { ...prev, role: newRole } : null));
            }
        } else {
            console.error("Failed to update user role:", res.error);
        }
        setChangingRole(false);
        setConfirmRoleOpen(false);
        setPendingRoleChange(null);
    };

    const handleViewDetails = (user: UserItem) => {
        setSelectedUser(user);
        setDetailsOpen(true);
    };

    const handleVerify = async (userId: string) => {
        setVerifying(true);
        const res = await verifyUser(userId);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId
                        ? { ...u, verificationStatus: "verified", status: "active" }
                        : u
                )
            );
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser((prev) =>
                    prev ? { ...prev, verificationStatus: "verified", status: "active" } : null
                );
            }
        } else {
            console.error("Failed to verify user:", res.error);
        }
        setVerifying(false);
    };

    const requestSuspend = (user: UserItem) => {
        setPendingSuspendUser(user);
        setSuspendDays(7);
        setConfirmSuspendOpen(true);
    };

    const handleConfirmSuspend = async () => {
        if (!pendingSuspendUser) return;
        setSuspending(true);
        const res = await toggleSuspendUser(pendingSuspendUser.id, true, suspendDays);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === pendingSuspendUser.id
                        ? { ...u, status: "suspended", isSuspended: true }
                        : u
                )
            );
            if (selectedUser && selectedUser.id === pendingSuspendUser.id) {
                setSelectedUser((prev) =>
                    prev ? { ...prev, status: "suspended", isSuspended: true } : null
                );
            }
        } else {
            console.error("Failed to suspend user:", res.error);
        }
        setSuspending(false);
        setConfirmSuspendOpen(false);
        setPendingSuspendUser(null);
    };

    const requestUnsuspend = (user: UserItem) => {
        setPendingUnsuspendUser(user);
        setConfirmUnsuspendOpen(true);
    };

    const handleConfirmUnsuspend = async () => {
        if (!pendingUnsuspendUser) return;
        setSuspending(true);
        const res = await toggleSuspendUser(pendingUnsuspendUser.id, false, 0);
        if (res.success) {
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === pendingUnsuspendUser.id
                        ? { ...u, status: "active", isSuspended: false }
                        : u
                )
            );
            if (selectedUser && selectedUser.id === pendingUnsuspendUser.id) {
                setSelectedUser((prev) =>
                    prev ? { ...prev, status: "active", isSuspended: false } : null
                );
            }
        } else {
            console.error("Failed to unsuspend user:", res.error);
        }
        setSuspending(false);
        setConfirmUnsuspendOpen(false);
        setPendingUnsuspendUser(null);
    };

    const handleCopyPrc = (prc: string) => {
        if (prc && prc !== "N/A") {
            navigator.clipboard.writeText(prc);
            setCopiedPrc(true);
            setTimeout(() => setCopiedPrc(false), 2000);
        }
    };

    // Filter & sort logic
    const processedUsers = React.useMemo(() => {
        let result = [...users];

        // Filter out admins completely from list
        result = result.filter((u) => u.role !== "admin");

        // Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q) ||
                    u.role.toLowerCase().includes(q)
            );
        }

        // Role filter
        if (roleFilter !== "all") {
            result = result.filter((u) => u.role === roleFilter);
        }

        // Status filter (Active/Inactive/Suspended)
        if (statusFilter !== "all") {
            result = result.filter((u) => {
                if (statusFilter === "suspended") {
                    return u.status === "suspended" || u.isSuspended;
                }
                return u.status === statusFilter;
            });
        }

        // Verification filter (Verified/Pending Verification)
        if (verificationFilter !== "all") {
            result = result.filter((u) => u.verificationStatus === verificationFilter);
        }

        // Sorting
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
    }, [users, searchQuery, roleFilter, statusFilter, verificationFilter, sortBy]);

    return (
        <>
            <Card className="w-full flex flex-col gap-0 py-0 border-[2px] border-slate-200/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
                {/* Header with Title, Description, and Select Filters */}
                <CardHeader className="pb-4 px-6 pt-6 border-b border-slate-100 shrink-0">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#62A9E6]/15 text-[#62A9E6] shadow-sm shrink-0">
                                <Users className="size-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold font-fredoka tracking-wide" style={{ color: "#4B5161" }}>
                                    Users Directory
                                </CardTitle>
                                <CardDescription className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>
                                    Filter, search, and manage registered accounts
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
                                    placeholder="Search name or email"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    aria-label="Search users"
                                    className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1 text-xs font-bold shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden"
                                    style={{ color: "#4B5161" }}
                                />
                            </div>

                            {/* Role Filter Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {roleFilter === "all"
                                            ? "All Roles"
                                            : roleFilter === "teacher"
                                                ? "Teachers"
                                                : roleFilter === "parent"
                                                    ? "Parents"
                                                    : "Students"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[140px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Roles" },
                                        { value: "teacher", label: "Teachers" },
                                        { value: "parent", label: "Parents" },
                                        { value: "student", label: "Students" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setRoleFilter(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                roleFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {roleFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Status Filter Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {statusFilter === "all"
                                            ? "All Activity"
                                            : statusFilter === "active"
                                                ? "Active"
                                                : statusFilter === "inactive"
                                                    ? "Inactive"
                                                    : "Suspended"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[140px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Activity" },
                                        { value: "active", label: "Active" },
                                        { value: "inactive", label: "Inactive" },
                                        { value: "suspended", label: "Suspended" },
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

                            {/* Verification Filter Selector */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="h-8.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#4B5161] shadow-2xs transition-colors hover:bg-slate-100 focus:border-[#62A9E6] focus:outline-hidden cursor-pointer flex items-center gap-2">
                                    <span>
                                        {verificationFilter === "all"
                                            ? "All Verification"
                                            : verificationFilter === "verified"
                                                ? "Verified"
                                                : "Pending Verification"}
                                    </span>
                                    <ChevronDown className="size-3.5 text-slate-400 shrink-0" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="min-w-[170px] rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xl z-50">
                                    {[
                                        { value: "all", label: "All Verification" },
                                        { value: "verified", label: "Verified" },
                                        { value: "pending", label: "Pending Verification" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.value}
                                            onClick={() => setVerificationFilter(item.value)}
                                            className={cn(
                                                "px-3 py-1.5 text-xs font-bold rounded-xl cursor-pointer flex items-center justify-between transition-colors",
                                                verificationFilter === item.value ? "bg-slate-100 text-[#2E79B9]" : "text-slate-700 hover:bg-slate-50"
                                            )}
                                        >
                                            <span>{item.label}</span>
                                            {verificationFilter === item.value && <Check className="size-3.5 text-[#2E79B9]" />}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Sort Selector */}
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
                    <Table containerClassName="max-h-[460px]">
                        {/* Sticky Table Header */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs pl-6 border-b border-slate-200 shadow-2xs">
                                    User Details
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Role
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Status
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Verification
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Created At
                                </TableHead>
                                <TableHead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 shadow-2xs">
                                    Last Active
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
                                        Loading user records...
                                    </TableCell>
                                </TableRow>
                            ) : processedUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 font-semibold">
                                        No matching user accounts found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                processedUsers.map((item) => {
                                    const roleBadgeClass =
                                        roleBadgeStyles[item.role] ||
                                        "bg-slate-100 border border-slate-200 text-slate-600";
                                    const isItemSuspended = item.status === "suspended" || item.isSuspended;

                                    return (
                                        <TableRow key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                            <TableCell className="pl-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-sm">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-mono mt-0.5">
                                                        {item.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold capitalize ${roleBadgeClass}`}>
                                                    {item.role}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {isItemSuspended ? (
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
                                                        <XCircle className="size-3.5 shrink-0" />
                                                        <span>Inactive</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.verificationStatus === "verified" ? (
                                                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#62A9E6]/15 border border-[#62A9E6]/30 px-2.5 py-1 text-xs font-bold text-[#2E79B9]">
                                                        <ShieldCheck className="size-3.5 shrink-0" />
                                                        <span>Verified</span>
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#AD99E6]/20 border border-[#AD99E6]/35 px-2.5 py-1 text-xs font-bold text-[#6444B8]">
                                                        <Clock className="size-3.5 shrink-0" />
                                                        <span>Pending Verification</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-500 font-mono">
                                                {item.createdAt}
                                            </TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-600">
                                                {item.lastActive}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger className="size-8 inline-flex items-center justify-center rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">
                                                        <MoreHorizontal className="size-4" />
                                                        <span className="sr-only">Open actions menu</span>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 shadow-lg border border-slate-200/80 bg-white">
                                                        {/* View Details */}
                                                        <DropdownMenuItem
                                                            onClick={() => handleViewDetails(item)}
                                                            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <Eye className="size-4 text-slate-500" />
                                                            <span>View Details</span>
                                                        </DropdownMenuItem>

                                                        {/* Edit Role Submenu (Hidden for Student role) */}
                                                        {item.role !== "student" && (
                                                            <DropdownMenuSub>
                                                                <DropdownMenuSubTrigger className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl cursor-pointer hover:bg-slate-100">
                                                                    <UserCog className="size-4 text-slate-500" />
                                                                    <span>Edit Role</span>
                                                                </DropdownMenuSubTrigger>
                                                                <DropdownMenuSubContent className="w-36 rounded-2xl p-1.5 shadow-lg border border-slate-200/80 bg-white">
                                                                    <DropdownMenuItem
                                                                        onClick={() => requestRoleChange(item, "parent")}
                                                                        className="px-3 py-1.5 text-xs font-bold text-slate-700 rounded-xl cursor-pointer hover:bg-slate-100"
                                                                    >
                                                                        Parent
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => requestRoleChange(item, "teacher")}
                                                                        className="px-3 py-1.5 text-xs font-bold text-slate-700 rounded-xl cursor-pointer hover:bg-slate-100"
                                                                    >
                                                                        Teacher
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuSubContent>
                                                            </DropdownMenuSub>
                                                        )}

                                                        <DropdownMenuSeparator className="my-1 border-slate-100" />

                                                        {/* Suspend / Unsuspend Account */}
                                                        {isItemSuspended ? (
                                                            <DropdownMenuItem
                                                                onClick={() => requestUnsuspend(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl cursor-pointer"
                                                            >
                                                                <CheckCircle2 className="size-4 text-emerald-600" />
                                                                <span>Unsuspend Account</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() => requestSuspend(item)}
                                                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl cursor-pointer"
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

            {/* View Details Dialog Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-[540px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    {selectedUser && (
                        <>
                            <DialogHeader className="pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#62A9E6]/15 text-[#62A9E6] font-bold text-lg font-fredoka">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <DialogTitle className="text-xl font-bold font-fredoka text-slate-800">
                                            {selectedUser.name}
                                        </DialogTitle>
                                        <DialogDescription className="text-xs font-semibold text-slate-500 font-mono mt-0.5">
                                            {selectedUser.email}
                                        </DialogDescription>
                                    </div>
                                </div>
                            </DialogHeader>

                            <div className="space-y-4 py-2">
                                {/* Role, Status & Verification Badges */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* Role Pill */}
                                    <span className={`inline-flex items-center rounded-xl px-2.5 py-1 text-xs font-bold capitalize ${roleBadgeStyles[selectedUser.role] || "bg-slate-100 border border-slate-200 text-slate-600"}`}>
                                        {selectedUser.role}
                                    </span>

                                    {/* Status Pill */}
                                    {selectedUser.status === "suspended" || selectedUser.isSuspended ? (
                                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600">
                                            <Ban className="size-3.5 shrink-0" />
                                            <span>Suspended</span>
                                        </div>
                                    ) : selectedUser.status === "active" ? (
                                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#AEE295]/20 border border-[#AEE295]/35 px-2.5 py-1 text-xs font-bold text-[#3B7A1E]">
                                            <CheckCircle2 className="size-3.5 shrink-0" />
                                            <span>Active</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-500">
                                            <XCircle className="size-3.5 shrink-0" />
                                            <span>Inactive</span>
                                        </div>
                                    )}

                                    {/* Verification Status Pill / Not Verified Red Pill */}
                                    {selectedUser.verificationStatus === "verified" ? (
                                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#62A9E6]/15 border border-[#62A9E6]/30 px-2.5 py-1 text-xs font-bold text-[#2E79B9]">
                                            <ShieldCheck className="size-3.5 shrink-0" />
                                            <span>Verified</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600">
                                            <AlertCircle className="size-3.5 shrink-0" />
                                            <span>Not Verified</span>
                                        </div>
                                    )}
                                </div>

                                {/* User Details Card */}
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                                                Registration Date
                                            </span>
                                            <span className="font-mono font-semibold text-slate-700 text-sm">
                                                {selectedUser.createdAt}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                                                Last Active
                                            </span>
                                            <span className="font-semibold text-slate-700 text-sm">
                                                {selectedUser.lastActive}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                                                Contact Number
                                            </span>
                                            <span className="font-semibold text-slate-700 text-sm">
                                                {selectedUser.contactNumber || "N/A"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">
                                                University
                                            </span>
                                            <span className="font-semibold text-slate-700 text-sm">
                                                {selectedUser.university || "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Role-Specific Details: Teacher */}
                                    {selectedUser.role === "teacher" && (
                                        <div className="pt-3 border-t border-slate-200/60 mt-2 space-y-3">
                                            <div>
                                                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] mb-1">
                                                    PRC ID Number
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-slate-800 text-sm bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                                                        {selectedUser.prcNumber || "N/A"}
                                                    </span>
                                                    {selectedUser.prcNumber && selectedUser.prcNumber !== "N/A" && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCopyPrc(selectedUser.prcNumber!)}
                                                            className="h-8 px-2.5 text-xs font-bold rounded-xl border-slate-200 hover:bg-slate-100 cursor-pointer"
                                                        >
                                                            {copiedPrc ? (
                                                                <>
                                                                    <Check className="size-3.5 text-emerald-600 mr-1" />
                                                                    <span className="text-emerald-600">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="size-3.5 text-slate-500 mr-1" />
                                                                    <span>Copy</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px] mb-1.5">
                                                    Uploaded ID Document
                                                </span>
                                                {selectedUser.idImageUrl ? (
                                                    <div className="relative group rounded-2xl border border-slate-200 bg-white p-2 overflow-hidden shadow-2xs transition-all hover:border-slate-300">
                                                        <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                                                            <img
                                                                src={selectedUser.idImageUrl}
                                                                alt={`${selectedUser.name}'s ID`}
                                                                className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                                                onClick={() => setPreviewImageUrl(selectedUser.idImageUrl!)}
                                                            />
                                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    onClick={() => setPreviewImageUrl(selectedUser.idImageUrl!)}
                                                                    className="h-8 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer border-0"
                                                                >
                                                                    <Maximize2 className="size-3.5" />
                                                                    <span>Expand</span>
                                                                </Button>
                                                                <a
                                                                    href={selectedUser.idImageUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-sm cursor-pointer"
                                                                >
                                                                    <ExternalLink className="size-3.5" />
                                                                    <span>Open</span>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-200 bg-white text-slate-500 text-xs font-semibold">
                                                        <FileImage className="size-4 text-slate-400 shrink-0" />
                                                        <span>No ID image uploaded</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Green Verify Button for Unverified Users */}
                                {selectedUser.verificationStatus === "pending" && (
                                    <div className="pt-2">
                                        <Button
                                            onClick={() => setConfirmVerifyOpen(true)}
                                            className="w-full h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 className="size-4" />
                                            <span>Verify Account</span>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Verification Dialog Modal */}
            <Dialog open={confirmVerifyOpen} onOpenChange={setConfirmVerifyOpen}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    {selectedUser && (
                        <div className="flex flex-col items-center text-center py-2 space-y-4">
                            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-600 border border-emerald-200/80 shadow-xs">
                                <ShieldCheck className="size-7" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-fredoka text-slate-800 text-center">
                                    Confirm Account Verification
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 text-center mt-1.5 leading-relaxed">
                                    Are you sure you want to verify <strong className="text-slate-800 font-bold">{selectedUser.name}</strong>? This will grant their account full verified access.
                                </DialogDescription>
                            </div>

                            <div className="flex items-center gap-3 w-full pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmVerifyOpen(false)}
                                    className="flex-1 h-10 rounded-2xl text-slate-600 font-bold text-xs border-slate-200 hover:bg-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        await handleVerify(selectedUser.id);
                                        setConfirmVerifyOpen(false);
                                    }}
                                    disabled={verifying}
                                    className="flex-1 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
                                >
                                    <CheckCircle2 className="size-4" />
                                    <span>{verifying ? "Verifying..." : "Yes, Verify Account"}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Confirm Role Change Dialog Modal */}
            <Dialog open={confirmRoleOpen} onOpenChange={(open) => {
                setConfirmRoleOpen(open);
                if (!open) setPendingRoleChange(null);
            }}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    {pendingRoleChange && (
                        <div className="flex flex-col items-center text-center py-2 space-y-4">
                            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-purple-100/70 text-purple-600 border border-purple-200/80 shadow-xs">
                                <UserCog className="size-7" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-fredoka text-slate-800 text-center">
                                    Confirm Role Change
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 text-center mt-1.5 leading-relaxed">
                                    Are you sure you want to change the role for <strong className="text-slate-800 font-bold">{pendingRoleChange.user.name}</strong> from <span className="capitalize font-bold text-slate-700">{pendingRoleChange.user.role}</span> to <span className="capitalize font-bold text-purple-600">{pendingRoleChange.newRole}</span>?
                                </DialogDescription>
                            </div>

                            <div className="flex items-center gap-3 w-full pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setConfirmRoleOpen(false);
                                        setPendingRoleChange(null);
                                    }}
                                    className="flex-1 h-10 rounded-2xl text-slate-600 font-bold text-xs border-slate-200 hover:bg-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmRoleChange}
                                    disabled={changingRole}
                                    className="flex-1 h-10 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
                                >
                                    <UserCog className="size-4" />
                                    <span>{changingRole ? "Changing..." : "Yes, Change Role"}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Suspend Account Confirmation Dialog Modal */}
            <Dialog open={confirmSuspendOpen} onOpenChange={(open) => {
                setConfirmSuspendOpen(open);
                if (!open) setPendingSuspendUser(null);
            }}>
                <DialogContent className="sm:max-w-[460px] rounded-3xl p-6 bg-white border border-red-100 shadow-2xl">
                    {pendingSuspendUser && (
                        <div className="flex flex-col items-center text-center py-2 space-y-4">
                            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-red-100/80 text-red-600 border border-red-200/80 shadow-xs">
                                <Ban className="size-7" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-fredoka text-slate-800 text-center">
                                    Suspend Account
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 text-center mt-1.5 leading-relaxed">
                                    Are you sure you want to suspend <strong className="text-slate-800 font-bold">{pendingSuspendUser.name}</strong>? This will restrict their login access.
                                </DialogDescription>
                            </div>

                            {/* Suspension Duration Selector */}
                            <div className="w-full text-left space-y-1.5 pt-1">
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

                            <div className="flex items-center gap-3 w-full pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setConfirmSuspendOpen(false);
                                        setPendingSuspendUser(null);
                                    }}
                                    className="flex-1 h-10 rounded-2xl text-slate-600 font-bold text-xs border-slate-200 hover:bg-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmSuspend}
                                    disabled={suspending}
                                    className="flex-1 h-10 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
                                >
                                    <Ban className="size-4" />
                                    <span>{suspending ? "Suspending..." : "Suspend Account"}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Unsuspend Account Confirmation Dialog Modal */}
            <Dialog open={confirmUnsuspendOpen} onOpenChange={(open) => {
                setConfirmUnsuspendOpen(open);
                if (!open) setPendingUnsuspendUser(null);
            }}>
                <DialogContent className="sm:max-w-[440px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    {pendingUnsuspendUser && (
                        <div className="flex flex-col items-center text-center py-2 space-y-4">
                            <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-emerald-100/70 text-emerald-600 border border-emerald-200/80 shadow-xs">
                                <CheckCircle2 className="size-7" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold font-fredoka text-slate-800 text-center">
                                    Unsuspend Account
                                </DialogTitle>
                                <DialogDescription className="text-xs font-semibold text-slate-500 text-center mt-1.5 leading-relaxed">
                                    Are you sure you want to unsuspend <strong className="text-slate-800 font-bold">{pendingUnsuspendUser.name}</strong>? This will restore their system access.
                                </DialogDescription>
                            </div>

                            <div className="flex items-center gap-3 w-full pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setConfirmUnsuspendOpen(false);
                                        setPendingUnsuspendUser(null);
                                    }}
                                    className="flex-1 h-10 rounded-2xl text-slate-600 font-bold text-xs border-slate-200 hover:bg-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleConfirmUnsuspend}
                                    disabled={suspending}
                                    className="flex-1 h-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer border-0 flex items-center justify-center gap-1.5"
                                >
                                    <CheckCircle2 className="size-4" />
                                    <span>{suspending ? "Unsuspending..." : "Unsuspend Account"}</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* ID Image Preview Lightbox Dialog */}
            <Dialog open={!!previewImageUrl} onOpenChange={(open) => !open && setPreviewImageUrl(null)}>
                <DialogContent className="sm:max-w-[700px] rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    <DialogHeader className="pb-3 border-b border-slate-100">
                        <div className="flex items-center justify-between pr-6">
                            <div>
                                <DialogTitle className="text-lg font-bold font-fredoka text-slate-800">
                                    Teacher ID Document
                                </DialogTitle>
                                {selectedUser && (
                                    <DialogDescription className="text-xs font-semibold text-slate-500 font-mono mt-0.5">
                                        {selectedUser.name} ({selectedUser.email})
                                    </DialogDescription>
                                )}
                            </div>
                            {previewImageUrl && (
                                <a
                                    href={previewImageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors shrink-0"
                                >
                                    <ExternalLink className="size-3.5" />
                                    <span>Open Original</span>
                                </a>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="py-2 flex items-center justify-center max-h-[70vh] overflow-auto">
                        {previewImageUrl && (
                            <img
                                src={previewImageUrl}
                                alt="Teacher ID preview"
                                className="max-w-full max-h-[60vh] object-contain rounded-2xl border border-slate-100 shadow-sm"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default UserTable;

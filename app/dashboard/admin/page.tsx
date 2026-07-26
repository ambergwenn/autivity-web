"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AdminTable } from "@/components/dashboard/admin/admin-table";

export default function AdminPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                window.location.href = "/login";
                return;
            }

            const role = session.user?.user_metadata?.role;
            if (role !== "admin") {
                await supabase.auth.signOut();
                window.location.href = "/login";
                return;
            }

            setLoading(false);
        };

        checkUser();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
                <p className="text-lg font-medium" style={{ color: "#4B5161" }}>Loading Administrators...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold md:text-3xl font-fredoka" style={{ color: "#4B5161" }}>
                        Administrators
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-1">
                        Manage system administrators and staff permissions
                    </p>
                </div>
            </div>

            {/* Administrators Table */}
            <AdminTable />
        </div>
    );
}

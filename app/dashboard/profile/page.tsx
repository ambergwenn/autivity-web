"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentUserProfile, updateCurrentUserProfile, type CurrentUserProfile } from "@/lib/queries/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Check, AlertCircle } from "lucide-react";

export default function ProfilePage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [profile, setProfile] = useState<CurrentUserProfile | null>(null);

    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function loadProfile() {
            setLoading(true);
            const data = await getCurrentUserProfile();
            if (isMounted && data) {
                setProfile(data);
                setFirstName(data.first_name || "");
                setLastName(data.last_name || "");
                setEmail(data.email || "");
                setLoading(false);
            } else if (isMounted) {
                setLoading(false);
            }
        }
        loadProfile();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setStatusMsg(null);

        const res = await updateCurrentUserProfile(profile.id, {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
        });

        if (res.success) {
            setStatusMsg({ type: "success", text: "Account profile updated successfully!" });
            setProfile((prev) =>
                prev ? { ...prev, first_name: firstName.trim(), last_name: lastName.trim() } : null
            );
        } else {
            setStatusMsg({ type: "error", text: "Failed to update profile. Please try again." });
        }
        setSaving(false);
    };

    const handleCancel = () => {
        if (profile) {
            setFirstName(profile.first_name || "");
            setLastName(profile.last_name || "");
            setStatusMsg(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
                <p className="text-lg font-medium" style={{ color: "#4B5161" }}>Loading Account Details...</p>
            </div>
        );
    }

    const fullName = `${firstName} ${lastName}`.trim() || "Administrator";
    const initial = fullName.charAt(0).toUpperCase();

    return (
        <div className="w-full space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold md:text-3xl font-fredoka" style={{ color: "#4B5161" }}>
                    Profile
                </h1>
            </div>

            <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden p-6 sm:p-8">
                <CardContent className="p-0">
                    <form onSubmit={handleSave} className="space-y-8">
                        {statusMsg && (
                            <div
                                className={`p-4 text-xs font-bold rounded-2xl flex items-center gap-2 border ${statusMsg.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-red-50 text-red-600 border-red-200"
                                    }`}
                            >
                                {statusMsg.type === "success" ? (
                                    <Check className="size-4 shrink-0" />
                                ) : (
                                    <AlertCircle className="size-4 shrink-0" />
                                )}
                                <span>{statusMsg.text}</span>
                            </div>
                        )}

                        {/* Top User Profile Info (Avatar + Name & Email) */}
                        <div className="flex items-center gap-5 pb-8 border-b border-slate-100">
                            <Avatar className="size-20 rounded-2xl border-2 border-slate-200 shadow-sm shrink-0">
                                <AvatarFallback className="rounded-2xl bg-[#62A9E6]/20 text-[#2E79B9] font-extrabold text-2xl font-fredoka">
                                    {initial}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold font-fredoka" style={{ color: "#4B5161" }}>
                                    {fullName}
                                </h2>
                                <p className="text-sm font-semibold text-slate-500 mt-0.5">
                                    {email}
                                </p>
                            </div>
                        </div>

                        {/* First Name & Last Name Inputs */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-2 block">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter first name"
                                    className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#4B5161] shadow-2xs transition-colors focus:border-[#62A9E6] focus:outline-hidden"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 mb-2 block">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter last name"
                                    className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#4B5161] shadow-2xs transition-colors focus:border-[#62A9E6] focus:outline-hidden"
                                />
                            </div>
                        </div>



                        {/* Email Input & Edit Email Button */}
                        <div>
                            <label className="text-xs font-bold text-slate-700 mb-2 block">Email</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="email"
                                    disabled
                                    value={email}
                                    className="flex-1 h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-bold text-[#4B5161] hover:bg-slate-50 cursor-pointer shadow-2xs"
                                >
                                    Edit Email
                                </Button>
                            </div>
                            <p className="text-xs font-medium text-slate-400 mt-2">
                                Used to log in to your account
                            </p>
                        </div>

                        {/* Password Section */}
                        <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="text-base font-bold font-fredoka" style={{ color: "#4B5161" }}>
                                    Password
                                </h3>
                                <p className="text-xs font-medium text-slate-400 mt-0.5">
                                    Change your password to keep your account secure
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-11 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-bold text-[#4B5161] hover:bg-slate-50 cursor-pointer shadow-2xs shrink-0"
                            >
                                Change Password
                            </Button>
                        </div>

                        {/* Form Footer Action Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="h-11 rounded-2xl border border-slate-200 bg-white px-6 text-xs font-bold text-[#4B5161] hover:bg-slate-50 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="h-11 rounded-2xl bg-[#62A9E6] hover:bg-[#5299D6] text-white px-8 text-xs font-bold shadow-md cursor-pointer flex items-center gap-2"
                            >
                                {saving && <Loader2 className="size-4 animate-spin" />}
                                <span>Save</span>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

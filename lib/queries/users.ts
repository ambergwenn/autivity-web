import { supabase } from "@/lib/supabase";

export interface UserKPIStats {
  students: number;
  teachers: number;
  parents: number;
  pendingApprovals: number;
  totalUsers: number;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "parent" | "student" | "admin";
  status: "active" | "inactive" | "suspended";
  verificationStatus: "verified" | "pending";
  createdAt: string;
  lastActive: string;
  contactNumber?: string;
  university?: string;
  prcNumber?: string;
  idImageUrl?: string | null;
  learnerCode?: string | null;
  learnerName?: string | null;
  isSuspended?: boolean;
  suspendedUntil?: string | null;
}

/**
 * Fetches user stats for the User Management KPI Cards from profiles and students tables.
 * Performs the exact query pattern as the overview dashboard KPI cards.
 */
export async function getUserKPIs(): Promise<UserKPIStats> {
  try {
    const [teacherCountRes, parentCountRes, pendingCountRes, studentCountRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "parent"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_verified", false),
      supabase.from("students").select("*", { count: "exact", head: true }),
    ]);

    if (teacherCountRes.error) throw teacherCountRes.error;
    if (parentCountRes.error) throw parentCountRes.error;
    if (pendingCountRes.error) console.warn("Pending count error:", pendingCountRes.error);
    if (studentCountRes.error) throw studentCountRes.error;

    const teachers = teacherCountRes.count || 0;
    const parents = parentCountRes.count || 0;
    const students = studentCountRes.count || 0;
    const pendingApprovals = pendingCountRes.count || 0;

    const totalUsers = students + teachers + parents;

    return {
      students,
      teachers,
      parents,
      pendingApprovals,
      totalUsers,
    };
  } catch (error) {
    console.error("Error in getUserKPIs:", error);
    return {
      students: 0,
      teachers: 0,
      parents: 0,
      pendingApprovals: 0,
      totalUsers: 0,
    };
  }
}

export async function getTeacherIdUrl(rawUrl: string): Promise<string | null> {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  const cleaned = rawUrl.trim();
  if (!cleaned) return null;

  let path = cleaned;
  if (cleaned.includes("/teacher-ids/")) {
    path = cleaned.split("/teacher-ids/")[1];
  } else if (cleaned.startsWith("teacher-ids/")) {
    path = cleaned.replace(/^teacher-ids\//, "");
  }

  path = decodeURIComponent(path.split("?")[0]);

  try {
    const { data: signedData, error: signedError } = await supabase.storage
      .from("teacher-ids")
      .createSignedUrl(path, 3600);

    if (!signedError && signedData?.signedUrl) {
      return signedData.signedUrl;
    }

    const { data: publicUrlData } = supabase.storage
      .from("teacher-ids")
      .getPublicUrl(path);

    return publicUrlData?.publicUrl || cleaned;
  } catch (err) {
    console.error("Error generating teacher ID URL:", err);
    return cleaned;
  }
}

/**
 * Fetches user directory items for the Main Users Data Table from profiles, students, and student_sessions.
 */
export async function getUsers(): Promise<UserItem[]> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [profilesRes, studentsRes, sessionsRes] = await Promise.all([
      supabase.from("profiles").select("*"),
      supabase.from("students").select("*"),
      supabase.from("student_sessions").select("student_id, created_at"),
    ]);

    if (profilesRes.error) console.error("Profiles fetch error:", profilesRes.error);
    if (studentsRes.error) console.error("Students fetch error:", studentsRes.error);
    if (sessionsRes.error) console.error("Student sessions fetch error:", sessionsRes.error);

    // Map latest session timestamp per student_id
    const studentLatestSessionMap: Record<string, string> = {};
    if (sessionsRes.data) {
      for (const session of sessionsRes.data) {
        const studentId = session.student_id;
        const sessionDate = session.created_at;
        if (studentId && sessionDate) {
          if (
            !studentLatestSessionMap[studentId] ||
            new Date(sessionDate) > new Date(studentLatestSessionMap[studentId])
          ) {
            studentLatestSessionMap[studentId] = sessionDate;
          }
        }
      }
    }

    // Map student code -> student name from students table
    const studentMapByCode: Record<string, string> = {};
    if (studentsRes.data) {
      for (const s of studentsRes.data) {
        const code = (s.learner_code || s.student_code || "").trim();
        if (code) {
          const combinedStudentName = `${s.first_name || ""} ${s.last_name || ""}`.trim();
          const studentName = combinedStudentName || s.full_name || s.name || "Student Learner";
          studentMapByCode[code] = studentName;
          studentMapByCode[code.toLowerCase()] = studentName;
        }
      }
    }

    const now = new Date();

    // Process profiles (teachers, parents, admins)
    const profilesList: UserItem[] = await Promise.all(
      (profilesRes.data || []).map(async (p: any) => {
        const lastSignInVal = p.last_sign_in_at || p.last_sign_in || p.updated_at;
        const lastSignIn = lastSignInVal ? new Date(lastSignInVal) : null;

        // Verification status from boolean column `is_verified`
        const isVerified = typeof p.is_verified === "boolean" ? p.is_verified : p.status !== "pending";
        const verificationStatus: UserItem["verificationStatus"] = isVerified ? "verified" : "pending";
        
        const suspendedUntilDate = p.suspended_until ? new Date(p.suspended_until) : null;
        const isCurrentlySuspended = p.is_suspended === true || (suspendedUntilDate !== null && suspendedUntilDate > now) || p.status === "suspended";
        
        const status: UserItem["status"] = isCurrentlySuspended
          ? "suspended"
          : (lastSignIn && lastSignIn >= thirtyDaysAgo)
          ? "active"
          : "inactive";

        const roleStr = (p.role || "teacher").toLowerCase();
        const role: UserItem["role"] =
          roleStr === "admin"
            ? "admin"
            : roleStr === "parent"
            ? "parent"
            : "teacher";

        const createdDateVal = p.created_at || p.created_at_timestamp || p.registered_at || p.updated_at;
        
        // Combine first_name and last_name columns from profiles table
        const combinedName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
        const profileName = combinedName || p.full_name || p.name || p.username || (p.email ? p.email.split("@")[0] : "Unnamed User");

        const rawIdImg = p.id_image_url || p.id_image;
        const idImageUrl = rawIdImg ? await getTeacherIdUrl(rawIdImg) : null;

        const learnerCode = (p.learner_code || p.student_code || "").trim() || null;
        const learnerName = learnerCode
          ? studentMapByCode[learnerCode] || studentMapByCode[learnerCode.toLowerCase()] || null
          : null;

        return {
          id: p.id,
          name: profileName,
          email: p.email || "N/A",
          role,
          status,
          verificationStatus,
          createdAt: createdDateVal ? new Date(createdDateVal).toLocaleDateString() : "N/A",
          lastActive: lastSignIn ? lastSignIn.toLocaleDateString() : "Never logged in",
          contactNumber: p.contact_number || p.phone_number || p.phone || "N/A",
          university: p.university || p.school || "N/A",
          prcNumber: p.prc_number || p.prc_id || "N/A",
          idImageUrl,
          learnerCode,
          learnerName,
          isSuspended: isCurrentlySuspended,
          suspendedUntil: p.suspended_until || null,
        };
      })
    );

    // Process students
    const studentsList: UserItem[] = (studentsRes.data || []).map((s: any) => {
      const rawSessionDate = studentLatestSessionMap[s.id];
      const latestSessionAt = rawSessionDate ? new Date(rawSessionDate) : null;

      const verificationStatus: UserItem["verificationStatus"] = "verified";
      const suspendedUntilDate = s.suspended_until ? new Date(s.suspended_until) : null;
      const isCurrentlySuspended = s.is_suspended === true || (suspendedUntilDate !== null && suspendedUntilDate > now) || s.status === "suspended";
      const status: UserItem["status"] = isCurrentlySuspended
        ? "suspended"
        : (latestSessionAt && latestSessionAt >= thirtyDaysAgo)
        ? "active"
        : "inactive";

      const combinedStudentName = `${s.first_name || ""} ${s.last_name || ""}`.trim();
      const studentName =
        combinedStudentName ||
        s.full_name ||
        s.name ||
        "Student Learner";

      const createdDateVal = s.created_at || s.registered_at || s.updated_at;
      const sCode = (s.learner_code || s.student_code || "").trim() || null;

      return {
        id: s.id,
        name: studentName,
        email: sCode ? `Code: ${sCode}` : "Student Account",
        role: "student",
        status,
        verificationStatus,
        createdAt: createdDateVal ? new Date(createdDateVal).toLocaleDateString() : "N/A",
        lastActive: latestSessionAt ? latestSessionAt.toLocaleDateString() : "No sessions logged",
        contactNumber: s.contact_number || s.guardian_phone || "N/A",
        university: "N/A",
        prcNumber: "N/A",
        idImageUrl: null,
        learnerCode: sCode,
        learnerName: studentName,
        isSuspended: isCurrentlySuspended,
        suspendedUntil: s.suspended_until || null,
      };
    });

    return [...profilesList, ...studentsList];
  } catch (error) {
    console.error("Error in getUsers query:", error);
    return [];
  }
}

/**
 * Updates the role column of a user in the 'profiles' table.
 */
export async function updateUserRole(
  userId: string,
  newRole: "teacher" | "parent" | "admin"
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Supabase role update error:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn("No profile row matched for ID:", userId);
      return { success: false, error: new Error("User record not found in profiles table") };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user role in Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Verifies a user profile by setting is_verified = true in 'profiles' table.
 */
export async function verifyUser(
  userId: string
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ is_verified: true })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Supabase verify user error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error verifying user in Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Toggles suspension of a user profile in 'profiles' table and Supabase Auth if service role is present.
 * @param days Number of days user is suspended for. If 0 or null, indefinite. If suspend=false, clears suspension.
 */
export async function toggleSuspendUser(
  userId: string,
  suspend: boolean,
  days: number = 0
): Promise<{ success: boolean; error?: any; message?: string }> {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    let suspendedUntil: string | null = null;
    let authBanDuration = "none";

    if (suspend) {
      if (days > 0) {
        const until = new Date();
        until.setDate(until.getDate() + days);
        suspendedUntil = until.toISOString();
        authBanDuration = `${days * 24}h`;
      } else {
        // Indefinite ban (10 years)
        authBanDuration = "87600h";
      }
    }

    // 1. Update is_suspended and suspended_until in the profiles table
    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        is_suspended: suspend,
        suspended_until: suspendedUntil,
      })
      .eq("id", userId);

    if (dbError) {
      console.error("Database suspend update error:", dbError);
      throw dbError;
    }

    // 2. Hard-ban (or unban) them at the Supabase Auth level if admin client / service key is configured
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          serviceKey
        );

        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { ban_duration: authBanDuration }
        );

        if (authError) {
          console.warn("Supabase Auth admin ban error:", authError);
        }
      } catch (authErr) {
        console.warn("Could not execute auth admin ban:", authErr);
      }
    }

    return {
      success: true,
      message: suspend
        ? days > 0
          ? `User suspended for ${days} day(s)`
          : "User suspended indefinitely"
        : "User reactivated",
    };
  } catch (error) {
    console.error("Error in toggleSuspendUser:", error);
    return { success: false, error };
  }
}

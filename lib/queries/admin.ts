import { supabase } from "@/lib/supabase";

export interface AdminItem {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  verificationStatus: "verified" | "pending";
  createdAt: string;
  lastActive: string;
  contactNumber?: string;
  university?: string;
  isSuspended?: boolean;
}

/**
 * Fetches all admin profiles (role = 'admin') from Supabase.
 */
export async function getAdminUsers(): Promise<AdminItem[]> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admins from Supabase:", error);
      throw error;
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    return profiles.map((p: any) => {
      const combinedName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
      const displayName = combinedName || p.full_name || p.name || p.email || "Unnamed Admin";
      const isVerified = p.is_verified === true || p.status === "verified";
      const isSuspended = p.is_suspended === true || p.status === "suspended";

      let statusVal: "active" | "inactive" | "suspended" = "active";
      if (isSuspended) {
        statusVal = "suspended";
      } else {
        const lastActiveTime = p.last_active || p.updated_at || p.created_at;
        if (lastActiveTime && new Date(lastActiveTime) < thirtyDaysAgo) {
          statusVal = "inactive";
        }
      }

      return {
        id: p.id,
        name: displayName,
        email: p.email || "No email",
        status: statusVal,
        verificationStatus: isVerified ? "verified" : "pending",
        createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
        lastActive: p.last_active ? new Date(p.last_active).toLocaleDateString() : "Recently",
        contactNumber: p.contact_number || p.phone || "N/A",
        university: p.university || "N/A",
        isSuspended,
      };
    });
  } catch (error) {
    console.error("Error in getAdminUsers query:", error);
    return [];
  }
}

/**
 * Updates admin profile fields in the `profiles` table.
 */
export async function updateAdminProfile(
  adminId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    contact_number?: string;
    university?: string;
  }
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", adminId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error updating admin profile:", error);
    return { success: false, error };
  }
}

/**
 * Toggles or sets the suspended state for an admin in the `profiles` table.
 */
export async function toggleSuspendAdmin(
  adminId: string,
  suspend: boolean
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_suspended: suspend,
        status: suspend ? "suspended" : "active",
      })
      .eq("id", adminId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error toggling suspend admin:", error);
    return { success: false, error };
  }
}

/**
 * Toggles or sets the verification status for an admin in the `profiles` table.
 */
export async function verifyAdmin(
  adminId: string,
  verify: boolean = true
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: verify })
      .eq("id", adminId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error verifying admin:", error);
    return { success: false, error };
  }
}

export interface CurrentUserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  contact_number?: string;
}

/**
 * Fetches the currently authenticated user's profile details.
 */
export async function getCurrentUserProfile(): Promise<CurrentUserProfile | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, contact_number")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.warn("Profile fetch error:", error);
    }

    const meta = session.user.user_metadata || {};
    const email = session.user.email || "";

    let firstName = profile?.first_name || meta.first_name || "";
    let lastName = profile?.last_name || meta.last_name || "";
    const contactNumber = profile?.contact_number || meta.contact_number || "";

    if (!firstName && !lastName) {
      const full = meta.full_name || meta.name || "";
      if (full) {
        const parts = full.trim().split(" ");
        firstName = parts[0] || "";
        lastName = parts.slice(1).join(" ") || "";
      } else {
        firstName = email.split("@")[0] || "Admin";
        lastName = "";
      }
    }

    return {
      id: session.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      contact_number: contactNumber,
    };
  } catch (error) {
    console.error("Error in getCurrentUserProfile:", error);
    return null;
  }
}

/**
 * Updates the currently authenticated user's profile names in Supabase.
 */
export async function updateCurrentUserProfile(
  userId: string,
  updates: { first_name: string; last_name: string; contact_number?: string }
): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("Error updating current user profile:", error);
      throw error;
    }
    return { success: true };
  } catch (error) {
    console.error("Error in updateCurrentUserProfile:", error);
    return { success: false, error };
  }
}

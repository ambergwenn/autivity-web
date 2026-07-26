import { supabase } from "@/lib/supabase";

// ============================================================================
// RAW SQL QUERY
// ============================================================================
/**
 * Raw SQL Query to retrieve all classes with teacher profile info, university, and student counts.
 * 
 * Details & Column Mappings:
 * - name: `title` in classes table
 * - teacher: `teacher_id` FK pointing to `profiles.id` where role = 'teacher'
 * - university: `university` column in profiles table based on teacher
 * - count of students: count of rows in `students` table connected through `class_id`
 * - schedule: `schedule` column in classes table (e.g. "Monday - Wednesday 10:00 AM")
 * - theme: `theme_name` in classes table (lowercase, e.g. "blue")
 * - archived status: `is_archived` boolean column in classes table
 * - grade: `grade` column in classes table (e.g. "Grade 1")
 */
export const GET_ALL_CLASSES_SQL = `
SELECT 
  c.id,
  c.title AS name,
  c.schedule,
  LOWER(c.theme_name) AS theme,
  c.is_archived,
  c.grade,
  c.teacher_id,
  COALESCE(
    NULLIF(TRIM(CONCAT(p.first_name, ' ', p.last_name)), ''),
    p.full_name,
    p.name,
    'Unassigned'
  ) AS teacher,
  COALESCE(p.university, 'N/A') AS university,
  COUNT(s.id)::int AS students_count
FROM classes c
LEFT JOIN profiles p ON c.teacher_id = p.id AND p.role = 'teacher'
LEFT JOIN students s ON s.class_id = c.id
GROUP BY 
  c.id, 
  c.title, 
  c.schedule, 
  c.theme_name, 
  c.is_archived, 
  c.grade, 
  c.teacher_id, 
  p.first_name, 
  p.last_name, 
  p.full_name, 
  p.name, 
  p.university;
`;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface ClassQueryResult {
  id: string;
  title: string;          // DB column: title (name)
  teacher: string;        // Teacher full name from profiles table
  teacher_id: string | null; // FK pointing to profiles table id
  university: string;     // University from profiles table based on teacher
  studentsCount: number;  // Count of students connected through class_id in students table
  schedule: string;       // DB column: schedule (e.g. "Monday - Wednesday 10:00 AM")
  theme_name: string;     // DB column: theme_name (lowercase, e.g. "blue")
  is_archived: boolean;   // DB column: is_archived (archived status)
  grade: string;          // DB column: grade (e.g. "Grade 1")
  status: "active" | "archived" | "pending";
}

export interface TeacherOption {
  id: string;
  name: string;
  university: string;
}

// ============================================================================
// SUPABASE QUERY FUNCTIONS
// ============================================================================

/**
 * Fetches all classes from Supabase `classes` table along with teacher profiles and student counts.
 */
export async function getClasses(): Promise<ClassQueryResult[]> {
  try {
    // Attempt relational fetch via Supabase Client
    const { data: classesData, error: classesError } = await supabase
      .from("classes")
      .select(`
        *,
        profiles (*),
        students (
          id
        )
      `);

    if (!classesError && classesData) {
      return classesData.map((item: any) => {
        const teacherProfile = item.profiles;
        const combinedTeacherName = teacherProfile
          ? `${teacherProfile.first_name || ""} ${teacherProfile.last_name || ""}`.trim()
          : "";
        const teacherName =
          combinedTeacherName ||
          teacherProfile?.full_name ||
          teacherProfile?.name ||
          "Unassigned";

        const university = teacherProfile?.university || "N/A";
        const studentsCount = Array.isArray(item.students) ? item.students.length : 0;
        const isArchived = Boolean(item.is_archived);

        let status: "active" | "archived" | "pending" = "active";
        if (isArchived) {
          status = "archived";
        } else if (!item.teacher_id || teacherName === "Unassigned") {
          status = "pending";
        }

        return {
          id: item.id,
          title: item.title || "Untitled Class",
          teacher: teacherName,
          teacher_id: item.teacher_id || null,
          university,
          studentsCount,
          schedule: item.schedule || "Not scheduled",
          theme_name: (item.theme_name || "blue").toLowerCase(),
          is_archived: isArchived,
          grade: item.grade || "Unassigned Grade",
          status,
        };
      });
    }

    // Fallback: Fetch tables separately and merge in memory if relational FK cache is unmapped
    const [classesRes, profilesRes, studentsRes] = await Promise.all([
      supabase.from("classes").select("*"),
      supabase.from("profiles").select("*").eq("role", "teacher"),
      supabase.from("students").select("id, class_id"),
    ]);

    if (classesRes.error) throw classesRes.error;

    const profilesMap = new Map<string, any>();
    if (profilesRes.data) {
      profilesRes.data.forEach((p: any) => profilesMap.set(p.id, p));
    }

    const studentCountMap = new Map<string, number>();
    if (studentsRes.data) {
      studentsRes.data.forEach((s: any) => {
        if (s.class_id) {
          studentCountMap.set(s.class_id, (studentCountMap.get(s.class_id) || 0) + 1);
        }
      });
    }

    return (classesRes.data || []).map((c: any) => {
      const teacherProfile = c.teacher_id ? profilesMap.get(c.teacher_id) : null;
      const combinedTeacherName = teacherProfile
        ? `${teacherProfile.first_name || ""} ${teacherProfile.last_name || ""}`.trim()
        : "";
      const teacherName =
        combinedTeacherName ||
        teacherProfile?.full_name ||
        teacherProfile?.name ||
        "Unassigned";

      const university = teacherProfile?.university || "N/A";
      const studentsCount = studentCountMap.get(c.id) || 0;
      const isArchived = Boolean(c.is_archived);

      let status: "active" | "archived" | "pending" = "active";
      if (isArchived) {
        status = "archived";
      } else if (!c.teacher_id || teacherName === "Unassigned") {
        status = "pending";
      }

      return {
        id: c.id,
        title: c.title || "Untitled Class",
        teacher: teacherName,
        teacher_id: c.teacher_id || null,
        university,
        studentsCount,
        schedule: c.schedule || "Not scheduled",
        theme_name: (c.theme_name || "blue").toLowerCase(),
        is_archived: isArchived,
        grade: c.grade || "Unassigned Grade",
        status,
      };
    });
  } catch (error) {
    console.error("Error in getClasses query:", error);
    return [];
  }
}

/**
 * Fetches list of profiles with role = 'teacher' for dropdown assignment.
 */
export async function getTeachersList(): Promise<TeacherOption[]> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "teacher");

    if (error) throw error;

    return (data || []).map((p: any) => {
      const combinedName = `${p.first_name || ""} ${p.last_name || ""}`.trim();
      const teacherName = combinedName || p.full_name || p.name || "Unnamed Teacher";
      return {
        id: p.id,
        name: teacherName,
        university: p.university && p.university !== "N/A" ? p.university : "",
      };
    });
  } catch (error) {
    console.error("Error fetching teachers list:", error);
    return [];
  }
}

/**
 * Updates class columns in the `classes` table.
 */
export async function updateClassDetails(
  classId: string,
  updates: {
    title?: string;
    grade?: string;
    schedule?: string;
    theme_name?: string;
    teacher_id?: string | null;
    is_archived?: boolean;
  }
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!classId) {
      throw new Error("Class ID is required for update.");
    }

    const { data, error } = await supabase
      .from("classes")
      .update(updates)
      .eq("id", classId)
      .select();

    if (error) {
      console.error("Error updating class in Supabase:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in updateClassDetails:", error);
    return { success: false, error };
  }
}

/**
 * Inserts a new class record into the `classes` table in Supabase.
 */
export async function createClass(newClass: {
  title: string;
  grade: string;
  schedule: string;
  theme_name: string;
  teacher_id: string | null;
  is_archived: boolean;
}): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const { data, error } = await supabase
      .from("classes")
      .insert([newClass])
      .select();

    if (error) {
      console.error("Error creating class in Supabase:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in createClass:", error);
    return { success: false, error };
  }
}

export interface ClassKpiStatsData {
  activeClassesCount: number;
  archivedClassesCount: number;
  activeClassesThisMonth: number;
  archivedClassesThisMonth: number;
}

/**
 * Fetches summary KPI metrics for active and archived classes.
 */
export async function getClassKpiStats(): Promise<ClassKpiStatsData> {
  try {
    const { data, error } = await supabase
      .from("classes")
      .select("is_archived, created_at");

    if (error) {
      console.error("Error fetching class KPI stats:", error);
      throw error;
    }

    const classes = data || [];
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let activeClassesCount = 0;
    let archivedClassesCount = 0;
    let activeClassesThisMonth = 0;
    let archivedClassesThisMonth = 0;

    for (const c of classes) {
      const isArchived = Boolean(c.is_archived);
      const isThisMonth = c.created_at
        ? new Date(c.created_at) >= firstDayOfMonth
        : false;

      if (isArchived) {
        archivedClassesCount++;
        if (isThisMonth) archivedClassesThisMonth++;
      } else {
        activeClassesCount++;
        if (isThisMonth) activeClassesThisMonth++;
      }
    }

    return {
      activeClassesCount,
      archivedClassesCount,
      activeClassesThisMonth,
      archivedClassesThisMonth,
    };
  } catch (error) {
    console.error("Error in getClassKpiStats:", error);
    return {
      activeClassesCount: 0,
      archivedClassesCount: 0,
      activeClassesThisMonth: 0,
      archivedClassesThisMonth: 0,
    };
  }
}

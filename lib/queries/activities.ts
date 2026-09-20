import { supabase } from "@/lib/supabase";

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  sub_category: string;
  skill_domain: string[];
  difficulty_level: number;
  difficulty_label: "Easy" | "Medium" | "Hard" | "Custom" | string;
  createdAt: string;
  assignedStudentsCount?: number;
  is_hidden?: boolean;
}

export interface MostAssignedCategoryItem {
  category: string;
  assignments: number;
  fill?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Tracing: "#62A9E6",
  "Bubble-Pop": "#ED529B",
  "Bubble Pop": "#ED529B",
  "Drag-Drop": "#E8B00C",
  "Drag and Drop": "#E8B00C",
  Matching: "#AD99E6",
  Patterning: "#AEE295",
  "Sensory Play": "#E8B00C",
  Sequencing: "#FD9356",
  "Pick-n-Choose": "#14B8A6",
  "Pick n Choose": "#14B8A6",
  "Pick N Choose": "#14B8A6",
};

const EXTRA_PALETTE = ["#62A9E6", "#ED529B", "#E8B00C", "#AD99E6", "#AEE295", "#FD9356", "#14B8A6", "#F472B6", "#94A3B8"];

export function getCategoryColor(category: string, index: number = 0): string {
  if (!category) return EXTRA_PALETTE[index % EXTRA_PALETTE.length];
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category];

  const normalized = category.trim().toLowerCase().replace(/-/g, " ");
  for (const [key, color] of Object.entries(CATEGORY_COLORS)) {
    if (key.toLowerCase().replace(/-/g, " ") === normalized) {
      return color;
    }
  }

  return EXTRA_PALETTE[index % EXTRA_PALETTE.length];
}

/**
 * Base-10 Math Helper Functions:
 * Tens digit = Category Tier (e.g., 10 = Lines, 20 = Shapes, 70 = Picture Sequencing)
 * Units digit / rank in subcategory = Relative Difficulty (1 = Easy, 2 = Medium, 3 = Hard)
 */
export function getCategoryBase(level: number | string): number {
  const num = typeof level === "number" ? level : parseInt(String(level || "10"), 10);
  const safeNum = isNaN(num) ? 10 : num;
  return Math.floor(safeNum / 10) * 10;
}

/**
 * Resolves difficulty label ('Easy' | 'Medium' | 'Hard') and relative index (1, 2, 3)
 * relative to the sorted difficulty levels in its sub-category.
 * E.g., for Picture Sequencing [75, 76, 77] -> 75 is Easy (1), 76 is Medium (2), 77 is Hard (3).
 * For Letter Tracing [11, 12, 13] -> 11 is Easy (1), 12 is Medium (2), 13 is Hard (3).
 */
export function getRelativeDifficultyFromLevels(
  level: number | string,
  subCategoryLevels: number[] = []
): { label: "Easy" | "Medium" | "Hard"; relativeIndex: 1 | 2 | 3 } {
  if (typeof level === "string") {
    const lower = level.trim().toLowerCase();
    if (lower === "easy" || lower === "beginner") return { label: "Easy", relativeIndex: 1 };
    if (lower === "medium" || lower === "intermediate") return { label: "Medium", relativeIndex: 2 };
    if (lower === "hard" || lower === "advanced") return { label: "Hard", relativeIndex: 3 };
  }

  const num = typeof level === "number" ? level : parseInt(String(level || "1"), 10);
  const safeNum = isNaN(num) ? 1 : num;

  if (subCategoryLevels && subCategoryLevels.length > 0) {
    const sorted = Array.from(new Set(subCategoryLevels)).sort((a, b) => a - b);
    const idx = sorted.indexOf(safeNum);
    if (idx !== -1) {
      if (sorted.length === 1) {
        return { label: "Easy", relativeIndex: 1 };
      }
      if (sorted.length === 2) {
        return idx === 0
          ? { label: "Easy", relativeIndex: 1 }
          : { label: "Hard", relativeIndex: 3 };
      }
      if (sorted.length === 3) {
        if (idx === 0) return { label: "Easy", relativeIndex: 1 };
        if (idx === 1) return { label: "Medium", relativeIndex: 2 };
        return { label: "Hard", relativeIndex: 3 };
      }
      // 4 or more levels
      const ratio = idx / (sorted.length - 1);
      if (ratio <= 0.34) return { label: "Easy", relativeIndex: 1 };
      if (ratio <= 0.67) return { label: "Medium", relativeIndex: 2 };
      return { label: "Hard", relativeIndex: 3 };
    }
  }

  // Fallback if subCategoryLevels is not provided
  if (safeNum === 1) return { label: "Easy", relativeIndex: 1 };
  if (safeNum === 2) return { label: "Medium", relativeIndex: 2 };
  if (safeNum === 3) return { label: "Hard", relativeIndex: 3 };

  const mod = safeNum % 10;
  if (mod === 0 || mod === 1) return { label: "Easy", relativeIndex: 1 };
  if (mod === 2) return { label: "Medium", relativeIndex: 2 };
  return { label: "Hard", relativeIndex: 3 };
}

export function getRelativeDifficulty(level: number | string, subCategoryLevels: number[] = []): number {
  return getRelativeDifficultyFromLevels(level, subCategoryLevels).relativeIndex;
}

export function calculateNewDifficulty(categoryBase: number, relativeOffset: number): number {
  return categoryBase + relativeOffset;
}

/**
 * Transforms difficulty values relative to subcategory levels into Easy, Medium, Hard labels.
 */
export function getDifficultyLabel(level: number | string, subCategoryLevels: number[] = []): "Easy" | "Medium" | "Hard" {
  return getRelativeDifficultyFromLevels(level, subCategoryLevels).label;
}

/**
 * Fetches distinct categories from the 'activities' table.
 */
export async function getActivityCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("category");

    if (error) throw error;
    if (!data || data.length === 0) return [];
    const unique = Array.from(new Set(data.map((item: any) => item.category).filter(Boolean)));
    return unique.sort();
  } catch (error) {
    console.error("Error fetching activity categories from Supabase:", error);
    return [];
  }
}

/**
 * Fetches distinct sub-categories from the 'activities' table, optionally filtered by category.
 */
export async function getActivitySubCategories(category?: string): Promise<string[]> {
  try {
    let query = supabase.from("activities").select("sub_category");
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) return [];
    const unique = Array.from(new Set(data.map((item: any) => item.sub_category).filter(Boolean)));
    return unique.sort();
  } catch (error) {
    console.error("Error fetching activity sub-categories from Supabase:", error);
    return [];
  }
}

/**
 * Fetches all distinct skill domains across activities in Supabase.
 */
export async function getAllSkillDomains(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("skill_domain");

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const skillsSet = new Set<string>();
    for (const item of data) {
      if (Array.isArray(item.skill_domain)) {
        item.skill_domain.forEach((s: string) => s && skillsSet.add(s.trim()));
      } else if (typeof item.skill_domain === "string" && item.skill_domain.trim()) {
        try {
          const parsed = JSON.parse(item.skill_domain);
          if (Array.isArray(parsed)) parsed.forEach((s: string) => s && skillsSet.add(s.trim()));
          else item.skill_domain.split(",").forEach((s: string) => s && skillsSet.add(s.trim()));
        } catch {
          item.skill_domain.split(",").forEach((s: string) => s && skillsSet.add(s.trim()));
        }
      }
    }
    return Array.from(skillsSet).sort();
  } catch (error) {
    console.error("Error fetching skill domains from Supabase:", error);
    return [];
  }
}

/**
 * Fetches activity count per category to build the distribution donut chart.
 */
export async function getActivityCategoryBreakdown(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("category");

    if (error) {
      console.error("Error fetching category breakdown:", error);
      throw error;
    }

    const counts: Record<string, number> = {};
    if (data) {
      for (const item of data) {
        const cat = item.category || "General";
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  } catch (error) {
    console.error("Error in getActivityCategoryBreakdown query:", error);
    return {};
  }
}

/**
 * Fetches the assignment count per category based on student assigned_activities paths.
 * All existing categories from activities table are included (even if 0 assignments).
 */
// Helper function to extract activity paths or titles from array/string/JSON
function parseActivityItems(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) {
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback to raw string if JSON parse fails
      }
    }
    if (trimmed.includes(",")) {
      return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
}

/**
 * Fetches the assignment count per category based on student assigned_activities and student_sessions.
 * All existing categories from activities table are included (even if 0 assignments).
 */
export async function getMostAssignedCategories(): Promise<MostAssignedCategoryItem[]> {
  try {
    const [activitiesRes, studentsRes, sessionsRes] = await Promise.all([
      supabase.from("activities").select("category, path, title, sub_category"),
      supabase.from("students").select("assigned_activities"),
      supabase.from("student_sessions").select("activity_path"),
    ]);

    if (activitiesRes.error) console.error("Error fetching activities for most assigned query:", activitiesRes.error);
    if (studentsRes.error) console.error("Error fetching students assigned_activities:", studentsRes.error);
    if (sessionsRes.error) console.error("Error fetching student_sessions:", sessionsRes.error);

    const activitiesData = activitiesRes.data || [];
    const studentsData = studentsRes.data || [];
    const sessionsData = sessionsRes.data || [];

    const categoryCounts: Record<string, number> = {};
    const pathToCategoryMap: Record<string, string> = {};

    // Collect ONLY categories that actually exist in the database's activities table
    for (const act of activitiesData) {
      if (act.category) {
        const cat = act.category.trim();
        if (categoryCounts[cat] === undefined) {
          categoryCounts[cat] = 0;
        }
        if (act.path) {
          const raw = String(act.path).trim();
          const cleanPath = raw.toLowerCase().replace(/^activity\/tracing\//, "");
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
          pathToCategoryMap[cleanPath] = cat;
        }
        if (act.title) {
          const raw = String(act.title).trim();
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
        }
        if (act.sub_category) {
          const raw = String(act.sub_category).trim();
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
        }
      }
    }

    const matchCategory = (itemStr: string): string | null => {
      if (!itemStr) return null;
      const raw = itemStr.trim();
      const clean = raw.toLowerCase();
      const cleanPath = clean.replace(/^activity\/tracing\//, "");

      if (pathToCategoryMap[raw]) return pathToCategoryMap[raw];
      if (pathToCategoryMap[clean]) return pathToCategoryMap[clean];
      if (pathToCategoryMap[cleanPath]) return pathToCategoryMap[cleanPath];

      for (const cat of Object.keys(categoryCounts)) {
        if (cat.toLowerCase() === clean) return cat;
      }

      for (const cat of Object.keys(categoryCounts)) {
        const catLower = cat.toLowerCase();
        if (clean.includes(catLower) || catLower.includes(clean)) return cat;
      }

      return null;
    };

    // 1. Count from students assigned_activities
    for (const student of studentsData) {
      const items = parseActivityItems(student.assigned_activities);
      for (const item of items) {
        const matched = matchCategory(item);
        if (matched) {
          categoryCounts[matched] = (categoryCounts[matched] || 0) + 1;
        }
      }
    }

    // 2. Count from student_sessions activity_path
    for (const session of sessionsData) {
      const items = parseActivityItems(session.activity_path);
      for (const item of items) {
        const matched = matchCategory(item);
        if (matched) {
          categoryCounts[matched] = (categoryCounts[matched] || 0) + 1;
        }
      }
    }

    // Convert to array & sort descending by assignments count
    const items = Object.entries(categoryCounts).map(([category, assignments]) => ({
      category,
      assignments,
    }));

    items.sort((a, b) => b.assignments - a.assignments);

    return items.map((item, index) => ({
      ...item,
      fill: getCategoryColor(item.category, index),
    }));
  } catch (error) {
    console.error("Error in getMostAssignedCategories query:", error);
    return [];
  }
}

export interface ActivityCardStatsData {
  totalActivities: number;
  activitiesCreatedThisMonth: number;
  mostAssignedCategory: string;
  assignedStudentsCountForTopCategory: number;
}

/**
 * Fetches summary KPI card statistics for Total Activities and Most Assigned Category.
 */
export async function getActivityCardStats(): Promise<ActivityCardStatsData> {
  try {
    const { count: totalCount } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true });

    const [activitiesRes, studentsRes, sessionsRes] = await Promise.all([
      supabase.from("activities").select("category, path, title, sub_category, created_at"),
      supabase.from("students").select("id, assigned_activities"),
      supabase.from("student_sessions").select("student_id, activity_path"),
    ]);

    const activitiesList = activitiesRes.data || [];
    const studentsList = studentsRes.data || [];
    const sessionsList = sessionsRes.data || [];

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const activitiesCreatedThisMonth = activitiesList.filter((act) => {
      if (!act.created_at) return false;
      const createdDate = new Date(act.created_at);
      return !isNaN(createdDate.getTime()) && createdDate >= firstDayOfMonth;
    }).length;

    const categoryAssignmentsCount: Record<string, number> = {};
    const categoryStudentsSet: Record<string, Set<string>> = {};
    const pathToCategoryMap: Record<string, string> = {};

    for (const act of activitiesList) {
      if (act.category) {
        const cat = act.category.trim();
        categoryAssignmentsCount[cat] = categoryAssignmentsCount[cat] || 0;
        if (!categoryStudentsSet[cat]) categoryStudentsSet[cat] = new Set<string>();

        if (act.path) {
          const raw = String(act.path).trim();
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
        }
        if (act.title) {
          const raw = String(act.title).trim();
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
        }
        if (act.sub_category) {
          const raw = String(act.sub_category).trim();
          pathToCategoryMap[raw] = cat;
          pathToCategoryMap[raw.toLowerCase()] = cat;
        }
      }
    }

    const matchCategory = (itemStr: string): string | null => {
      if (!itemStr) return null;
      const raw = itemStr.trim();
      const clean = raw.toLowerCase();

      if (pathToCategoryMap[raw]) return pathToCategoryMap[raw];
      if (pathToCategoryMap[clean]) return pathToCategoryMap[clean];

      for (const cat of Object.keys(categoryAssignmentsCount)) {
        if (cat.toLowerCase() === clean) return cat;
      }

      for (const cat of Object.keys(categoryAssignmentsCount)) {
        const catLower = cat.toLowerCase();
        if (clean.includes(catLower) || catLower.includes(clean)) return cat;
      }

      return null;
    };

    for (const student of studentsList) {
      const items = parseActivityItems(student.assigned_activities);
      for (const item of items) {
        const matched = matchCategory(item);
        if (matched) {
          categoryAssignmentsCount[matched] = (categoryAssignmentsCount[matched] || 0) + 1;
          if (student.id) {
            categoryStudentsSet[matched]?.add(String(student.id));
          }
        }
      }
    }

    for (const session of sessionsList) {
      const items = parseActivityItems(session.activity_path);
      for (const item of items) {
        const matched = matchCategory(item);
        if (matched) {
          categoryAssignmentsCount[matched] = (categoryAssignmentsCount[matched] || 0) + 1;
          if (session.student_id) {
            categoryStudentsSet[matched]?.add(String(session.student_id));
          }
        }
      }
    }

    let topCategory = "";
    let maxAssignments = 0;

    for (const [cat, count] of Object.entries(categoryAssignmentsCount)) {
      if (count > maxAssignments) {
        maxAssignments = count;
        topCategory = cat;
      }
    }

    const assignedStudentsCountForTopCategory = (topCategory && categoryStudentsSet[topCategory])
      ? categoryStudentsSet[topCategory].size
      : 0;

    return {
      totalActivities: totalCount !== null ? totalCount : activitiesList.length,
      activitiesCreatedThisMonth,
      mostAssignedCategory: topCategory,
      assignedStudentsCountForTopCategory,
    };
  } catch (error) {
    console.error("Error fetching activity card stats:", error);
    return {
      totalActivities: 0,
      activitiesCreatedThisMonth: 0,
      mostAssignedCategory: "",
      assignedStudentsCountForTopCategory: 0,
    };
  }
}

/**
 * Fetches all existing activities from the 'activities' table in Supabase.
 */
export async function getActivities(): Promise<ActivityItem[]> {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching activities from Supabase:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group unique numerical levels per subcategory
    const subCategoryLevelsMap = new Map<string, number[]>();
    for (const item of data) {
      const subCatKey = (item.sub_category || item.subcategory || item.category || "general").trim().toLowerCase();
      const rawNum = typeof item.difficulty_level === "number"
        ? item.difficulty_level
        : parseInt(String(item.difficulty_level || ""), 10);
      if (!isNaN(rawNum)) {
        const existing = subCategoryLevelsMap.get(subCatKey) || [];
        if (!existing.includes(rawNum)) {
          existing.push(rawNum);
        }
        subCategoryLevelsMap.set(subCatKey, existing);
      }
    }

    subCategoryLevelsMap.forEach((levels) => {
      levels.sort((a, b) => a - b);
    });

    return data.map((item: any) => {
      const subCatKey = (item.sub_category || item.subcategory || item.category || "general").trim().toLowerCase();
      const subLevels = subCategoryLevelsMap.get(subCatKey) || [];

      const rawDiff = item.difficulty_level !== undefined && item.difficulty_level !== null
        ? item.difficulty_level
        : (item.difficulty || item.difficulty_label || 1);
      const difficultyLabel = getDifficultyLabel(rawDiff, subLevels);
      const parsedLevel = typeof item.difficulty_level === "number"
        ? item.difficulty_level
        : parseInt(String(item.difficulty_level || "0"), 10);
      const level = !isNaN(parsedLevel) && parsedLevel > 0
        ? parsedLevel
        : (subLevels[0] || 1);

      // Parse skill_domain array or comma-separated string if applicable
      let skillDomainArray: string[] = [];
      if (Array.isArray(item.skill_domain)) {
        skillDomainArray = item.skill_domain;
      } else if (typeof item.skill_domain === "string" && item.skill_domain.trim()) {
        try {
          const parsed = JSON.parse(item.skill_domain);
          if (Array.isArray(parsed)) skillDomainArray = parsed;
          else skillDomainArray = item.skill_domain.split(",").map((s: string) => s.trim());
        } catch {
          skillDomainArray = item.skill_domain.split(",").map((s: string) => s.trim());
        }
      }

      const createdDateVal = item.created_at || item.createdAt;

      return {
        id: item.id,
        title: item.title || item.name || "Untitled Activity",
        category: item.category || "General",
        sub_category: item.sub_category || item.subcategory || "General",
        skill_domain: skillDomainArray,
        difficulty_level: level,
        difficulty_label: difficultyLabel,
        createdAt: createdDateVal ? new Date(createdDateVal).toLocaleDateString() : "N/A",
        assignedStudentsCount: item.assigned_students_count || item.assignedCount || 0,
        is_hidden: item.is_hidden === true || item.status === "hidden",
      };
    });
  } catch (error) {
    console.error("Failed to execute getActivities:", error);
    return [];
  }
}

/**
 * Updates an activity in the 'activities' table in Supabase.
 */
export async function updateActivityDetails(
  activityId: string,
  updates: {
    title?: string;
    category?: string;
    sub_category?: string;
    skill_domain?: string[];
    difficulty_level?: number;
    is_hidden?: boolean;
  }
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!activityId) {
      throw new Error("Invalid activity ID");
    }

    // Build update payload using existing columns in activities table
    const payload: Record<string, any> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.sub_category !== undefined) payload.sub_category = updates.sub_category;
    if (updates.skill_domain !== undefined) {
      payload.skill_domain = Array.isArray(updates.skill_domain) ? updates.skill_domain : [];
    }
    if (updates.difficulty_level !== undefined) payload.difficulty_level = updates.difficulty_level;
    if (updates.is_hidden !== undefined) payload.is_hidden = updates.is_hidden;

    const { error } = await supabase
      .from("activities")
      .update(payload)
      .eq("id", activityId);

    if (error) {
      if (error.code === "PGRST204" && error.message?.includes("is_hidden")) {
        delete payload.is_hidden;
        const { error: retryErr } = await supabase
          .from("activities")
          .update(payload)
          .eq("id", activityId);

        if (retryErr) throw retryErr;
        return { success: true };
      }
      console.error("Supabase update activity error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating activity in Supabase:", error);
    return { success: false, error };
  }
}

/**
 * Toggles or sets the is_hidden flag for an activity in the 'activities' table.
 */
export async function toggleHideActivity(
  activityId: string,
  hide: boolean = true
): Promise<{ success: boolean; error?: any }> {
  try {
    if (!activityId) {
      throw new Error("Invalid activity ID");
    }

    const { error } = await supabase
      .from("activities")
      .update({ is_hidden: hide })
      .eq("id", activityId);

    if (error) {
      if (error.code === "PGRST204" && error.message?.includes("is_hidden")) {
        console.warn("is_hidden column is not present in activities schema.");
        return { success: true };
      }
      console.error("Supabase toggle hide activity error:", error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in toggleHideActivity:", error);
    return { success: false, error };
  }
}

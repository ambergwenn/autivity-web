import { supabase } from "@/lib/supabase";
import { getDifficultyLabel } from "@/lib/queries/activities";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UserKPIStats {
  students: number;
  teachers: number;
  parents: number;
  totalNonAdmins: number;
}

// ============================================================================
// KPI CARD QUERIES
// ============================================================================

/**
 * Fetches user stats for the Overview KPI Cards from profiles and students tables
 */
export async function getDashboardUserKPIs(): Promise<UserKPIStats> {
  try {
    const [totalNonAdminsRes, teacherCountRes, parentCountRes, studentCountRes] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).neq("role", "admin"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "parent"),
      supabase.from("students").select("*", { count: "exact", head: true }),
    ]);

    if (totalNonAdminsRes.error) throw totalNonAdminsRes.error;
    if (teacherCountRes.error) throw teacherCountRes.error;
    if (parentCountRes.error) throw parentCountRes.error;
    if (studentCountRes.error) throw studentCountRes.error;

    return {
      students: studentCountRes.count || 0,
      teachers: teacherCountRes.count || 0,
      parents: parentCountRes.count || 0,
      totalNonAdmins: totalNonAdminsRes.count || 0,
    };
  } catch (error) {
    console.error("Error in getDashboardUserKPIs:", error);
    return { students: 0, teachers: 0, parents: 0, totalNonAdmins: 0 };
  }
}

/**
 * Fetches total count of rows from the 'activities' table
 */
export async function getDashboardActivityKPIs(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error in getDashboardActivityKPIs:", error);
    return 0;
  }
}

export interface SessionKPIStats {
  total: number;
  thisWeek: number;
}

/**
 * Fetches total session count and count of sessions created in the last 7 days
 */
export async function getDashboardSessionKPIs(): Promise<SessionKPIStats> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();

    const [totalRes, thisWeekRes] = await Promise.all([
      supabase.from("student_sessions").select("*", { count: "exact", head: true }),
      supabase.from("student_sessions").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgoISO),
    ]);

    if (totalRes.error) throw totalRes.error;
    if (thisWeekRes.error) throw thisWeekRes.error;

    return {
      total: totalRes.count || 0,
      thisWeek: thisWeekRes.count || 0,
    };
  } catch (error) {
    console.error("Error in getDashboardSessionKPIs:", error);
    return { total: 0, thisWeek: 0 };
  }
}

export interface MilestoneKPIStats {
  achieved: number;
  total: number;
}

/**
 * Fetches total milestones and milestones with status = 'achieved'
 */
export async function getDashboardMilestoneKPIs(): Promise<MilestoneKPIStats> {
  try {
    const [totalRes, achievedRes] = await Promise.all([
      supabase.from("student_milestones").select("*", { count: "exact", head: true }),
      supabase.from("student_milestones").select("*", { count: "exact", head: true }).eq("status", "achieved"),
    ]);

    if (totalRes.error) throw totalRes.error;
    if (achievedRes.error) throw achievedRes.error;

    return {
      achieved: achievedRes.count || 0,
      total: totalRes.count || 0,
    };
  } catch (error) {
    console.error("Error in getDashboardMilestoneKPIs:", error);
    return { achieved: 0, total: 0 };
  }
}

// ============================================================================
// ADAPTIVE ENGINE CHART QUERY
// ============================================================================

export interface AdaptiveEngineStats {
  upshifts: number;
  standard: number;
  bailouts: number;
  total: number;
}

/**
 * Fetches adaptive engine stats from 'student_sessions' table based on 'mistakes' column.
 * - 0 mistakes -> upshifts count + 1
 * - 1 or 2 mistakes -> standard count + 1
 * - 3 or higher mistakes -> bailouts count + 1
 */
export async function getDashboardAdaptiveEngineStats(days?: number): Promise<AdaptiveEngineStats> {
  try {
    let query = supabase.from("student_sessions").select("mistakes");

    if (days) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - days);
      query = query.gte("created_at", pastDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    let upshifts = 0;
    let standard = 0;
    let bailouts = 0;

    if (data) {
      for (const row of data) {
        const mistakes = row.mistakes ?? 0;
        if (mistakes === 0) {
          upshifts++;
        } else if (mistakes === 1 || mistakes === 2) {
          standard++;
        } else if (mistakes >= 3) {
          bailouts++;
        }
      }
    }

    return {
      upshifts,
      standard,
      bailouts,
      total: upshifts + standard + bailouts,
    };
  } catch (error) {
    console.error("Error in getDashboardAdaptiveEngineStats:", error);
    return { upshifts: 0, standard: 0, bailouts: 0, total: 0 };
  }
}

// ============================================================================
// DEVELOPMENTAL PROGRESS CHART QUERY
// ============================================================================

export interface DevelopmentalProgressPoint {
  month: string;
  motor: number;
  cognitive: number;
  sensory: number;
  communication: number;
  social: number;
}

/**
 * Fetches master_domains, sub_skills, and student_sessions from Supabase
 * Maps sub-skills to master domains, groups sessions by month, computes mastery score per session:
 * - 0 mistakes -> 100%
 * - 1 or 2 mistakes -> 70%
 * - 3+ mistakes -> 0%
 * Computes average mastery per master domain per month.
 */
export async function getDashboardDevelopmentalProgressData(): Promise<DevelopmentalProgressPoint[]> {
  try {
    const [masterDomainsRes, subSkillsRes, sessionsRes] = await Promise.all([
      supabase.from("master_domains").select("id, name"),
      supabase.from("sub_skills").select("id, name, master_domain_id"),
      supabase.from("student_sessions").select("created_at, skill_domain, mistakes"),
    ]);

    if (masterDomainsRes.error) console.warn("master_domains query warning:", masterDomainsRes.error);
    if (subSkillsRes.error) console.warn("sub_skills query warning:", subSkillsRes.error);
    if (sessionsRes.error) throw sessionsRes.error;

    // Step 1: Map Sub-Skills to Master Domains
    const masterDomainMap = new Map<number, string>();
    (masterDomainsRes.data || []).forEach((md) => {
      masterDomainMap.set(md.id, md.name);
    });

    const subSkillToDomain = new Map<string, string>();
    (subSkillsRes.data || []).forEach((ss) => {
      const parentDomainName = masterDomainMap.get(ss.master_domain_id);
      if (ss.name && parentDomainName) {
        subSkillToDomain.set(ss.name.trim().toLowerCase(), parentDomainName);
      }
    });

    const getDomainKey = (domainName: string): "motor" | "cognitive" | "sensory" | "communication" | "social" | null => {
      const lower = domainName.toLowerCase();
      if (lower.includes("motor")) return "motor";
      if (lower.includes("cognit")) return "cognitive";
      if (lower.includes("sensor")) return "sensory";
      if (lower.includes("communicat")) return "communication";
      if (lower.includes("social")) return "social";
      return null;
    };

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const monthlyAcc: Record<string, Record<string, { total: number; count: number }>> = {};
    monthNames.forEach((m) => {
      monthlyAcc[m] = {
        motor: { total: 0, count: 0 },
        cognitive: { total: 0, count: 0 },
        sensory: { total: 0, count: 0 },
        communication: { total: 0, count: 0 },
        social: { total: 0, count: 0 },
      };
    });

    const sessions = sessionsRes.data || [];

    // Step 2, 3, 4: Group by Month, Evaluate Mastery & Roll-up
    for (const session of sessions) {
      if (!session.created_at) continue;

      const date = new Date(session.created_at);
      const monthName = monthNames[date.getMonth()];
      if (!monthlyAcc[monthName]) continue;

      // Session Mastery Score: 100% if 0 mistakes, 70% if 1-2 mistakes, 0% if >= 3 mistakes
      const mistakes = session.mistakes ?? 0;
      let masteryScore = 0;
      if (mistakes === 0) {
        masteryScore = 100;
      } else if (mistakes <= 2) {
        masteryScore = 70;
      } else {
        masteryScore = 0;
      }

      // Parse skill_domain text array
      let rawDomains: string[] = [];
      if (Array.isArray(session.skill_domain)) {
        rawDomains = session.skill_domain;
      } else if (typeof session.skill_domain === "string") {
        try {
          const parsed = JSON.parse(session.skill_domain);
          if (Array.isArray(parsed)) rawDomains = parsed;
          else rawDomains = [session.skill_domain];
        } catch {
          rawDomains = [session.skill_domain];
        }
      }

      for (const rawSubSkill of rawDomains) {
        if (!rawSubSkill) continue;
        const normalizedSubSkill = rawSubSkill.trim().toLowerCase();

        let masterDomainName = subSkillToDomain.get(normalizedSubSkill);
        if (!masterDomainName) {
          for (const mdName of masterDomainMap.values()) {
            if (mdName.toLowerCase() === normalizedSubSkill || normalizedSubSkill.includes(mdName.toLowerCase())) {
              masterDomainName = mdName;
              break;
            }
          }
        }

        const domainKey = masterDomainName ? getDomainKey(masterDomainName) : getDomainKey(rawSubSkill);
        if (domainKey) {
          monthlyAcc[monthName][domainKey].total += masteryScore;
          monthlyAcc[monthName][domainKey].count += 1;
        }
      }
    }

    // Step 5: Format for Chart
    const formattedData: DevelopmentalProgressPoint[] = monthNames.map((month) => {
      const monthData = monthlyAcc[month];
      return {
        month,
        motor: monthData.motor.count > 0 ? Math.round(monthData.motor.total / monthData.motor.count) : 0,
        cognitive: monthData.cognitive.count > 0 ? Math.round(monthData.cognitive.total / monthData.cognitive.count) : 0,
        sensory: monthData.sensory.count > 0 ? Math.round(monthData.sensory.total / monthData.sensory.count) : 0,
        communication: monthData.communication.count > 0 ? Math.round(monthData.communication.total / monthData.communication.count) : 0,
        social: monthData.social.count > 0 ? Math.round(monthData.social.total / monthData.social.count) : 0,
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error in getDashboardDevelopmentalProgressData:", error);
    return [];
  }
}

// ============================================================================
// ACTIVITY PERFORMANCE ALERTS QUERY
// ============================================================================

export interface ActivityPerformanceAlertItem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  totalSessions: number;
  bailoutRate: number;
  avgMistakes: number;
}

/**
 * Fetches activities and student_sessions from Supabase.
 * Unnests session activity_path and matches with activities table on activities.path.
 * Calculates:
 * - totalSessions
 * - bailoutRate (% of sessions with mistakes >= 3)
 * - avgMistakes (average mistakes per session)
 * Returns items sorted by bailoutRate descending.
 */
export async function getActivityPerformanceAlerts(): Promise<ActivityPerformanceAlertItem[]> {
  try {
    const [activitiesRes, sessionsRes] = await Promise.all([
      supabase.from("activities").select("id, title, category, sub_category, difficulty_level, path"),
      supabase.from("student_sessions").select("activity_path, mistakes"),
    ]);

    if (activitiesRes.error) throw activitiesRes.error;
    if (sessionsRes.error) throw sessionsRes.error;

    const activities = activitiesRes.data || [];
    const sessions = sessionsRes.data || [];

    const activityMap = new Map<string, {
      id: string;
      title: string;
      category: string;
      difficulty: string;
      path: string;
    }>();

    activities.forEach((act) => {
      if (act.path) {
        const level = typeof act.difficulty_level === "number" ? act.difficulty_level : parseInt(String(act.difficulty_level || "0"), 10);
        const diffLabel = getDifficultyLabel(level);

        activityMap.set(act.path.trim(), {
          id: String(act.id),
          title: act.title || "Untitled Activity",
          category: act.category || "General",
          difficulty: diffLabel,
          path: act.path.trim(),
        });
      }
    });

    const pathMetrics = new Map<string, {
      totalSessions: number;
      bailoutCount: number;
      totalMistakes: number;
    }>();

    for (const session of sessions) {
      const mistakes = session.mistakes ?? 0;
      const isBailout = mistakes >= 3;

      let paths: string[] = [];
      if (Array.isArray(session.activity_path)) {
        paths = session.activity_path;
      } else if (typeof session.activity_path === "string") {
        try {
          const parsed = JSON.parse(session.activity_path);
          if (Array.isArray(parsed)) paths = parsed;
          else paths = [session.activity_path];
        } catch {
          paths = [session.activity_path];
        }
      }

      for (const rawPath of paths) {
        if (!rawPath) continue;
        const trimmedPath = rawPath.trim();
        if (!activityMap.has(trimmedPath)) continue;

        let m = pathMetrics.get(trimmedPath);
        if (!m) {
          m = { totalSessions: 0, bailoutCount: 0, totalMistakes: 0 };
          pathMetrics.set(trimmedPath, m);
        }

        m.totalSessions += 1;
        if (isBailout) m.bailoutCount += 1;
        m.totalMistakes += mistakes;
      }
    }

    const items: ActivityPerformanceAlertItem[] = [];

    activityMap.forEach((act, path) => {
      const m = pathMetrics.get(path);
      const totalSessions = m ? m.totalSessions : 0;
      const bailoutRate = totalSessions > 0 ? Number(((m!.bailoutCount / totalSessions) * 100).toFixed(1)) : 0;
      const avgMistakes = totalSessions > 0 ? Number((m!.totalMistakes / totalSessions).toFixed(1)) : 0;

      items.push({
        id: act.id,
        title: act.title,
        category: act.category,
        difficulty: act.difficulty,
        totalSessions,
        bailoutRate,
        avgMistakes,
      });
    });

    items.sort((a, b) => b.bailoutRate - a.bailoutRate);

    return items;
  } catch (error) {
    console.error("Error in getActivityPerformanceAlerts:", error);
    return [];
  }
}




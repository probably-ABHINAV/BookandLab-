import { createServerSupabaseClient } from "@/lib/supabase/server";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export async function calculateProgress(userId: string, subjectId?: string) {
  const supabase = await createServerSupabaseClient();

  let chapQuery = supabase
    .from("chapters")
    .select("id")
    .eq("is_published", true)
    .is("deleted_at", null);

  if (subjectId) chapQuery = chapQuery.eq("subject_id", subjectId);
  const { data: chapters } = await chapQuery;
  const ids = chapters?.map((c) => c.id) ?? [];

  if (ids.length === 0) return { total: 0, completed: 0, percentage: 0 };

  const { data: done } = await supabase
    .from("chapter_progress")
    .select("chapter_id")
    .eq("user_id", userId)
    .eq("status", "completed")
    .in("chapter_id", ids);

  const total = ids.length;
  const completed = done?.length ?? 0;
  return {
    total,
    completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export async function calculateSkillAverages(userId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: submissions } = await supabase
    .from("project_submissions")
    .select("id")
    .eq("user_id", userId);

  const subIds = submissions?.map((r) => r.id) ?? [];
  if (subIds.length === 0) return null;

  const { data: reviews } = await supabase
    .from("mentor_reviews")
    .select(
      "concept_clarity, critical_thinking, application, communication, reviewed_at"
    )
    .in("submission_id", subIds)
    .order("reviewed_at", { ascending: false })
    .limit(20);

  if (!reviews || reviews.length === 0) return null;

  const avg = (key: "concept_clarity" | "critical_thinking" | "application" | "communication") =>
    Math.round(
      (reviews.reduce((s, r) => s + (Number(r[key]) || 0), 0) / reviews.length) *
        10
    ) / 10;

  const recent = reviews.slice(0, 3);
  const prev = reviews.slice(3, 6);
  const trend = (key: "concept_clarity" | "critical_thinking" | "application" | "communication") => {
    const r =
      recent.reduce((s, x) => s + Number(x[key] || 0), 0) /
      (recent.length || 1);
    const p =
      prev.reduce((s, x) => s + Number(x[key] || 0), 0) / (prev.length || 1);
    return r > p ? ("up" as const) : r < p ? ("down" as const) : ("stable" as const);
  };

  return {
    concept_clarity: { avg: avg("concept_clarity"), trend: trend("concept_clarity") },
    critical_thinking: { avg: avg("critical_thinking"), trend: trend("critical_thinking") },
    application: { avg: avg("application"), trend: trend("application") },
    communication: { avg: avg("communication"), trend: trend("communication") },
  };
}

// Called every time a student completes a step
export async function updateUserStats(userId: string) {
  const supabase = await createServerSupabaseClient();
  const today = dayjs().format("YYYY-MM-DD");
  const monday = dayjs().startOf("isoWeek").format("YYYY-MM-DD");

  const { data: stats } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", userId)
    .single();

  // --- STREAK LOGIC ---
  let currentStreak = stats?.current_streak ?? 0;
  let longestStreak = stats?.longest_streak ?? 0;
  const lastActive = stats?.last_active_date;

  if (lastActive === today) {
    // Already active today, no change
  } else if (
    lastActive === dayjs().subtract(1, "day").format("YYYY-MM-DD")
  ) {
    // Consecutive day — extend streak
    currentStreak += 1;
    longestStreak = Math.max(longestStreak, currentStreak);
  } else {
    // Gap — reset streak
    currentStreak = 1;
  }

  // --- WEEKLY GOAL LOGIC ---
  let weeklyDone = stats?.weekly_chapters_done ?? 0;
  const weekStart = stats?.week_start_date;

  if (weekStart !== monday) {
    weeklyDone = 0;
  }

  const { count } = await supabase
    .from("chapter_progress")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("status", "completed")
    .gte("completed_at", monday + "T00:00:00Z");

  weeklyDone = count ?? 0;

  const { count: totalCount } = await supabase
    .from("chapter_progress")
    .select("id", { count: "exact" })
    .eq("user_id", userId)
    .eq("status", "completed");

  const { count: totalSteps } = await supabase
    .from("chapter_progress")
    .select("steps_completed", { count: "exact" })
    .eq("user_id", userId);

  await supabase.from("user_stats").upsert(
    {
      user_id: userId,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_active_date: today,
      week_start_date: monday,
      weekly_chapters_done: weeklyDone,
      total_chapters_completed: totalCount ?? 0,
      total_steps_completed: totalSteps ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return { currentStreak, longestStreak, weeklyDone };
}

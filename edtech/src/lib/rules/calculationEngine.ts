import { createServerSupabaseAdmin } from "@/lib/supabase/server";

// Progress calculation
export async function calculateProgress(userId: string, subjectId?: string) {
  const supabase = await createServerSupabaseAdmin();
  let q = supabase.from("chapters").select("id").eq("is_published", true);
  if (subjectId) q = q.eq("subject_id", subjectId);
  const { data: chapters } = await q;
  const ids = chapters?.map(c => c.id) ?? [];
  const { count } = await supabase.from("chapter_progress")
    .select("id", { count: "exact" }).eq("user_id", userId)
    .eq("status", "completed").in("chapter_id", ids);
  const total = ids.length;
  const done = count ?? 0;
  return { total, completed: done, percentage: total > 0 ? Math.round(done / total * 100) : 0 };
}

// Skill averages with trend
export async function calculateSkillAverages(userId: string) {
  const supabase = await createServerSupabaseAdmin();
  // Get all submission IDs for this student
  const { data: subs } = await supabase
    .from("project_submissions").select("id").eq("user_id", userId);
  const subIds = subs?.map(s => s.id) ?? [];
  if (!subIds.length) return null;
  const { data: reviews } = await supabase
    .from("mentor_reviews")
    .select("concept_clarity,critical_thinking,application,communication,reviewed_at")
    .in("submission_id", subIds)
    .order("reviewed_at", { ascending: false }).limit(20);
  if (!reviews?.length) return null;
  const avg = (key: keyof typeof reviews[0]) => Math.round(reviews.reduce((s, r) => s + (Number(r[key]) || 0), 0) / reviews.length * 10) / 10;
  const recent = reviews.slice(0, 3);
  const prev = reviews.slice(3, 6);
  const trend = (key: keyof typeof reviews[0]) => {
    const r = recent.reduce((s, x) => s + (Number(x[key]) || 0), 0) / (recent.length || 1);
    const p = prev.reduce((s, x) => s + (Number(x[key]) || 0), 0) / (prev.length || 1);
    return r > p ? "up" : r < p ? "down" : "stable";
  };
  return {
    concept_clarity:   { avg: avg("concept_clarity"),   trend: trend("concept_clarity") },
    critical_thinking: { avg: avg("critical_thinking"), trend: trend("critical_thinking") },
    application:       { avg: avg("application"),       trend: trend("application") },
    communication:     { avg: avg("communication"),     trend: trend("communication") },
  };
}

function getMondayOfWeek() {
  const d = new Date();
  const day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); 
  return new Date(d.setDate(diff)).toISOString().split("T")[0];
}

// src/lib/calculationEngine.ts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUserStats(supabase: any, userId: string) {
  const { data: stats } = await supabase
    .from("user_stats").select("*").eq("user_id", userId).single();

  const today = new Date(); 
  today.setHours(0,0,0,0);
  const lastActive = stats?.last_active_date
    ? new Date(stats.last_active_date) : null;

  let newStreak = stats?.streak_count || 0;
  if (!lastActive) { 
    newStreak = 1;
  }
  else {
    const diffDays = Math.floor((today.getTime()-lastActive.getTime())/86400000);
    if (diffDays === 0) { /* same day — no change */ }
    else if (diffDays === 1) { newStreak += 1; }
    else { newStreak = 1; } // streak broken
  }

  // Weekly goal: count chapters completed this week (Mon-Sun)
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1);
  const { count } = await supabase
    .from("chapter_progress")
    .select("id", { count: "exact" })
    .eq("user_id", userId).eq("status", "completed")
    .gte("completed_at", monday.toISOString());

  await supabase.from("user_stats").upsert({
    user_id: userId,
    streak_count: newStreak,
    chapters_this_week: count || 0,
    last_active_date: today.toISOString()
  }, { onConflict: "user_id" });
}

export async function oldUpdateUserStats(userId: string) {
  const supabase = await createServerSupabaseAdmin();
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  const monday = getMondayOfWeek();
  const { data: stats } = await supabase
    .from("user_stats").select("*").eq("user_id", userId).single();
  
  // Streak
  let streak = stats?.current_streak ?? 0;
  let longest = stats?.longest_streak ?? 0;
  const last = stats?.last_active_date;
  if (last === today) { /* no change */ }
  else if (last === yesterday) { streak += 1; longest = Math.max(longest, streak); }
  else { streak = 1; }

  // Weekly goal
  const { count: weeklyDone } = await supabase
    .from("chapter_progress").select("id", { count: "exact" })
    .eq("user_id", userId).eq("status", "completed")
    .gte("completed_at", monday + "T00:00:00Z");
    
  // Total
  const { count: totalDone } = await supabase
    .from("chapter_progress").select("id", { count: "exact" })
    .eq("user_id", userId).eq("status", "completed");
    
  await supabase.from("user_stats").upsert({
    user_id: userId, current_streak: streak, longest_streak: longest,
    last_active_date: today, week_start_date: monday,
    weekly_chapters_done: weeklyDone ?? 0,
    total_chapters_completed: totalDone ?? 0,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id" });
  
  return { streak, weeklyDone: weeklyDone ?? 0 };
}

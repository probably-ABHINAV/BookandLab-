import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import {
  calculateProgress,
  calculateSkillAverages,
} from "@/lib/rules/calculationEngine";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "student");
  if (authError) return authError;
  const userId = user!.id;

  const { error: subErr, subscription } = await subscriptionRule(userId);
  if (subErr) return subErr;

  const supabase = await createServerSupabaseClient();

  const [overallProgress, skillAverages, stats, lastActivity, pending, subjects, notifications] =
    await Promise.all([
      calculateProgress(userId),
      calculateSkillAverages(userId),
      supabase.from("user_stats").select("*").eq("user_id", userId).single(),
      supabase
        .from("chapter_progress")
        .select("chapter_id, current_step, last_activity, chapters(title, subjects(name))")
        .eq("user_id", userId)
        .order("last_activity", { ascending: false })
        .limit(1),
      supabase
        .from("project_submissions")
        .select("id, chapter_id, status, chapters(title)")
        .eq("user_id", userId)
        .eq("status", "pending_review"),
      supabase.from("subjects").select("id, name").is("deleted_at", null),
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const subjectProgress = await Promise.all(
    (subjects.data ?? []).map(async (s) => ({
      id: s.id,
      name: s.name,
      ...(await calculateProgress(userId, s.id)),
    }))
  );

  const userStats = stats.data;

  return NextResponse.json({
    subscription_end: subscription?.end_date,
    continue_learning: lastActivity.data?.[0] ?? null,
    progress_summary: overallProgress,
    subject_cards: subjectProgress,
    skill_snapshot: skillAverages,
    pending_tasks: pending.data ?? [],
    notifications: notifications.data ?? [],
    weekly_goal: {
      target: userStats?.weekly_target ?? 2,
      done: userStats?.weekly_chapters_done ?? 0,
      percentage: Math.round(
        ((userStats?.weekly_chapters_done ?? 0) / (userStats?.weekly_target ?? 2)) * 100
      ),
    },
    streak: {
      current: userStats?.current_streak ?? 0,
      longest: userStats?.longest_streak ?? 0,
      last_active: userStats?.last_active_date,
    },
    total_completed: userStats?.total_chapters_completed ?? 0,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import { calculateSkillAverages } from "@/lib/rules/calculationEngine";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "student");
  if (authError) return authError;
  const userId = user!.id;

  const { error: subErr } = await subscriptionRule(userId);
  if (subErr) return subErr;

  const supabase = await createServerSupabaseClient();

  const [completedChapters, stats, subjects] = await Promise.all([
    supabase
      .from("chapter_progress")
      .select("chapter_id, completed_at, chapters(title, subjects(name))")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false }),
    supabase.from("user_stats").select("*").eq("user_id", userId).single(),
    supabase.from("subjects").select("id, name, chapters(id, is_published)").is("deleted_at", null),
  ]);

  // Get reviews for skill history
  const { data: submissions } = await supabase
    .from("project_submissions")
    .select("id")
    .eq("user_id", userId);

  const subIds = submissions?.map((r) => r.id) ?? [];
  let allReviews: unknown[] = [];
  if (subIds.length > 0) {
    const { data } = await supabase
      .from("mentor_reviews")
      .select("concept_clarity, critical_thinking, application, communication, reviewed_at")
      .in("submission_id", subIds)
      .order("reviewed_at", { ascending: true });
    allReviews = data ?? [];
  }

  const skillAverages = await calculateSkillAverages(userId);

  // Subject breakdown
  const subjectBreakdown = await Promise.all(
    (subjects.data ?? []).map(async (s) => {
      const publishedChapters = (s.chapters as Array<{ id: string; is_published: boolean }>)?.filter(
        (c) => c.is_published
      ) ?? [];
      const total = publishedChapters.length;
      const chapterIds = publishedChapters.map((c) => c.id);

      let completed = 0;
      if (chapterIds.length > 0) {
        const { count } = await supabase
          .from("chapter_progress")
          .select("id", { count: "exact" })
          .eq("user_id", userId)
          .eq("status", "completed")
          .in("chapter_id", chapterIds);
        completed = count ?? 0;
      }

      return {
        id: s.id,
        name: s.name,
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    })
  );

  // Activity last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 864e5).toISOString();
  const { data: recentActivity } = await supabase
    .from("chapter_progress")
    .select("last_activity")
    .eq("user_id", userId)
    .gte("last_activity", thirtyDaysAgo);

  return NextResponse.json({
    completed_chapters: completedChapters.data ?? [],
    skill_averages: skillAverages,
    skill_history: allReviews,
    subject_breakdown: subjectBreakdown,
    streak: {
      current: stats.data?.current_streak ?? 0,
      longest: stats.data?.longest_streak ?? 0,
    },
    weekly_goal: {
      target: stats.data?.weekly_target ?? 2,
      done: stats.data?.weekly_chapters_done ?? 0,
    },
    total_completed: stats.data?.total_chapters_completed ?? 0,
    activity_dates:
      recentActivity?.map((r) => (r.last_activity as string)?.split("T")[0]) ?? [],
  });
}

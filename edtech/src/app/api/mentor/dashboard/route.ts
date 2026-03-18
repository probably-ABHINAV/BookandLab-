import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "mentor");
  if (authError) return authError;
  const mentorId = user!.id;

  const supabase = await createServerSupabaseClient();

  const [assignments, pendingReviews, recentReviews] = await Promise.all([
    supabase
      .from("mentor_assignments")
      .select("student_id, users!mentor_assignments_student_id_fkey(id, name, email, avatar_url)")
      .eq("mentor_id", mentorId)
      .eq("is_active", true),
    supabase
      .from("project_submissions")
      .select("id, user_id, chapter_id, submitted_at, status, users(name), chapters(title)")
      .eq("status", "pending_review")
      .is("deleted_at", null)
      .in(
        "user_id",
        (
          await supabase
            .from("mentor_assignments")
            .select("student_id")
            .eq("mentor_id", mentorId)
            .eq("is_active", true)
        ).data?.map((a) => a.student_id) ?? []
      )
      .order("submitted_at", { ascending: true }),
    supabase
      .from("mentor_reviews")
      .select("id, submission_id, reviewed_at, concept_clarity, critical_thinking, application, communication")
      .eq("mentor_id", mentorId)
      .order("reviewed_at", { ascending: false })
      .limit(10),
  ]);

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() + 1);
  const reviewsThisWeek =
    recentReviews.data?.filter(
      (r) => new Date(r.reviewed_at) >= thisWeekStart
    ).length ?? 0;

  return NextResponse.json({
    total_students: assignments.data?.length ?? 0,
    pending_reviews: pendingReviews.data ?? [],
    pending_count: pendingReviews.data?.length ?? 0,
    reviews_this_week: reviewsThisWeek,
    recent_reviews: recentReviews.data ?? [],
    assigned_students: assignments.data?.map((a) => a.users) ?? [],
  });
}

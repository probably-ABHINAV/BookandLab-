import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { calculateProgress, calculateSkillAverages } from "@/lib/rules/calculationEngine";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, user } = await requireRole(request, "mentor");
  if (authError) return authError;
  const mentorId = user!.id;
  const { id: studentId } = await params;

  const supabase = await createServerSupabaseClient();

  // Verify assignment
  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("student_id", studentId)
    .eq("is_active", true)
    .single();

  if (!assignment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [student, progress, skillAverages, submissions, subscription] = await Promise.all([
    supabase.from("users").select("id, name, email, avatar_url").eq("id", studentId).single(),
    calculateProgress(studentId),
    calculateSkillAverages(studentId),
    supabase
      .from("project_submissions")
      .select("id, chapter_id, status, submitted_at, chapters(title)")
      .eq("user_id", studentId)
      .is("deleted_at", null)
      .order("submitted_at", { ascending: false }),
    supabase
      .from("subscriptions")
      .select("status, end_date")
      .eq("user_id", studentId)
      .eq("status", "active")
      .single(),
  ]);

  return NextResponse.json({
    student: student.data,
    progress,
    skill_averages: skillAverages,
    submissions: submissions.data ?? [],
    subscription: subscription.data,
  });
}

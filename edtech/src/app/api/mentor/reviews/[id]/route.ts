import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { mentorReviewSchema, validateBody } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "mentor") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: submissionId } = await params;
  const supabase = await createServerSupabaseClient();

  // BOLA Guard: Verify this mentor is assigned to this student
  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("student_id")
    .eq("mentor_id", auth.userId)
    .single();

  if (!assignment) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Get submission + student name + chapter title
  const { data: submission } = await supabase
    .from("submissions")
    .select(`
      *,
      users!student_id(name),
      chapters(title)
    `)
    .eq("id", submissionId)
    .eq("student_id", assignment.student_id)
    .single();

  if (!submission) return NextResponse.json({ error: "Forbidden or Not Found" }, { status: 403 });

  return NextResponse.json({ success: true, submission });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "mentor") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, mentorReviewSchema);
  if (error) return error;

  const { id: submissionId } = await params;
  const supabase = await createServerSupabaseClient();

  // 1. Verify BOLA again in POST
  const { data: submission } = await supabase
    .from("submissions")
    .select("student_id, chapter_id")
    .eq("id", submissionId)
    .single();

  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", auth.userId)
    .eq("student_id", submission.student_id)
    .single();

  if (!assignment) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Execute sequential updates (simulating transaction)
  // a. Insert 4 rows into skill_growth
  const skillsToInsert = [
    { user_id: submission.student_id, submission_id: submissionId, skill_type: "concept", score: data.scores.concept },
    { user_id: submission.student_id, submission_id: submissionId, skill_type: "critical_thinking", score: data.scores.critical_thinking },
    { user_id: submission.student_id, submission_id: submissionId, skill_type: "application", score: data.scores.application },
    { user_id: submission.student_id, submission_id: submissionId, skill_type: "communication", score: data.scores.communication }
  ];

  await supabase.from("skill_growth").insert(skillsToInsert);

  // b. Update submission status
  await supabase.from("submissions")
    .update({ 
      status: "reviewed", 
      reviewer_comment: data.comment, 
      reviewed_at: new Date().toISOString() 
    })
    .eq("id", submissionId);

  // c. Unlock step 6
  await supabase.from("chapter_progress")
    .update({ step_6_unlocked: true })
    .eq("user_id", submission.student_id)
    .eq("chapter_id", submission.chapter_id);

  return NextResponse.json({ success: true });
}

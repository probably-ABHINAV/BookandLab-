import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, mentorReviewSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "mentor");
  if (authError) return authError;
  const mentorId = user!.id;

  const { data, error: valErr } = await validateBody(request, mentorReviewSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();

  // BOLA check: ensure mentor is assigned to this student
  const { data: submission } = await supabase
    .from("project_submissions")
    .select("id, user_id, status")
    .eq("id", data!.submission_id)
    .single();

  if (!submission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: assignment } = await supabase
    .from("mentor_assignments")
    .select("id")
    .eq("mentor_id", mentorId)
    .eq("student_id", submission.user_id)
    .eq("is_active", true)
    .single();

  if (!assignment) {
    return NextResponse.json({ error: "Not authorized for this student" }, { status: 404 });
  }

  if (submission.status === "reviewed") {
    return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
  }

  const { data: review, error } = await supabase
    .from("mentor_reviews")
    .insert({ ...data!, mentor_id: mentorId })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }

  await supabase
    .from("project_submissions")
    .update({
      status: data!.is_resubmit_requested ? "resubmit" : "reviewed",
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", data!.submission_id);

  // Notify student
  await supabase.from("notifications").insert({
    user_id: submission.user_id,
    type: "review_complete",
    title: "Your project has been reviewed",
    body: "Check your skills page for feedback and scores",
  });

  return NextResponse.json({ success: true, review_id: review.id });
}

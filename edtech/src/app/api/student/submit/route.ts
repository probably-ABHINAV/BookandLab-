import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import { validateBody, projectSubmitSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "student");
  if (authError) return authError;
  const userId = user!.id;

  const { data, error: valErr } = await validateBody(request, projectSubmitSchema);
  if (valErr) return valErr;

  const { error: subErr } = await subscriptionRule(userId);
  if (subErr) return subErr;

  const supabase = await createServerSupabaseClient();

  const { data: submission, error } = await supabase
    .from("project_submissions")
    .insert({
      user_id: userId,
      chapter_id: data!.chapter_id,
      text_answer: data!.text_answer,
      reflection: data!.reflection || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, submission_id: submission.id });
}

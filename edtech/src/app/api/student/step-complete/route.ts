import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import { validateBody, stepCompleteSchema } from "@/lib/validations/schemas";
import { updateUserStats } from "@/lib/rules/calculationEngine";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authError, user } = await requireRole(request, "student");
  if (authError) return authError;
  const userId = user!.id;

  const { data, error: valErr } = await validateBody(request, stepCompleteSchema);
  if (valErr) return valErr;

  const { error: subErr } = await subscriptionRule(userId);
  if (subErr) return subErr;

  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase
    .from("chapter_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("chapter_id", data!.chapter_id)
    .single();

  const stepsCompleted: number[] = existing?.steps_completed ?? [];
  if (!stepsCompleted.includes(data!.step)) stepsCompleted.push(data!.step);

  const isLastStep = data!.step === 6;
  const isNowComplete = stepsCompleted.length === 6 || isLastStep;

  const progressUpdate = {
    user_id: userId,
    chapter_id: data!.chapter_id,
    current_step: Math.min(data!.step + 1, 6),
    steps_completed: stepsCompleted,
    status: isNowComplete ? "completed" : "in_progress",
    completed_at: isNowComplete ? new Date().toISOString() : null,
    last_activity: new Date().toISOString(),
  };

  await supabase
    .from("chapter_progress")
    .upsert(progressUpdate, { onConflict: "user_id,chapter_id" });

  const stats = await updateUserStats(userId);

  return NextResponse.json({
    success: true,
    chapter_completed: isNowComplete,
    streak: stats.currentStreak,
    weekly_done: stats.weeklyDone,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { unlockRule } from "@/lib/rules/unlockRule";
import { updateUserStats } from "@/lib/rules/calculationEngine";
import { stepCompleteSchema, validateBody } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "student") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, stepCompleteSchema);
  if (error) return error;

  const { id: chapterId } = await params;
  const stepNumber = data.stepNumber;

  const supabase = await createServerSupabaseClient();
  
  const isUnlocked = await unlockRule(supabase, auth.userId, chapterId, stepNumber);
  if (!isUnlocked) return NextResponse.json({ error: "Step is locked" }, { status: 403 });

  const { error: upsertErr } = await supabase.from("chapter_progress").upsert({
    user_id: auth.userId, 
    chapter_id: chapterId,
    current_step: stepNumber + 1,
    [`step_${stepNumber}_done`]: true,
    updated_at: new Date().toISOString()
  }, { onConflict: "user_id,chapter_id" });

  if (upsertErr) return NextResponse.json({ error: upsertErr.message }, { status: 500 });

  await updateUserStats(supabase, auth.userId);

  const { data: updatedStats } = await supabase.from("user_stats").select("*").eq("user_id", auth.userId).single();

  return NextResponse.json({ success: true, newStep: stepNumber + 1, stats: updatedStats || null });
}

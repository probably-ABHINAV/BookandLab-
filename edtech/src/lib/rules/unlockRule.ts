import { createServerSupabaseClient } from "@/lib/supabase/server";

// src/lib/rules/unlockRule.ts
export async function unlockRule(
  supabase: any, userId: string, chapterId: string, stepNumber: number
): Promise<boolean> {
  if (stepNumber === 1) return true;
  if (stepNumber === 6) {
    const { data } = await supabase
      .from("chapter_progress")
      .select("step_6_unlocked")
      .eq("user_id", userId).eq("chapter_id", chapterId).single();
    return data?.step_6_unlocked === true;
  }
  const prevStep = `step_${stepNumber - 1}_done`;
  const { data } = await supabase
    .from("chapter_progress")
    .select(prevStep)
    .eq("user_id", userId).eq("chapter_id", chapterId).single();
  return data?.[prevStep] === true;
}

export async function canAccessChapter(userId: string, chapterId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: ch } = await supabase
    .from("chapters")
    .select("is_published, prerequisite_chapter_id")
    .eq("id", chapterId)
    .single();
  if (!ch || !ch.is_published) return false;
  if (ch.prerequisite_chapter_id) {
    const { data: prereq } = await supabase
      .from("chapter_progress")
      .select("status")
      .eq("user_id", userId)
      .eq("chapter_id", ch.prerequisite_chapter_id)
      .single();
    if (!prereq || prereq.status !== "completed") return false;
  }
  return true;
}

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function canAccessChapter(userId: string, chapterId: string) {
  const supabase = await createServerSupabaseClient();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("is_published, prerequisite_chapter_id")
    .eq("id", chapterId)
    .single();

  if (!chapter || !chapter.is_published) return false;

  if (chapter.prerequisite_chapter_id) {
    const { data: prereq } = await supabase
      .from("chapter_progress")
      .select("status")
      .eq("user_id", userId)
      .eq("chapter_id", chapter.prerequisite_chapter_id)
      .single();

    if (!prereq || prereq.status !== "completed") return false;
  }

  return true;
}

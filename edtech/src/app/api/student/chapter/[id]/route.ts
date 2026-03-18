import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import { canAccessChapter } from "@/lib/rules/unlockRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authError, user } = await requireRole(request, "student");
  if (authError) return authError;
  const userId = user!.id;

  const { error: subErr } = await subscriptionRule(userId);
  if (subErr) return subErr;

  const { id } = await params;

  const canAccess = await canAccessChapter(userId, id);
  if (!canAccess) {
    return NextResponse.json(
      { error: "Chapter locked — complete prerequisite first" },
      { status: 403 }
    );
  }

  const supabase = await createServerSupabaseClient();

  const [chapterRes, contentRes, progressRes] = await Promise.all([
    supabase
      .from("chapters")
      .select("*, subjects(name)")
      .eq("id", id)
      .single(),
    supabase
      .from("chapter_content")
      .select("*")
      .eq("chapter_id", id)
      .single(),
    supabase
      .from("chapter_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", id)
      .single(),
  ]);

  if (!chapterRes.data) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json({
    chapter: chapterRes.data,
    content: contentRes.data,
    progress: progressRes.data ?? {
      current_step: 1,
      steps_completed: [],
      status: "in_progress",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
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
  const supabase = await createServerSupabaseClient();

  const { data: subject } = await supabase
    .from("subjects")
    .select("*, chapters(*, chapter_content(*))")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!subject) {
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });
  }

  // Get progress for each chapter
  const chapterIds = subject.chapters?.map((c: { id: string }) => c.id) ?? [];
  const { data: progress } = await supabase
    .from("chapter_progress")
    .select("*")
    .eq("user_id", userId)
    .in("chapter_id", chapterIds);

  const progressMap = new Map(
    (progress ?? []).map((p: { chapter_id: string }) => [p.chapter_id, p])
  );

  const chaptersWithProgress = (subject.chapters ?? []).map(
    (ch: { id: string; [key: string]: unknown }) => ({
      ...ch,
      progress: progressMap.get(ch.id) ?? null,
    })
  );

  return NextResponse.json({
    subject,
    chapters: chaptersWithProgress,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { subscriptionRule } from "@/lib/rules/subscriptionRule";
import { canAccessChapter } from "@/lib/rules/unlockRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr, user } = await requireRole(request, "student");
  if (authErr) return authErr;
  const userId = user!.id;
  
  const { id: chapterId } = await params;

  const { error: subErr } = await subscriptionRule(userId);
  if (subErr) return subErr;

  // Unlock logic
  const isUnlocked = await canAccessChapter(userId, chapterId);
  if (!isUnlocked) {
    return NextResponse.json({ error: "Chapter locked or missing prerequisite" }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();

  try {
    // 1. Read Chapter details
    const { data: chapter } = await supabase
      .from("chapters")
      .select("*, subjects(name)")
      .eq("id", chapterId)
      .single();

    if (!chapter) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. Read Chapter Content
    const { data: content } = await supabase
      .from("chapter_content")
      .select("*")
      .eq("chapter_id", chapterId)
      .single();

    // 3. Read Progress
    const { data: progress } = await supabase
      .from("chapter_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .single();

    // 4. Mentor Info
    const { data: assignment } = await supabase
      .from("mentor_assignments")
      .select("mentor_id, users(name, avatar_url)")
      .eq("student_id", userId)
      .eq("is_active", true)
      .single();

    return NextResponse.json({
      success: true,
      chapter,
      content,
      progress: progress || { current_step: 1, steps_completed: [], status: "not_started" },
      mentor_info: assignment ? assignment.users : null
    });

  } catch (err) {
    console.error("[API Error] GET /student/chapter/[id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

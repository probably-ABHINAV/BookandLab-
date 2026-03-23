import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error: authErr, user } = await requireRole(request, "mentor");
  if (authErr) return authErr;
  const mentorId = user!.id;
  const { id: studentId } = await params;

  const supabase = await createServerSupabaseClient();

  try {
    // 1. BOLA Guard
    const { data: assignment } = await supabase
      .from("mentor_assignments")
      .select("id")
      .eq("mentor_id", mentorId)
      .eq("student_id", studentId)
      .eq("is_active", true)
      .single();

    if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. Student User Data
    const { data: student } = await supabase
      .from("users")
      .select("name, email, avatar_url, created_at")
      .eq("id", studentId)
      .single();

    // 3. Chapter Progress
    const { data: progress } = await supabase
      .from("chapter_progress")
      .select("*, chapters(title)")
      .eq("user_id", studentId)
      .order("last_activity", { ascending: false });

    // 4. Submissions & Reviews
    const { data: submissions } = await supabase
      .from("project_submissions")
      .select("*, chapters(title)")
      .eq("user_id", studentId)
      .order("submitted_at", { ascending: false });

    return NextResponse.json({
      success: true,
      student,
      progress: progress || [],
      submissions: submissions || []
    });

  } catch (err) {
    console.error("[API Error] GET /mentor/student/[id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

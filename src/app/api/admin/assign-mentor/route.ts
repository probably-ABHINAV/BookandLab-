import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, assignMentorSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { data, error: valErr } = await validateBody(request, assignMentorSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();
  try {
    // 1. Inactivate existing true
    await supabase.from("mentor_assignments")
      .update({ is_active: false })
      .eq("student_id", data.student_id)
      .eq("is_active", true);

    // 2. Insert new
    const { data: assignment, error } = await supabase
      .from("mentor_assignments")
      .insert({
        mentor_id: data.mentor_id,
        student_id: data.student_id,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    // 3. Notify mentor
    await supabase.from("notifications").insert({
      user_id: data.mentor_id,
      type: "new_student",
      title: "New student assigned",
      body: "A new student has been assigned to you by the admin.",
      metadata: { student_id: data.student_id }
    });

    return NextResponse.json({ success: true, assignment_id: assignment.id });
  } catch (err) {
    console.error("[API Error] POST /admin/assign-mentor", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // same pattern, the instructions say 'POST/PATCH' or 'PATCH updates old and inserts new'.
  return POST(request);
}

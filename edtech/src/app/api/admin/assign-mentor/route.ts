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

  const { data: assignment, error } = await supabase
    .from("mentor_assignments")
    .upsert(
      {
        mentor_id: data!.mentor_id,
        student_id: data!.student_id,
        is_active: true,
      },
      { onConflict: "mentor_id,student_id" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
  return NextResponse.json({ success: true, assignment });
}

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const supabase = await createServerSupabaseClient();

  const { data: mentors } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "mentor")
    .eq("is_active", true)
    .is("deleted_at", null);

  const mentorsWithCounts = await Promise.all(
    (mentors ?? []).map(async (m) => {
      const { count } = await supabase
        .from("mentor_assignments")
        .select("id", { count: "exact" })
        .eq("mentor_id", m.id)
        .eq("is_active", true);
      return { ...m, student_count: count ?? 0 };
    })
  );

  const { data: unassigned } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "student")
    .eq("is_active", true)
    .is("deleted_at", null);

  return NextResponse.json({
    mentors: mentorsWithCounts,
    students: unassigned ?? [],
  });
}

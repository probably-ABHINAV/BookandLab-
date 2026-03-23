import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authErr, user } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const data = await request.json().catch(() => null);
  if (!data || !data.name || !data.grade_level) {
    return NextResponse.json({ error: "Invalid JSON or missing fields" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  try {
    const { data: newClass, error } = await supabase
      .from("classes")
      .insert({
        name: data.name,
        grade_level: data.grade_level,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_log").insert({
      table_name: "classes",
      record_id: newClass.id,
      action: "INSERT",
      new_data: newClass,
      changed_by: user!.id
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (err) {
    console.error("[API Error] POST /admin/class", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authErr, user } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const data = await request.json().catch(() => null);
  if (!data || !data.name) {
    return NextResponse.json({ error: "Invalid JSON or missing fields" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  try {
    const { data: skill, error } = await supabase
      .from("skill_parameters")
      .upsert({
        id: data.id || undefined, // Upsert if id exists
        name: data.name,
        description: data.description,
        is_active: data.is_active ?? true
      }, { onConflict: "id" }) // assuming id is PK and we upsert on it
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_log").insert({
      table_name: "skill_parameters",
      record_id: skill.id,
      action: "UPSERT",
      new_data: skill,
      changed_by: user!.id
    });

    return NextResponse.json({ success: true, skill });
  } catch (err) {
    console.error("[API Error] POST/PATCH /admin/skill", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  return POST(request);
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { error: authErr, user } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const data = await request.json().catch(() => null);
  if (!data || !data.class_id || !data.name) {
    return NextResponse.json({ error: "Invalid JSON or missing fields" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  try {
    const { data: newSubject, error } = await supabase
      .from("subjects")
      .insert({
        class_id: data.class_id,
        name: data.name,
        tag: data.tag || "",
        order_index: data.order_index || 0
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("audit_log").insert({
      table_name: "subjects",
      record_id: newSubject.id,
      action: "INSERT",
      new_data: newSubject,
      changed_by: user!.id
    });

    return NextResponse.json({ success: true, subject: newSubject });
  } catch (err) {
    console.error("[API Error] POST /admin/subject", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

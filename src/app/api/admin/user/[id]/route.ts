import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();

  const { data, error: dbErr } = await supabase
    .from("users")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true, user: data });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  await supabase
    .from("users")
    .update({ is_active: false, deleted_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ success: true });
}

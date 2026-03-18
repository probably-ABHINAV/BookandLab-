import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("chapters")
    .select("*, subjects(name), chapter_content(*)")
    .eq("id", id)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ chapter: data });
}

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
    .from("chapters")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true, chapter: data });
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
    .from("chapters")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  return NextResponse.json({ success: true });
}

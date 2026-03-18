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
    .from("chapter_content")
    .select("*")
    .eq("chapter_id", id)
    .single();

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ content: data });
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
    .from("chapter_content")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("chapter_id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true, content: data });
}

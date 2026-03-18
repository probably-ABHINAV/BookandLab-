import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, createChapterSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const supabase = await createServerSupabaseClient();
  const { data, error: dbErr } = await supabase
    .from("chapters")
    .select("*, subjects(name), units(name), chapter_content(*)")
    .is("deleted_at", null)
    .order("order_index", { ascending: true });

  if (dbErr) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  return NextResponse.json({ chapters: data });
}

export async function POST(request: NextRequest) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { data, error: valErr } = await validateBody(request, createChapterSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();

  const { data: chapter, error } = await supabase
    .from("chapters")
    .insert(data!)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Create failed" }, { status: 500 });

  // Create empty content row
  await supabase.from("chapter_content").insert({ chapter_id: chapter.id });

  return NextResponse.json({ success: true, chapter }, { status: 201 });
}

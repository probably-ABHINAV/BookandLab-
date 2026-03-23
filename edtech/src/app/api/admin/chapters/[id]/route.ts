import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { updateChapterSchema, validateBody } from "@/lib/validations/schemas";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, updateChapterSchema);
  if (error) return error;

  const { id } = await params;
  const adminClient = createAdminClient();

  const updates: Record<string, string | boolean | null> = { updated_at: new Date().toISOString() };
  if (data.title !== undefined) updates.title = data.title;
  if (data.description !== undefined) updates.description = data.description;
  if (data.status !== undefined) {
    updates.is_published = data.status === "published";
    if (data.status === "published") updates.published_at = new Date().toISOString();
  }
  if (data.deleted_at !== undefined) updates.deleted_at = data.deleted_at;

  const { data: chapter, error: dbErr } = await adminClient
    .from("chapters")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true, chapter });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const adminClient = createAdminClient();

  const { error: dbErr } = await adminClient
    .from("chapters")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id);

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

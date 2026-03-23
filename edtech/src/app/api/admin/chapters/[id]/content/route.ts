import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: chapterId } = await params;
  const adminClient = createAdminClient();

  // If no content exists yet, this will safely return null. Upsert creates it.
  const { data: content, error } = await adminClient
    .from("chapter_content")
    .select("*")
    .eq("chapter_id", chapterId)
    .single();

  if (error && error.code !== "PGRST116") { // Ignore 'Not found' error code naturally
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, content: content || {} });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body;
  try { body = await request.json(); } 
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { id: chapterId } = await params;
  const adminClient = createAdminClient();

  // Protect against arbitrary object updates; body should just be { step_1_text: "...", materials: [...] }
  const payload = { chapter_id: chapterId, ...body, updated_at: new Date().toISOString() };

  const { data: content, error } = await adminClient
    .from("chapter_content")
    .upsert(payload, { onConflict: "chapter_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, content });
}

import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createChapterSchema, validateBody } from "@/lib/validations/schemas";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const subjectId = searchParams.get("subject_id");
  const status = searchParams.get("status");

  const adminClient = createAdminClient();

  let query = adminClient.from("chapters").select("*").is("deleted_at", null);
  
  if (subjectId) query = query.eq("subject_id", subjectId);
  // Support both new status column and old is_published boolean just in case
  if (status === "published") query = query.eq("is_published", true);
  if (status === "draft") query = query.eq("is_published", false);

  const { data: chapters, error } = await query;
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, chapters });
}

export async function POST(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, createChapterSchema);
  if (error) return error;

  const adminClient = createAdminClient();

  // Map to existing columns while the DB finishes migrating
  const { data: chapter, error: dbErr } = await adminClient
    .from("chapters")
    .insert({
      title: data.title,
      subject_id: data.subject_id,
      description: data.description || null,
      is_published: false
    })
    .select()
    .single();

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });
  return NextResponse.json({ success: true, chapter });
}

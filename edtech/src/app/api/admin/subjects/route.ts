import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body;
  try { body = await request.json(); } 
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, class_id } = body;
  if (!name || !class_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const adminClient = createAdminClient();
  const { data: subject, error } = await adminClient
    .from("subjects")
    .insert({ name, class_id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, subject });
}

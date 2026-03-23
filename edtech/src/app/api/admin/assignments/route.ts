import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

export async function GET(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const adminClient = createAdminClient();
  const { data: assignments, error } = await adminClient
    .from("mentor_assignments")
    .select("mentor_id, users!mentor_assignments_mentor_id_fkey(name)");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const workload: any = {};
  for (const a of (assignments || [])) {
    if (!workload[a.mentor_id]) workload[a.mentor_id] = { count: 0, name: (a.users as any)?.name };
    workload[a.mentor_id].count++;
  }

  return NextResponse.json({ success: true, workload: Object.entries(workload).map(([mentor_id, data]: any) => ({ mentor_id, ...data })) });
}

export async function POST(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { mentor_id, student_id } = body;
  if (!mentor_id || !student_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const adminClient = createAdminClient();
  const { data, error } = await adminClient.from("mentor_assignments").insert({ mentor_id, student_id }).select().single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, assignment: data });
}

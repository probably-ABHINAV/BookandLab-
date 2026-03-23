import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() { return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!); }

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
  const { id } = await params;
  const adminClient = createAdminClient();
  const { error } = await adminClient.from("users").update({ deleted_at: new Date().toISOString() }).eq("id", id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

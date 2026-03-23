import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function GET(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q");
  const role = searchParams.get("role");

  const adminClient = createAdminClient();

  let query = adminClient
    .from("users")
    .select("*, subscriptions(*)") 
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (role) query = query.eq("role", role);
  if (search) query = query.ilike("name", `%${search}%`); // Using simpler search for simplicity

  const { data: users, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, users });
}

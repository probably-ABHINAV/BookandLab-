import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, createUserSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const supabase = await createServerSupabaseClient();
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const search = url.searchParams.get("search");

  let query = supabase
    .from("users")
    .select("*, subscriptions(status, end_date)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (role) query = query.eq("role", role);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);

  const { data, error: dbErr } = await query;
  if (dbErr) return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  return NextResponse.json({ users: data });
}

export async function POST(request: NextRequest) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { data, error: valErr } = await validateBody(request, createUserSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();

  const { data: user, error } = await supabase
    .from("users")
    .insert(data!)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Create failed", details: error.message }, { status: 500 });

  // Create user_stats entry for students
  if (data!.role === "student") {
    await supabase.from("user_stats").insert({ user_id: user.id });
  }

  return NextResponse.json({ success: true, user }, { status: 201 });
}

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, updateSubscriptionSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error } = await requireRole(request, "admin");
  if (error) return error;

  const { userId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return NextResponse.json({ subscriptions: data ?? [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { userId } = await params;
  const body = await request.json();
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      plan_name: body.plan_name || "standard",
      start_date: body.start_date || new Date().toISOString().split("T")[0],
      end_date: body.end_date,
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Create failed" }, { status: 500 });
  return NextResponse.json({ success: true, subscription: data }, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const { userId } = await params;
  const { data, error: valErr } = await validateBody(request, updateSubscriptionSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();

  const { data: sub, error } = await supabase
    .from("subscriptions")
    .update({ ...data!, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("status", "active")
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true, subscription: sub });
}

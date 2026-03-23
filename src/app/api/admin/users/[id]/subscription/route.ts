import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { extendSubscriptionSchema, validateBody } from "@/lib/validations/schemas";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data, error } = await validateBody(request, extendSubscriptionSchema);
  if (error) return error;

  const { id: userId } = await params;
  const adminClient = createAdminClient();
  const days = data.days;

  const { data: sub } = await adminClient
    .from("subscriptions")
    .select("id, end_date")
    .eq("user_id", userId)
    .single();

  let newExpiry;

  if (!sub) {
    newExpiry = new Date(Date.now() + days * 86400000).toISOString();
    await adminClient.from("subscriptions").insert({
      user_id: userId,
      end_date: newExpiry,
      start_date: new Date().toISOString(),
      plan_name: "standard",
      status: "active"
    });
  } else {
    // Note: 'end_date' in schema maps to prompt's 'expires_at'
    const currentExpiry = new Date(sub.end_date);
    const base = currentExpiry > new Date() ? currentExpiry : new Date();
    base.setDate(base.getDate() + days);
    newExpiry = base.toISOString();
    
    await adminClient.from("subscriptions")
      .update({ end_date: newExpiry, status: "active" })
      .eq("id", sub.id);
  }

  return NextResponse.json({ success: true, newExpiry });
}

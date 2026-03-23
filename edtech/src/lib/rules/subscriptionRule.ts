import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function subscriptionRule(userId: string) {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];
  const { data } = await supabase
    .from("subscriptions")
    .select("end_date, status, plan_name")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("end_date", today)
    .single();
  if (!data)
    return { allowed: false, error: Response.json({ error: "Subscription expired" }, { status: 402 }) };
  return { allowed: true, error: null, subscription: data };
}

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
  if (!data) {
    // Auto-provision a 30-day free trial for new users
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 30);
    const { data: trial } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan_name: "free_trial",
        status: "active",
        start_date: today,
        end_date: trialEnd.toISOString().split("T")[0],
      })
      .select("end_date, status, plan_name")
      .single();
    if (trial) return { allowed: true, error: null, subscription: trial };
    return { allowed: false, error: Response.json({ error: "Subscription expired" }, { status: 402 }) };
  }
  return { allowed: true, error: null, subscription: data };
}

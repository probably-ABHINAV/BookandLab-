import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function subscriptionRule(userId: string) {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("subscriptions")
    .select("end_date, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .gte("end_date", today)
    .single();

  if (!data) {
    return {
      allowed: false,
      error: NextResponse.json(
        { error: "Subscription expired or not found" },
        { status: 402 }
      ),
      subscription: null,
    };
  }

  return { allowed: true, error: null, subscription: data };
}

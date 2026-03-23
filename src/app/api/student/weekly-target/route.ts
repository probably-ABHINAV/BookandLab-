import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { validateBody, weeklyTargetSchema } from "@/lib/validations/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  const { error, user } = await requireRole(request, "student");
  if (error) return error;

  const { data, error: valErr } = await validateBody(request, weeklyTargetSchema);
  if (valErr) return valErr;

  const supabase = await createServerSupabaseClient();
  await supabase.from("user_stats").upsert(
    { user_id: user!.id, weekly_target: data!.weekly_target },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ success: true });
}

import { NextRequest } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export async function PATCH(request: NextRequest) {
  const { error, user } = await requireRole(request, "student");
  if (error) return error;

  const body = await request.json().catch(() => ({}));
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success)
    return Response.json({ error: "Validation failed", details: parsed.error.issues }, { status: 422 });

  const supabase = await createServerSupabaseClient();
  
  const { error: dbErr } = await supabase.from("users")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", user!.id);  // use JWT userId, never request body userId

  if (dbErr) return Response.json({ error: "Update failed", details: dbErr }, { status: 500 });
  return Response.json({ success: true });
}

import { NextRequest } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, user } = await requireRole(request, "student");
  if (error) return error;

  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // BOLA: verify notification belongs to this user
  const { data: notif } = await supabase
    .from("notifications").select("user_id").eq("id", id).single();
    
  if (!notif || notif.user_id !== user!.id)
    return Response.json({ error: "Not found" }, { status: 404 });

  await supabase.from("notifications")
    .update({ is_read: true })
    .eq("id", id);

  return Response.json({ success: true });
}

import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth || auth.role !== "mentor") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const supabase = await createServerSupabaseClient();

  const { data: pendingReviews, error } = await supabase
    .from("submissions")
    .select(`
      id, chapter_id, status, created_at,
      users!student_id(name),
      chapters(title)
    `)
    .eq("mentor_id", auth.userId)
    .eq("status", "submitted")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, pendingReviews: pendingReviews || [] });
}

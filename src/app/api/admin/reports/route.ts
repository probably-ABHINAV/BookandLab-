import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const supabase = await createServerSupabaseClient();
  try {
    const { count: userCount } = await supabase.from("users").select("id", { count: "exact" }).is("deleted_at", null);
    const { count: studentCount } = await supabase.from("users").select("id", { count: "exact" }).eq("role", "student").is("deleted_at", null);
    const { count: activeSubs } = await supabase.from("subscriptions").select("id", { count: "exact" }).eq("status", "active");
    const { count: mentorCount } = await supabase.from("users").select("id", { count: "exact" }).eq("role", "mentor").is("deleted_at", null);

    return NextResponse.json({
      success: true,
      reports: {
        total_users: userCount || 0,
        total_students: studentCount || 0,
        total_mentors: mentorCount || 0,
        active_subscriptions: activeSubs || 0,
      }
    });
  } catch (err) {
    console.error("[API Error] GET /admin/reports", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

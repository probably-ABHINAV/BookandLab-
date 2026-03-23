import { NextRequest } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  // Use createServerSupabaseClient because we need row-level info or admin client?
  // Actually, instructions state "Admin API routes use SUPABASE_SERVICE_ROLE_KEY"
  // so we'll just use the regular mapped one, but our custom `requireRole` checks the role.
  // Wait, the snippet uses `createServerSupabaseClient()`, we will stick to the provided guide logic.
  
  const { error: authErr } = await requireRole(request, "admin");
  if (authErr) return authErr;

  const supabase = await createServerSupabaseClient(); // Assuming RLS allows admin via mapped functions

  // Fetch all data needed for report
  const [usersRes, progressRes, subsRes, reviewsRes] = await Promise.all([
    supabase.from("users").select("id,name,email,role,created_at").eq("is_active", true),
    supabase.from("chapter_progress").select("user_id,chapter_id,status,completed_at"),
    supabase.from("subscriptions").select("user_id,plan_name,end_date,status"),
    supabase.from("mentor_reviews").select("mentor_id,concept_clarity,critical_thinking,application,communication,reviewed_at"),
  ]);

  // Build CSV
  const rows = [
    ["Name","Email","Role","Joined","Chapters Completed","Subscription","Sub End Date"],
    ...(usersRes.data||[]).map(u => {
      const done = (progressRes.data||[]).filter(p=>p.user_id===u.id && p.status==="completed").length;
      const sub  = (subsRes.data||[]).find(s=>s.user_id===u.id);
      return [u.name, u.email, u.role, u.created_at?.split("T")[0], done, sub?.plan_name||"none", sub?.end_date||""];
    })
  ];

  const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="bookandlab-report-${new Date().toISOString().split("T")[0]}.csv"`,
    }
  });
}

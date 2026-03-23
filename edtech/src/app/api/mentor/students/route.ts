import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { error: authErr, user } = await requireRole(request, "mentor");
  if (authErr) return authErr;
  const mentorId = user!.id;

  const supabase = await createServerSupabaseClient();

  try {
    // 1. Get assigned students list
    const { data: assignments } = await supabase
      .from("mentor_assignments")
      .select("student_id, users(name, email, avatar_url, created_at)")
      .eq("mentor_id", mentorId)
      .eq("is_active", true);

    const studentIds = assignments?.map(a => a.student_id) || [];
    
    // 2. We'd enrich this with chapter progress and overall mentor score stats. 
    // This replicates the BOLA logic because `studentIds` limits exactly who we query.
    let studentDetails: any[] = [];

    if (studentIds.length > 0) {
      const { data: stats } = await supabase
        .from("user_stats")
        .select("user_id, current_streak, total_chapters_completed")
        .in("user_id", studentIds);
        
      studentDetails = assignments!.map(a => {
        const matchingStats = stats?.find(s => s.user_id === a.student_id);
        const u = (a.users as any);
        return {
          id: a.student_id,
          name: Array.isArray(u) ? u[0]?.name : u?.name,
          email: Array.isArray(u) ? u[0]?.email : u?.email,
          avatar_url: Array.isArray(u) ? u[0]?.avatar_url : u?.avatar_url,
          streak: matchingStats?.current_streak || 0,
          completed: matchingStats?.total_chapters_completed || 0
        };
      });
    }

    return NextResponse.json({
      success: true,
      students: studentDetails
    });

  } catch (err) {
    console.error("[API Error] GET /mentor/students", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { authRule } from "@/lib/rules/authRule";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const auth = await authRule(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = auth.userId;

  const supabase = await createServerSupabaseClient();

  try {
    const [statsRes, currentChapterRes, progressRes, skillsRes, heatmapRawRes] = await Promise.all([
      // 1. user_stats
      supabase.from("user_stats").select("*").eq("user_id", userId).single(),
      
      // 2. chapter_progress with chapter join
      supabase.from("chapter_progress")
        .select("*, chapters(title, subject_id)")
        .eq("user_id", userId)
        .neq("status", "completed")
        .order("last_activity", { ascending: false })
        .limit(1)
        .single(),

      // 3. subjects / progress
      supabase.from("chapter_progress")
        .select("status, chapters(subject_id)")
        .eq("user_id", userId),

      // 4. skills
      supabase.from("skill_growth")
        .select("skill_type, score, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),

      // 5. heatmap (last 30 days)
      supabase.from("chapter_progress")
        .select("completed_at")
        .eq("user_id", userId)
        .not("completed_at", "is", null)
    ]);

    // Group progress by subject
    const subjectsAgg: Record<string, { total: number; done: number }> = {};
    if (progressRes.data) {
      for (const p of progressRes.data) {
        const subjId = (p.chapters as any)?.subject_id;
        if (!subjId) continue;
        if (!subjectsAgg[subjId]) subjectsAgg[subjId] = { total: 0, done: 0 };
        subjectsAgg[subjId].total++;
        if (p.status === "completed") subjectsAgg[subjId].done++;
      }
    }

    // Group heatmap by date
    const heatmapAgg: Record<string, number> = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (heatmapRawRes.data) {
      for (const h of heatmapRawRes.data) {
        const d = new Date(h.completed_at!);
        if (d >= thirtyDaysAgo) {
          const dateStr = d.toISOString().split("T")[0];
          heatmapAgg[dateStr] = (heatmapAgg[dateStr] || 0) + 1;
        }
      }
    }

    return NextResponse.json({
      success: true,
      stats: statsRes.data || null,
      currentChapter: currentChapterRes.data || null,
      subjects: Object.entries(subjectsAgg).map(([subject_id, counts]) => ({ subject_id, ...counts })),
      skills: skillsRes.data || [],
      heatmap: Object.entries(heatmapAgg).map(([date, count]) => ({ date, count }))
    });

  } catch (err) {
    console.error("[API Error] GET /student/dashboard", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

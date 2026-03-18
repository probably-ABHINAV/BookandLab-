"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  BookOpen,
  TrendingUp,
  Flame,
  Target,
  ChevronRight,
} from "lucide-react";
import {
  StreakBadge,
  SkillBar,
  ProgressBar,
  ActivityHeatmap,
  DashboardSkeleton,
} from "@/components/ui";

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-progress"],
    queryFn: () => fetch("/api/student/progress").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-3xl font-bold">Progress & Performance</h1>
        <p className="text-navy-600 mt-1">Track your growth and achievements</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-flat text-center">
          <BookOpen className="w-6 h-6 text-primary-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{data?.total_completed ?? 0}</p>
          <p className="text-xs text-navy-600">Total Completed</p>
        </div>
        <div className="card-flat text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{data?.streak?.current ?? 0}</p>
          <p className="text-xs text-navy-600">Current / {data?.streak?.longest ?? 0} Best</p>
        </div>
        <div className="card-flat text-center">
          <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {data?.weekly_goal?.done ?? 0}/{data?.weekly_goal?.target ?? 2}
          </p>
          <p className="text-xs text-navy-600">Weekly Goal</p>
        </div>
        <div className="card-flat text-center">
          <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">
            {data?.skill_averages
              ? (
                  Object.values(data.skill_averages).reduce(
                    (sum: number, s: unknown) => sum + (s as { avg: number }).avg,
                    0
                  ) / 4
                ).toFixed(1)
              : "—"}
          </p>
          <p className="text-xs text-navy-600">Avg Skill Score</p>
        </div>
      </div>

      {/* Skill Averages */}
      {data?.skill_averages && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Skill Overview</h2>
          <div className="card-flat space-y-3">
            {Object.entries(data.skill_averages).map(([key, value]) => (
              <SkillBar
                key={key}
                name={key.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                score={(value as { avg: number; trend: "up" | "down" | "stable" }).avg}
                trend={(value as { avg: number; trend: "up" | "down" | "stable" }).trend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Subject Breakdown */}
      {(data?.subject_breakdown?.length ?? 0) > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Subject Completion</h2>
          <div className="space-y-3">
            {data.subject_breakdown.map(
              (s: { id: string; name: string; total: number; completed: number; percentage: number }) => (
                <div key={s.id} className="card-flat">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-sm text-navy-600">
                      {s.completed} / {s.total}
                    </span>
                  </div>
                  <ProgressBar value={s.completed} max={s.total} showPercentage={false} />
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Activity Heatmap */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Last 30 Days Activity</h2>
        <div className="card-flat">
          <ActivityHeatmap activityDates={data?.activity_dates ?? []} />
          <p className="text-xs text-navy-600 mt-3">
            Green = active, Gray = no activity
          </p>
        </div>
      </div>

      {/* Streak Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakBadge
          streak={data?.streak?.current ?? 0}
          longest={data?.streak?.longest ?? 0}
          size="large"
        />
        <div className="card-flat">
          <h3 className="font-heading text-lg font-bold mb-4">Chapter Timeline</h3>
          {(data?.completed_chapters?.length ?? 0) > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {data.completed_chapters.slice(0, 10).map(
                (ch: { chapter_id: string; completed_at: string; chapters?: { title: string } }) => (
                  <div key={ch.chapter_id} className="flex items-center justify-between py-2 border-b border-cream-100 last:border-0">
                    <span className="text-sm font-medium truncate">
                      {ch.chapters?.title || ch.chapter_id}
                    </span>
                    <span className="text-xs text-navy-600 shrink-0">
                      {ch.completed_at ? new Date(ch.completed_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-navy-600">No chapters completed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

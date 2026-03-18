"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Bell,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  StreakBadge,
  WeeklyGoalRing,
  SkillBar,
  ProgressBar,
  ReviewStatusBadge,
  DashboardSkeleton,
} from "@/components/ui";

export default function StudentDashboard() {
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => fetch("/api/student/dashboard").then((r) => r.json()),
    staleTime: 30_000,
  });

  const setTarget = useMutation({
    mutationFn: (target: number) =>
      fetch("/api/student/weekly-target", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekly_target: target }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["student-dashboard"] }),
  });

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="text-center py-20 animate-fade-up">
        <h2 className="font-heading text-2xl font-bold mb-4 text-brand-navy">Unable to load dashboard</h2>
        <p className="text-text-secondary mb-6">Please check your connection and try again.</p>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["student-dashboard"] })}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-brand-navy">Good morning! 👋</h1>
          <p className="text-text-secondary mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge-premium badge-soft bg-green-50 text-green-700">Active</span>
          <button className="relative p-2 text-text-tertiary hover:text-brand-navy transition-colors bg-white rounded-full shadow-sm border border-brand-muted">
            <Bell className="w-5 h-5" />
            {(data.notifications?.length ?? 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-cream">
                {data.notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (Streak + Goal + Continue) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StreakBadge
              streak={data.streak?.current ?? 0}
              longest={data.streak?.longest ?? 0}
              size="large"
            />
            <div className="bento-card p-6 !rounded-[2rem]">
              <WeeklyGoalRing
                done={data.weekly_goal?.done ?? 0}
                target={data.weekly_goal?.target ?? 2}
                onEditTarget={(t) => setTarget.mutate(t)}
              />
            </div>
          </div>

          {/* Continue Learning */}
          {data.continue_learning && (
            <div className="bento-card !rounded-[2.5rem] bg-brand-navy text-white relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-64 h-64 bg-brand-yellow/20 blur-[80px] rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <BookOpen className="w-8 h-8 text-brand-yellow" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">
                      Resume Learning
                    </p>
                    <h3 className="font-heading text-2xl font-bold mb-1">
                      {data.continue_learning.chapters?.title || "Untitled Chapter"}
                    </h3>
                    <p className="text-sm text-white/70">
                      Step {data.continue_learning.current_step} of 6
                    </p>
                  </div>
                </div>
                <Link
                  href={`/student/chapter/${data.continue_learning.chapter_id}`}
                  className="btn bg-white text-brand-navy hover:bg-brand-yellow hover:scale-105 shrink-0"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="relative z-10 mt-6 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-yellow rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${((data.continue_learning.current_step - 1) / 6) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Current Subjects */}
          {(data.subject_cards?.length ?? 0) > 0 && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-navy mb-4">Subject Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.subject_cards.map(
                  (s: { id: string; name: string; total: number; completed: number; percentage: number }) => (
                    <div key={s.id} className="dashboard-card group hover:shadow-bento cursor-pointer transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-brand-navy text-lg">{s.name}</h3>
                        <Link
                          href={`/student/subjects/${s.id}`}
                          className="w-8 h-8 rounded-full bg-brand-muted flex items-center justify-center group-hover:bg-brand-yellow group-hover:text-brand-navy transition-colors scale-90 group-hover:scale-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                      <ProgressBar value={s.completed} max={s.total} color="bg-brand-navy" showPercentage={false} />
                      <div className="flex justify-between text-xs font-medium text-text-tertiary mt-2">
                        <span>{s.completed} of {s.total} chapters</span>
                        <span className="font-bold text-brand-navy">{s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0}%</span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="dashboard-card text-center p-4">
              <div className="w-10 h-10 bg-brand-muted text-brand-navy rounded-full mx-auto flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <p className="font-heading text-3xl font-bold text-brand-navy">{data.total_completed ?? 0}</p>
              <p className="text-xs font-semibold text-text-tertiary uppercase mt-1">Completed</p>
            </div>
            <div className="dashboard-card text-center p-4">
              <div className="w-10 h-10 bg-brand-muted text-brand-navy rounded-full mx-auto flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="font-heading text-3xl font-bold text-brand-navy">{data.weekly_goal?.done ?? 0}</p>
              <p className="text-xs font-semibold text-text-tertiary uppercase mt-1">This Week</p>
            </div>
          </div>

          {/* Skill Snapshot Bento */}
          {data.skill_snapshot && (
            <div className="bento-card">
              <h2 className="font-heading text-2xl font-bold text-brand-navy mb-6">Skill Snapshot</h2>
              <div className="space-y-5">
                {Object.entries(data.skill_snapshot).map(([key, value]) => (
                  <SkillBar
                    key={key}
                    name={key.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    score={(value as { avg: number; trend: "up" | "down" | "stable" }).avg}
                    trend={(value as { avg: number; trend: "up" | "down" | "stable" }).trend}
                  />
                ))}
              </div>
              <Link href="/student/skills" className="block text-center text-sm font-bold text-brand-navy w-full py-3 mt-6 rounded-xl bg-brand-muted hover:bg-brand-yellow transition-colors">
                View Detailed Analytics
              </Link>
            </div>
          )}

          {/* Pending Tasks */}
          {(data.pending_tasks?.length ?? 0) > 0 && (
            <div className="bento-card p-6">
              <h2 className="font-heading text-xl font-bold text-brand-navy mb-4">Pending Tasks</h2>
              <div className="space-y-3">
                {data.pending_tasks.map(
                  (t: { id: string; chapter_id: string; status: string; chapters?: { title: string } }) => (
                    <div key={t.id} className="p-3 rounded-xl border border-brand-muted bg-white flex items-center justify-between hover:border-brand-navy transition-colors">
                      <div className="flex gap-3 items-center">
                        <ReviewStatusBadge status={t.status} />
                        <span className="text-sm font-bold text-brand-navy truncate max-w-[120px]">
                          {t.chapters?.title}
                        </span>
                      </div>
                      <Link
                        href={`/student/chapter/${t.chapter_id}`}
                        className="text-xs text-brand-yellow font-bold uppercase tracking-wider hover:underline shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

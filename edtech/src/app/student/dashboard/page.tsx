"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Flame,
  Target,
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
      <div className="text-center py-20">
        <h2 className="font-heading text-2xl font-bold mb-4">Unable to load dashboard</h2>
        <p className="text-navy-600 mb-6">Please check your connection and try again.</p>
        <button
          onClick={() => qc.invalidateQueries({ queryKey: ["student-dashboard"] })}
          className="btn-pill btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Good morning! 👋</h1>
          <p className="text-navy-600 mt-1">Ready to continue your learning journey?</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-success">Active</span>
          <button className="relative p-2 text-navy-400 hover:text-navy-900 transition-colors">
            <Bell className="w-5 h-5" />
            {(data.notifications?.length ?? 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {data.notifications.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Streak + Weekly Goal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakBadge
          streak={data.streak?.current ?? 0}
          longest={data.streak?.longest ?? 0}
        />
        <WeeklyGoalRing
          done={data.weekly_goal?.done ?? 0}
          target={data.weekly_goal?.target ?? 2}
          onEditTarget={(t) => setTarget.mutate(t)}
        />
      </div>

      {/* Continue Learning */}
      {data.continue_learning && (
        <div className="card bg-gradient-to-r from-primary-50 to-cream-50 border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-0.5">
                  Resume Learning
                </p>
                <h3 className="font-heading text-lg font-bold">
                  {data.continue_learning.chapters?.title || "Untitled Chapter"}
                </h3>
                <p className="text-sm text-navy-600">
                  Step {data.continue_learning.current_step} of 6
                </p>
              </div>
            </div>
            <Link
              href={`/student/chapter/${data.continue_learning.chapter_id}`}
              className="btn-pill btn-primary text-sm"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-4 h-2 bg-primary-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-400 rounded-full transition-all"
              style={{
                width: `${((data.continue_learning.current_step - 1) / 6) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.total_completed ?? 0}</p>
              <p className="text-xs text-navy-600">Chapters Completed</p>
            </div>
          </div>
        </div>
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.progress_summary?.percentage ?? 0}%</p>
              <p className="text-xs text-navy-600">Overall Progress</p>
            </div>
          </div>
        </div>
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.weekly_goal?.done ?? 0}</p>
              <p className="text-xs text-navy-600">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      {(data.subject_cards?.length ?? 0) > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Subject Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.subject_cards.map(
              (s: { id: string; name: string; total: number; completed: number; percentage: number }) => (
                <div key={s.id} className="card-flat">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{s.name}</h3>
                    <Link
                      href={`/student/subjects/${s.id}`}
                      className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
                    >
                      Open <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <ProgressBar value={s.completed} max={s.total} color="bg-primary-400" />
                  <p className="text-xs text-navy-600 mt-1.5">
                    {s.completed} / {s.total} chapters
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Skill Snapshot */}
      {data.skill_snapshot && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Skill Snapshot</h2>
          <div className="card-flat space-y-3">
            {Object.entries(data.skill_snapshot).map(([key, value]) => (
              <SkillBar
                key={key}
                name={key
                  .split("_")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ")}
                score={(value as { avg: number; trend: "up" | "down" | "stable" }).avg}
                trend={(value as { avg: number; trend: "up" | "down" | "stable" }).trend}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pending Tasks */}
      {(data.pending_tasks?.length ?? 0) > 0 && (
        <div>
          <h2 className="font-heading text-xl font-bold mb-4">Pending Tasks</h2>
          <div className="space-y-2">
            {data.pending_tasks.map(
              (t: { id: string; chapter_id: string; status: string; chapters?: { title: string } }) => (
                <div key={t.id} className="card-flat flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ReviewStatusBadge status={t.status} />
                    <span className="text-sm font-medium">
                      {t.chapters?.title || "Submission"}
                    </span>
                  </div>
                  <Link
                    href={`/student/chapter/${t.chapter_id}`}
                    className="text-sm text-primary-500 hover:underline"
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
  );
}

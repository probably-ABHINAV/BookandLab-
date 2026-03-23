"use client";

import { CheckCircle2, Circle, Flame, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// --- UI COMPONENTS ---

export function StreakBadge({ streak, longest, size = "default" }: { streak: number; longest?: number; size?: "default" | "large" }) {
  const isLarge = size === "large";
  return (
    <div className={`dashboard-card flex items-center gap-4 ${isLarge ? "p-6" : ""}`}>
      <div className={`rounded-2xl flex items-center justify-center shrink-0 bg-orange-50 ${isLarge ? "w-16 h-16" : "w-12 h-12"}`}>
        <Flame className={`${isLarge ? "w-8 h-8" : "w-6 h-6"} text-orange-500`} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">Current Streak</h3>
        <p className={`font-heading font-bold text-brand-navy ${isLarge ? "text-4xl" : "text-2xl"}`}>
          {streak} <span className="text-sm font-medium text-text-tertiary ml-1">Days</span>
        </p>
        <p className="text-xs text-text-tertiary mt-1">Personal best: {longest ?? streak} days</p>
      </div>
    </div>
  );
}

export function WeeklyGoalRing({ done, target, onEditTarget }: { done: number; target: number; onEditTarget?: (t: number) => void }) {
  const percent = Math.min((done / target) * 100, 100);
  const strokeDashoffset = 126 - (126 * percent) / 100;

  return (
    <div className="dashboard-card flex items-center justify-between">
      <div>
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">Weekly Goal</h3>
        <p className="font-heading text-2xl font-bold text-brand-navy">
          {done} <span className="text-sm font-medium text-text-tertiary">/ {target} tasks</span>
        </p>
        {onEditTarget && (
          <button onClick={() => { const val = prompt("Set new weekly target:", target.toString()); if (val && !isNaN(Number(val))) onEditTarget(Number(val)); }} className="text-xs text-brand-yellow font-bold mt-2 hover:underline">
            Edit Target
          </button>
        )}
      </div>
      <div className="relative w-16 h-16">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="32" cy="32" r="20" className="stroke-brand-muted fill-none" strokeWidth="6" />
          <circle cx="32" cy="32" r="20" className="stroke-brand-yellow fill-none transition-all duration-1000 ease-out" strokeWidth="6" strokeDasharray="126" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Target className="w-5 h-5 text-brand-navy" />
        </div>
      </div>
    </div>
  );
}

export function SkillBar({ name, score, trend }: { name: string; score: number; trend: "up" | "down" | "stable" }) {
  const percent = (score / 5) * 100;
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-1.5">
        <span className="text-sm font-bold text-brand-navy">{name}</span>
        <div className="flex items-center gap-2">
          {trend === "up" && <span className="text-xs text-green-500 font-bold">↑ +0.2</span>}
          {trend === "down" && <span className="text-xs text-red-500 font-bold">↓ -0.1</span>}
          <span className="text-sm font-bold text-text-secondary">{score.toFixed(1)} / 5</span>
        </div>
      </div>
      <div className="h-3 bg-brand-muted rounded-full overflow-hidden">
        <div className="h-full bg-brand-navy rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ProgressBar({ value, max, showPercentage = true, color = "bg-brand-yellow" }: { value: number; max: number; showPercentage?: boolean; color?: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full">
      {showPercentage && (
        <div className="flex justify-between text-xs font-bold text-text-secondary mb-1">
          <span>Progress</span>
          <span>{percent}%</span>
        </div>
      )}
      <div className="h-2 bg-brand-muted rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function StepProgress({ stepsCompleted, currentStep }: { stepsCompleted: number[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5, 6].map((step) => {
        const isCompleted = stepsCompleted.includes(step);
        const isCurrent = currentStep === step;
        return (
          <div key={step} className="flex flex-col items-center gap-1">
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-brand-yellow" />
            ) : (
              <Circle className={cn("w-5 h-5", isCurrent ? "text-brand-navy fill-brand-navy/10" : "text-brand-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SubscriptionBadge({ status }: { status: string }) {
  if (status === "active") return <span className="badge-premium badge-yellow">Pro Plan</span>;
  if (status === "canceled") return <span className="badge-premium badge-soft">Canceled</span>;
  return <span className="badge-premium badge-soft">Free</span>;
}

export function ReviewStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-orange-50 text-orange-600 border border-orange-200",
    reviewed: "bg-green-50 text-green-600 border border-green-200",
    resubmit: "bg-red-50 text-red-600 border border-red-200",
  };
  return <span className={cn("badge-premium", styles[status] || styles.pending)}>{status}</span>;
}

export function ActivityHeatmap({ activityDates }: { activityDates: string[] }) {
  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <div className="flex flex-wrap gap-1.5">
      {days.map((date) => {
        const isActive = activityDates.includes(date);
        return (
          <div key={date} title={date} className={cn("w-4 h-4 rounded-sm transition-colors", isActive ? "bg-brand-yellow" : "bg-brand-muted hover:bg-brand-cream")} />
        );
      })}
    </div>
  );
}

export function ConfirmModal({ open, title, message, confirmText, onConfirm, onCancel, destructive }: { open: boolean; title: string; message: string; confirmText?: string; onConfirm: () => void; onCancel: () => void; destructive?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-bento animate-fade-up">
        <h3 className="font-heading text-2xl font-bold text-brand-navy mb-2">{title}</h3>
        <p className="text-text-secondary mb-8">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-outline !py-2.5">Cancel</button>
          <button onClick={onConfirm} className={cn("btn !py-2.5", destructive ? "bg-red-500 hover:bg-red-600 text-white" : "btn-primary")}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex justify-between"><div className="skeleton h-10 w-64" /><div className="skeleton h-10 w-24 rounded-full" /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="skeleton h-32" /><div className="skeleton h-32" /></div>
      <div className="skeleton h-48" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="skeleton h-24" /><div className="skeleton h-24" /><div className="skeleton h-24" /></div>
    </div>
  );
}

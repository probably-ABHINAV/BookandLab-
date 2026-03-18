"use client";

import { Flame, Target, TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// =============== STREAK BADGE ===============
export function StreakBadge({
  streak,
  longest,
  size = "default",
}: {
  streak: number;
  longest?: number;
  size?: "small" | "default" | "large";
}) {
  const isActive = streak > 0;
  const isHot = streak >= 7;

  const sizeClasses = {
    small: "p-3",
    default: "p-5",
    large: "p-6",
  };

  const numClasses = {
    small: "text-2xl",
    default: "text-4xl",
    large: "text-5xl",
  };

  return (
    <div
      className={cn(
        "rounded-2xl transition-all",
        sizeClasses[size],
        isActive ? "bg-orange-50" : "bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <Flame
          className={cn(
            "shrink-0",
            size === "small" ? "w-5 h-5" : "w-7 h-7",
            isActive ? "text-orange-500" : "text-gray-300",
            isHot && "animate-pulse"
          )}
        />
        <span
          className={cn(
            "font-bold",
            numClasses[size],
            isActive ? "text-navy-900" : "text-gray-400"
          )}
        >
          {streak}
        </span>
      </div>
      <p className="text-sm font-medium text-navy-700">Day Streak</p>
      {longest !== undefined && (
        <p className="text-xs text-navy-600 mt-0.5">
          Personal best: {longest} days
        </p>
      )}
    </div>
  );
}

// =============== WEEKLY GOAL RING ===============
export function WeeklyGoalRing({
  done,
  target,
  onEditTarget,
}: {
  done: number;
  target: number;
  onEditTarget?: (newTarget: number) => void;
}) {
  const percentage = Math.min(Math.round((done / target) * 100), 100);
  const isOnTrack = percentage >= 50;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-green-50 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold text-navy-900">This Week</span>
        </div>
        {onEditTarget && (
          <button
            onClick={() => {
              const newTarget = prompt("Set weekly chapter target (1-14):", String(target));
              if (newTarget) {
                const n = parseInt(newTarget);
                if (n >= 1 && n <= 14) onEditTarget(n);
              }
            }}
            className="text-xs text-navy-400 hover:text-primary-500 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isOnTrack ? "#22c55e" : "#f59e0b"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{percentage}%</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-navy-900">
            {done}/{target}
          </p>
          <p className="text-sm text-navy-600">chapters</p>
        </div>
      </div>
    </div>
  );
}

// =============== SKILL BAR ===============
export function SkillBar({
  name,
  score,
  trend,
}: {
  name: string;
  score: number;
  trend: "up" | "down" | "stable";
}) {
  const percentage = (score / 5) * 100;
  const colors: Record<string, string> = {
    "Concept Clarity": "bg-blue-500",
    "Critical Thinking": "bg-purple-500",
    Application: "bg-green-500",
    Communication: "bg-amber-500",
  };

  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-400";

  return (
    <div className="flex items-center gap-3">
      <div className="w-32 text-sm font-medium text-navy-700 truncate">{name}</div>
      <div className="flex-1 h-2.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", colors[name] || "bg-primary-400")}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-bold w-10 text-right">{score}</span>
      <TrendIcon className={cn("w-4 h-4", trendColor)} />
    </div>
  );
}

// =============== PROGRESS BAR ===============
export function ProgressBar({
  value,
  max,
  label,
  color = "bg-primary-400",
  showPercentage = true,
}: {
  value: number;
  max: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
}) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm mb-1.5">
          {label && <span className="font-medium text-navy-700">{label}</span>}
          {showPercentage && <span className="text-navy-600">{percentage}%</span>}
        </div>
      )}
      <div className="h-2.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// =============== STEP PROGRESS ===============
export function StepProgress({
  stepsCompleted,
  currentStep,
  total = 6,
}: {
  stepsCompleted: number[];
  currentStep: number;
  total?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1;
        const isDone = stepsCompleted.includes(step);
        const isCurrent = step === currentStep;

        return (
          <div
            key={step}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              isDone
                ? "bg-green-500"
                : isCurrent
                  ? "ring-2 ring-primary-400 bg-primary-100"
                  : "bg-cream-200"
            )}
          />
        );
      })}
    </div>
  );
}

// =============== SUBSCRIPTION BADGE ===============
export function SubscriptionBadge({ status }: { status: string }) {
  const badges: Record<string, { className: string; label: string }> = {
    active: { className: "badge-success", label: "Active" },
    expired: { className: "badge-error", label: "Expired" },
    cancelled: { className: "badge-warning", label: "Cancelled" },
  };

  const badge = badges[status] || badges.expired;

  return <span className={cn("badge", badge.className)}>{badge.label}</span>;
}

// =============== REVIEW STATUS BADGE ===============
export function ReviewStatusBadge({ status }: { status: string }) {
  const badges: Record<string, { className: string; label: string }> = {
    pending_review: { className: "badge-warning", label: "Pending" },
    reviewed: { className: "badge-success", label: "Reviewed" },
    resubmit: { className: "badge-error", label: "Resubmit" },
  };

  const badge = badges[status] || { className: "badge-info", label: status };

  return <span className={cn("badge", badge.className)}>{badge.label}</span>;
}

// =============== ACTIVITY HEATMAP ===============
export function ActivityHeatmap({ activityDates }: { activityDates: string[] }) {
  const today = new Date();
  const days = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split("T")[0];
  });

  return (
    <div className="flex gap-1 flex-wrap">
      {days.map((day) => {
        const isActive = activityDates.includes(day);
        return (
          <div
            key={day}
            className={cn(
              "w-4 h-4 rounded-sm transition-colors cursor-default",
              isActive ? "bg-green-400 hover:bg-green-500" : "bg-cream-200 hover:bg-cream-300"
            )}
            title={day}
          />
        );
      })}
    </div>
  );
}

// =============== CONFIRM MODAL ===============
export function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  destructive = false,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  destructive?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 animate-scale-in shadow-2xl">
        <h3 className="font-heading text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-navy-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn-pill btn-outline text-sm !py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              "btn-pill text-sm !py-2",
              destructive ? "bg-red-500 text-white hover:bg-red-600" : "btn-primary"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// =============== LOADING SKELETON ===============
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="skeleton h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="skeleton h-32" />
        <div className="skeleton h-32" />
      </div>
      <div className="skeleton h-24" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="skeleton h-20" />
        <div className="skeleton h-20" />
        <div className="skeleton h-20" />
      </div>
    </div>
  );
}

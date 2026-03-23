"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Play, Clock, TrendingUp, Bell } from "lucide-react";
import { useUser } from "@stackframe/stack";
import { Suspense } from "react";

const Skeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-16 bg-[var(--br)] rounded-2xl w-full max-w-md"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-48 bg-[var(--br)] rounded-2xl"></div>
        <div className="h-64 bg-[var(--br)] rounded-2xl"></div>
      </div>
      <div className="h-64 bg-[var(--br)] rounded-2xl"></div>
    </div>
  </div>
);

function StudentDashboardContent() {
  const user = useUser();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => fetch("/api/student/dashboard").then((r) => r.json()),
  });

  if (isLoading) return <Skeleton />;

  const data = apiResponse || {};
  
  // 1. Current Chapter (Up Next)
  const current = data.currentChapter;
  const currentTitle = current?.chapters?.title || "No pending chapters";
  const currentStep = current?.current_step || 1;
  const currentPercent = Math.round((currentStep / 6) * 100);

  // 2. Stats (Weekly Goal & Streak)
  const streak = data.stats?.streak_count || 0;
  const doneThisWeek = data.stats?.chapters_this_week || 0;
  const weeklyGoal = data.stats?.weekly_goal || 3;
  const goalPercent = Math.min(100, Math.round((doneThisWeek / weeklyGoal) * 100));
  const circumference = 402.12;
  const dashOffset = circumference - (goalPercent / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* 1. Header + Date */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--dark)] tracking-tight">
            Welcome back, {user?.displayName || "Student"}! <span className="text-[var(--y)]">👋</span>
          </h1>
          <p className="text-[var(--mu)] font-bold text-sm tracking-widest uppercase mt-2">{today}</p>
        </div>
        <button className="w-10 h-10 bg-[var(--wh)] rounded-full border border-[var(--br)] flex items-center justify-center hover:bg-[var(--c2)] transition-colors relative">
           <Bell className="w-4 h-4 text-[var(--dark)]" />
           {/* Notification dot (Static for now, fallback to bell) */}
           <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[var(--red)] rounded-full border border-[var(--wh)]" />
        </button>
      </div>

      {/* 2. Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Continue Learning */}
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[20px] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-1 transition-transform">
             <div className="flex-1">
               <div className="inline-block bg-[var(--y)] bg-opacity-20 text-[var(--dark)] px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
                 Up Next
               </div>
               <h3 className="text-2xl font-black mb-4">{currentTitle}</h3>
               
               {/* Progress Bar */}
               <div className="flex items-center gap-4">
                 <div className="flex-1 h-[8px] bg-[var(--c2)] rounded-full overflow-hidden">
                   <div className="h-full bg-[var(--y)] rounded-full transition-all duration-1000" style={{ width: `${currentPercent}%` }}></div>
                 </div>
                 <span className="text-[var(--mu)] text-xs font-bold whitespace-nowrap">Step {currentStep} of 6</span>
               </div>
             </div>

              <div className="shrink-0 flex items-center">
                {current?.chapter_id ? (
                  <Link href={`/student/chapter/${current.chapter_id}`} className="bg-[var(--dark)] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                    <Play className="w-4 h-4" /> Resume Step {currentStep}
                  </Link>
                ) : (
                  <span className="bg-[var(--mu)] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 opacity-50 cursor-not-allowed">
                    <Clock className="w-4 h-4" /> No Active Chapter
                  </span>
                )}
              </div>
          </div>

          {/* Card: Recent Activity (Streak & Skills) */}
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[20px] shadow-sm">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-[var(--c2)] border border-[var(--br)]">
                <div className="w-10 h-10 bg-[var(--bg2)] rounded-[8px] flex items-center justify-center border border-[var(--br)]">
                  <TrendingUp className="w-4 h-4 text-[var(--dark)]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-[var(--dark)]">Current Streak</h4>
                </div>
                <p className="text-[var(--mu2)] text-xs font-semibold whitespace-nowrap">{streak} Days 🔥</p>
              </div>

              {/* Render dynamic skill snapshots */}
              {(data.skills || []).slice(0, 3).map((skill: { skill_type: string; score: number }, i: number) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--c2)] transition-colors border border-transparent hover:border-[var(--br)]">
                  <div className="w-10 h-10 bg-[var(--bg2)] rounded-[8px] flex items-center justify-center border border-[var(--br)]">
                    <TrendingUp className="w-4 h-4 text-[var(--dark)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-[var(--dark)] capitalize">Skill Growth: {skill.skill_type.replace("_", " ")}</h4>
                  </div>
                  <p className="text-[var(--mu2)] text-xs font-semibold whitespace-nowrap">Score: {skill.score}/5</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-1">
          
          {/* Card: Performance Overview (Weekly Goal) */}
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[20px] shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[300px]">
            <h3 className="text-xl font-bold mb-8 w-full text-left">Weekly Goal</h3>
            
            {/* CSS Circular Progress Array */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80" cy="80" r="64"
                  stroke="var(--bg2)" strokeWidth="16" fill="none"
                />
                <circle
                  cx="80" cy="80" r="64"
                  stroke="var(--green)" strokeWidth="16" fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-[var(--dark)]">{goalPercent}%</span>
                <span className="text-[var(--mu)] text-[10px] font-bold tracking-widest uppercase mt-1">Completion</span>
              </div>
            </div>

            <div className="w-full bg-[var(--c2)] rounded-[12px] p-4 border border-[var(--br)]">
              <p className="text-[var(--dark)] font-bold text-sm">Target: {doneThisWeek} / {weeklyGoal} chapters</p>
              <p className="text-[var(--mu)] text-xs font-medium mt-1">
                {doneThisWeek >= weeklyGoal ? "Goal reached! Amazing job!" : "Keep pushing to hit your weekly target!"}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function StudentDashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <StudentDashboardContent />
    </Suspense>
  );
}

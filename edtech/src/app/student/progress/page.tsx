"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Trophy, Star, Shield, ArrowRight } from "lucide-react";

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-progress"],
    queryFn: () => fetch("/api/student/progress").then((r) => r.json()),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-[200px] bg-[var(--br)] rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-[250px] bg-[var(--br)] rounded-2xl"></div>
          <div className="h-[250px] bg-[var(--br)] rounded-2xl"></div>
          <div className="h-[250px] bg-[var(--br)] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const subjects = data?.subject_breakdown || [];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-12">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">Your Learning Progress</h1>
          <p className="text-[var(--dark)] font-medium text-lg mt-3 bg-[var(--y)] bg-opacity-20 inline-block px-4 py-1.5 rounded-full border border-[var(--y)]">
            🌟 You are in the top <span className="font-black">15%</span> of students!
          </p>
        </div>
      </div>

      {/* 2. Main Content - Subject Grid */}
      <div>
        <h2 className="text-2xl font-black text-[var(--dark)] mb-6">Subject Breakdown</h2>
        {subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((s: any, i: number) => {
              const bgColors = ["bg-[var(--green-bg)] text-[var(--green)]", "bg-[var(--blue-bg)] text-[var(--blue)]", "bg-[var(--purple-bg)] text-[var(--purple)]", "bg-[var(--red-bg)] text-[var(--red)]"];
              const iconStyle = bgColors[i % bgColors.length];
              const pct = s.total > 0 ? (s.completed / s.total) * 100 : 0;

              return (
                <div key={s.id} className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center border border-[var(--br)] ${iconStyle}`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="font-black text-[var(--dark)] text-xl">{Math.round(pct)}%</span>
                  </div>
                  
                  <div>
                    <h3 className="font-black text-xl text-[var(--dark)] mb-1">{s.name}</h3>
                    <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mb-6">
                      {s.completed} / {s.total} Chapters Completed
                    </p>

                    <div className="h-[8px] bg-[var(--c2)] rounded-full overflow-hidden border border-[var(--br)]">
                      <div 
                        className="h-full bg-[var(--green)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-12 text-center text-[var(--mu)] font-bold">
            No active subjects found. Go to the dashboard to start learning!
          </div>
        )}
      </div>

      {/* 3. Recent Achievements Banner */}
      <div className="bg-[var(--dark)] rounded-[20px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--y)] opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
        <div className="absolute -bottom-10 flex gap-4 opacity-5">
          <Trophy className="w-32 h-32" /> <Star className="w-32 h-32" /> <Shield className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white mb-2">Recent Achievements</h2>
          <p className="text-[var(--y)] font-bold text-sm tracking-widest uppercase">7 Day Streak • 5 Quizzes Passed • Rising Star</p>
        </div>
        
        <div className="relative z-10 shrink-0 flex items-center gap-4">
          <div className="bg-[#2A261A] border border-[#3A3528] rounded-[16px] p-4 flex items-center gap-4">
             <div className="w-12 h-12 bg-[var(--y)] rounded-full flex items-center justify-center">
               <span className="text-2xl">🔥</span>
             </div>
             <div>
               <p className="text-[var(--mu2)] font-bold text-xs uppercase tracking-widest">Current Streak</p>
               <p className="text-2xl font-black text-white">{data?.streak?.current ?? 0} Days</p>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}

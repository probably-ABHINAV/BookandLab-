"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, ClipboardCheck, BarChart3, ArrowRight, Clock } from "lucide-react";
import { useUser } from "@stackframe/stack";

function MentorDashboardContent() {
  const user = useUser();
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-dashboard"],
    queryFn: () => fetch("/api/mentor/dashboard").then((r) => r.json()),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-[var(--br)] rounded-2xl"></div>
          <div className="h-40 bg-[var(--br)] rounded-2xl"></div>
          <div className="h-40 bg-[var(--br)] rounded-2xl"></div>
        </div>
        <div className="h-96 bg-[var(--br)] rounded-2xl mt-8"></div>
      </div>
    );
  }

  const pendingCount = data?.pendingReviews?.length || 0;

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">Mentor Dashboard</h1>
          <p className="text-[var(--mu)] font-bold text-lg mt-2">
            Welcome back, <span className="text-[var(--dark)]">{user?.displayName || "Mentor"}</span>
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="bg-[var(--red)] bg-opacity-10 text-[var(--red)] border border-[var(--red)] px-6 py-3 rounded-full flex items-center gap-3 font-bold shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--red)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--red)]"></span>
            </span>
            {pendingCount} Pending Reviews
          </div>
        )}
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pending Reviews */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-[12px] bg-[var(--y)] bg-opacity-20 text-[var(--yd)] flex items-center justify-center shrink-0 border border-[var(--y)]">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{pendingCount}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Pending Reviews</p>
          </div>
        </div>

        {/* Active Students */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-[12px] bg-[var(--blue)] bg-opacity-10 text-[var(--blue)] flex items-center justify-center shrink-0 border border-[var(--blue-border)]">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{data?.total_students || 0}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Active Students</p>
          </div>
        </div>

        {/* Average Completion */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 rounded-[12px] bg-[var(--green)] bg-opacity-10 text-[var(--green)] flex items-center justify-center shrink-0 border border-green-200">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{data?.reviews_this_week || 0}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Reviews This Week</p>
          </div>
        </div>

      </div>

      {/* 3. Recent Submissions */}
      <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[var(--br)] flex items-center justify-between bg-[var(--bg2)]">
          <h2 className="text-2xl font-black text-[var(--dark)]">Recent Submissions</h2>
        </div>
        
        <div className="p-0">
          {(data?.pendingReviews?.length ?? 0) > 0 ? (
            <div className="divide-y divide-[var(--br)]">
              {data.pendingReviews.map((r: any) => {
                const daysWaiting = Math.floor((new Date().getTime() - new Date(r.created_at || r.submitted_at).getTime()) / (1000 * 3600 * 24));
                const isUrgent = daysWaiting > 3;

                return (
                  <div key={r.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-8 hover:bg-[var(--c2)] transition-colors gap-4 ${isUrgent ? 'bg-red-50 hover:bg-red-100 border-[var(--red)] border-2' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-[var(--br)] flex items-center justify-center shrink-0 text-[var(--dark)] font-black text-lg">
                        {(r.users?.name || "S")[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-[var(--dark)] text-lg">{r.users?.name || "Student"}</h3>
                        <p className="text-[var(--mu)] font-bold">{r.chapters?.title || "Chapter Submission"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className={`w-4 h-4 ${isUrgent ? 'text-[var(--red)]' : 'text-[var(--mu)]'}`} />
                          <span className={`text-xs font-bold uppercase tracking-widest ${isUrgent ? 'text-[var(--red)]' : 'text-[var(--mu2)]'}`}>
                            Waiting {daysWaiting} {daysWaiting === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Link href={`/mentor/reviews/${r.id}`} className="bg-[var(--dark)] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shrink-0 border-2 border-[var(--dark)]">
                      Review <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <ClipboardCheck className="w-16 h-16 text-[var(--green)] mb-6 opacity-80" />
              <p className="text-2xl font-black text-[var(--dark)] mb-2">Inbox Zero</p>
              <p className="text-[var(--mu)] font-bold text-lg max-w-sm">You have caught up with all student submissions. Great job!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default function MentorDashboard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--mu)] font-bold">Loading dashboard...</div>}>
      <MentorDashboardContent />
    </Suspense>
  );
}

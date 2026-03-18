"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, ClipboardCheck, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { DashboardSkeleton, ReviewStatusBadge } from "@/components/ui";

export default function MentorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-dashboard"],
    queryFn: () => fetch("/api/mentor/dashboard").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-4xl font-bold text-brand-navy">Mentor Dashboard</h1>
        <p className="text-text-secondary mt-1">Overview of your students and pending reviews</p>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-card bg-brand-navy text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-brand-yellow/20 transition-colors duration-700" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-brand-yellow" />
            </div>
            <p className="font-heading text-5xl font-bold mb-2">{data?.total_students ?? 0}</p>
            <p className="text-sm text-white/70 uppercase tracking-wider font-bold">Assigned Students</p>
          </div>
        </div>
        
        <div className="bento-card bg-brand-surface relative group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500 ${(data?.pending_count ?? 0) > 0 ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <p className="font-heading text-5xl font-bold text-brand-navy mb-2">{data?.pending_count ?? 0}</p>
          <p className="text-sm text-text-secondary uppercase tracking-wider font-bold">Pending Reviews</p>
        </div>
        
        <div className="bento-card bg-brand-surface relative group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-6 h-6" />
          </div>
          <p className="font-heading text-5xl font-bold text-brand-navy mb-2">{data?.reviews_this_week ?? 0}</p>
          <p className="text-sm text-text-secondary uppercase tracking-wider font-bold">Reviewed This Week</p>
        </div>
      </div>

      {/* Pending Reviews Bento */}
      <div className="bento-card">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Action Required</h2>
          <span className="badge-premium badge-yellow">Priority</span>
        </div>
        
        {(data?.pending_reviews?.length ?? 0) > 0 ? (
          <div className="space-y-4">
            {data.pending_reviews.map((r: { id: string; user_id: string; chapter_id: string; submitted_at: string; status: string; users?: { name: string }; chapters?: { title: string } }) => (
              <div key={r.id} className="dashboard-card border border-brand-muted hover:border-brand-navy transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-muted rounded-full flex items-center justify-center border-2 border-brand-cream">
                    <span className="text-sm font-bold text-brand-navy">{(r.users?.name || "S").charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-heading text-lg font-bold text-brand-navy">{r.users?.name || "Student"}</p>
                    <p className="text-sm text-text-secondary">{r.chapters?.title || "Chapter Submission"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold text-text-tertiary uppercase mb-1">Submitted</p>
                    <p className="text-sm font-semibold text-brand-navy">{new Date(r.submitted_at).toLocaleDateString()}</p>
                  </div>
                  <Link href={`/mentor/reviews/${r.id}`} className="btn btn-outline hover:bg-brand-navy hover:text-white shrink-0 ml-auto sm:ml-0">
                    Grade <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-brand-muted rounded-3xl bg-brand-cream/50">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ClipboardCheck className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-brand-navy mb-2">Inbox Zero</h3>
            <p className="text-text-secondary max-w-sm mx-auto">You have no pending reviews. Great job keeping up with your students!</p>
          </div>
        )}
      </div>
    </div>
  );
}

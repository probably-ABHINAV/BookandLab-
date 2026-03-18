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
        <h1 className="font-heading text-3xl font-bold">Mentor Dashboard</h1>
        <p className="text-navy-600 mt-1">Overview of your students and reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.total_students ?? 0}</p>
              <p className="text-xs text-navy-600">Assigned Students</p>
            </div>
          </div>
        </div>
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${(data?.pending_count ?? 0) > 0 ? "bg-orange-50" : "bg-green-50"}`}>
              <ClipboardCheck className={`w-5 h-5 ${(data?.pending_count ?? 0) > 0 ? "text-orange-600" : "text-green-600"}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.pending_count ?? 0}</p>
              <p className="text-xs text-navy-600">Pending Reviews</p>
            </div>
          </div>
        </div>
        <div className="card-flat">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.reviews_this_week ?? 0}</p>
              <p className="text-xs text-navy-600">Reviews This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Pending Reviews</h2>
        {(data?.pending_reviews?.length ?? 0) > 0 ? (
          <div className="space-y-2">
            {data.pending_reviews.map((r: { id: string; user_id: string; chapter_id: string; submitted_at: string; status: string; users?: { name: string }; chapters?: { title: string } }) => (
              <div key={r.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-700">{(r.users?.name || "S").charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{r.users?.name || "Student"}</p>
                    <p className="text-xs text-navy-600">{r.chapters?.title || "Chapter"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-navy-600">
                    {new Date(r.submitted_at).toLocaleDateString()}
                  </span>
                  <Link href={`/mentor/reviews/${r.id}`} className="btn-pill btn-secondary text-xs !py-1.5 !px-4">
                    Review <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-flat text-center py-12">
            <AlertCircle className="w-8 h-8 text-cream-300 mx-auto mb-3" />
            <p className="text-navy-600">No pending reviews. Great job staying on top!</p>
          </div>
        )}
      </div>
    </div>
  );
}

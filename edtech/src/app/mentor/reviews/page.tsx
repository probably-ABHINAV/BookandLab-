"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { ReviewStatusBadge, DashboardSkeleton } from "@/components/ui";

export default function MentorReviewsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-dashboard"],
    queryFn: () => fetch("/api/mentor/dashboard").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-heading text-3xl font-bold">Reviews</h1>
      <div className="space-y-2">
        {(data?.pending_reviews ?? []).map((r: {id:string;status:string;submitted_at:string;users?:{name:string};chapters?:{title:string}}) => (
          <Link key={r.id} href={`/mentor/reviews/${r.id}`} className="card flex items-center justify-between group">
            <div>
              <p className="font-semibold text-sm">{r.users?.name || "Student"} — {r.chapters?.title || "Chapter"}</p>
              <p className="text-xs text-navy-600">{new Date(r.submitted_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <ReviewStatusBadge status={r.status} />
              <ChevronRight className="w-4 h-4 text-navy-400 group-hover:text-primary-500" />
            </div>
          </Link>
        ))}
        {(data?.pending_reviews?.length ?? 0) === 0 && <p className="text-center py-12 text-navy-600">All caught up! No pending reviews.</p>}
      </div>
    </div>
  );
}

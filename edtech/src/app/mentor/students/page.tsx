"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui";

export default function MentorStudentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-dashboard"],
    queryFn: () => fetch("/api/mentor/dashboard").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h1 className="font-heading text-3xl font-bold">My Students</h1>
      <div className="space-y-2">
        {(data?.assigned_students ?? []).map((s: { id: string; name: string; email: string }) => (
          <Link key={s.id} href={`/mentor/students/${s.id}`} className="card flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-primary-700">{s.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-navy-600">{s.email}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-primary-500 transition-colors" />
          </Link>
        ))}
        {(data?.assigned_students?.length ?? 0) === 0 && (
          <p className="text-center py-12 text-navy-600">No students assigned yet.</p>
        )}
      </div>
    </div>
  );
}

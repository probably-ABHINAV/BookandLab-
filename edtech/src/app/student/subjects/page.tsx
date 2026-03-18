"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BookOpen, ChevronRight, Lock, CheckCircle2 } from "lucide-react";
import { ProgressBar } from "@/components/ui";

export default function SubjectsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: () => fetch("/api/student/dashboard").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-3xl font-bold">Subjects</h1>
        <p className="text-navy-600 mt-1">Browse your courses and continue learning</p>
      </div>

      <div className="grid gap-4">
        {(data?.subject_cards ?? []).map(
          (s: { id: string; name: string; total: number; completed: number; percentage: number }) => (
            <Link
              key={s.id}
              href={`/student/subjects/${s.id}`}
              className="card flex items-center justify-between group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-lg font-bold">{s.name}</h3>
                  <div className="mt-1.5">
                    <ProgressBar
                      value={s.completed}
                      max={s.total}
                      showPercentage={false}
                    />
                  </div>
                  <p className="text-xs text-navy-600 mt-1">
                    {s.completed} / {s.total} chapters • {s.percentage}% complete
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-primary-500 transition-colors shrink-0 ml-4" />
            </Link>
          )
        )}
        {(data?.subject_cards?.length ?? 0) === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-cream-300 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">No subjects yet</h2>
            <p className="text-navy-600">Ask your admin to set up subjects and chapters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

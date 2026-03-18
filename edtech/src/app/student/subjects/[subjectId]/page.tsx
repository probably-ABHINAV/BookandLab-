"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BookOpen, Lock, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { StepProgress, ProgressBar } from "@/components/ui";

export default function SubjectDetailPage() {
  const { subjectId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: () => fetch(`/api/student/subject/${subjectId}`).then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="skeleton h-20" />)}</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link href="/student/subjects" className="p-2 hover:bg-cream-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl font-bold">{data?.subject?.name || "Subject"}</h1>
          <p className="text-sm text-navy-600">{data?.chapters?.length ?? 0} chapters</p>
        </div>
      </div>

      <div className="space-y-3">
        {(data?.chapters ?? []).map((ch: {
          id: string; title: string; description?: string; estimated_minutes: number;
          is_published: boolean; progress?: { steps_completed: number[]; current_step: number; status: string } | null;
        }, i: number) => {
          const isComplete = ch.progress?.status === "completed";
          const isLocked = !ch.is_published;

          return (
            <Link
              key={ch.id}
              href={isLocked ? "#" : `/student/chapter/${ch.id}`}
              className={`card flex items-center gap-4 ${isLocked ? "opacity-50 cursor-not-allowed" : "group"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isComplete ? "bg-green-50" : isLocked ? "bg-gray-100" : "bg-primary-50"
              }`}>
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <span className="text-sm font-bold text-primary-600">{i + 1}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{ch.title}</h3>
                {ch.description && <p className="text-xs text-navy-600 truncate">{ch.description}</p>}
                <div className="flex items-center gap-3 mt-1.5">
                  <StepProgress
                    stepsCompleted={ch.progress?.steps_completed ?? []}
                    currentStep={ch.progress?.current_step ?? 1}
                  />
                  <span className="text-xs text-navy-600">{ch.estimated_minutes}min</span>
                </div>
              </div>
              {!isLocked && (
                <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-primary-500 transition-colors shrink-0" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

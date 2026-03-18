"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProgressBar, SkillBar, ReviewStatusBadge, DashboardSkeleton } from "@/components/ui";

export default function MentorStudentDetailPage() {
  const { studentId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-student", studentId],
    queryFn: () => fetch(`/api/mentor/student/${studentId}`).then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <Link href="/mentor/students" className="p-2 hover:bg-cream-100 rounded-xl"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-heading text-2xl font-bold">{data?.student?.name || "Student"}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-flat"><p className="text-2xl font-bold">{data?.progress?.percentage ?? 0}%</p><p className="text-xs text-navy-600">Progress</p></div>
        <div className="card-flat"><p className="text-2xl font-bold">{data?.progress?.completed ?? 0}</p><p className="text-xs text-navy-600">Chapters Done</p></div>
        <div className="card-flat"><p className="text-2xl font-bold">{data?.subscription?.status === "active" ? "Active" : "None"}</p><p className="text-xs text-navy-600">Subscription</p></div>
      </div>

      {data?.skill_averages && (
        <div>
          <h2 className="font-heading text-lg font-bold mb-3">Skills</h2>
          <div className="card-flat space-y-3">
            {Object.entries(data.skill_averages).map(([k, v]) => (
              <SkillBar key={k} name={k.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} score={(v as {avg:number;trend:"up"|"down"|"stable"}).avg} trend={(v as {avg:number;trend:"up"|"down"|"stable"}).trend} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-heading text-lg font-bold mb-3">Submissions</h2>
        <div className="space-y-2">
          {(data?.submissions ?? []).map((s: {id:string;status:string;submitted_at:string;chapters?:{title:string}}) => (
            <div key={s.id} className="card-flat flex items-center justify-between">
              <div><p className="font-medium text-sm">{s.chapters?.title || "Submission"}</p><p className="text-xs text-navy-600">{new Date(s.submitted_at).toLocaleDateString()}</p></div>
              <ReviewStatusBadge status={s.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

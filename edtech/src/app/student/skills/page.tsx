"use client";
import { useQuery } from "@tanstack/react-query";
import { SkillBar, DashboardSkeleton } from "@/components/ui";

export default function SkillsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["student-progress"],
    queryFn: () => fetch("/api/student/progress").then((r) => r.json()),
    staleTime: 30_000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-3xl font-bold">Skills</h1>
        <p className="text-navy-600 mt-1">Your skill development across 4 dimensions</p>
      </div>

      {data?.skill_averages ? (
        <div className="card-flat space-y-4">
          {Object.entries(data.skill_averages).map(([key, value]) => (
            <SkillBar
              key={key}
              name={key.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              score={(value as { avg: number; trend: "up" | "down" | "stable" }).avg}
              trend={(value as { avg: number; trend: "up" | "down" | "stable" }).trend}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-navy-600">Complete chapters and receive reviews to see your skill data.</p>
        </div>
      )}
    </div>
  );
}

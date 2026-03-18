"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui";

export default function AdminMentorsPage() {
  const qc = useQueryClient();
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-mentors"],
    queryFn: () => fetch("/api/admin/assign-mentor").then((r) => r.json()),
    staleTime: 30_000,
  });

  const assignMentor = useMutation({
    mutationFn: () =>
      fetch("/api/admin/assign-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mentor_id: selectedMentor, student_id: selectedStudent }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-mentors"] });
      setSelectedMentor("");
      setSelectedStudent("");
    },
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <h1 className="font-heading text-3xl font-bold">Mentor Assignments</h1>

      {/* Assignment form */}
      <div className="card max-w-lg">
        <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-primary-500" />
          Assign a Student
        </h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5">Mentor</label>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
            >
              <option value="">Select mentor...</option>
              {(data?.mentors ?? []).map((m: { id: string; name: string; student_count: number }) => (
                <option key={m.id} value={m.id}>{m.name} ({m.student_count} students)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-200 text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
            >
              <option value="">Select student...</option>
              {(data?.students ?? []).map((s: { id: string; name: string }) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => assignMentor.mutate()}
            disabled={!selectedMentor || !selectedStudent || assignMentor.isPending}
            className="btn-pill btn-primary w-full justify-center text-sm"
          >
            {assignMentor.isPending ? "Assigning..." : "Assign Student to Mentor"}
          </button>
        </div>
      </div>

      {/* Mentor list */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Active Mentors</h2>
        <div className="space-y-2">
          {(data?.mentors ?? []).map((m: { id: string; name: string; email: string; student_count: number }) => (
            <div key={m.id} className="card-flat flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                  <span className="font-bold text-green-600">{m.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs text-navy-600">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-navy-600">
                <Users className="w-4 h-4" />
                {m.student_count} students
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

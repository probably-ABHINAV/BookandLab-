"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Mail, BookOpen } from "lucide-react";

export default function MentorStudentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["mentor-dashboard"],
    queryFn: () => fetch("/api/mentor/dashboard").then((r) => r.json()),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-[var(--br)] rounded-[16px]"></div>
          ))}
        </div>
      </div>
    );
  }

  const students = data?.assigned_students ?? [];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">Active Students</h1>
          <p className="text-[var(--mu)] font-bold text-lg mt-2">Manage your mentees and track their progress</p>
        </div>
        <div className="bg-[var(--dark)] text-white px-6 py-2 rounded-full font-bold text-sm border border-[var(--dark)]">
          {students.length} Total Assigned
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((s: { id: string; name: string; email: string }, i: number) => {
          const bgColors = ["bg-[var(--blue-bg)] text-[var(--blue)] border-[var(--blue-border)]", "bg-[var(--green-bg)] text-[var(--green)] border-green-200", "bg-[var(--purple-bg)] text-[var(--purple)] border-purple-200", "bg-[var(--y)] bg-opacity-20 text-[var(--yd)] border-[var(--y)]"];
          const avatarStyle = bgColors[i % bgColors.length];
          
          return (
            <div key={s.id} className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between min-h-[220px]">
              
              <div className="flex items-start justify-between">
                <div className={`w-16 h-16 rounded-[12px] flex items-center justify-center border text-2xl font-black ${avatarStyle}`}>
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <Link href={`/mentor/students/${s.id}`} className="w-10 h-10 rounded-full bg-[var(--bg2)] flex items-center justify-center border border-[var(--br)] text-[var(--dark)] hover:bg-[var(--y)] transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-6">
                <h3 className="font-black text-2xl text-[var(--dark)] truncate" title={s.name}>{s.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-[var(--mu)]">
                  <Mail className="w-4 h-4 shrink-0" />
                  <p className="font-bold text-sm truncate" title={s.email}>{s.email}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--br)] flex items-center justify-between">
                <div className="flex items-center gap-2 bg-[var(--bg2)] px-3 py-1.5 rounded-lg border border-[var(--br)]">
                  <BookOpen className="w-4 h-4 text-[var(--dark)]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--dark)]">View Details</span>
                </div>
              </div>
            </div>
          );
        })}

        {students.length === 0 && (
          <div className="col-span-full py-20 bg-[var(--wh)] border border-[var(--br)] rounded-[16px] text-center px-4">
             <div className="w-20 h-20 bg-[var(--bg2)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--br)]">
               <span className="text-4xl">👨‍🎓</span>
             </div>
             <p className="text-2xl font-black text-[var(--dark)] mb-2">No Students Yet</p>
             <p className="text-[var(--mu)] font-bold text-lg max-w-sm mx-auto">You have not been assigned any students yet. They will appear here once assigned by an admin.</p>
          </div>
        )}
      </div>

    </div>
  );
}

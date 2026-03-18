"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, BookOpen, UserPlus, BarChart3, ChevronRight, Settings, SlidersHorizontal } from "lucide-react";
import { DashboardSkeleton } from "@/components/ui";

export default function AdminDashboard() {
  const usersQ = useQuery({ queryKey: ["admin-users"], queryFn: () => fetch("/api/admin/user").then(r => r.json()), staleTime: 30_000 });
  const chaptersQ = useQuery({ queryKey: ["admin-chapters"], queryFn: () => fetch("/api/admin/chapter").then(r => r.json()), staleTime: 30_000 });

  if (usersQ.isLoading || chaptersQ.isLoading) return <DashboardSkeleton />;

  const users = usersQ.data?.users ?? [];
  const chapters = chaptersQ.data?.chapters ?? [];
  const students = users.filter((u: { role: string }) => u.role === "student");
  const mentors = users.filter((u: { role: string }) => u.role === "mentor");

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h1 className="font-heading text-4xl font-bold text-brand-navy">Administrator Panel</h1>
        <p className="text-text-secondary mt-1">Platform overview, user management, and content authoring</p>
      </div>

      {/* Primary Metrics Bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-600", href: "/admin/users" },
          { icon: BookOpen, label: "Chapters Live", value: chapters.length, color: "bg-brand-muted text-brand-navy", href: "/admin/chapters" },
          { icon: UserPlus, label: "Active Mentors", value: mentors.length, color: "bg-brand-yellow/20 text-brand-yellow", bgClass: "bg-brand-navy text-white" },
          { icon: BarChart3, label: "Enrolled Students", value: students.length, color: "bg-green-50 text-green-600", href: "/admin/users?role=student" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href || "#"} className={`bento-card flex flex-col justify-between group cursor-pointer ${stat.bgClass || "bg-brand-surface"}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className={`font-heading text-5xl font-bold mb-2 ${stat.bgClass ? "text-white" : "text-brand-navy"}`}>{stat.value}</p>
              <p className={`text-xs uppercase tracking-wider font-bold ${stat.bgClass ? "text-white/70" : "text-text-secondary"}`}>{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Control Center Bento */}
      <div className="bento-card">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-brand-muted">
          <SlidersHorizontal className="w-6 h-6 text-brand-navy" />
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Control Center</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Content Editor", desc: "Author deep-dive chapters using the 6-step flow", href: "/admin/chapters", icon: BookOpen },
            { label: "Directory", desc: "View and manage all user accounts & roles", href: "/admin/users", icon: Users },
            { label: "Mentor Assignments", desc: "Pair students with industry mentors", href: "/admin/mentors", icon: UserPlus },
            { label: "Billing & Access", desc: "Manage Pro subscriptions and billing limits", href: "/admin/subscriptions", icon: Settings },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="dashboard-card flex items-center gap-5 group hover:border-brand-navy transition-all">
              <div className="w-14 h-14 rounded-full bg-brand-muted flex items-center justify-center text-brand-navy group-hover:bg-brand-yellow group-hover:scale-110 transition-all shrink-0">
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-heading text-xl font-bold text-brand-navy mb-1">{action.label}</p>
                <p className="text-sm text-text-secondary pr-4">{action.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-brand-navy shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

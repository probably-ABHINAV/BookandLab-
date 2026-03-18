"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, BookOpen, UserPlus, CreditCard, BarChart3, ChevronRight } from "lucide-react";
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
        <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-navy-600 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Total Users", value: users.length, color: "bg-blue-50 text-blue-600", href: "/admin/users" },
          { icon: BookOpen, label: "Chapters", value: chapters.length, color: "bg-green-50 text-green-600", href: "/admin/chapters" },
          { icon: UserPlus, label: "Mentors", value: mentors.length, color: "bg-purple-50 text-purple-600", href: "/admin/mentors" },
          { icon: BarChart3, label: "Students", value: students.length, color: "bg-amber-50 text-amber-600", href: "/admin/users?role=student" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card group">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-navy-600">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-heading text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { label: "Manage Chapters", desc: "Add, edit, or archive chapters", href: "/admin/chapters" },
            { label: "Manage Users", desc: "View and manage user accounts", href: "/admin/users" },
            { label: "Assign Mentors", desc: "Pair mentors with students", href: "/admin/mentors" },
            { label: "Manage Subscriptions", desc: "Add or update subscription plans", href: "/admin/subscriptions" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="card-flat flex items-center justify-between group hover:bg-cream-50">
              <div>
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs text-navy-600">{action.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-navy-400 group-hover:text-primary-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

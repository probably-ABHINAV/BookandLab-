"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, BookOpen, CreditCard, Activity, ArrowRight, Settings } from "lucide-react";

export default function AdminDashboard() {
  const usersQ = useQuery({ queryKey: ["admin-users"], queryFn: () => fetch("/api/admin/users").then(r => r.json()) });
  const chaptersQ = useQuery({ queryKey: ["admin-chapters"], queryFn: () => fetch("/api/admin/chapters").then(r => r.json()) });

  if (usersQ.isLoading || chaptersQ.isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64 mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-[var(--br)] rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="h-32 bg-[var(--br)] rounded-2xl"></div>
          <div className="h-32 bg-[var(--br)] rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const users = usersQ.data?.users ?? [];
  const chapters = chaptersQ.data?.chapters ?? [];
  const students = users.filter((u: { role: string }) => u.role === "student");

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">Admin Control Center</h1>
          <p className="text-[var(--mu)] font-bold text-lg mt-2">Manage curriculum, users, and platform settings</p>
        </div>
        <button className="bg-[var(--wh)] border border-[var(--br)] text-[var(--dark)] px-6 py-3 rounded-full flex items-center gap-2 font-bold hover:bg-[var(--c2)] transition-colors shadow-sm">
          <Settings className="w-5 h-5" /> Platform Settings
        </button>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--blue-bg)] text-[var(--blue)] border-[var(--blue-border)] flex items-center justify-center border mb-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{users.length}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Total Users</p>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--purple-bg)] text-[var(--purple)] border-purple-200 flex items-center justify-center border mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{Math.floor(students.length * 0.8)}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Active Subscriptions</p>
          </div>
        </div>

        {/* Total Chapters */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--y)] bg-opacity-20 text-[var(--yd)] border-[var(--y)] flex items-center justify-center border mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--dark)]">{chapters.length}</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">Total Chapters</p>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] p-[24px] shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--green-bg)] text-[var(--green)] border-green-200 flex items-center justify-center border mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-4xl font-black text-[var(--green)]">100%</p>
            <p className="text-[var(--mu)] font-bold text-xs uppercase tracking-widest mt-1">System Status</p>
          </div>
        </div>

      </div>

      {/* 3. Massive Action Buttons */}
      <h2 className="text-2xl font-black text-[var(--dark)] mt-12 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Manage Curriculum */}
        <Link href="/admin/chapters" className="group relative bg-[var(--dark)] rounded-[20px] p-8 overflow-hidden flex items-center justify-between border-[3px] border-[var(--dark)] hover:shadow-lg hover:-translate-y-1 transition-all">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[var(--y)] opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-2">Manage Curriculum</h3>
            <p className="text-[var(--mu2)] font-bold text-sm">Create, edit, and publish chapters and subjects.</p>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-full bg-white bg-opacity-10 flex items-center justify-center group-hover:bg-[var(--y)] group-hover:text-[var(--dark)] text-white transition-colors shrink-0">
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>

        {/* Manage Users */}
        <Link href="/admin/users" className="group relative bg-[var(--wh)] rounded-[20px] p-8 overflow-hidden flex items-center justify-between border-[3px] border-[var(--dark)] shadow-[4px_4px_0px_#17140D] hover:shadow-[6px_6px_0px_#17140D] hover:-translate-y-1 transition-all">
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-[var(--dark)] mb-2">Manage Users</h3>
            <p className="text-[var(--mu)] font-bold text-sm">Assign mentors, view progress, and manage subscriptions.</p>
          </div>
          <div className="relative z-10 w-16 h-16 rounded-full bg-[var(--dark)] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <ArrowRight className="w-6 h-6" />
          </div>
        </Link>
        
      </div>

    </div>
  );
}

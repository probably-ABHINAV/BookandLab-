"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen, LayoutDashboard, Target, Activity, CheckSquare, 
  Users, User, FileEdit, Settings, LogOut, ChevronLeft, ChevronRight
} from "lucide-react";

interface SidebarProps {
  role: "student" | "mentor" | "admin";
}

const NAV_ITEMS = {
  student: [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Subjects", href: "/student/subjects", icon: BookOpen },
    { label: "Progress", href: "/student/progress", icon: Activity },
    { label: "Skills", href: "/student/skills", icon: Target },
    { label: "Profile", href: "/student/profile", icon: User },
  ],
  mentor: [
    { label: "Overview", href: "/mentor/dashboard", icon: LayoutDashboard },
    { label: "My Students", href: "/mentor/students", icon: Users },
    { label: "Pending Reviews", href: "/mentor/reviews", icon: CheckSquare },
    { label: "Settings", href: "/mentor/settings", icon: Settings },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Chapters", href: "/admin/chapters", icon: BookOpen },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Mentors", href: "/admin/mentors", icon: CheckSquare },
    { label: "Subscriptions", href: "/admin/subscriptions", icon: FileEdit },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = NAV_ITEMS[role];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-40 bg-brand-navy text-white flex flex-col ${
        collapsed ? "w-[88px]" : "w-[260px]"
      }`}
    >
      {/* Brand Header */}
      <div className={`h-20 flex items-center border-b border-white/5 ${collapsed ? "justify-center" : "px-6 gap-3"}`}>
        <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center shrink-0 shadow-glow">
          <BookOpen className="w-5 h-5 text-brand-navy" />
        </div>
        {!collapsed && (
          <span className="font-heading text-xl font-bold tracking-widest uppercase text-white animate-fade-in-up">
            MÖNAC
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 text-xs font-semibold text-brand-yellow uppercase tracking-wider mb-4">
            {role} Panel
          </p>
        )}
        
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? "bg-brand-yellow text-brand-navy shadow-md" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${collapsed ? "mx-auto" : ""}`} />
              {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-brand-dark text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-opacity">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Area */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Exit App</span>}
        </Link>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 w-8 h-8 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center shadow-md hover:scale-110 transition-transform z-50 border-2 border-brand-cream"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}

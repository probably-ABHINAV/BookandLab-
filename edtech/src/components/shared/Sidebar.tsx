"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  BarChart3,
  Bell,
  User,
  Users,
  FileText,
  ClipboardCheck,
  Settings,
  LogOut,
  Flame,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "student" | "mentor" | "admin";
  userName?: string;
  streak?: number;
}

const navItems = {
  student: [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/subjects", label: "Subjects", icon: BookOpen },
    { href: "/student/progress", label: "Progress", icon: TrendingUp },
    { href: "/student/skills", label: "Skills", icon: BarChart3 },
    { href: "/student/profile", label: "Profile", icon: User },
  ],
  mentor: [
    { href: "/mentor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/mentor/students", label: "My Students", icon: Users },
    { href: "/mentor/reviews", label: "Reviews", icon: ClipboardCheck },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/chapters", label: "Chapters", icon: BookOpen },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/mentors", label: "Mentors", icon: UserPlus },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  ],
};

export default function Sidebar({ role, userName = "User", streak = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const items = navItems[role];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-cream-200 flex flex-col z-40 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-cream-200">
        <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-heading text-lg font-bold truncate">
            BookandLab
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-navy-600 hover:bg-cream-100 hover:text-navy-900"
              )}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary-500")} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!collapsed && item.label === "Dashboard" && role === "student" && streak > 0 && (
                <span className="ml-auto flex items-center gap-1 text-xs font-bold text-orange-500">
                  <Flame className="w-3.5 h-3.5" />
                  {streak}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-cream-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* User info + logout */}
      <div className="p-4 border-t border-cream-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary-700">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-navy-600 capitalize">{role}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => {
                document.cookie = "user_id=; Max-Age=0; path=/";
                document.cookie = "user_role=; Max-Age=0; path=/";
                window.location.href = "/login";
              }}
              className="p-1.5 text-navy-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

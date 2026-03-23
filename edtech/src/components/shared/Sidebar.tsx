"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  LogOut, LayoutDashboard, BookOpen, BarChart2, Bell, User,
  Sprout, FileText, ClipboardList, Users, TrendingUp,
  School, BookMarked, PenLine, GraduationCap, Link2, CreditCard, Target,
  Menu, X
} from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

interface SidebarProps {
  role: "student" | "mentor" | "admin";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const app = useStackApp();
  const user = useUser({ or: "redirect" });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isCurrent = (path: string) => pathname.startsWith(path);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen(prev => !prev), []);

  type NavItem = { section?: string; icon?: any; label?: string; href?: string; badge?: boolean | number; };

  const studentNav: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
    { icon: BookOpen, label: 'My Chapters', href: '/student/subjects' },
    { icon: BarChart2, label: 'Progress', href: '/student/progress' },
    { icon: Sprout, label: 'Skills', href: '/student/skills' },
    { icon: FileText, label: 'Submissions', href: '/student/projects', badge: 3 },
    { icon: Bell, label: 'Notifications', href: '/student/notifications', badge: 2 },
    { icon: User, label: 'Profile', href: '/student/profile' }
  ];

  const mentorNav: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/mentor/dashboard' },
    { icon: ClipboardList, label: 'Pending Reviews', href: '/mentor/reviews', badge: 5 },
    { icon: Users, label: 'My Students', href: "/mentor/students" },
    { icon: TrendingUp, label: 'Skill Analytics', href: "/mentor/analytics" },
    { icon: Bell, label: 'Notifications', href: '/mentor/notifications', badge: 1 },
    { icon: User, label: 'Profile', href: '/mentor/profile' },
  ];

  const adminNav: NavItem[] = [
    { section: 'Curriculum' },
    { icon: School, label: 'Classes', href: '/admin/classes' },
    { icon: BookMarked, label: 'Subjects', href: '/admin/subjects' },
    { icon: BookOpen, label: 'Chapters', href: '/admin/chapters', badge: 4 },
    { icon: PenLine, label: 'Content Editor', href: '/admin/editor' },
    { section: 'People' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: GraduationCap, label: 'Mentors', href: '/admin/mentors' },
    { icon: Link2, label: 'Assignments', href: '/admin/mentors/assign' },
    { section: 'System' },
    { icon: CreditCard, label: 'Subscriptions', href: '/admin/subscriptions' },
    { icon: Target, label: 'Skills & Rubrics', href: '/admin/skills' },
    { icon: BarChart2, label: 'Reports', href: '/admin/reports' }
  ];

  const navItems = role === "student" ? studentNav : role === "mentor" ? mentorNav : adminNav;

  const roleColor = role === 'admin' ? '#E74C3C' : role === 'mentor' ? '#7B5CF5' : '#1A9E5C';

  const renderNavContent = () => (
    <>
      {/* Logo section */}
      <div style={{ padding: "20px 18px" }} className="border-b border-[#2A261A]">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-3 group">
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--y)", color: "var(--dark)" }} className="flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <h1 style={{ fontSize: "13px", fontWeight: 900 }} className="text-white tracking-tight">BookandLab</h1>
            <p style={{ fontSize: "9px" }} className="text-[var(--mu2)] uppercase font-bold tracking-widest leading-none mt-0.5">Learn • Apply</p>
          </div>
        </Link>
      </div>

      {/* User section */}
      <div style={{ padding: "16px 18px" }} className="border-b border-[#2A261A]">
        <div className="flex items-center gap-3">
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: roleColor }} className="flex items-center justify-center font-bold text-white text-sm shrink-0">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="overflow-hidden">
            <p style={{ fontSize: "12.5px", fontWeight: 700 }} className="text-white truncate">{user?.displayName || "User"}</p>
            <p style={{ fontSize: "10px" }} className="text-[var(--mu)] capitalize">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav section */}
      <nav style={{ flex: 1 }} className="py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <p key={`section-${item.section}-${idx}`} style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--mu)" }} className="px-3 pt-4 pb-1 uppercase">
                {item.section}
              </p>
            );
          }

          if (!item.href) return null;

          const active = isCurrent(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                background: active ? "rgba(245,166,35,0.14)" : "transparent",
                border: active ? "1px solid rgba(245,166,35,0.22)" : "1px solid transparent",
                color: active ? "var(--y)" : "#D0C8B8",
                fontWeight: active ? 700 : 500
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-[13px] hover:bg-white/5 hover:text-white min-h-[44px]"
            >
              {item.icon && <item.icon style={{ width: "16px", height: "16px", color: active ? "var(--y)" : "var(--mu2)" }} />}
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--red)", color: "white", padding: "1px 6px", borderRadius: "99px" }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2A261A] mt-auto flex items-center justify-between">
        <button
          onClick={() => app.urls.signOut}
          className="flex items-center gap-2 px-2 py-1.5 text-left rounded-lg text-xs font-semibold text-[var(--mu)] hover:text-white transition-colors min-h-[44px]"
        >
          <LogOut style={{ width: "14px", height: "14px" }} />
          <span>Log out</span>
        </button>
        {role === "student" && (
          <span style={{ fontSize: "9px", fontWeight: 800, background: "rgba(22,163,74,0.15)", color: "var(--green)", padding: "2px 6px", borderRadius: "4px" }}>PRO</span>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4" style={{ background: "var(--dark)" }}>
        <Link href={`/${role}/dashboard`} className="flex items-center gap-2.5">
          <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "var(--y)", color: "var(--dark)" }} className="flex items-center justify-center font-bold text-sm">
            B
          </div>
          <span style={{ fontSize: "13px", fontWeight: 900 }} className="text-white tracking-tight">BookandLab</span>
        </Link>
        <button
          onClick={toggleMobile}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`md:hidden fixed top-14 left-0 bottom-0 z-40 w-[260px] flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--dark)" }}
      >
        {renderNavContent()}
      </aside>

      {/* ── Desktop Sidebar (unchanged) ── */}
      <aside style={{ width: "224px", background: "var(--dark)" }} className="hidden md:flex fixed left-0 top-0 h-screen flex-col z-50 overflow-y-auto border-r border-[#2A261A]">
        {renderNavContent()}
      </aside>
    </>
  );
}

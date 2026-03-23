import Sidebar from "@/components/shared/Sidebar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Suspense fallback={<div className="hidden md:block w-[224px] h-screen bg-[var(--dark)]" />}>
        <Sidebar role="mentor" />
      </Suspense>
      <main className="flex-1 flex flex-col min-w-0 overflow-auto p-4 md:p-7 md:ml-[224px] animate-fade-in">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

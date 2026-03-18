import Sidebar from "@/components/shared/Sidebar";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Sidebar role="mentor" />
      <main className="ml-[260px] p-8 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
}

import Sidebar from "@/components/shared/Sidebar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Sidebar role="student" />
      <main className="ml-[260px] p-8 max-w-[1400px] animate-fade-up">
        {children}
      </main>
    </div>
  );
}

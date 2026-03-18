"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { ConfirmModal } from "@/components/ui";

export default function AdminChaptersPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-chapters"],
    queryFn: () => fetch("/api/admin/chapter").then((r) => r.json()),
    staleTime: 30_000,
  });

  const deleteChapter = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/chapter/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { setDeleteId(null); qc.invalidateQueries({ queryKey: ["admin-chapters"] }); },
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      fetch(`/api/admin/chapter/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published: !published }) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-chapters"] }),
  });

  if (isLoading) return <div className="skeleton h-48" />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Chapters</h1>
        <button className="btn-pill btn-primary text-sm"><Plus className="w-4 h-4" /> Create Chapter</button>
      </div>

      <div className="space-y-2">
        {(data?.chapters ?? []).map((ch: { id: string; title: string; is_published: boolean; subjects?: { name: string }; estimated_minutes: number }) => (
          <div key={ch.id} className="card-flat flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">{ch.title}</h3>
              <p className="text-xs text-navy-600">{ch.subjects?.name ?? "No subject"} · {ch.estimated_minutes}min</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`badge ${ch.is_published ? "badge-success" : "badge-warning"}`}>
                {ch.is_published ? "Published" : "Draft"}
              </span>
              <button
                onClick={() => togglePublish.mutate({ id: ch.id, published: ch.is_published })}
                className="p-2 hover:bg-cream-100 rounded-xl transition-colors"
                title={ch.is_published ? "Unpublish" : "Publish"}
              >
                {ch.is_published ? <EyeOff className="w-4 h-4 text-navy-400" /> : <Eye className="w-4 h-4 text-green-500" />}
              </button>
              <button onClick={() => setDeleteId(ch.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Chapter"
        message="This will soft-delete the chapter. It can be recovered later."
        confirmText="Delete"
        destructive
        onConfirm={() => deleteId && deleteChapter.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

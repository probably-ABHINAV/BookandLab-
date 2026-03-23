"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Eye, EyeOff, BookOpen, Clock } from "lucide-react";

export default function AdminChaptersPage() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-chapters"],
    queryFn: () => fetch("/api/admin/chapters").then((r) => r.json()),
  });

  const deleteChapter = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/chapters/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { setDeleteId(null); qc.invalidateQueries({ queryKey: ["admin-chapters"] }); },
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      fetch(`/api/admin/chapters/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published: !published }) }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-chapters"] }),
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64 mb-12"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-[var(--br)] rounded-[16px]"></div>
          ))}
        </div>
      </div>
    );
  }

  const chapters = data?.chapters ?? [];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">Curriculum Library</h1>
          <p className="text-[var(--mu)] font-bold text-lg mt-2">Manage all chapters and course content</p>
        </div>
        <button className="bg-[var(--dark)] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity border-2 border-[var(--dark)] shadow-sm shrink-0">
          <Plus className="w-5 h-5" /> Create Chapter
        </button>
      </div>

      {/* Chapters List */}
      <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-[var(--br)] bg-[var(--bg2)] flex items-center justify-between">
          <h2 className="text-2xl font-black text-[var(--dark)]">All Chapters ({chapters.length})</h2>
        </div>
        
        <div className="p-0">
          {chapters.length > 0 ? (
            <div className="divide-y divide-[var(--br)]">
              {chapters.map((ch: any) => (
                <div key={ch.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 hover:bg-[var(--c2)] transition-colors gap-6">
                  
                  <div className="flex items-start gap-6 flex-1">
                    <div className="w-14 h-14 rounded-[12px] bg-[var(--bg2)] border border-[var(--br)] text-[var(--dark)] flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-[var(--dark)] mb-1">{ch.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-[var(--mu)] font-bold text-sm">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" /> {ch.subjects?.name ?? "No subject"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {ch.estimated_minutes} min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 shrink-0">
                    {/* Status Badge */}
                    {ch.is_published ? (
                      <span className="bg-[var(--green)] bg-opacity-10 text-[var(--green)] border border-[var(--green)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest hidden sm:inline-block">
                        Published
                      </span>
                    ) : (
                      <span className="bg-[var(--y)] bg-opacity-20 text-[var(--yd)] border border-[var(--y)] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest hidden sm:inline-block">
                        Draft
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                       <button
                        onClick={() => togglePublish.mutate({ id: ch.id, published: ch.is_published })}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${ch.is_published ? 'border-[var(--mu)] text-[var(--mu)] hover:bg-[var(--bg2)]' : 'border-[var(--green)] text-[var(--green)] hover:bg-green-50'}`}
                        title={ch.is_published ? "Unpublish" : "Publish"}
                      >
                        {ch.is_published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                      
                        <Link href={`/admin/chapters/${ch.id}/editor`} className="w-12 h-12 rounded-full border border-[var(--mu)] text-[var(--dark)] flex flex-col items-center justify-center hover:bg-[var(--y)] hover:border-[var(--y)] transition-colors" title="Content Editor">
                         <Pencil className="w-5 h-5" />
                        </Link>

                      <button onClick={() => setDeleteId(ch.id)} className="w-12 h-12 rounded-full border border-[var(--red)] text-[var(--red)] flex items-center justify-center hover:bg-red-50 transition-colors" title="Delete Chapter">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="w-20 h-20 bg-[var(--bg2)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--br)]">
                <BookOpen className="w-8 h-8 text-[var(--mu)]" />
              </div>
              <p className="text-2xl font-black text-[var(--dark)] mb-2">No Chapters Yet</p>
              <p className="text-[var(--mu)] font-bold text-lg max-w-sm mb-8">Start building your curriculum by creating your first chapter.</p>
              <button className="bg-[var(--dark)] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity border-2 border-[var(--dark)] shadow-sm">
                <Plus className="w-5 h-5" /> Create First Chapter
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Modal Overlay */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[20px] p-8 max-w-md w-full shadow-2xl transform scale-100 animate-fade-in-up">
            <h3 className="text-2xl font-black text-[var(--dark)] mb-2">Delete Chapter?</h3>
            <p className="text-[var(--mu)] font-bold mb-8">This action cannot be undone. Are you sure you want to delete this chapter entirely?</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-[var(--bg2)] text-[var(--dark)] border border-[var(--br)] px-6 py-3 rounded-full font-bold hover:bg-[var(--c2)] transition-colors">
                Cancel
              </button>
              <button onClick={() => { deleteId && deleteChapter.mutate(deleteId); }} className="flex-1 bg-[var(--red)] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

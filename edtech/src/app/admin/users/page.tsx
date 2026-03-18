"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Search, Filter } from "lucide-react";
import { ConfirmModal, SubscriptionBadge } from "@/components/ui";

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      return fetch(`/api/admin/user?${params}`).then((r) => r.json());
    },
    staleTime: 15_000,
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/user/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { setDeleteId(null); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
  });

  if (isLoading) return <div className="skeleton h-48" />;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-bold">Users</h1>
        <button className="btn-pill btn-primary text-sm"><Plus className="w-4 h-4" /> Add User</button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-200 bg-white focus:ring-2 focus:ring-primary-400 focus:outline-none text-sm"
            placeholder="Search by name or email..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-cream-200 bg-white text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="mentor">Mentors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="space-y-2">
        {(data?.users ?? []).map((u: { id: string; name: string; email: string; role: string; is_active: boolean; subscriptions?: Array<{ status: string }> }) => (
          <div key={u.id} className="card-flat flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="font-bold text-sm text-primary-700">{u.name?.charAt(0) || "?"}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{u.name}</p>
                <p className="text-xs text-navy-600">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="badge capitalize" style={{ background: u.role === "admin" ? "#eee" : undefined }}>
                {u.role}
              </span>
              {u.role === "student" && u.subscriptions?.[0] && (
                <SubscriptionBadge status={u.subscriptions[0].status} />
              )}
              <button onClick={() => setDeleteId(u.id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Deactivate User"
        message="This will deactivate the user account."
        confirmText="Deactivate"
        destructive
        onConfirm={() => deleteId && deleteUser.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

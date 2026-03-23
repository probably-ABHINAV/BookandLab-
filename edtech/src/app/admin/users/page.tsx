"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Trash2, Search, Settings, Shield, User, GraduationCap, X } from "lucide-react";
import { ConfirmModal } from "@/components/ui";

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
      return fetch(`/api/admin/users?${params}`).then((r) => r.json());
    },
    staleTime: 15_000,
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/users/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { setDeleteId(null); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
  });

  const extendSubscription = useMutation({
    mutationFn: (id: string) => fetch(`/api/admin/users/${id}/subscription`, { method: "PATCH" }).then(r => r.json()),
    onSuccess: (data) => {
      if (data.success) {
        alert("Subscription extended by 1 month!");
        qc.invalidateQueries({ queryKey: ["admin-users"] });
      } else {
        alert(data.error || "Extension failed");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 bg-[var(--br)] rounded-xl w-64 mb-12"></div>
        <div className="flex gap-4 mb-8">
          <div className="h-14 bg-[var(--br)] rounded-[16px] flex-1"></div>
          <div className="h-14 bg-[var(--br)] rounded-[16px] w-48"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-[var(--br)] rounded-[12px]"></div>
          ))}
        </div>
      </div>
    );
  }

  const users = data?.users ?? [];

  return (
    <div className="space-y-12 max-w-6xl mx-auto animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-black text-4xl text-[var(--dark)] tracking-tight">User Management</h1>
          <p className="text-[var(--mu)] font-bold text-lg mt-2">Manage access and roles for all platform accounts</p>
        </div>
        <button className="bg-[var(--dark)] text-white px-8 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity border-2 border-[var(--dark)] shadow-sm shrink-0">
          <Plus className="w-5 h-5" /> Add User
        </button>
      </div>

      {/* Filters & Table Wrapper */}
      <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[16px] overflow-hidden shadow-sm">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-[var(--br)] bg-[var(--bg2)] flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--mu)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-[12px] border border-[var(--br)] bg-[var(--wh)] focus:border-[var(--y)] focus:outline-none text-[var(--dark)] font-bold placeholder-[var(--mu)] transition-colors"
              placeholder="Search by name or email..."
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full md:w-auto px-6 py-3 rounded-[12px] border border-[var(--br)] bg-[var(--wh)] text-[var(--dark)] font-bold focus:border-[var(--y)] focus:outline-none transition-colors appearance-none cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="mentor">Mentors</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto p-0">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[var(--br)] bg-[var(--wh)] text-[var(--mu)] uppercase tracking-widest text-xs font-black">
                <th className="p-6">User Details</th>
                <th className="p-6">Role</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--br)] bg-[var(--wh)]">
              {users.map((u: any) => {
                
                // Role styling
                let RoleIcon = User;
                let roleColor = "bg-[var(--br)] text-[var(--dark)]";
                if (u.role === "admin") {
                  RoleIcon = Shield;
                  roleColor = "bg-[var(--purple-bg)] text-[var(--purple)] border-purple-200 border";
                } else if (u.role === "mentor") {
                  RoleIcon = GraduationCap;
                  roleColor = "bg-[var(--blue-bg)] text-[var(--blue)] border-[var(--blue-border)] border";
                } else {
                  roleColor = "bg-[var(--y)] bg-opacity-20 text-[var(--yd)] border-[var(--y)] border";
                }

                // Subscription Badge logic
                let isSubbed = false;
                if (u.role === "student" && u.subscriptions?.[0]) {
                  isSubbed = u.subscriptions[0].status === "active";
                }

                return (
                  <tr key={u.id} className="hover:bg-[var(--c2)] transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 ${roleColor}`}>
                          <RoleIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-[var(--dark)] text-lg">{u.name || "Unnamed User"}</p>
                          <p className="text-[var(--mu)] font-bold text-sm">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${roleColor}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-6">
                      {isSubbed || u.role !== "student" ? (
                        <span className="inline-flex items-center gap-2 text-[var(--green)] font-bold text-sm">
                          <span className="w-2 h-2 rounded-full bg-[var(--green)]"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-[var(--mu)] font-bold text-sm">
                          <span className="w-2 h-2 rounded-full bg-[var(--mu)]"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {u.role === "student" && (
                          <button 
                            onClick={() => extendSubscription.mutate(u.id)}
                            disabled={extendSubscription.isPending}
                            className="text-[11px] font-bold text-[var(--dark)] bg-[var(--y)] px-3 py-1.5 rounded-[8px] border border-[var(--yd)] hover:brightness-105 transition-all mr-2 shadow-sm whitespace-nowrap" 
                            title="Extend 1 Month"
                          >
                           + 1 Month
                          </button>
                        )}
                        <button className="w-10 h-10 rounded-[10px] border border-[var(--br)] flex items-center justify-center hover:bg-[var(--bg2)] text-[var(--dark)] transition-colors shrink-0" title="Manage Preferences">
                          <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(u.id)} className="w-10 h-10 rounded-[10px] border border-[var(--red)] flex items-center justify-center hover:bg-red-50 text-[var(--red)] transition-colors shrink-0" title="Deactivate User">
                          <X className="w-4 h-4 text-[var(--red)]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="w-16 h-16 bg-[var(--bg2)] rounded-full flex items-center justify-center mx-auto mb-4 border border-[var(--br)]">
                      <Search className="w-6 h-6 text-[var(--mu)]" />
                    </div>
                    <p className="text-xl font-black text-[var(--dark)] mb-1">No matches found</p>
                    <p className="text-[var(--mu)] font-bold">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deactivate Modal Overlay */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--wh)] border border-[var(--br)] rounded-[20px] p-8 max-w-md w-full shadow-2xl transform scale-100 animate-fade-in-up">
            <h3 className="text-2xl font-black text-[var(--dark)] mb-2">Deactivate User?</h3>
            <p className="text-[var(--mu)] font-bold mb-8">This will immediately revoke their access to the platform. Are you sure?</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 bg-[var(--bg2)] text-[var(--dark)] border border-[var(--br)] px-6 py-3 rounded-full font-bold hover:bg-[var(--c2)] transition-colors">
                Cancel
              </button>
              <button onClick={() => { deleteId && deleteUser.mutate(deleteId); }} className="flex-1 bg-[var(--red)] text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdmin } from "@/contexts/AdminContext";
import type { ManagedUser } from "@/lib/user-management";
import { USER_MODULES } from "@/lib/user-permissions";
import { Activity, Camera, Check, ChevronLeft, ChevronRight, Eye, LoaderCircle, Pencil, Plus, Search, ShieldCheck, Trash2, UserRound, UserX, X } from "lucide-react";

type UserForm = {
  name: string; email: string; role: "super_admin" | "admin" | "editor"; isActive: boolean;
  permissions: string[]; password: string; confirmPassword: string;
};
const emptyForm = (role: UserForm["role"] = "editor"): UserForm => ({ name: "", email: "", role, isActive: true, permissions: [], password: "", confirmPassword: "" });
const dateLabel = (value: string | null) => value ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Never";
const roleLabel = (role: ManagedUser["role"]) => ({ super_admin: "Super Admin", admin: "Admin", editor: "Editor / Staff" })[role];

export default function UserManagementPage() {
  const { user: actor } = useAdmin();
  const isSuperAdmin = actor?.role === "super_admin";
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [queryText, setQueryText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"users" | "activity">("users");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [details, setDetails] = useState<ManagedUser | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm());
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [pageSize] = useState(8);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [userResponse, auditResponse] = await Promise.all([fetch("/api/admin/users", { cache: "no-store" }), fetch("/api/admin/audit", { cache: "no-store" })]);
      const userData = await userResponse.json();
      if (!userResponse.ok) throw new Error(userData.error || "Unable to load users.");
      setUsers(userData.users || []);
      if (auditResponse.ok) setEvents((await auditResponse.json()).events || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load user management data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => () => { if (avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview); }, [avatarPreview]);

  const filtered = useMemo(() => users.filter((entry) => {
    const searchMatch = `${entry.name} ${entry.email}`.toLowerCase().includes(queryText.trim().toLowerCase());
    return searchMatch && (roleFilter === "all" || entry.role === roleFilter) && (statusFilter === "all" || (statusFilter === "active") === entry.isActive);
  }), [users, queryText, roleFilter, statusFilter]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visibleUsers = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeCount = users.filter((entry) => entry.isActive).length;
  const editorCount = users.filter((entry) => entry.role === "editor").length;

  useEffect(() => { if (page > pageCount) setPage(pageCount); }, [page, pageCount]);
  useEffect(() => {
    if (!createOpen && !details) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { closeEditor(); setDetails(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [createOpen, details]);

  const startCreate = () => { setEditing(null); setCreateOpen(true); setForm(emptyForm(isSuperAdmin ? "admin" : "editor")); setAvatarFile(null); setAvatarPreview(""); setRemoveAvatar(false); setError(""); setNotice(""); };
  const startEdit = (entry: ManagedUser) => {
    setEditing(entry); setCreateOpen(true); setForm({ name: entry.name, email: entry.email, role: entry.role, isActive: entry.isActive, permissions: [...entry.permissions], password: "", confirmPassword: "" });
    setAvatarFile(null); setAvatarPreview(entry.profileImage || ""); setRemoveAvatar(false); setError(""); setNotice("");
  };
  const closeEditor = () => { setEditing(null); setCreateOpen(false); setAvatarFile(null); setAvatarPreview(""); setError(""); };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); setSaving(true);
    let accountWasSaved = false;
    const wasCreating = !editing;
    if (form.password && form.password !== form.confirmPassword) { setError("Passwords do not match."); setSaving(false); return; }
    if (!editing && (!form.password || form.password.length < 12)) { setError("Use a password with at least 12 characters."); setSaving(false); return; }
    try {
      const payload: any = { name: form.name, email: form.email, isActive: form.isActive };
      if (!editing || form.role !== editing.role) payload.role = form.role;
      if (form.role === "editor") payload.permissions = form.permissions;
      if (!editing) Object.assign(payload, { password: form.password });
      const response = await fetch(editing ? `/api/admin/users/${editing.id}` : "/api/admin/users", {
        method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save account.");
      accountWasSaved = true;
      const userId = result.user.id;
      if (form.password && editing) {
        const passwordResponse = await fetch(`/api/admin/users/${userId}/password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: form.password, confirmPassword: form.confirmPassword }) });
        const passwordResult = await passwordResponse.json();
        if (!passwordResponse.ok) throw new Error(passwordResult.error || "Unable to reset password.");
      }
      if (avatarFile) {
        const data = new FormData(); data.set("avatar", avatarFile);
        const avatarResponse = await fetch(`/api/admin/users/${userId}/avatar`, { method: "POST", body: data });
        const avatarResult = await avatarResponse.json();
        if (!avatarResponse.ok) throw new Error(avatarResult.error || "Image upload failed.");
      } else if (removeAvatar && editing?.profileImage) {
        const avatarResponse = await fetch(`/api/admin/users/${userId}/avatar`, { method: "DELETE" });
        const avatarResult = await avatarResponse.json();
        if (!avatarResponse.ok) throw new Error(avatarResult.error || "Image removal failed.");
      }
      setNotice(editing ? "Account updated successfully." : "Account created successfully. The user can now sign in with this email and password."); closeEditor(); await load();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Unable to save account.";
      if (accountWasSaved && wasCreating) {
        setNotice(`Account created successfully. ${message} You can edit the account to retry the picture update.`);
        closeEditor(); await load();
      } else setError(message);
    }
    finally { setSaving(false); }
  };

  const changeStatus = async (entry: ManagedUser) => {
    setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/users/${entry.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !entry.isActive }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Unable to change account status.");
      setNotice(`${entry.name} ${entry.isActive ? "deactivated" : "activated"}.`); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to change account status."); }
  };

  const deleteAccount = async (entry: ManagedUser) => {
    if (!window.confirm(`Permanently delete ${entry.name} (${entry.email})? Audit history will be retained.`)) return;
    try {
      const response = await fetch(`/api/admin/users/${entry.id}`, { method: "DELETE" }); const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete account.");
      setNotice("Account deleted."); await load();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete account."); }
  };

  const selectAvatar = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError("Choose a JPG, PNG, or WebP image smaller than 2 MB."); return; }
    setError(""); setRemoveAvatar(false); setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file));
  };

  const containDialogFocus = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  return <div className="space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck size={16} className="text-blue-600" />Access control</div><h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">User management</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage administrator accounts, access, and account activity.</p></div>
      <Button onClick={startCreate} className="h-10 gap-2 self-start px-4"><Plus size={17} />Add user</Button>
    </div>

    {error && !editing && <div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError("")}><X size={16} /></button></div>}
    {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><Check size={16} />{notice}</div>}

    <div className="grid gap-4 sm:grid-cols-3">
      {[{ label: "Total accounts", value: users.length, description: "All registered users" }, { label: "Active accounts", value: activeCount, description: "Can sign in" }, { label: "Editor / Staff", value: editorCount, description: "Limited module access" }].map((item) => <Card key={item.label} className="border border-slate-200 shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm font-medium text-slate-600">{item.label}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{item.value}</p><p className="mt-1 text-xs text-slate-500">{item.description}</p></div><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><UserRound size={21} /></div></CardContent></Card>)}
    </div>

    <div className="flex gap-1 border-b border-slate-200" role="tablist" aria-label="User management sections">
      <button role="tab" aria-selected={activeTab === "users"} onClick={() => setActiveTab("users")} className={`border-b-2 px-4 py-3 text-sm font-medium ${activeTab === "users" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"}`}>Accounts</button>
      <button role="tab" aria-selected={activeTab === "activity"} onClick={() => setActiveTab("activity")} className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${activeTab === "activity" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-600 hover:text-slate-900"}`}><Activity size={15} />Audit activity</button>
    </div>

    {activeTab === "users" ? <Card className="overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1"><span className="sr-only">Search users</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={queryText} onChange={(event) => { setQueryText(event.target.value); setPage(1); }} placeholder="Search by name or email" className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label>
        <div className="flex flex-wrap gap-2"><label className="sr-only" htmlFor="role-filter">Filter by role</label><select id="role-filter" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"><option value="all">All roles</option><option value="super_admin">Super Admin</option><option value="admin">Admin</option><option value="editor">Editor / Staff</option></select><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
      </div>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead><tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-600"><th className="px-5 py-3 font-semibold">User</th><th className="px-4 py-3 font-semibold">Role</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Registered</th><th className="px-4 py-3 font-semibold">Last sign in</th><th className="px-4 py-3 font-semibold">Updated</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500"><LoaderCircle className="mx-auto mb-2 animate-spin" size={20} />Loading accounts…</td></tr> : visibleUsers.length === 0 ? <tr><td colSpan={7} className="px-5 py-12 text-center"><UserX className="mx-auto mb-2 text-slate-400" size={24} /><p className="font-medium text-slate-700">No users found</p><p className="mt-1 text-sm text-slate-500">Adjust your search or filters.</p></td></tr> : visibleUsers.map((entry) => {
          const manageable = isSuperAdmin || entry.role === "editor";
          const isSelf = entry.id === actor?.id;
          return <tr key={entry.id} className="hover:bg-slate-50/80"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 shrink-0 overflow-hidden place-items-center rounded-full bg-blue-100 font-semibold text-blue-800">{entry.profileImage ? <img src={entry.profileImage} alt="" className="h-full w-full object-cover" /> : entry.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0"><span className="block truncate font-semibold text-slate-900">{entry.name}{isSelf && <span className="ml-2 text-xs font-normal text-slate-500">You</span>}</span><span className="block truncate text-xs text-slate-600">{entry.email}</span></span></div></td><td className="px-4 py-4"><Badge variant="outline" className={entry.role === "super_admin" ? "border-purple-200 bg-purple-50 text-purple-800" : entry.role === "admin" ? "border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-100 text-slate-700"}>{roleLabel(entry.role)}</Badge></td><td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${entry.isActive ? "text-green-700" : "text-slate-500"}`}><i className={`h-2 w-2 rounded-full ${entry.isActive ? "bg-green-600" : "bg-slate-400"}`} />{entry.isActive ? "Active" : "Inactive"}</span></td><td className="px-4 py-4 text-xs text-slate-600">{dateLabel(entry.createdAt)}</td><td className="px-4 py-4 text-xs text-slate-600">{dateLabel(entry.lastLogin)}</td><td className="px-4 py-4 text-xs text-slate-600">{dateLabel(entry.updatedAt)}</td><td className="px-4 py-4"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon-sm" aria-label={`View ${entry.name}`} onClick={() => setDetails(entry)}><Eye size={16} /></Button>{manageable && <Button variant="ghost" size="icon-sm" aria-label={`Edit ${entry.name}`} onClick={() => startEdit(entry)}><Pencil size={16} /></Button>}{manageable && !isSelf && <Button variant="ghost" size="icon-sm" aria-label={`${entry.isActive ? "Deactivate" : "Activate"} ${entry.name}`} onClick={() => void changeStatus(entry)} className={entry.isActive ? "text-amber-700 hover:bg-amber-50" : "text-green-700 hover:bg-green-50"}>{entry.isActive ? <UserX size={16} /> : <Check size={16} />}</Button>}{isSuperAdmin && !isSelf && <Button variant="ghost" size="icon-sm" aria-label={`Delete ${entry.name}`} onClick={() => void deleteAccount(entry)} className="text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>}</div></td></tr>;
        })}</tbody></table></div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filtered.length)} of {filtered.length}</span><div className="flex items-center gap-2"><Button variant="outline" size="sm" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft size={16} />Previous</Button><span className="px-2 text-xs">{page} / {pageCount}</span><Button variant="outline" size="sm" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight size={16} /></Button></div></div>
    </Card> : <Card className="border border-slate-200 shadow-sm"><CardContent className="p-0"><div className="divide-y divide-slate-100">{events.length === 0 ? <div className="p-12 text-center text-sm text-slate-500">No administrative activity recorded yet.</div> : events.map((event) => <div key={event.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-medium text-slate-800">{event.action.replaceAll(".", " ")}</p><p className="mt-1 text-sm text-slate-600"><span className="font-medium">{event.actorName}</span> ({event.actorEmail}) → {event.targetName} ({event.targetEmail})</p>{event.details?.fields && <p className="mt-1 text-xs text-slate-500">Updated: {event.details.fields.join(", ")}</p>}</div><time className="shrink-0 text-xs text-slate-500">{dateLabel(event.createdAt)}</time></div>)}</div></CardContent></Card>}

    {/* Account editor */}
    {createOpen && <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-slate-950/55 p-3 sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor(); }}><section onKeyDown={containDialogFocus} role="dialog" aria-modal="true" aria-labelledby="user-dialog-title" className="my-6 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"><div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700"><div><h2 id="user-dialog-title" className="text-xl font-semibold text-slate-900 dark:text-white">{editing ? "Edit user" : "Create user"}</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Account details, access level, and sign-in settings.</p></div><button aria-label="Close dialog" onClick={closeEditor} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button></div>
      <form onSubmit={submit} className="space-y-5 p-6">
        {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-500 ring-1 ring-slate-200">{avatarPreview ? <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" /> : <UserRound size={28} />}</div><div className="flex flex-wrap gap-2"><label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"><Camera size={16} />{avatarPreview ? "Replace picture" : "Upload picture"}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => selectAvatar(event.target.files?.[0])} /></label>{editing?.profileImage && !removeAvatar && <Button type="button" variant="outline" size="sm" onClick={() => { setRemoveAvatar(true); setAvatarFile(null); setAvatarPreview(""); }}>Remove picture</Button>}<p className="w-full text-xs text-slate-500">JPG, PNG, or WebP · up to 2 MB</p></div></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Full name<input required minLength={2} maxLength={255} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoFocus className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Email address<input required type="email" maxLength={255} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Role<select disabled={!!editing && editing.id === actor?.id} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as UserForm["role"], permissions: [] })} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 disabled:bg-slate-100">{isSuperAdmin && <option value="super_admin">Super Admin</option>}{isSuperAdmin && <option value="admin">Admin</option>}<option value="editor">Editor / Staff</option></select></label><label className={`flex items-center gap-3 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200 ${editing?.id === actor?.id ? "opacity-70" : ""}`}><input type="checkbox" disabled={editing?.id === actor?.id} checked={form.isActive} onChange={(event) => setForm({ ...form, isActive: event.target.checked })} className="h-4 w-4 accent-blue-600" />Account active</label></div>
        {form.role === "editor" && <fieldset className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><legend className="px-1 text-sm font-semibold text-slate-800 dark:text-slate-100">Module access</legend><p className="mb-3 text-xs text-slate-500">Editor/Staff accounts can access only selected modules.</p><div className="grid gap-2 sm:grid-cols-2">{USER_MODULES.map((module) => <label key={module} className="flex items-center gap-2 text-sm capitalize text-slate-700 dark:text-slate-200"><input type="checkbox" checked={form.permissions.includes(module)} onChange={(event) => setForm({ ...form, permissions: event.target.checked ? [...form.permissions, module] : form.permissions.filter((item) => item !== module) })} className="h-4 w-4 accent-blue-600" />{module}</label>)}</div></fieldset>}
        {(!editing || editing.id !== actor?.id) && <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">{editing ? "Reset password (optional)" : "Password"}<input type="password" required={!editing} minLength={12} autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 12 characters, including a number" className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 placeholder:text-xs focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Confirm password<input type="password" required={!editing || !!form.password} autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label></div>}
        <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700"><Button type="button" variant="outline" onClick={closeEditor}>Cancel</Button><Button type="submit" disabled={saving} className="min-w-32 gap-2">{saving && <LoaderCircle size={16} className="animate-spin" />}{editing ? "Save changes" : "Create account"}</Button></div>
      </form></section></div>}

    {details && <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetails(null); }}><section onKeyDown={containDialogFocus} role="dialog" aria-modal="true" aria-labelledby="user-details-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="flex justify-between"><div><h2 id="user-details-title" className="text-xl font-semibold text-slate-900 dark:text-white">Account details</h2><p className="mt-1 text-sm text-slate-600">Registration and access information</p></div><button aria-label="Close details" autoFocus onClick={() => setDetails(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={18} /></button></div><div className="mt-5 flex items-center gap-4"><span className="grid h-16 w-16 overflow-hidden place-items-center rounded-full bg-blue-100 text-lg font-semibold text-blue-800">{details.profileImage ? <img src={details.profileImage} alt="" className="h-full w-full object-cover" /> : details.name.slice(0, 1).toUpperCase()}</span><div><p className="font-semibold text-slate-900 dark:text-white">{details.name}</p><p className="text-sm text-slate-600">{details.email}</p></div></div><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-slate-500">Role</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{roleLabel(details.role)}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{details.isActive ? "Active" : "Inactive"}</dd></div><div><dt className="text-slate-500">Created</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{dateLabel(details.createdAt)}</dd></div><div><dt className="text-slate-500">Last updated</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{dateLabel(details.updatedAt)}</dd></div><div><dt className="text-slate-500">Last sign in</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{dateLabel(details.lastLogin)}</dd></div><div><dt className="text-slate-500">Modules</dt><dd className="mt-1 font-medium text-slate-800 dark:text-slate-200">{details.role === "editor" ? details.permissions.join(", ") || "None assigned" : "All modules"}</dd></div></dl></section></div>}
  </div>;
}

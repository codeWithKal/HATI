"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdmin } from "@/contexts/AdminContext";
import { Camera, Check, KeyRound, LoaderCircle, Save, ShieldCheck, Trash2, UserRound } from "lucide-react";

export default function AccountSettingsPage() {
  const { user, refresh } = useAdmin();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/account/profile", { cache: "no-store" }).then(async (response) => {
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load profile.");
      setName(data.user.name); setEmail(data.user.email); setProfileImage(data.user.profileImage);
    }).catch((cause) => setError(cause instanceof Error ? cause.message : "Unable to load profile."));
  }, []);

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/account/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to save profile.");
      await refresh(); setNotice("Profile updated successfully.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save profile."); }
    finally { setBusy(false); }
  };

  const uploadAvatar = async (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError("Choose a JPG, PNG, or WebP image smaller than 2 MB."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const form = new FormData(); form.set("avatar", file);
      const response = await fetch("/api/account/avatar", { method: "POST", body: form }); const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to upload image.");
      setProfileImage(data.user.profileImage); await refresh(); setNotice("Profile picture updated successfully.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to upload image."); }
    finally { setBusy(false); }
  };

  const clearAvatar = async () => {
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/account/avatar", { method: "DELETE" }); const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to remove image.");
      setProfileImage(null); await refresh(); setNotice("Profile picture removed successfully.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to remove image."); }
    finally { setBusy(false); }
  };

  const changePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); setBusy(false); return; }
    try {
      const response = await fetch("/api/account/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword, newPassword, confirmPassword }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to change password.");
      await refresh(); setNotice("Password changed successfully. Other active sessions have been signed out."); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to change password."); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><ShieldCheck size={16} className="text-blue-600" />Personal settings</div><h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">My account</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Manage your profile and sign-in security.</p></div>
    {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
    {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"><Check size={16} />{notice}</div>}

    <Card className="border border-slate-200 shadow-sm"><CardContent className="p-5 sm:p-7"><div className="mb-6"><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile details</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Update your name, email, and picture.</p></div>
      <div className="mb-6 flex flex-wrap items-center gap-4"><span className="grid h-20 w-20 overflow-hidden place-items-center rounded-full bg-blue-100 text-blue-800 ring-1 ring-slate-200">{profileImage ? <img src={profileImage} alt={`${name} profile`} className="h-full w-full object-cover" /> : <UserRound size={30} />}</span><div className="flex flex-wrap gap-2"><label className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50 ${busy ? "pointer-events-none opacity-50" : ""}`}><Camera size={16} />{profileImage ? "Replace picture" : "Upload picture"}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={(event) => void uploadAvatar(event.target.files?.[0])} /></label>{profileImage && <Button variant="outline" size="sm" disabled={busy} onClick={() => void clearAvatar()}><Trash2 size={15} />Remove picture</Button>}<p className="w-full text-xs text-slate-500">JPG, PNG, or WebP · up to 2 MB</p></div></div>
      <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Full name<input required minLength={2} maxLength={255} value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Email address<input required type="email" maxLength={255} value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><div className="sm:col-span-2"><Button disabled={busy} className="gap-2"><Save size={16} />Save profile</Button></div></form>
    </CardContent></Card>

    <Card className="border border-slate-200 shadow-sm"><CardContent className="p-5 sm:p-7"><div className="mb-6 flex items-start gap-3"><span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><KeyRound size={19} /></span><div><h2 className="text-lg font-semibold text-slate-900 dark:text-white">Change password</h2><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Use at least 12 characters and include a number.</p></div></div><form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200 sm:col-span-2">Current password<input required type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">New password<input required minLength={12} type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">Confirm new password<input required minLength={12} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20" /></label><div className="sm:col-span-2"><Button disabled={busy} className="gap-2"><KeyRound size={16} />Update password</Button></div></form></CardContent></Card>
  </div>;
}

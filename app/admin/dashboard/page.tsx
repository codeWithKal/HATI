"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAdmin } from "@/contexts/AdminContext";
import { Activity, ArrowRight, BriefcaseBusiness, Building2, Clock3, DollarSign, Image, LoaderCircle, Mail, Newspaper, Package, ShieldCheck, Truck, Users, Wrench } from "lucide-react";

const modules = [
  { key: "products", title: "Products", href: "/admin/products", icon: Package, endpoint: "/api/products", color: "blue" },
  { key: "inventory", title: "Inventory", href: "/admin/inventory", icon: Truck, endpoint: "/api/inventory", color: "amber" },
  { key: "services", title: "Services", href: "/admin/services", icon: Wrench, endpoint: "/api/services", color: "emerald" },
  { key: "projects", title: "Projects", href: "/admin/projects", icon: Building2, endpoint: "/api/projects", property: "projects", color: "violet" },
  { key: "news", title: "News", href: "/admin/news", icon: Newspaper, endpoint: "/api/news", color: "orange" },
  { key: "tenders", title: "Tenders", href: "/admin/tenders", icon: DollarSign, endpoint: "/api/tenders", property: "tenders", color: "green" },
  { key: "staff", title: "Staff", href: "/admin/staff", icon: Users, endpoint: "/api/staff", property: "staff", color: "pink" },
  { key: "careers", title: "Careers", href: "/admin/careers", icon: BriefcaseBusiness, endpoint: "/api/careers", property: "careers", color: "indigo" },
  { key: "gallery", title: "Gallery", href: "/admin/gallery", icon: Image, endpoint: "/api/gallery", property: "gallery", color: "rose" },
  { key: "contacts", title: "Contacts", href: "/admin/contacts", icon: Mail, endpoint: "/api/contacts", property: "contacts", color: "cyan" },
];
const dateLabel = (value: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export default function AdminDashboard() {
  const { user } = useAdmin();
  const canManageUsers = user && ["super_admin", "admin"].includes(user.role);
  const visibleModules = useMemo(() => user?.role === "editor" ? modules.filter((item) => user.permissions.includes(item.key)) : modules, [user]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userCount, setUserCount] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let active = true;
    setLoading(true);
    const load = async () => {
      const responses = await Promise.all(visibleModules.map(async (item) => {
        try {
          const response = await fetch(item.endpoint, { cache: "no-store" });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || `Unable to load ${item.title.toLowerCase()}.`);
          const entries = item.property ? data[item.property] : data;
          return [item.key, Array.isArray(entries) ? entries.length : 0] as const;
        } catch { return [item.key, 0] as const; }
      }));
      const activityRequest = fetch(canManageUsers ? "/api/admin/audit" : "/api/account/activity", { cache: "no-store" }).then(async (response) => response.ok ? (await response.json()).events || [] : []);
      const usersRequest = canManageUsers ? fetch("/api/admin/users", { cache: "no-store" }).then(async (response) => response.ok ? (await response.json()).users?.length ?? null : null) : Promise.resolve(null);
      const [activity, accounts] = await Promise.all([activityRequest, usersRequest]);
      if (!active) return;
      setCounts(Object.fromEntries(responses)); setEvents(activity); setUserCount(accounts); setLoading(false);
    };
    void load().catch(() => { if (active) { setError("Some dashboard data could not be loaded."); setLoading(false); } });
    return () => { active = false; };
  }, [canManageUsers, user, visibleModules]);

  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-sm text-slate-500"><Activity size={16} className="text-blue-600" />Workspace overview</div><h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Welcome, {user?.name?.split(" ")[0]}</h1><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Here’s a current overview of the areas you can manage.</p></div><Badge variant="outline" className="w-fit gap-2 border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-800"><ShieldCheck size={15} />{user?.role?.replaceAll("_", " ")}</Badge></div>
    {error && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {visibleModules.slice(0, 4).map((item) => { const Icon = item.icon; return <Card key={item.key} className="border border-slate-200 shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm font-medium text-slate-600">{item.title}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{loading ? <span className="inline-block h-8 w-10 animate-pulse rounded bg-slate-200" /> : counts[item.key] ?? 0}</p><Link href={item.href} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">Open module<ArrowRight size={13} /></Link></div><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><Icon size={21} /></span></CardContent></Card>; })}
      {canManageUsers && <Card className="border border-slate-200 shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm font-medium text-slate-600">User accounts</p><p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{loading ? "…" : userCount ?? 0}</p><Link href="/admin/users" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900">Manage access<ArrowRight size={13} /></Link></div><span className="rounded-xl bg-violet-50 p-3 text-violet-800"><Users size={21} /></span></CardContent></Card>}
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
      <Card className="border border-slate-200 shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Your modules</h2><p className="mt-1 text-xs text-slate-600">Current database counts and shortcuts</p></div><span className="text-xs text-slate-500">{visibleModules.length} available</span></div><CardContent className="grid gap-3 p-4 sm:grid-cols-2">{visibleModules.map((item) => { const Icon = item.icon; return <Link key={item.key} href={item.href} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"><span className="rounded-lg bg-slate-100 p-2.5 text-slate-700"><Icon size={18} /></span><span className="min-w-0 flex-1"><span className="block font-semibold text-slate-800 dark:text-slate-100">{item.title}</span><span className="text-xs text-slate-500">{loading ? "Loading…" : `${counts[item.key] ?? 0} records`}</span></span><ArrowRight size={16} className="text-slate-400" /></Link>; })}{visibleModules.length === 0 && <div className="col-span-full rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-600">No modules are assigned yet. Ask an administrator to grant access.</div>}</CardContent></Card>

      <Card className="border border-slate-200 shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="font-semibold text-slate-900 dark:text-slate-100">Recent account activity</h2><p className="mt-1 text-xs text-slate-600">Administrative changes recorded in the audit log</p></div><Clock3 size={17} className="text-slate-500" /></div><CardContent className="p-0"><div className="divide-y divide-slate-100">{loading ? <div className="grid min-h-36 place-items-center text-slate-500"><LoaderCircle className="animate-spin" size={20} /></div> : events.length === 0 ? <div className="p-7 text-center text-sm text-slate-500">No user management activity has been recorded yet.</div> : events.slice(0, 8).map((event) => <div key={event.id} className="px-5 py-3.5"><p className="text-sm font-medium capitalize text-slate-800 dark:text-slate-100">{String(event.action).replaceAll(".", " ")}</p><p className="mt-1 text-xs text-slate-600">{canManageUsers ? `${event.actorName} · ${event.targetName}` : `Account: ${event.targetName}`}</p><time className="mt-1 block text-xs text-slate-500">{dateLabel(event.createdAt)}</time></div>)}</div>{canManageUsers && <div className="border-t border-slate-200 p-3"><Link href="/admin/users" className="flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">View user activity<ArrowRight size={15} /></Link></div>}</CardContent></Card>
    </div>

    <Card className="border border-blue-200 bg-blue-50/70 shadow-none"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-900">Need to update your profile?</h2><p className="mt-1 text-sm text-slate-600">Change your contact details, profile picture, or password in account settings.</p></div><Button asChild className="gap-2 self-start bg-blue-700 text-white hover:bg-blue-800"><Link href="/admin/account">Account settings<ArrowRight size={15} /></Link></Button></CardContent></Card>
  </div>;
}

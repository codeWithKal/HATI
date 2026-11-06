"use client";

import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase, BriefcaseBusiness, ChevronDown, ChevronLeft, ChevronRight, DollarSign,
  ClipboardList, Image, LayoutDashboard, LogOut, Mail, Menu, Moon, Monitor, Newspaper, Package,
  Settings2, ShieldCheck, Sun, Truck, UserCog, Users, Wrench,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const contentGroups = [
  { title: "Workspace", items: [
    { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  ] },
  { title: "Content", items: [
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/inventory", label: "Inventory", icon: Truck },
    { href: "/admin/services", label: "Services", icon: Wrench },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/news", label: "News", icon: Newspaper },
    { href: "/admin/tenders", label: "Tenders", icon: DollarSign },
  ] },
  { title: "Organization", items: [
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/careers", label: "Careers", icon: BriefcaseBusiness },
    { href: "/admin/job-applications", label: "Job Applications", icon: ClipboardList },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
    { href: "/admin/contacts", label: "Contacts", icon: Mail },
  ] },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const resize = () => { const isSmall = window.innerWidth < 768; setMobile(isSmall); if (!isSmall) setMobileOpen(false); };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") router.replace("/admin/login");
  }, [isAuthenticated, isLoading, pathname, router]);

  const canManageUsers = user && ["super_admin", "admin"].includes(user.role);
  const moduleForHref = (href: string) => href.split("/").pop()?.replaceAll("-", "_") || "";
  const groups = useMemo(() => {
    const visibleContent = user?.role === "editor"
      ? contentGroups.map((group) => ({ ...group, items: group.items.filter((item) => user.permissions.includes(moduleForHref(item.href))) })).filter((group) => group.items.length)
      : contentGroups;
    return [
    ...visibleContent,
    { title: "Account", items: [
      ...(canManageUsers ? [{ href: "/admin/users", label: "User Management", icon: UserCog }] : []),
      { href: "/admin/account", label: "My Account", icon: Settings2 },
    ] },
  ];
  }, [canManageUsers, user]);

  const activeItem = groups.flatMap((group) => group.items).find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const isLogin = pathname === "/admin/login";
  const routePermissions: Record<string, string> = {
    products: "products", inventory: "inventory", services: "services", projects: "projects",
    news: "news", tenders: "tenders", staff: "staff", careers: "careers", gallery: "gallery", contacts: "contacts", "job-applications": "job_applications",
  };
  const pathParts = pathname.split("/").filter(Boolean);
  const requestedModule = pathParts[0] === "admin" ? routePermissions[pathParts[1]] : undefined;
  const editorHasPageAccess = user?.role !== "editor" || pathname === "/admin/account" || Boolean(requestedModule && user.permissions.includes(requestedModule));
  const fallbackHref = user?.role === "editor"
    ? contentGroups.flatMap((group) => group.items).find((item) => user.permissions.includes(moduleForHref(item.href)))?.href || "/admin/account"
    : "/admin/dashboard";

  useEffect(() => {
    if (!isLoading && isAuthenticated && !editorHasPageAccess) router.replace(fallbackHref);
  }, [editorHasPageAccess, fallbackHref, isAuthenticated, isLoading, router]);
  if (isLogin) return <div className="admin-shell min-h-screen">{children}</div>;
  if (isLoading) return <div className="admin-shell min-h-screen grid place-items-center" aria-busy="true"><span className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" /></div>;
  if (!isAuthenticated) return null;
  if (!editorHasPageAccess) return <div className="admin-shell min-h-screen grid place-items-center text-sm text-slate-600">Redirecting to an assigned module…</div>;

  const closeMobile = () => { if (mobile) setMobileOpen(false); };
  const avatar = user?.profileImage;

  return (
    <div className="admin-shell relative flex min-h-screen">
      {mobile && mobileOpen && <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/60" />}
      <aside className={`${mobile ? `fixed inset-y-0 left-0 z-50 w-72 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}` : `fixed inset-y-0 left-0 z-40 ${expanded ? "w-64" : "w-[76px]"}`} flex shrink-0 flex-col border-r border-[#30445f] bg-[#14243A] text-slate-100 transition-all duration-200`}>
        <div className="flex h-[72px] items-center justify-between border-b border-[#30445f] px-4">
          <Link href="/admin/dashboard" onClick={closeMobile} className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-white"><img src="/hati-logo.png" alt="HATI logo" className="h-full w-full object-contain" /></span>
            {(expanded || mobile) && <span className="min-w-0"><span className="block truncate text-sm font-semibold text-white">HATI Administration</span><span className="block text-xs text-slate-300">Management workspace</span></span>}
          </Link>
          {!mobile && <button onClick={() => setExpanded((value) => !value)} aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"} className="rounded-lg p-2 text-slate-300 hover:bg-[#223a58] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">{expanded ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}</button>}
          {mobile && <button onClick={() => setMobileOpen(false)} aria-label="Close navigation" className="rounded-lg p-2 text-slate-300 hover:bg-[#223a58]"><ChevronLeft size={18} /></button>}
        </div>

        <nav aria-label="Administration" className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {groups.map((group) => <section key={group.title}>
            {(expanded || mobile) && <h2 className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{group.title}</h2>}
            <div className="space-y-1">{group.items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return <Link key={href} href={href} onClick={closeMobile} aria-current={active ? "page" : undefined} title={!expanded && !mobile ? label : undefined} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 ${active ? "bg-[#2563EB] text-white" : "text-slate-200 hover:bg-[#223a58] hover:text-white"} ${!expanded && !mobile ? "justify-center" : ""}`}>
                <Icon size={18} aria-hidden="true" />{(expanded || mobile) && <span>{label}</span>}
              </Link>;
            })}</div>
          </section>)}
        </nav>

        <div className="border-t border-[#30445f] p-3">
          <Link href="/admin/account" onClick={closeMobile} className={`mb-3 flex items-center gap-3 rounded-xl bg-[#1b304b] p-3 hover:bg-[#223a58] ${!expanded && !mobile ? "justify-center" : ""}`}>
            <span className="grid h-9 w-9 shrink-0 overflow-hidden place-items-center rounded-full bg-[#2563EB] text-sm font-semibold text-white">{avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}</span>
            {(expanded || mobile) && <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-white">{user?.name}</span><span className="block truncate text-xs capitalize text-slate-300">{user?.role?.replaceAll("_", " ")}</span></span>}
          </Link>
          <div className="flex gap-2">
            {mounted && <DropdownMenu><DropdownMenuTrigger render={<Button variant="outline" size="sm" aria-label="Choose color theme" className="flex-1 border-[#40536c] bg-transparent text-slate-100 hover:bg-[#223a58] hover:text-white">{theme === "dark" ? <Moon /> : theme === "light" ? <Sun /> : <Monitor />} {(expanded || mobile) && <><span className="ml-2">Appearance</span><ChevronDown className="ml-auto" /></>}</Button>} /><DropdownMenuContent align="start">{[{ value: "light", title: "Light", icon: Sun }, { value: "dark", title: "Dark", icon: Moon }, { value: "system", title: "System", icon: Monitor }].map((entry) => <DropdownMenuItem key={entry.value} onClick={() => setTheme(entry.value as "light" | "dark" | "system")}><entry.icon className="mr-2 h-4 w-4" />{entry.title}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
            <Button variant="outline" size="icon" aria-label="Sign out" className="border-[#40536c] bg-transparent text-slate-100 hover:bg-red-900/50 hover:text-white" onClick={async () => { await logout(); router.replace("/admin/login"); }}><LogOut size={16} /></Button>
          </div>
        </div>
      </aside>

      <div className={`flex min-w-0 flex-1 flex-col ${mobile ? "ml-0" : expanded ? "ml-64" : "ml-[76px]"}`}>
        <header className="sticky top-0 z-30 flex min-h-[72px] items-center justify-between border-b border-border bg-card px-4 shadow-sm md:px-7">
          <div className="flex items-center gap-3">
            {mobile && <Button variant="outline" size="icon" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={18} /></Button>}
            <div><h1 className="text-lg font-semibold text-foreground">{activeItem?.label || "Administration"}</h1><p aria-label="Breadcrumb" className="mt-0.5 text-xs text-muted-foreground">HATI <span className="px-1">/</span>{pathname.split("/").filter(Boolean).join(" / ")}</p></div>
          </div>
          <div className="flex items-center gap-3">
            {canManageUsers && <Link href="/admin/users" aria-label="User management" className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:inline-flex"><ShieldCheck size={18} /></Link>}
            <Link href="/admin/account" className="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="grid h-9 w-9 overflow-hidden place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}</span>
              <span className="hidden text-left sm:block"><span className="block max-w-40 truncate text-sm font-medium text-slate-800 dark:text-slate-100">{user?.name}</span><span className="block text-xs capitalize text-slate-500 dark:text-slate-300">{user?.role?.replaceAll("_", " ")}</span></span>
            </Link>
          </div>
        </header>
        <main className="bg-background"><div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</div></main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminProvider><AdminLayoutContent>{children}</AdminLayoutContent></AdminProvider>;
}

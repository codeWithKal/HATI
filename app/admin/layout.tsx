"use client";

import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminFooter } from "@/components/admin/AdminFooter";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  Menu,
  LayoutDashboard,
  Package,
  Wrench,
  Briefcase,
  Newspaper,
  DollarSign,
  Users,
  BriefcaseBusiness,
  Image,
  Mail,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Truck,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [mounted, setMounted] = useState(false);

  // After mounting, we can safely show the theme toggle
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (pathname === "/admin/login" || isLoading) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Main navigation items
  const mainMenuItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/services", label: "Services", icon: Wrench },
    { href: "/admin/projects", label: "Projects", icon: Briefcase },
    { href: "/admin/news", label: "News", icon: Newspaper },
    { href: "/admin/inventory", label: "Inventory", icon: Truck },
  ];

  const managementMenuItems = [
    { href: "/admin/tenders", label: "Tenders", icon: DollarSign },
    { href: "/admin/staff", label: "Staff", icon: Users },
    { href: "/admin/careers", label: "Careers", icon: BriefcaseBusiness },
    { href: "/admin/gallery", label: "Gallery", icon: Image },
    { href: "/admin/contacts", label: "Contacts", icon: Mail },
  ];

  const menuGroups = [
    { title: "Main", items: mainMenuItems },
    { title: "Management", items: managementMenuItems },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Theme options for dropdown
  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  // Get current theme label and icon
  const currentTheme =
    themeOptions.find((t) => t.value === theme) || themeOptions[0];
  const CurrentIcon = currentTheme.icon;

  // Get resolved theme display
  const getResolvedThemeDisplay = () => {
    if (theme === "system") {
      return resolvedTheme === "dark" ? "🌙 Dark" : "☀️ Light";
    }
    return resolvedTheme === "dark" ? "🌙 Dark" : "☀️ Light";
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-[72px]"
        } border-r bg-card/95 backdrop-blur-sm shadow-lg flex flex-col fixed md:relative z-50 h-full transition-all duration-300 ${
          isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                H
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="font-bold text-lg leading-none">HATI Admin</h1>
                  <p className="text-[10px] text-muted-foreground">
                    Content Management
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 hover:bg-accent rounded-lg transition-colors"
              title={sidebarOpen ? "Collapse" : "Expand"}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {sidebarOpen && (
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "hover:bg-accent text-foreground hover:translate-x-1"
                    } ${!sidebarOpen && "justify-center"}`}
                    title={!sidebarOpen ? item.label : ""}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? "text-primary-foreground" : ""} flex-shrink-0`}
                    />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                    {active && sidebarOpen && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t space-y-2">
          {sidebarOpen && (
            <div className="px-3 py-2 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "admin@hati.com"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            {/* Theme Dropdown */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`${sidebarOpen ? "flex-1" : "w-full"} gap-2`}
                  >
                    <CurrentIcon className="h-4 w-4" />
                    {sidebarOpen && (
                      <span className="text-xs flex-1 text-left">
                        {currentTheme.label}
                      </span>
                    )}
                    {sidebarOpen && (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActiveTheme = theme === option.value;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() =>
                          setTheme(option.value as "light" | "dark" | "system")
                        }
                        className={`cursor-pointer gap-2 ${
                          isActiveTheme ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                        {isActiveTheme && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  {theme === "system" && (
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t mt-1 pt-1.5">
                      System: {getResolvedThemeDisplay()}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              variant="outline"
              size="sm"
              className={`${sidebarOpen ? "flex-1" : "w-full"} gap-2 text-destructive hover:text-destructive hover:bg-destructive/10`}
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span className="text-xs">Logout</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b bg-card/95 backdrop-blur-sm px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h2 className="text-lg font-semibold">
                {menuGroups
                  .flatMap((g) => g.items)
                  .find((item) => isActive(item.href))?.label || "Dashboard"}
              </h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {pathname?.split("/").filter(Boolean).join(" › ") || "Overview"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Theme Dropdown (Top Bar) */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 min-w-[80px] bg-transparent hover:bg-accent/50"
                  >
                    <CurrentIcon className="h-4 w-4" />
                    <span className="text-xs">{currentTheme.label}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isActiveTheme = theme === option.value;
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() =>
                          setTheme(option.value as "light" | "dark" | "system")
                        }
                        className={`cursor-pointer gap-2 ${
                          isActiveTheme ? "bg-primary/10 text-primary" : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{option.label}</span>
                        {isActiveTheme && (
                          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  {theme === "system" && (
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t mt-1 pt-1.5">
                      System: {getResolvedThemeDisplay()}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Resolved Theme Indicator */}
            {mounted && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className={`h-2 w-2 rounded-full ${resolvedTheme === "dark" ? "bg-blue-500" : "bg-amber-500"}`}
                />
                {resolvedTheme === "dark" ? "Dark" : "Light"}
              </div>
            )}

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setNotifications(0)}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center animate-pulse">
                  {notifications}
                </span>
              )}
            </Button>

            {/* User Avatar (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-secondary/5">
          <div className="container mx-auto p-4 md:p-6 max-w-7xl">
            {children}
          </div>
        </main>

        {/* Admin Footer */}
        {/* <AdminFooter /> */}
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}

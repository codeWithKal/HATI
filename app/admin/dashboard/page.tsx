"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package,
  Wrench,
  Briefcase,
  FileText,
  Clock,
  AlertCircle,
  Users,
  Building2,
  Newspaper,
  Image,
  DollarSign,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  BarChart3,
  Activity,
  PieChart,
  Shield,
  Bell,
  UserPlus,
  FolderOpen,
  LayoutDashboard,
  Menu,
  ChevronRight,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  BriefcaseBusiness,
  UserRound,
  Mail,
  MapPin,
  Phone,
  Warehouse,
} from "lucide-react";
import { useState, useEffect } from "react";
import productsData from "@/data/products.json";
import servicesData from "@/data/services.json";
import projectsData from "@/data/projects.json";
import newsData from "@/data/news.json";
import staffData from "@/data/staff.json";
import tendersData from "@/data/tenders.json";
import careersData from "@/data/careers.json";
import galleryData from "@/data/gallery.json";
import contactInfoData from "@/data/contactInfo.json";
import inventoryData from "@/data/inventory.json";

export default function AdminDashboard() {
  const { user } = useAdmin();
  const [activeTab, setActiveTab] = useState("overview");
  const [counts, setCounts] = useState({
    products: 0,
    services: 0,
    projects: 0,
    news: 0,
    staff: 0,
    tenders: 0,
    careers: 0,
    gallery: 0,
    contacts: 0,
    inventory: 0,
  });

  useEffect(() => {
    // Load counts from data files
    const loadCounts = () => {
      try {
        let products = productsData;
        let services = servicesData;
        let projects = projectsData;
        let news = newsData;
        let staff = staffData;
        let tenders = tendersData;
        let careers = careersData;
        let gallery = galleryData;
        let contacts = contactInfoData;
        let inventory = inventoryData;

        // Handle array/object formats
        if (
          products &&
          typeof products === "object" &&
          !Array.isArray(products)
        ) {
          products = (products as any).products || [];
        }
        if (
          services &&
          typeof services === "object" &&
          !Array.isArray(services)
        ) {
          services = (services as any).services || [];
        }
        if (
          projects &&
          typeof projects === "object" &&
          !Array.isArray(projects)
        ) {
          projects = (projects as any).projects || [];
        }
        if (news && typeof news === "object" && !Array.isArray(news)) {
          news = (news as any).news || [];
        }
        if (
          inventory &&
          typeof inventory === "object" &&
          !Array.isArray(inventory)
        ) {
          inventory = (inventory as any).inventory || [];
        }

        setCounts({
          products: Array.isArray(products) ? products.length : 0,
          services: Array.isArray(services) ? services.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          news: Array.isArray(news) ? news.length : 0,
          staff: Array.isArray(staff) ? staff.length : 0,
          tenders: Array.isArray(tenders) ? tenders.length : 0,
          careers: Array.isArray(careers) ? careers.length : 0,
          gallery: Array.isArray(gallery) ? gallery.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          inventory: Array.isArray(inventory) ? inventory.length : 0,
        });
      } catch (error) {
        console.error("Error loading counts:", error);
      }
    };

    loadCounts();
  }, []);

  // Enhanced stats with more detail
  const stats = [
    {
      icon: Package,
      label: "Products",
      value: counts.products.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      change: "+2",
      changeType: "increase",
      href: "/admin/products",
    },
    {
      icon: Wrench,
      label: "Services",
      value: counts.services.toString(),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      change: "+1",
      changeType: "increase",
      href: "/admin/services",
    },
    {
      icon: Briefcase,
      label: "Projects",
      value: counts.projects.toString(),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      change: "0",
      changeType: "neutral",
      href: "/admin/projects",
    },
    {
      icon: FileText,
      label: "News Articles",
      value: counts.news.toString(),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      change: "+3",
      changeType: "increase",
      href: "/admin/news",
    },
    {
      icon: Users,
      label: "Staff Members",
      value: counts.staff.toString(),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      change: "0",
      changeType: "neutral",
      href: "/admin/staff",
    },
    {
      icon: DollarSign,
      label: "Tenders",
      value: counts.tenders.toString(),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      change: "+1",
      changeType: "increase",
      href: "/admin/tenders",
    },
    {
      icon: BriefcaseBusiness,
      label: "Careers",
      value: counts.careers.toString(),
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      change: "0",
      changeType: "neutral",
      href: "/admin/careers",
    },
    {
      icon: Image,
      label: "Gallery",
      value: counts.gallery.toString(),
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      change: "+4",
      changeType: "increase",
      href: "/admin/gallery",
    },
    {
      icon: Mail,
      label: "Contacts",
      value: counts.contacts.toString(),
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      change: "+1",
      changeType: "increase",
      href: "/admin/contacts",
    },
    {
      icon: Warehouse,
      label: "Inventory",
      value: counts.inventory.toString(),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      change: "+0",
      changeType: "neutral",
      href: "/admin/inventory",
    },
  ];

  // Recent activities with more detail
  const recentActivities = [
    {
      id: 1,
      action: "Updated Project: Office Building",
      time: "2 hours ago",
      type: "update",
      user: "John Doe",
      status: "success",
    },
    {
      id: 2,
      action: "Added new Service: Consultation",
      time: "5 hours ago",
      type: "create",
      user: "Sarah Smith",
      status: "success",
    },
    {
      id: 3,
      action: "Published News Article: Sustainability Initiative",
      time: "1 day ago",
      type: "create",
      user: "Mike Johnson",
      status: "success",
    },
    {
      id: 4,
      action: "Updated Tender Status: Hospital Construction",
      time: "2 days ago",
      type: "update",
      user: "Emily Davis",
      status: "warning",
    },
    {
      id: 5,
      action: "New Staff Member Added: Lisa Anderson",
      time: "3 days ago",
      type: "create",
      user: "David Wilson",
      status: "success",
    },
    {
      id: 6,
      action: "New Career Position Posted: Senior Engineer",
      time: "4 days ago",
      type: "create",
      user: "HR Team",
      status: "success",
    },
    {
      id: 7,
      action: "Inventory Updated: Fino Sand",
      time: "5 days ago",
      type: "update",
      user: "Warehouse Team",
      status: "success",
    },
  ];

  // Quick action menus
  const quickActions = [
    {
      icon: Plus,
      label: "Add Product",
      href: "/admin/products/add",
      color: "text-blue-500",
    },
    {
      icon: Plus,
      label: "Add Service",
      href: "/admin/services/add",
      color: "text-green-500",
    },
    {
      icon: Plus,
      label: "Add Project",
      href: "/admin/projects/add",
      color: "text-purple-500",
    },
    {
      icon: Plus,
      label: "Post News",
      href: "/admin/news/add",
      color: "text-orange-500",
    },
    {
      icon: UserPlus,
      label: "Add Staff",
      href: "/admin/staff/add",
      color: "text-pink-500",
    },
    {
      icon: Plus,
      label: "Create Tender",
      href: "/admin/tenders/add",
      color: "text-emerald-500",
    },
    {
      icon: Plus,
      label: "Add Career",
      href: "/admin/careers/add",
      color: "text-indigo-500",
    },
    {
      icon: Plus,
      label: "Add Gallery",
      href: "/admin/gallery/add",
      color: "text-rose-500",
    },
    {
      icon: Plus,
      label: "Add Inventory",
      href: "/admin/inventory/add",
      color: "text-amber-500",
    },
  ];

  // Content management sections
  const contentSections = [
    {
      title: "Products",
      icon: Package,
      count: counts.products.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/admin/products",
      items: [
        { label: "All Products", href: "/admin/products" },
        { label: "Add New", href: "/admin/products/add" },
        { label: "Categories", href: "/admin/products/categories" },
      ],
    },
    {
      title: "Services",
      icon: Wrench,
      count: counts.services.toString(),
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/admin/services",
      items: [
        { label: "All Services", href: "/admin/services" },
        { label: "Add New", href: "/admin/services/add" },
      ],
    },
    {
      title: "Projects",
      icon: Building2,
      count: counts.projects.toString(),
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/admin/projects",
      items: [
        { label: "All Projects", href: "/admin/projects" },
        { label: "Add New", href: "/admin/projects/add" },
        { label: "Gallery", href: "/admin/projects/gallery" },
      ],
    },
    {
      title: "News",
      icon: Newspaper,
      count: counts.news.toString(),
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      href: "/admin/news",
      items: [
        { label: "All Articles", href: "/admin/news" },
        { label: "Add New", href: "/admin/news/add" },
        { label: "Categories", href: "/admin/news/categories" },
      ],
    },
    {
      title: "Staff",
      icon: Users,
      count: counts.staff.toString(),
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
      href: "/admin/staff",
      items: [
        { label: "All Staff", href: "/admin/staff" },
        { label: "Add New", href: "/admin/staff/add" },
        { label: "Departments", href: "/admin/staff/departments" },
      ],
    },
    {
      title: "Tenders",
      icon: DollarSign,
      count: counts.tenders.toString(),
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      href: "/admin/tenders",
      items: [
        { label: "All Tenders", href: "/admin/tenders" },
        { label: "Add New", href: "/admin/tenders/add" },
        { label: "Settings", href: "/admin/tenders/settings" },
      ],
    },
    {
      title: "Careers",
      icon: BriefcaseBusiness,
      count: counts.careers.toString(),
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      href: "/admin/careers",
      items: [
        { label: "All Positions", href: "/admin/careers" },
        { label: "Add New", href: "/admin/careers/add" },
        { label: "Benefits", href: "/admin/careers/benefits" },
      ],
    },
    {
      title: "Gallery",
      icon: Image,
      count: counts.gallery.toString(),
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      href: "/admin/gallery",
      items: [
        { label: "All Images", href: "/admin/gallery" },
        { label: "Add New", href: "/admin/gallery/add" },
        { label: "Categories", href: "/admin/gallery/categories" },
      ],
    },
    {
      title: "Contacts",
      icon: Mail,
      count: counts.contacts.toString(),
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      href: "/admin/contacts",
      items: [
        { label: "All Contacts", href: "/admin/contacts" },
        { label: "Add New", href: "/admin/contacts/add" },
        { label: "Inquiries", href: "/admin/contacts/inquiries" },
      ],
    },
    {
      title: "Inventory",
      icon: Warehouse,
      count: counts.inventory.toString(),
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      href: "/admin/inventory",
      items: [
        { label: "All Inventory", href: "/admin/inventory" },
        { label: "Add New", href: "/admin/inventory/add" },
        { label: "Categories", href: "/admin/inventory/categories" },
      ],
    },
  ];

  // Pending tasks/approvals
  const pendingTasks = [
    {
      id: 1,
      title: "Review Project: Nairobi Tech Hub",
      priority: "High",
      deadline: "2024-02-01",
      department: "Operations",
    },
    {
      id: 2,
      title: "Approve Staff Request: Senior Engineer",
      priority: "Medium",
      deadline: "2024-02-05",
      department: "HR",
    },
    {
      id: 3,
      title: "Review Tender Submission",
      priority: "High",
      deadline: "2024-01-28",
      department: "Procurement",
    },
    {
      id: 4,
      title: "Review Career Applications",
      priority: "Medium",
      deadline: "2024-02-10",
      department: "HR",
    },
    {
      id: 5,
      title: "Inventory Restock: Fino Sand",
      priority: "Low",
      deadline: "2024-02-15",
      department: "Warehouse",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || "Admin"} 👋 Here's what's happening
            with HATI today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <Badge
                        variant={
                          stat.changeType === "increase"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {stat.changeType === "increase" ? "↑" : "→"}{" "}
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}
                  >
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Activity & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 hover:bg-primary/5 hover:border-primary/30"
                    >
                      <Icon className={`h-4 w-4 ${action.color}`} />
                      <span className="text-xs">{action.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Filter className="h-3 w-3" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded ${
                        activity.type === "create"
                          ? "bg-green-500/10"
                          : "bg-blue-500/10"
                      }`}
                    >
                      {activity.type === "create" ? (
                        <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.action}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {activity.user}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      activity.status === "success" ? "default" : "secondary"
                    }
                  >
                    {activity.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - System Status & Pending Tasks */}
        <div className="space-y-6">
          {/* System Status */}
          <Card className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Online
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Connected
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="text-xs text-yellow-600 dark:text-yellow-400">
                    78% used
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    2 hours ago
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card className="p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Pending Tasks
              <Badge className="ml-auto">{pendingTasks.length}</Badge>
            </h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border bg-secondary/5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{task.department}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.deadline}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        task.priority === "High" ? "destructive" : "default"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Admin Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                Use the sidebar to manage all content sections
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                Changes are auto-saved as you work
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                Preview changes before publishing
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Content Management Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Content Management</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {contentSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${section.bgColor}`}>
                    <Icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <Badge variant="outline">{section.count}</Badge>
                </div>
                <h3 className="font-semibold mb-2">{section.title}</h3>
                <div className="space-y-1">
                  {section.items.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group-hover:translate-x-1 duration-200"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <Link href={section.href}>
                  <Button variant="ghost" className="w-full mt-3 text-xs gap-1">
                    Manage {section.title}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

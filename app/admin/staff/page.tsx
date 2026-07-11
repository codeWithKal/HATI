"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  X,
  Save,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Star,
  Shield,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import staffData from "@/data/staff.json";
import staffStatsData from "@/data/staffStats.json";

export default function AdminStaff() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: { en: "", am: "", om: "" },
    position: { en: "", am: "", om: "" },
    department: { en: "", am: "", om: "" },
    bio: { en: "", am: "", om: "" },
    experience: "",
    avatar: "👤",
    email: "",
    isActive: true,
  });

  useEffect(() => {
    loadStaffData();
  }, []);

  const loadStaffData = () => {
    setLoading(true);
    try {
      // Load staff
      let items = staffData;
      if (
        staffData &&
        typeof staffData === "object" &&
        !Array.isArray(staffData)
      ) {
        items = (staffData as any).staff || [];
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      setStaffList(items);

      // Load stats
      let statsData = staffStatsData;
      if (
        staffStatsData &&
        typeof staffStatsData === "object" &&
        !Array.isArray(staffStatsData)
      ) {
        statsData = (staffStatsData as any).stats || [];
      }
      if (!Array.isArray(statsData)) {
        statsData = [];
      }
      setStats(statsData);
    } catch (error) {
      console.error("Error loading staff:", error);
      setStaffList([]);
      setStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments
  const departments = [
    "all",
    ...new Set(staffList.map((s) => s.department?.en).filter(Boolean)),
  ];

  // Filter items
  const filteredItems = staffList.filter((item) => {
    const matchesSearch =
      item.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || item.department?.en === filterDepartment;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && item.isActive !== false) ||
      (filterStatus === "inactive" && item.isActive === false);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentItems.map((s) => s.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: { en: "", am: "", om: "" },
      position: { en: "", am: "", om: "" },
      department: { en: "", am: "", om: "" },
      bio: { en: "", am: "", om: "" },
      experience: "",
      avatar: "👤",
      email: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || { en: "", am: "", om: "" },
      position: item.position || { en: "", am: "", om: "" },
      department: item.department || { en: "", am: "", om: "" },
      bio: item.bio || { en: "", am: "", om: "" },
      experience: item.experience || "",
      avatar: item.avatar || "👤",
      email: item.email || "",
      isActive: item.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      setStaffList(staffList.filter((s) => s.id !== id));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedItems.length} staff members?`,
      )
    ) {
      setStaffList(staffList.filter((s) => !selectedItems.includes(s.id)));
      setSelectedItems([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleStatus = (id: string) => {
    setStaffList(
      staffList.map((s) =>
        s.id === id
          ? { ...s, isActive: s.isActive === false ? true : false }
          : s,
      ),
    );
  };

  const handleSave = () => {
    if (!formData.name.en || !formData.position.en || !formData.department.en) {
      alert("Please fill in all required fields (Name, Position, Department)");
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      position: formData.position,
      department: formData.department,
      bio: formData.bio,
      experience: formData.experience,
      avatar: formData.avatar,
      email: formData.email,
      isActive: formData.isActive,
    };

    if (editingId) {
      setStaffList(staffList.map((s) => (s.id === editingId ? newItem : s)));
    } else {
      setStaffList([...staffList, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Management:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Engineering:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      Operations:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
      Finance:
        "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
      "Human Resources":
        "bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30",
      Safety: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
    };
    return colors[department] || "bg-primary/20 text-primary border-primary/30";
  };

  const getDepartmentIcon = (department: string) => {
    const icons: Record<string, any> = {
      Management: Briefcase,
      Engineering: Building2,
      Operations: Users,
      Finance: Star,
      "Human Resources": Users,
      Safety: Shield,
    };
    return icons[department] || Users;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading staff members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Staff Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage staff members and team information from data/staff.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStaffData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Staff member saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{staffList.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {staffList.filter((s) => s.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold">{departments.length - 1}</p>
            </div>
            <Building2 className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedItems.length}</p>
            </div>
            <Briefcase className="h-8 w-8 text-amber-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium">
            {selectedItems.length} items selected
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Name (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="Name in Amharic"
                  value={formData.name.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, am: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Name (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Name in Oromoo"
                  value={formData.name.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: { ...formData.name, om: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Position */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Position (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Chief Executive Officer"
                  value={formData.position.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: { ...formData.position, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Position (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="Position in Amharic"
                  value={formData.position.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: { ...formData.position, am: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Position (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Position in Oromoo"
                  value={formData.position.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      position: { ...formData.position, om: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Department */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Department (English) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: {
                        ...formData.department,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Department</option>
                  <option value="Management">Management</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Department (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="Department in Amharic"
                  value={formData.department.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: {
                        ...formData.department,
                        am: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Department (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Department in Oromoo"
                  value={formData.department.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: {
                        ...formData.department,
                        om: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Bio (English)
                </label>
                <textarea
                  placeholder="Bio in English"
                  value={formData.bio.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: { ...formData.bio, en: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Bio (Amharic)
                </label>
                <textarea
                  placeholder="Bio in Amharic"
                  value={formData.bio.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: { ...formData.bio, am: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Bio (Oromoo)
                </label>
                <textarea
                  placeholder="Bio in Oromoo"
                  value={formData.bio.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bio: { ...formData.bio, om: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Experience, Avatar, Email */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="25+"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Avatar Emoji
                </label>
                <input
                  type="text"
                  placeholder="👨‍💼"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john.doe@hati.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update Staff" : "Add Staff"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === currentItems.length &&
                      currentItems.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">
                        No staff members found
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ||
                        filterDepartment !== "all" ||
                        filterStatus !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding your first staff member"}
                      </p>
                      {!searchTerm &&
                        filterDepartment === "all" &&
                        filterStatus === "all" && (
                          <Button onClick={handleAddNew} className="mt-4 gap-2">
                            <UserPlus className="h-4 w-4" />
                            Add Staff Member
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const DepartmentIcon = getDepartmentIcon(item.department?.en);
                  return (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-secondary/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={(e) =>
                            handleSelectItem(item.id, e.target.checked)
                          }
                          className="rounded border-primary/20 text-primary focus:ring-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {item.avatar || "👤"}
                          </span>
                          <div>
                            <p className="font-medium">
                              {item.name?.en || "Unnamed"}
                            </p>
                            {item.email && (
                              <p className="text-xs text-muted-foreground">
                                {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <p className="text-sm">{item.position?.en || "N/A"}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          {item.experience || "N/A"} years
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <Badge
                          className={getDepartmentColor(item.department?.en)}
                        >
                          <DepartmentIcon className="h-3 w-3 mr-1" />
                          {item.department?.en || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            item.isActive !== false ? "default" : "secondary"
                          }
                          className={
                            item.isActive !== false
                              ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : ""
                          }
                        >
                          {item.isActive !== false ? (
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                          ) : (
                            <X className="h-3 w-3 mr-1" />
                          )}
                          {item.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleStatus(item.id)}
                            title="Toggle Status"
                          >
                            {item.isActive !== false ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <X className="h-4 w-4 text-red-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredItems.length)} of{" "}
              {filteredItems.length} staff members
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        Data loaded from data/staff.json • {staffList.length} staff members
        total
      </div>
    </div>
  );
}

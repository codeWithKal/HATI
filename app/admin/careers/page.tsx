"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseBusiness,
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
  Clock,
  Users,
  Award,
  Calendar,
  Filter,
} from "lucide-react";
import Link from "next/link";
import careersData from "@/data/careers.json";

export default function AdminCareers() {
  const [careersList, setCareersList] = useState<any[]>([]);
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
    title: { en: "", am: "", om: "" },
    location: { en: "", am: "", om: "" },
    type: { en: "", am: "", om: "" },
    department: { en: "", am: "", om: "" },
    experience: { en: "", am: "", om: "" },
    posted: new Date().toISOString().split("T")[0],
    isActive: true,
  });

  useEffect(() => {
    loadCareersData();
  }, []);

  const loadCareersData = () => {
    setLoading(true);
    try {
      let items = careersData;
      if (
        careersData &&
        typeof careersData === "object" &&
        !Array.isArray(careersData)
      ) {
        items = (careersData as any).careers || [];
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      setCareersList(items);
    } catch (error) {
      console.error("Error loading careers:", error);
      setCareersList([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique departments
  const departments = [
    "all",
    ...new Set(careersList.map((c) => c.department?.en).filter(Boolean)),
  ];

  // Filter items
  const filteredItems = careersList.filter((item) => {
    const matchesSearch =
      item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.en?.toLowerCase().includes(searchTerm.toLowerCase());

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
      setSelectedItems(currentItems.map((c) => c.id));
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
      title: { en: "", am: "", om: "" },
      location: { en: "", am: "", om: "" },
      type: { en: "", am: "", om: "" },
      department: { en: "", am: "", om: "" },
      experience: { en: "", am: "", om: "" },
      posted: new Date().toISOString().split("T")[0],
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || { en: "", am: "", om: "" },
      location: item.location || { en: "", am: "", om: "" },
      type: item.type || { en: "", am: "", om: "" },
      department: item.department || { en: "", am: "", om: "" },
      experience: item.experience || { en: "", am: "", om: "" },
      posted: item.posted || new Date().toISOString().split("T")[0],
      isActive: item.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this position?")) {
      setCareersList(careersList.filter((c) => c.id !== id));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedItems.length} positions?`,
      )
    ) {
      setCareersList(careersList.filter((c) => !selectedItems.includes(c.id)));
      setSelectedItems([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleStatus = (id: string) => {
    setCareersList(
      careersList.map((c) =>
        c.id === id
          ? { ...c, isActive: c.isActive === false ? true : false }
          : c,
      ),
    );
  };

  const handleSave = () => {
    if (!formData.title.en || !formData.department.en) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      location: formData.location,
      type: formData.type,
      department: formData.department,
      experience: formData.experience,
      posted: formData.posted,
      isActive: formData.isActive,
    };

    if (editingId) {
      setCareersList(
        careersList.map((c) => (c.id === editingId ? newItem : c)),
      );
    } else {
      setCareersList([...careersList, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Operations:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      Construction:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
      Finance:
        "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
      "Human Resources":
        "bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30",
      Procurement:
        "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/30",
    };
    return colors[department] || "bg-primary/20 text-primary border-primary/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading positions...</p>
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
            <BriefcaseBusiness className="h-7 w-7 text-primary" />
            Careers Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage job positions and career opportunities from data/careers.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCareersData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Position
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Position saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Positions</p>
              <p className="text-2xl font-bold">{careersList.length}</p>
            </div>
            <BriefcaseBusiness className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {careersList.filter((c) => c.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Departments</p>
              <p className="text-2xl font-bold">
                {
                  new Set(
                    careersList.map((c) => c.department?.en).filter(Boolean),
                  ).size
                }
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedItems.length}</p>
            </div>
            <Award className="h-8 w-8 text-amber-500 opacity-50" />
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
              {editingId ? "Edit Position" : "Add New Position"}
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
            {/* Title */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Senior Civil Engineer"
                  value={formData.title.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Title (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="Title in Amharic"
                  value={formData.title.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, am: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Title (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Title in Oromoo"
                  value={formData.title.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: { ...formData.title, om: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Location (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Addis Ababa, Ethiopia"
                  value={formData.location.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Location (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="Location in Amharic"
                  value={formData.location.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, am: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Location (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Location in Oromoo"
                  value={formData.location.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location, om: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Department, Type, Experience */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Department <span className="text-red-500">*</span>
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
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Construction">Construction</option>
                  <option value="Finance">Finance</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Procurement">Procurement</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: { ...formData.type, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="5+ years"
                  value={formData.experience.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience: {
                        ...formData.experience,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Posted Date & Status */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Posted Date
                </label>
                <input
                  type="date"
                  value={formData.posted}
                  onChange={(e) =>
                    setFormData({ ...formData, posted: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Status
                </label>
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
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update Position" : "Create Position"}
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
              placeholder="Search positions..."
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
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Location
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
                      <BriefcaseBusiness className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">No positions found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ||
                        filterDepartment !== "all" ||
                        filterStatus !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding your first position"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
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
                      <div>
                        <p className="font-medium">
                          {item.title?.en || "Untitled"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.type?.en || ""}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge
                        className={getDepartmentColor(item.department?.en)}
                      >
                        {item.department?.en || "N/A"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {item.location?.en || "N/A"}
                      </div>
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
                ))
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
              {filteredItems.length} positions
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
        Data loaded from data/careers.json • {careersList.length} positions
        total
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
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
  Filter,
  Tag,
} from "lucide-react";
import Link from "next/link";
import servicesData from "@/data/services.json";

export default function AdminServices() {
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: { en: "", am: "", om: "" },
    description: { en: "", am: "", om: "" },
    isActive: true,
  });

  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = () => {
    setLoading(true);
    try {
      let items = servicesData;
      if (
        servicesData &&
        typeof servicesData === "object" &&
        !Array.isArray(servicesData)
      ) {
        items = (servicesData as any).services || [];
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      setServiceList(items);
    } catch (error) {
      console.error("Error loading services:", error);
      setServiceList([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter items
  const filteredItems = serviceList.filter((item) => {
    const matchesSearch =
      item.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.en?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
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
      description: { en: "", am: "", om: "" },
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || { en: "", am: "", om: "" },
      description: item.description || { en: "", am: "", om: "" },
      isActive: item.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServiceList(serviceList.filter((s) => s.id !== id));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedItems.length} services?`,
      )
    ) {
      setServiceList(serviceList.filter((s) => !selectedItems.includes(s.id)));
      setSelectedItems([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleStatus = (id: string) => {
    setServiceList(
      serviceList.map((s) =>
        s.id === id
          ? { ...s, isActive: s.isActive === false ? true : false }
          : s,
      ),
    );
  };

  const handleSave = () => {
    if (!formData.name.en || !formData.description.en) {
      alert(
        "Please fill in all required fields (Name and Description in English)",
      );
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      isActive: formData.isActive,
    };

    if (editingId) {
      setServiceList(
        serviceList.map((s) => (s.id === editingId ? newItem : s)),
      );
    } else {
      setServiceList([...serviceList, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading services...</p>
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
            <Wrench className="h-7 w-7 text-primary" />
            Services Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your services from data/services.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadServicesData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Service saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Services</p>
              <p className="text-2xl font-bold">{serviceList.length}</p>
            </div>
            <Wrench className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {serviceList.filter((s) => s.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold">
                {serviceList.filter((s) => s.isActive === false).length}
              </p>
            </div>
            <X className="h-8 w-8 text-red-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedItems.length}</p>
            </div>
            <Tag className="h-8 w-8 text-amber-500 opacity-50" />
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
              {editingId ? "Edit Service" : "Add New Service"}
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
                  placeholder="Civil Engineering"
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
                  placeholder="ስም በአማርኛ"
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
                  placeholder="Maqaa Oromoon"
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

            {/* Description */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Description (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Expert civil engineering services for infrastructure projects..."
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        en: e.target.value,
                      },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Description (Amharic)
                </label>
                <textarea
                  placeholder="መግለጫ በአማርኛ"
                  value={formData.description.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        am: e.target.value,
                      },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Description (Oromoo)
                </label>
                <textarea
                  placeholder="Ibsa Oromoon"
                  value={formData.description.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: {
                        ...formData.description,
                        om: e.target.value,
                      },
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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
                {editingId ? "Update Service" : "Create Service"}
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
              placeholder="Search services by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="px-4 py-2">
              {filteredItems.length} results
            </Badge>
          </div>
        </div>
      </Card>

      {/* Services Table */}
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
                  Description
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
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Wrench className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">No services found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm
                          ? "Try adjusting your search"
                          : "Get started by adding your first service"}
                      </p>
                      {!searchTerm && (
                        <Button onClick={handleAddNew} className="mt-4 gap-2">
                          <Plus className="h-4 w-4" />
                          Add Service
                        </Button>
                      )}
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
                          {item.name?.en || "Unnamed"}
                        </p>
                        {item.name?.am && (
                          <p className="text-xs text-muted-foreground">
                            {item.name.am}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                        {item.description?.en || "No description"}
                      </p>
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
              {filteredItems.length} services
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
        Data loaded from data/services.json • {serviceList.length} services
        total
      </div>
    </div>
  );
}

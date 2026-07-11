"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
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
  Globe,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import contactInfoData from "@/data/contactInfo.json";

export default function AdminContacts() {
  const [contactsList, setContactsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: "address",
    icon: "MapPin",
    title: { en: "", am: "", om: "" },
    details: { en: "", am: "", om: "" },
    badge: { en: "", am: "", om: "" },
    badgeIcon: "Globe",
    isActive: true,
  });

  useEffect(() => {
    loadContactsData();
  }, []);

  const loadContactsData = () => {
    setLoading(true);
    try {
      let items = contactInfoData;
      if (
        contactInfoData &&
        typeof contactInfoData === "object" &&
        !Array.isArray(contactInfoData)
      ) {
        items = (contactInfoData as any).contacts || [];
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      setContactsList(items);
    } catch (error) {
      console.error("Error loading contacts:", error);
      setContactsList([]);
    } finally {
      setLoading(false);
    }
  };

  const types = [
    "all",
    ...new Set(contactsList.map((c) => c.type).filter(Boolean)),
  ];

  const filteredItems = contactsList.filter((item) => {
    const matchesSearch =
      item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details?.en?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesType;
  });

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
      type: "address",
      icon: "MapPin",
      title: { en: "", am: "", om: "" },
      details: { en: "", am: "", om: "" },
      badge: { en: "", am: "", om: "" },
      badgeIcon: "Globe",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      type: item.type || "address",
      icon: item.icon || "MapPin",
      title: item.title || { en: "", am: "", om: "" },
      details: item.details || { en: "", am: "", om: "" },
      badge: item.badge || { en: "", am: "", om: "" },
      badgeIcon: item.badgeIcon || "Globe",
      isActive: item.isActive !== false,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      setContactsList(contactsList.filter((c) => c.id !== id));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedItems.length} contacts?`,
      )
    ) {
      setContactsList(
        contactsList.filter((c) => !selectedItems.includes(c.id)),
      );
      setSelectedItems([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleToggleStatus = (id: string) => {
    setContactsList(
      contactsList.map((c) =>
        c.id === id
          ? { ...c, isActive: c.isActive === false ? true : false }
          : c,
      ),
    );
  };

  const handleSave = () => {
    if (!formData.title.en || !formData.details.en) {
      alert("Please fill in all required fields");
      return;
    }

    const newItem = {
      id: editingId || Date.now().toString(),
      type: formData.type,
      icon: formData.icon,
      title: formData.title,
      details: formData.details,
      badge: formData.badge,
      badgeIcon: formData.badgeIcon,
      isActive: formData.isActive,
    };

    if (editingId) {
      setContactsList(
        contactsList.map((c) => (c.id === editingId ? newItem : c)),
      );
    } else {
      setContactsList([...contactsList, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      address: MapPin,
      phone: Phone,
      email: Mail,
    };
    return icons[type] || MapPin;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      address:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      phone:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
      email:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
    };
    return colors[type] || "bg-primary/20 text-primary border-primary/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Mail className="h-7 w-7 text-primary" />
            Contact Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage contact information from data/contactInfo.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadContactsData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Contact saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
              <p className="text-2xl font-bold">{contactsList.length}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {contactsList.filter((c) => c.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Types</p>
              <p className="text-2xl font-bold">{types.length - 1}</p>
            </div>
            <Globe className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedItems.length}</p>
            </div>
            <Users className="h-8 w-8 text-amber-500 opacity-50" />
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
              {editingId ? "Edit Contact" : "Add New Contact"}
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
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="address">Address</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Icon <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="MapPin">Map Pin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                  <option value="Globe">Globe</option>
                  <option value="Clock">Clock</option>
                  <option value="Send">Send</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Office Address"
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

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Details (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Addis Ababa, Ethiopia\nP.O. Box 12345"
                  value={formData.details.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: { ...formData.details, en: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Details (Amharic)
                </label>
                <textarea
                  placeholder="Details in Amharic"
                  value={formData.details.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: { ...formData.details, am: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Details (Oromoo)
                </label>
                <textarea
                  placeholder="Details in Oromoo"
                  value={formData.details.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: { ...formData.details, om: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Badge Text (English)
                </label>
                <input
                  type="text"
                  placeholder="Visit Us"
                  value={formData.badge.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      badge: { ...formData.badge, en: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Badge Icon
                </label>
                <select
                  value={formData.badgeIcon}
                  onChange={(e) =>
                    setFormData({ ...formData, badgeIcon: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Globe">Globe</option>
                  <option value="Clock">Clock</option>
                  <option value="Send">Send</option>
                  <option value="MapPin">Map Pin</option>
                  <option value="Phone">Phone</option>
                  <option value="Mail">Mail</option>
                </select>
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
                {editingId ? "Update Contact" : "Create Contact"}
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
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Details
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
                      <Mail className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">No contacts found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || filterType !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding your first contact"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
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
                        <div>
                          <p className="font-medium">
                            {item.title?.en || "Untitled"}
                          </p>
                          {item.badge?.en && (
                            <Badge
                              variant="outline"
                              className="text-[10px] mt-1"
                            >
                              {item.badge.en}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <Badge className={getTypeColor(item.type)}>
                          <Icon className="h-3 w-3 mr-1" />
                          {item.type || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {item.details?.en || "N/A"}
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredItems.length)} of{" "}
              {filteredItems.length} contacts
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
        Data loaded from data/contactInfo.json • {contactsList.length} contacts
        total
      </div>
    </div>
  );
}

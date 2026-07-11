"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Image,
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
  Calendar,
  LayoutGrid,
  Upload,
  Filter,
} from "lucide-react";
import Link from "next/link";
import galleryData from "@/data/gallery.json";

export default function AdminGallery() {
  const [galleryList, setGalleryList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: { en: "", am: "", om: "" },
    category: "building",
    categoryLabel: { en: "", am: "", om: "" },
    location: { en: "", am: "", om: "" },
    status: "ongoing",
    emoji: "📷",
    year: new Date().getFullYear().toString(),
    isActive: true,
  });

  useEffect(() => {
    loadGalleryData();
  }, []);

  const loadGalleryData = () => {
    setLoading(true);
    try {
      let items = galleryData;
      if (
        galleryData &&
        typeof galleryData === "object" &&
        !Array.isArray(galleryData)
      ) {
        items = (galleryData as any).gallery || [];
      }
      if (!Array.isArray(items)) {
        items = [];
      }
      setGalleryList(items);
    } catch (error) {
      console.error("Error loading gallery:", error);
      setGalleryList([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
    ...new Set(galleryList.map((g) => g.category).filter(Boolean)),
  ];
  const statuses = ["all", "ongoing", "completed"];

  const filteredItems = galleryList.filter((item) => {
    const matchesSearch =
      item.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.en?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || item.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Rest of CRUD operations (similar to careers page)...

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Image className="h-7 w-7 text-primary" />
            Gallery Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage project images and gallery items from data/gallery.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadGalleryData}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Image
          </Button>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{galleryList.length}</p>
            </div>
            <Image className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {galleryList.filter((g) => g.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <LayoutGrid className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedItems.length}</p>
            </div>
            <Eye className="h-8 w-8 text-amber-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Similar form, filters, table, and pagination as careers page... */}
      <div className="text-center text-xs text-muted-foreground">
        Data loaded from data/gallery.json • {galleryList.length} items total
      </div>
    </div>
  );
}

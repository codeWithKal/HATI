"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Warehouse,
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
  Truck,
  DollarSign,
  Package,
  Filter,
  Download,
  Upload,
  LayoutGrid,
  List,
} from "lucide-react";
import inventoryData from "@/data/inventory.json";
import { InventoryGrid, InventoryTable } from "@/components/inventory";

export default function AdminInventory() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [inventoryList, setInventoryList] = useState(inventoryData);
  const [formData, setFormData] = useState({
    materialName: { en: "", am: "", om: "" },
    price_in_m3: { en: "", am: "", om: "" },
    stokeRemaining_in_m3: { en: "", am: "", om: "" },
  });

  // Calculate totals
  const getStockValue = (str: string) => {
    return parseFloat(str.replace(/[^0-9.]/g, ""));
  };

  const totalStock = inventoryList.reduce((sum, item) => {
    const stockStr = item.stokeRemaining_in_m3.en;
    return sum + getStockValue(stockStr);
  }, 0);

  const totalValue = inventoryList.reduce((sum, item) => {
    const stockStr = item.stokeRemaining_in_m3.en;
    const priceStr = item.price_in_m3.en;
    return sum + getStockValue(stockStr) * getStockValue(priceStr);
  }, 0);

  const totalTrucks = Math.round(totalStock / 16.74);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter items
  const filteredItems = inventoryList.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.materialName.en.toLowerCase().includes(search) ||
      item.materialName.am.includes(search) ||
      item.materialName.om.includes(search)
    );
  });

  // Paginate
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      materialName: { en: "", am: "", om: "" },
      price_in_m3: { en: "", am: "", om: "" },
      stokeRemaining_in_m3: { en: "", am: "", om: "" },
    });
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      materialName: item.materialName,
      price_in_m3: item.price_in_m3,
      stokeRemaining_in_m3: item.stokeRemaining_in_m3,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      setInventoryList(inventoryList.filter((item) => item.id !== id));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (
      confirm(`Are you sure you want to delete ${selectedItems.length} items?`)
    ) {
      setInventoryList(
        inventoryList.filter((item) => !selectedItems.includes(item.id)),
      );
      setSelectedItems([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSave = () => {
    if (
      !formData.materialName.en ||
      !formData.price_in_m3.en ||
      !formData.stokeRemaining_in_m3.en
    ) {
      alert("Please fill in all required fields (English versions)");
      return;
    }

    const newItem = {
      id: editingId || Date.now(),
      materialName: formData.materialName,
      price_in_m3: formData.price_in_m3,
      stokeRemaining_in_m3: formData.stokeRemaining_in_m3,
    };

    if (editingId) {
      setInventoryList(
        inventoryList.map((item) => (item.id === editingId ? newItem : item)),
      );
    } else {
      setInventoryList([...inventoryList, newItem]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Warehouse className="h-7 w-7 text-primary" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage materials inventory from data/inventory.json
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="gap-2"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <List className="h-4 w-4" />
              Table
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Inventory item saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Materials</p>
              <p className="text-2xl font-bold">{inventoryList.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-2xl font-bold">{totalStock.toFixed(0)} m³</p>
            </div>
            <Warehouse className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trucks Needed</p>
              <p className="text-2xl font-bold">{totalTrucks}</p>
            </div>
            <Truck className="h-8 w-8 text-amber-500 opacity-50" />
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
              {editingId ? "Edit Inventory Item" : "Add New Inventory Item"}
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
            {/* Material Name */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Material Name (English){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Fino Sand"
                  value={formData.materialName.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialName: {
                        ...formData.materialName,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Material Name (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="ፊኖ አሸዋ"
                  value={formData.materialName.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialName: {
                        ...formData.materialName,
                        am: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Material Name (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="Cirrachii Fino"
                  value={formData.materialName.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialName: {
                        ...formData.materialName,
                        om: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Price per m³ */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Price per m³ (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="2,500 ETB"
                  value={formData.price_in_m3.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_in_m3: {
                        ...formData.price_in_m3,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Price per m³ (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="2,500 ብር"
                  value={formData.price_in_m3.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_in_m3: {
                        ...formData.price_in_m3,
                        am: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Price per m³ (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="2,500 Birrii"
                  value={formData.price_in_m3.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_in_m3: {
                        ...formData.price_in_m3,
                        om: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Stock Remaining */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Stock Remaining (English){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="450 m³"
                  value={formData.stokeRemaining_in_m3.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stokeRemaining_in_m3: {
                        ...formData.stokeRemaining_in_m3,
                        en: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Stock Remaining (Amharic)
                </label>
                <input
                  type="text"
                  placeholder="450 ሜ³"
                  value={formData.stokeRemaining_in_m3.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stokeRemaining_in_m3: {
                        ...formData.stokeRemaining_in_m3,
                        am: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Stock Remaining (Oromoo)
                </label>
                <input
                  type="text"
                  placeholder="450 m³"
                  value={formData.stokeRemaining_in_m3.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stokeRemaining_in_m3: {
                        ...formData.stokeRemaining_in_m3,
                        om: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update Item" : "Create Item"}
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
              placeholder="Search inventory..."
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

      {/* Inventory Display with Actions */}
      {viewMode === "grid" ? (
        <InventoryGrid
          items={currentItems}
          truckCapacity={16.74}
          showTruckEstimate={true}
          showPrice={true}
          columns={3}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <InventoryTable
          items={currentItems}
          truckCapacity={16.74}
          showTruckEstimate={true}
          showPrice={true}
          showActions={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredItems.length)} of {filteredItems.length}{" "}
            items
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

      <div className="text-center text-xs text-smuted-foreground">
        Data loaded from data/inventory.json • {inventoryList.length} items
        total
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Image as ImageIcon,
  Tag,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import productsData from "@/data/products.json";

export default function AdminProducts() {
  const { user } = useAdmin();
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Load products with proper error handling
  useEffect(() => {
    try {
      // Handle both array and object formats
      let products = productsData;
      if (
        productsData &&
        typeof productsData === "object" &&
        !Array.isArray(productsData)
      ) {
        // If it's an object with a products property
        products = (productsData as any).products || [];
      }

      // Ensure we have an array
      if (!Array.isArray(products)) {
        console.warn("Products data is not an array:", products);
        products = [];
      }

      setProductList(products);
    } catch (error) {
      console.error("Error loading products:", error);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(productList.map((p) => p.category).filter(Boolean)),
  ];

  // Filter products
  const filteredProducts = productList.filter((product) => {
    const matchesSearch =
      product.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.en?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Paginate products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(currentProducts.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Handle select single
  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    }
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProductList(productList.filter((p) => p.id !== id));
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedProducts.length} products?`,
      )
    ) {
      setProductList(
        productList.filter((p) => !selectedProducts.includes(p.id)),
      );
      setSelectedProducts([]);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    // Reload data
    try {
      let products = productsData;
      if (
        productsData &&
        typeof productsData === "object" &&
        !Array.isArray(productsData)
      ) {
        products = (productsData as any).products || [];
      }
      if (!Array.isArray(products)) {
        products = [];
      }
      setProductList(products);
    } catch (error) {
      console.error("Error refreshing products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
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
            <Package className="h-7 w-7 text-primary" />
            Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Link href="/admin/products/add">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{productList.length}</p>
            </div>
            <Package className="h-8 w-8 text-primary opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Tag className="h-8 w-8 text-blue-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Displaying</p>
              <p className="text-2xl font-bold">{filteredProducts.length}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedProducts.length}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium">
            {selectedProducts.length} items selected
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === currentProducts.length &&
                      currentProducts.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Package className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">No products found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm || filterCategory !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by adding your first product"}
                      </p>
                      {!searchTerm && filterCategory === "all" && (
                        <Link href="/admin/products/add">
                          <Button className="mt-4 gap-2">
                            <Plus className="h-4 w-4" />
                            Add Product
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) =>
                          handleSelectProduct(product.id, e.target.checked)
                        }
                        className="rounded border-primary/20 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {product.name?.en || "Unnamed"}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description?.en || "No description"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {product.category || "uncategorized"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {product.image ? (
                        <div className="h-12 w-12 rounded-lg bg-secondary/50 flex items-center justify-center overflow-hidden">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date().toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
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
              {Math.min(endIndex, filteredProducts.length)} of{" "}
              {filteredProducts.length} products
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
    </div>
  );
}

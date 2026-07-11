"use client";

import { useState, useEffect } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  User,
  Calendar,
  Clock,
  Tag,
  Image as ImageIcon,
  X,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import newsData from "@/data/news.json";
import newsStatsData from "@/data/newsStats.json";

export default function AdminNews() {
  const { user } = useAdmin();
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: { en: "", am: "", om: "" },
    excerpt: { en: "", am: "", om: "" },
    author: "",
    date: new Date().toISOString().split("T")[0],
    category: "company",
    image: "📰",
    readTime: "3 min read",
    isActive: true,
    featured: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Load news data
  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = () => {
    setLoading(true);
    try {
      let articles = newsData;
      // Handle both array and object formats
      if (
        newsData &&
        typeof newsData === "object" &&
        !Array.isArray(newsData)
      ) {
        articles = (newsData as any).news || (newsData as any).articles || [];
      }
      if (!Array.isArray(articles)) {
        articles = [];
      }
      setNewsList(articles);
    } catch (error) {
      console.error("Error loading news:", error);
      setNewsList([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [
    "all",
    ...new Set(newsList.map((a) => a.category).filter(Boolean)),
  ];

  // Filter articles
  const filteredArticles = newsList.filter((article) => {
    const matchesSearch =
      article.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.title?.am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.title?.om?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || article.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && article.isActive !== false) ||
      (filterStatus === "inactive" && article.isActive === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Paginate
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedArticles(currentArticles.map((a) => a.id));
    } else {
      setSelectedArticles([]);
    }
  };

  // Handle select single
  const handleSelectArticle = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedArticles([...selectedArticles, id]);
    } else {
      setSelectedArticles(selectedArticles.filter((aid) => aid !== id));
    }
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      title: { en: "", am: "", om: "" },
      excerpt: { en: "", am: "", om: "" },
      author: "",
      date: new Date().toISOString().split("T")[0],
      category: "company",
      image: "📰",
      readTime: "3 min read",
      isActive: true,
      featured: false,
    });
    setSaveError("");
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setFormData({
      title: article.title || { en: "", am: "", om: "" },
      excerpt: article.excerpt || { en: "", am: "", om: "" },
      author: article.author || "",
      date: article.date || new Date().toISOString().split("T")[0],
      category: article.category || "company",
      image: article.image || "📰",
      readTime: article.readTime || "3 min read",
      isActive: article.isActive !== false,
      featured: article.featured || false,
    });
    setSaveError("");
    setShowForm(true);
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setNewsList(newsList.filter((a) => a.id !== id));
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedArticles.length === 0) return;
    if (
      confirm(
        `Are you sure you want to delete ${selectedArticles.length} articles?`,
      )
    ) {
      setNewsList(newsList.filter((a) => !selectedArticles.includes(a.id)));
      setSelectedArticles([]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id: string) => {
    setNewsList(
      newsList.map((a) =>
        a.id === id
          ? { ...a, isActive: a.isActive === false ? true : false }
          : a,
      ),
    );
  };

  // Handle toggle featured
  const handleToggleFeatured = (id: string) => {
    setNewsList(
      newsList.map((a) =>
        a.id === id
          ? { ...a, featured: a.featured === true ? false : true }
          : a,
      ),
    );
  };

  // Handle save
  const handleSave = () => {
    // Validate required fields
    if (!formData.title.en || !formData.excerpt.en || !formData.author) {
      setSaveError(
        "Please fill in all required fields (Title EN, Excerpt EN, Author)",
      );
      return;
    }

    const newArticle = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      author: formData.author,
      date: formData.date,
      category: formData.category,
      image: formData.image,
      readTime: formData.readTime,
      isActive: formData.isActive,
      featured: formData.featured,
    };

    if (editingId) {
      setNewsList(newsList.map((a) => (a.id === editingId ? newArticle : a)));
    } else {
      setNewsList([...newsList, newArticle]);
    }

    setShowForm(false);
    setEditingId(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadNewsData();
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      projects:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      innovation:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      company:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
    };
    return colors[category] || "bg-primary/20 text-primary border-primary/30";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      projects: "Projects",
      innovation: "Innovation",
      company: "Company",
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading articles...</p>
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
            <Newspaper className="h-7 w-7 text-primary" />
            News Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your news articles and announcements from data/news.json
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
          <Button onClick={handleAddNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Article
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <span>Article saved successfully!</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-2xl font-bold">{newsList.length}</p>
            </div>
            <Newspaper className="h-8 w-8 text-primary opacity-50" />
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
              <p className="text-sm text-muted-foreground">Authors</p>
              <p className="text-2xl font-bold">
                {new Set(newsList.map((a) => a.author).filter(Boolean)).size}
              </p>
            </div>
            <User className="h-8 w-8 text-green-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {newsList.filter((a) => a.isActive !== false).length}
              </p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-50" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Selected</p>
              <p className="text-2xl font-bold">{selectedArticles.length}</p>
            </div>
            <Sparkles className="h-8 w-8 text-purple-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <span className="text-sm font-medium">
            {selectedArticles.length} items selected
          </span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <Card className="p-6 border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Article" : "Add New Article"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {saveError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Titles */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Title (English)"
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
                  placeholder="Title (Amharic)"
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
                  placeholder="Title (Oromoo)"
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

            {/* Excerpts */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Excerpt (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Excerpt (English)"
                  value={formData.excerpt.en}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerpt: { ...formData.excerpt, en: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Excerpt (Amharic)
                </label>
                <textarea
                  placeholder="Excerpt (Amharic)"
                  value={formData.excerpt.am}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerpt: { ...formData.excerpt, am: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Excerpt (Oromoo)
                </label>
                <textarea
                  placeholder="Excerpt (Oromoo)"
                  value={formData.excerpt.om}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerpt: { ...formData.excerpt, om: e.target.value },
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>

            {/* Author, Date, Category */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Author"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="projects">Projects</option>
                  <option value="innovation">Innovation</option>
                  <option value="company">Company</option>
                </select>
              </div>
            </div>

            {/* Image, Read Time, Status */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Image Emoji
                </label>
                <input
                  type="text"
                  placeholder="📰"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Read Time
                </label>
                <input
                  type="text"
                  placeholder="3 min read"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                      className="rounded border-primary/20 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {editingId ? "Update Article" : "Create Article"}
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
              placeholder="Search articles by title, excerpt, or author..."
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
                  {cat === "all" ? "All Categories" : getCategoryLabel(cat)}
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

      {/* Articles Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/5">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedArticles.length === currentArticles.length &&
                      currentArticles.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-primary/20 text-primary focus:ring-primary"
                  />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground hidden sm:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Newspaper className="h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="text-lg font-medium">No articles found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm ||
                        filterCategory !== "all" ||
                        filterStatus !== "all"
                          ? "Try adjusting your filters"
                          : "Get started by creating your first article"}
                      </p>
                      {!searchTerm &&
                        filterCategory === "all" &&
                        filterStatus === "all" && (
                          <Button onClick={handleAddNew} className="mt-4 gap-2">
                            <Plus className="h-4 w-4" />
                            Add Article
                          </Button>
                        )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b hover:bg-secondary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={(e) =>
                          handleSelectArticle(article.id, e.target.checked)
                        }
                        className="rounded border-primary/20 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">
                          {article.title?.en || "Untitled"}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {article.excerpt?.en || "No excerpt"}
                        </p>
                        {article.featured && (
                          <Badge className="mt-1 bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px]">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge className={getCategoryColor(article.category)}>
                        {getCategoryLabel(article.category)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {article.author || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          article.isActive !== false ? "default" : "secondary"
                        }
                        className={
                          article.isActive !== false
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : ""
                        }
                      >
                        {article.isActive !== false ? (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        ) : (
                          <X className="h-3 w-3 mr-1" />
                        )}
                        {article.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date
                          ? new Date(article.date).toLocaleDateString()
                          : "No date"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/news/${article.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleStatus(article.id)}
                          title="Toggle Active Status"
                        >
                          {article.isActive !== false ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleToggleFeatured(article.id)}
                          title="Toggle Featured"
                        >
                          <Sparkles
                            className={`h-4 w-4 ${article.featured ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(article.id)}
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
              {Math.min(endIndex, filteredArticles.length)} of{" "}
              {filteredArticles.length} articles
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

      {/* Data Source Info */}
      <div className="text-center text-xs text-muted-foreground">
        Data loaded from data/news.json • {newsList.length} articles total
      </div>
    </div>
  );
}

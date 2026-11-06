"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
  Images,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GalleryItem = { id: number; image: string; category: string };

const imageUrl = (image: string) => {
  if (/^https?:\/\//i.test(image)) return image;
  const clean = image.replace(/^public\//, "");
  return clean.startsWith("/") ? clean : `/${clean}`;
};

const CATEGORY_OPTIONS = [
  "projects",
  "building",
  "construction",
  "team",
  "events",
];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [broken, setBroken] = useState<number[]>([]);
  const [dialogItem, setDialogItem] = useState<GalleryItem | null>(null);
  const [category, setCategory] = useState("projects");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [replaceId, setReplaceId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Gallery records could not be loaded.");
      setItems(Array.isArray(result.gallery) ? result.gallery : []);
      setBroken([]);
    } catch (cause) {
      setLoadError(
        cause instanceof Error
          ? cause.message
          : "Gallery records could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(
    () =>
      [...new Set(items.map((item) => item.category).filter(Boolean))].sort(),
    [items],
  );

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (categoryFilter === "all" || item.category === categoryFilter) &&
          `${item.category} ${item.image}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [items, categoryFilter, search],
  );

  const chooseFile = (file?: File) => {
    if (!file) return;
    if (
      !/^image\/(jpeg|png|webp)$/.test(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG, or WebP image smaller than 8 MB.");
      return;
    }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setUploadFile(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const resetDialog = () => {
    setDialogItem(null);
    setUploadFile(null);
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview("");
    setReplaceId(null);
    setCategory("projects");
    setError("");
  };

  const openUpload = (item?: GalleryItem) => {
    resetDialog();
    setDialogItem(item || null);
    setReplaceId(item?.id ?? null);
    setCategory(item?.category || "projects");
  };

  const submitUpload = async () => {
    if (!uploadFile) {
      setError("Select an image first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("imageFile", uploadFile);
      form.set("category", category);
      const response = await fetch(
        replaceId ? `/api/gallery/${replaceId}` : "/api/gallery",
        {
          method: replaceId ? "PUT" : "POST",
          body: form,
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Image could not be saved.");
      setMessage(
        replaceId ? "Gallery image replaced." : "Gallery image uploaded.",
      );
      resetDialog();
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Image could not be saved.",
      );
    } finally {
      setBusy(false);
    }
  };

  const saveCategory = async (item: GalleryItem, nextCategory: string) => {
    try {
      const response = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, category: nextCategory }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Category could not be updated.");
      setMessage("Gallery category updated.");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Category could not be updated.",
      );
    }
  };

  const deleteItem = async (item: GalleryItem) => {
    if (
      !window.confirm(
        "Delete this gallery record? Managed uploaded images are removed only when no other gallery record uses them.",
      )
    )
      return;
    try {
      const response = await fetch(`/api/gallery/${item.id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Gallery record could not be deleted.");
      setMessage("Gallery record deleted.");
      await load();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Gallery record could not be deleted.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Images className="h-5 w-5" />
            </span>
            Gallery Management
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage the existing gallery images and categories.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => void load()}
            disabled={loading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={() => openUpload()}>
            <Plus className="mr-2 h-4 w-4" />
            Upload image
          </Button>
        </div>
      </header>

      {/* Alerts */}
      {message && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-600/30 bg-green-500/10 p-3 text-sm text-green-800 dark:text-green-300"
        >
          <CheckCircle2 size={17} />
          {message}
          <button
            className="ml-auto"
            onClick={() => setMessage("")}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-300"
        >
          <AlertCircle size={17} />
          {error}
          <button
            className="ml-auto"
            onClick={() => setError("")}
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sticky toolbar */}
      <Card className="sticky top-4 z-30 border-border/70 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search gallery</span>
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories or image paths"
            />
          </label>
          <div className="flex items-center gap-2">
            <Filter
              size={16}
              className="hidden text-muted-foreground sm:block"
            />
            <label className="sr-only" htmlFor="gallery-category-filter">
              Filter category
            </label>
            <select
              id="gallery-category-filter"
              className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground sm:flex-initial"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
            <span className="hidden whitespace-nowrap rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground sm:inline-block">
              {filtered.length} / {items.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Grid / States */}
      {loading ? (
        <div className="grid min-h-64 place-items-center text-muted-foreground">
          <div className="flex flex-col items-center gap-3">
            <LoaderCircle
              className="h-7 w-7 animate-spin"
              aria-label="Loading gallery"
            />
            <p className="text-sm">Loading gallery…</p>
          </div>
        </div>
      ) : loadError ? (
        <Card>
          <CardContent className="grid min-h-64 place-items-center gap-3 p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-foreground">{loadError}</p>
            <Button variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : !filtered.length ? (
        <Card>
          <CardContent className="grid min-h-64 place-items-center p-8 text-center">
            <div>
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
                <ImageIcon className="h-7 w-7 text-muted-foreground" />
              </span>
              <h2 className="font-semibold text-foreground">
                No gallery images found
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search or upload a gallery image.
              </p>
              <Button className="mt-4" onClick={() => openUpload()}>
                <Plus className="mr-2 h-4 w-4" />
                Upload image
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative grid h-56 place-items-center overflow-hidden bg-muted sm:h-60">
                {broken.includes(item.id) ? (
                  <div className="grid h-full place-items-center p-4 text-center text-sm text-muted-foreground">
                    <div>
                      <AlertCircle className="mx-auto mb-2 h-6 w-6" />
                      Image unavailable
                      <p className="mt-1 break-all text-xs">{item.image}</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={imageUrl(item.image)}
                    alt={`Gallery image ${item.id}`}
                    loading="lazy"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    onError={() =>
                      setBroken((current) =>
                        current.includes(item.id)
                          ? current
                          : [...current, item.id],
                      )
                    }
                  />
                )}
                {/* ID badge */}
                <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                  #{item.id}
                </span>
                {/* Hover overlay */}
                <button
                  className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition hover:bg-black/40 hover:opacity-100 focus-visible:bg-black/40 focus-visible:opacity-100"
                  onClick={() => setDialogItem(item)}
                  aria-label="Preview gallery image"
                >
                  <span className="rounded-lg bg-black/70 px-3 py-2 text-sm font-medium">
                    Preview
                  </span>
                </button>
              </div>
              <CardContent className="space-y-3 p-3">
                <p
                  className="truncate text-xs text-muted-foreground"
                  title={item.image}
                >
                  {item.image}
                </p>
                <div className="flex items-center gap-1.5">
                  <label className="sr-only" htmlFor={`category-${item.id}`}>
                    Category for image {item.id}
                  </label>
                  <select
                    id={`category-${item.id}`}
                    value={item.category}
                    onChange={(event) =>
                      void saveCategory(item, event.target.value)
                    }
                    className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-sm text-foreground"
                  >
                    <option value={item.category}>{item.category}</option>
                    {CATEGORY_OPTIONS.filter(
                      (entry) => entry !== item.category,
                    ).map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Replace image"
                    onClick={() => openUpload(item)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete image"
                    onClick={() => void deleteItem(item)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview dialog */}
      {dialogItem && !replaceId ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setDialogItem(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            className="relative max-h-[90vh] max-w-5xl rounded-2xl bg-card p-3 shadow-2xl"
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute right-5 top-5 z-10"
              onClick={() => setDialogItem(null)}
              aria-label="Close preview"
            >
              <X size={18} />
            </Button>
            <img
              src={imageUrl(dialogItem.image)}
              alt={`Gallery image ${dialogItem.id}`}
              className="max-h-[82vh] max-w-full rounded-lg object-contain"
            />
          </div>
        </div>
      ) : null}

      {/* Upload / Replace dialog */}
      {(replaceId !== null || (dialogItem === null && preview)) && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-upload-title"
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="gallery-upload-title"
                  className="text-lg font-semibold text-foreground"
                >
                  {replaceId ? "Replace gallery image" : "Upload gallery image"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG, or WebP · up to 8 MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetDialog}
                aria-label="Close upload"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Dropzone-style file picker */}
            <div
              className="mb-4 cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/40 p-6 text-center transition hover:border-primary/60 hover:bg-primary/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                {uploadFile ? uploadFile.name : "Click to choose an image"}
              </p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
            </div>

            {preview && (
              <img
                src={preview}
                alt="Selected gallery image preview"
                className="mb-4 max-h-64 w-full rounded-lg border border-border object-contain"
              />
            )}

            <label className="block text-sm font-medium text-foreground">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-foreground"
              >
                <option value="projects">Projects</option>
                <option value="building">Building</option>
                <option value="construction">Construction</option>
                <option value="team">Team</option>
                <option value="events">Events</option>
              </select>
            </label>

            {error && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-700 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!uploadFile || busy}
                onClick={() => void submitUpload()}
              >
                {busy ? (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {replaceId ? "Replace image" : "Upload image"}
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

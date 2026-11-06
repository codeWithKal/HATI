"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, LoaderCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProductForm = { name: { en: string; am: string; om: string }; description: { en: string; am: string; om: string }; category: string; priceEtb: string; stockM3: string };
const blank: ProductForm = { name: { en: "", am: "", om: "" }, description: { en: "", am: "", om: "" }, category: "", priceEtb: "", stockM3: "" };
const inputClass = "mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(blank);
  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${params.id}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load product.");
      if (!active) return;
      setForm({ name: { en: data.name?.en || "", am: data.name?.am || "", om: data.name?.om || "" }, description: { en: data.description?.en || "", am: data.description?.am || "", om: data.description?.om || "" }, category: data.category || "", priceEtb: data.priceEtb == null ? "" : String(data.priceEtb), stockM3: data.stockM3 == null ? "" : String(data.stockM3) });
      setImage(data.image || data.images?.[0] || ""); setPreview(data.image || data.images?.[0] || "");
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Unable to load product."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.id]);

  const chooseFile = (selected?: File) => {
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 8 * 1024 * 1024) { setError("Choose a JPG, PNG, or WebP image smaller than 8 MB."); return; }
    setError(""); setFile(selected); setPreview(URL.createObjectURL(selected));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError("");
    if (!form.name.en.trim() || !form.description.en.trim() || !form.category.trim()) { setError("Name, description, and category are required."); return; }
    if ((form.priceEtb && Number(form.priceEtb) < 0) || (form.stockM3 && Number(form.stockM3) < 0)) { setError("Price and stock cannot be negative."); return; }
    setBusy(true);
    try {
      let savedImage = image;
      if (file) {
        const data = new FormData(); data.set("imageFile", file);
        const upload = await fetch("/api/admin/images/products", { method: "POST", body: data }); const result = await upload.json();
        if (!upload.ok) throw new Error(result.error || "Image upload failed."); savedImage = result.image;
      }
      const response = await fetch(`/api/products/${params.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, priceEtb: form.priceEtb || null, stockM3: form.stockM3 || null, image: savedImage, images: savedImage ? [savedImage] : [] }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Unable to update product.");
      router.push(`/admin/products/${params.id}`); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update product."); setBusy(false); }
  };

  if (loading) return <div className="grid min-h-72 place-items-center text-muted-foreground"><LoaderCircle className="animate-spin" /></div>;
  if (error && !form.name.en && !form.category) return <div className="space-y-4"><Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-primary"><ArrowLeft size={16} />Back to products</Link><p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p></div>;
  return <div className="mx-auto max-w-4xl space-y-6"><div className="flex items-center gap-3"><Link href={`/admin/products/${params.id}`} aria-label="Back to product" className="rounded-lg border border-border p-2 text-foreground hover:bg-muted"><ArrowLeft size={18} /></Link><div><h1 className="text-2xl font-bold text-foreground">Edit product</h1><p className="mt-1 text-sm text-muted-foreground">Update this product record.</p></div></div>
    <form onSubmit={submit} className="space-y-5"><Card><CardContent className="grid gap-4 p-5 sm:grid-cols-2">{(["en", "am", "om"] as const).map((language) => <label key={language} className="text-sm font-medium text-foreground">Product name ({language.toUpperCase()}){language === "en" && <span className="text-red-600"> *</span>}<input required={language === "en"} className={inputClass} value={form.name[language]} onChange={(event) => setForm({ ...form, name: { ...form.name, [language]: event.target.value } })} /></label>)}<label className="text-sm font-medium text-foreground">Category <span className="text-red-600">*</span><input required className={inputClass} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>{(["en", "am", "om"] as const).map((language) => <label key={language} className="text-sm font-medium text-foreground sm:col-span-2">Description ({language.toUpperCase()}){language === "en" && <span className="text-red-600"> *</span>}<textarea required={language === "en"} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.description[language]} onChange={(event) => setForm({ ...form, description: { ...form.description, [language]: event.target.value } })} /></label>)}<label className="text-sm font-medium text-foreground">Price (ETB)<input type="number" min="0" step="0.01" className={inputClass} value={form.priceEtb} onChange={(event) => setForm({ ...form, priceEtb: event.target.value })} /></label><label className="text-sm font-medium text-foreground">Stock (m³)<input type="number" min="0" step="0.001" className={inputClass} value={form.stockM3} onChange={(event) => setForm({ ...form, stockM3: event.target.value })} /></label><div className="sm:col-span-2"><label className="text-sm font-medium text-foreground">Product image <span className="font-normal text-muted-foreground">JPG, PNG, or WebP · up to 8 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseFile(event.target.files?.[0])} className="mt-2 block w-full text-sm text-foreground" /></label><div className="relative mt-3 grid h-56 w-full place-items-center overflow-hidden rounded-lg border border-border bg-muted sm:w-80">{preview ? <img src={preview} alt="Product image preview" className="h-full w-full object-cover" /> : <ImageIcon className="text-muted-foreground" size={28} />}{preview && <button type="button" onClick={() => { setFile(null); setImage(""); setPreview(""); }} className="absolute right-2 top-2 rounded-full bg-background/90 p-2 text-foreground" aria-label="Remove product image"><X size={16} /></button>}</div></div></CardContent></Card>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}<div className="flex justify-end gap-2"><Link href={`/admin/products/${params.id}`}><Button type="button" variant="outline">Cancel</Button></Link><Button type="submit" disabled={busy}>{busy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{busy ? "Saving…" : "Save changes"}</Button></div></form>
  </div>;
}

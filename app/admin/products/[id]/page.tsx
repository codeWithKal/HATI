"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Image as ImageIcon, LoaderCircle, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/products/${params.id}`, { cache: "no-store" }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load product.");
      if (active) setProduct(data);
    }).catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Unable to load product."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [params.id]);

  const removeProduct = async () => {
    if (!window.confirm(`Delete ${product?.name?.en || "this product"}? This cannot be undone.`)) return;
    setError("");
    try {
      const response = await fetch(`/api/products/${params.id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete product.");
      router.push("/admin/products");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to delete product."); }
  };

  if (loading) return <div className="grid min-h-72 place-items-center text-muted-foreground"><LoaderCircle className="animate-spin" /></div>;
  if (!product) return <div className="space-y-4"><Link href="/admin/products" className="inline-flex items-center gap-2 text-sm text-primary"><ArrowLeft size={16} />Back to products</Link><p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error || "Product not found."}</p></div>;
  const images: string[] = product.images?.length ? product.images : product.image ? [product.image] : [];

  return <div className="mx-auto max-w-5xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><Link href="/admin/products" aria-label="Back to products" className="rounded-lg border border-border p-2 text-foreground hover:bg-muted"><ArrowLeft size={18} /></Link><div><h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><Package className="h-6 w-6 text-primary" />Product details</h1><p className="mt-1 text-sm text-muted-foreground">Catalog record #{product.id}</p></div></div><div className="flex gap-2"><Link href={`/admin/products/${product.id}/edit`}><Button><Edit className="mr-2 h-4 w-4" />Edit product</Button></Link><Button variant="destructive" onClick={() => void removeProduct()}><Trash2 className="mr-2 h-4 w-4" />Delete</Button></div></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"><Card className="overflow-hidden"><div className="grid min-h-72 place-items-center bg-muted">{images[0] ? <img src={images[0]} alt={product.name?.en || "Product image"} className="max-h-[520px] w-full object-contain" /> : <div className="text-center text-muted-foreground"><ImageIcon className="mx-auto mb-2" size={32} />No product image</div>}</div>{images.length > 1 && <div className="grid grid-cols-4 gap-2 p-3">{images.map((src, index) => <img key={`${src}-${index}`} src={src} alt={`${product.name?.en || "Product"} image ${index + 1}`} className="h-20 w-full rounded-md border border-border object-cover" />)}</div>}</Card><Card><CardContent className="space-y-5 p-5 sm:p-7"><div><h2 className="text-2xl font-semibold text-foreground">{product.name?.en || "Unnamed product"}</h2><span className="mt-2 inline-block rounded-full border border-border px-3 py-1 text-sm capitalize text-muted-foreground">{product.category || "Uncategorized"}</span></div><section className="space-y-3"><h3 className="font-semibold text-foreground">Descriptions</h3>{(["en", "am", "om"] as const).map((language) => <div key={language}><p className="text-xs font-semibold uppercase text-muted-foreground">{language}</p><p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{product.description?.[language] || "No description provided."}</p></div>)}</section><dl className="grid grid-cols-2 gap-4 border-t border-border pt-4"><div><dt className="text-xs text-muted-foreground">Price</dt><dd className="mt-1 font-medium text-foreground">{product.priceEtb == null ? "Not set" : `${Number(product.priceEtb).toLocaleString()} ETB`}</dd></div><div><dt className="text-xs text-muted-foreground">Stock</dt><dd className="mt-1 font-medium text-foreground">{product.stockM3 == null ? "Not set" : `${product.stockM3} m³`}</dd></div></dl></CardContent></Card></div>
  </div>;
}

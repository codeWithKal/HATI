"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, LoaderCircle, Package, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const inputClass = 'mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: { en: '', am: '', om: '' }, description: { en: '', am: '', om: '' }, category: '', priceEtb: '', stockM3: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (!file) { setPreview(''); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  const selectImage = (selected?: File) => {
    if (!selected) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 8 * 1024 * 1024) { setError('Choose a JPG, PNG, or WebP image smaller than 8 MB.'); return; }
    setError(''); setFile(selected);
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!form.name.en.trim() || !form.description.en.trim() || !form.category.trim()) { setError('Name, description, and category are required.'); return; }
    if ((form.priceEtb && Number(form.priceEtb) < 0) || (form.stockM3 && Number(form.stockM3) < 0)) { setError('Price and stock cannot be negative.'); return; }
    setBusy(true);
    try {
      let image = '';
      if (file) { const data = new FormData(); data.set('imageFile', file); const uploaded = await fetch('/api/admin/images/products', { method: 'POST', body: data }); const result = await uploaded.json(); if (!uploaded.ok) throw new Error(result.error || 'Image upload failed.'); image = result.image; }
      const response = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, priceEtb: form.priceEtb || null, stockM3: form.stockM3 || null, image }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to save product.');
      router.push('/admin/products'); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save product.'); setBusy(false); }
  };

  return <div className="mx-auto max-w-4xl space-y-6">
    <div className="flex items-center gap-3"><Link href="/admin/products" aria-label="Back to products" className="rounded-lg border border-border p-2 text-foreground hover:bg-muted"><ArrowLeft size={18} /></Link><div><h1 className="flex items-center gap-2 text-2xl font-bold text-foreground"><Package className="h-6 w-6 text-primary" />Add Product</h1><p className="mt-1 text-sm text-muted-foreground">Create an item in the product catalog.</p></div></div>
    <form onSubmit={submit} className="space-y-5">
      <Card><CardContent className="grid gap-4 p-5 sm:grid-cols-2">
        {(['en', 'am', 'om'] as const).map((language) => <label key={language} className="text-sm font-medium text-foreground">Product name ({language.toUpperCase()}){language === 'en' && <span className="text-red-600"> *</span>}<input required={language === 'en'} className={inputClass} value={form.name[language]} onChange={(e) => setForm({ ...form, name: { ...form.name, [language]: e.target.value } })} /></label>)}
        <label className="text-sm font-medium text-foreground">Category <span className="text-red-600">*</span><input required className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Construction materials" /></label>
        {(['en', 'am', 'om'] as const).map((language) => <label key={language} className="text-sm font-medium text-foreground sm:col-span-2">Description ({language.toUpperCase()}){language === 'en' && <span className="text-red-600"> *</span>}<textarea required={language === 'en'} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground" value={form.description[language]} onChange={(e) => setForm({ ...form, description: { ...form.description, [language]: e.target.value } })} /></label>)}
        <label className="text-sm font-medium text-foreground">Price (ETB)<input type="number" min="0" step="0.01" className={inputClass} value={form.priceEtb} onChange={(e) => setForm({ ...form, priceEtb: e.target.value })} /></label>
        <label className="text-sm font-medium text-foreground">Stock (m³)<input type="number" min="0" step="0.001" className={inputClass} value={form.stockM3} onChange={(e) => setForm({ ...form, stockM3: e.target.value })} /></label>
        <div className="sm:col-span-2"><label className="text-sm font-medium text-foreground">Product image <span className="font-normal text-muted-foreground">JPG, PNG, or WebP · up to 8 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => selectImage(e.target.files?.[0])} className="mt-2 block w-full text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" /></label>{preview ? <div className="relative mt-3 h-56 w-full overflow-hidden rounded-lg border border-border bg-muted sm:w-80"><img src={preview} alt="Product image preview" className="h-full w-full object-cover" /><button type="button" onClick={() => setFile(null)} className="absolute right-2 top-2 rounded-full bg-background/90 p-2 text-foreground" aria-label="Remove selected image"><X size={16} /></button></div> : <div className="mt-3 grid h-40 place-items-center rounded-lg border border-dashed border-border bg-muted text-muted-foreground sm:w-80"><ImageIcon size={28} /></div>}</div>
      </CardContent></Card>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</p>}
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}{busy ? 'Saving…' : 'Save product'}</Button></div>
    </form>
  </div>;
}

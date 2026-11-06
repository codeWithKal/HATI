"use client";

import { Truck, Package, DollarSign, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface InventoryItem {
  id: number;
  materialName: { en: string; am: string; om: string };
  price_in_m3: { en: string; am: string; om: string };
  stokeRemaining_in_m3: { en: string; am: string; om: string };
}

interface InventoryCardProps {
  item: InventoryItem;
  truckCapacity?: number;
  showTruckEstimate?: boolean;
  showPrice?: boolean;
  className?: string;
  transparent?: boolean;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function InventoryCard({
  item, truckCapacity = 16.74, showTruckEstimate = true, showPrice = true,
  className = "", onEdit, onDelete, showActions = false,
}: InventoryCardProps) {
  const { language } = useLanguage();
  const value = (localized: { en: string; am: string; om: string }) => localized?.[language] || localized?.en || "";
  const numberValue = (raw: string) => Number.parseFloat(String(raw ?? "").replace(/[^0-9.]/g, "")) || 0;
  const stock = numberValue(value(item.stokeRemaining_in_m3));
  const price = numberValue(value(item.price_in_m3));
  const trucks = Math.round(stock / truckCapacity);
  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "ETB", maximumFractionDigits: 0 }).format(amount);
  const level = stock > 400
    ? { label: { en: "High", am: "ከፍተኛ", om: "Ol" }, style: "border-green-600/30 bg-green-500/10 text-green-800 dark:text-green-300" }
    : stock > 200
      ? { label: { en: "Medium", am: "መካከለኛ", om: "Giddugaleessa" }, style: "border-amber-600/30 bg-amber-500/10 text-amber-800 dark:text-amber-300" }
      : { label: { en: "Low", am: "ዝቅተኛ", om: "Gadi" }, style: "border-red-600/30 bg-red-500/10 text-red-800 dark:text-red-300" };

  return (
    <Card className={`border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-md ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-foreground">{value(item.materialName)}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="border-border text-muted-foreground">ID: {item.id}</Badge>
            <Badge variant="outline" className={level.style}>{value(level.label)}</Badge>
          </div>
        </div>
        <Package className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1"><p className="text-sm text-muted-foreground">{language === "am" ? "የቀረ ክምችት" : language === "om" ? "Hafuun Kuusa" : "Stock Remaining"}</p><p className="text-xl font-bold text-foreground">{value(item.stokeRemaining_in_m3)}</p></div>
        {showTruckEstimate && <div className="space-y-1"><p className="text-sm text-muted-foreground">{language === "am" ? "የሚገመቱ መኪናዎች" : language === "om" ? "Mootoroowwan Tilmaaman" : "Estimated Trucks"}</p><p className="flex items-center gap-2 text-xl font-bold text-foreground"><Truck className="h-5 w-5 text-primary" />{trucks}</p></div>}
      </div>

      {showPrice && <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div className="space-y-1"><p className="text-sm text-muted-foreground">{language === "am" ? "ዋጋ በአንድ ኪዩቢክ ሜትር" : language === "om" ? "Gatii m³ tokko" : "Price per m³"}</p><p className="flex items-center gap-1 text-base font-semibold text-foreground"><DollarSign className="h-4 w-4 text-primary" />{value(item.price_in_m3)}</p></div>
        <div className="space-y-1"><p className="text-sm text-muted-foreground">{language === "am" ? "የአንድ መኪና ዋጋ" : language === "om" ? "Gatii Mootoro Tokkoo" : "Per Truck Value"}</p><p className="text-base font-bold text-foreground">{formatCurrency(truckCapacity * price)}</p></div>
      </div>}

      <div className="mt-4"><div className="h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-all" style={{ width: `${Math.min((stock / 500) * 100, 100)}%` }} /></div><div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>0 m³</span><span>500 m³</span></div></div>

      {showActions && (onEdit || onDelete) && <div className="mt-4 flex gap-2 border-t border-border pt-4">
        {onEdit && <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => onEdit(item)}><Edit2 className="h-4 w-4" />{language === "am" ? "አርትዕ" : language === "om" ? "Jijjiiri" : "Edit"}</Button>}
        {onDelete && <Button variant="destructive" size="sm" className="flex-1 gap-2" onClick={() => onDelete(item.id)}><Trash2 className="h-4 w-4" />{language === "am" ? "ሰርዝ" : language === "om" ? "Haqi" : "Delete"}</Button>}
      </div>}
    </Card>
  );
}

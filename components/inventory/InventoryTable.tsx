"use client";

import { Truck, Package, DollarSign, Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface InventoryItem {
  id: number;
  materialName: {
    en: string;
    am: string;
    om: string;
  };
  price_in_m3: {
    en: string;
    am: string;
    om: string;
  };
  stokeRemaining_in_m3: {
    en: string;
    am: string;
    om: string;
  };
}

interface InventoryTableProps {
  items: InventoryItem[];
  truckCapacity?: number;
  showTruckEstimate?: boolean;
  showPrice?: boolean;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function InventoryTable({
  items,
  truckCapacity = 16.74,
  showTruckEstimate = true,
  showPrice = true,
  onEdit,
  onDelete,
  showActions = false,
}: InventoryTableProps) {
  const { language } = useLanguage();

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Parse numeric values from formatted strings
  const getStockValue = (str: string) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  };

  const getPriceValue = (str: string) => {
    if (!str) return 0;
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Table headers with language support
  const headers = {
    id: {
      en: "ID",
      am: "መታወቂያ",
      om: "ID",
    },
    material: {
      en: "Material",
      am: "ቁሳቁስ",
      om: "Meessaa",
    },
    stock: {
      en: "Stock (m³)",
      am: "ክምችት (ሜ³)",
      om: "Kuusa (m³)",
    },
    trucks: {
      en: "Trucks",
      am: "መኪናዎች",
      om: "Mootoroowwan",
    },
    price: {
      en: "Price/m³",
      am: "ዋጋ/ሜ³",
      om: "Gatii/m³",
    },
    perTruck: {
      en: "Per Truck",
      am: "በአንድ መኪና",
      om: "Mootoro Tokkoon",
    },
    status: {
      en: "Status",
      am: "ሁኔታ",
      om: "Haala",
    },
    actions: {
      en: "Actions",
      am: "ተግባራት",
      om: "Gochaalee",
    },
  };

  // Status labels
  const statusLabels = {
    high: {
      en: "High",
      am: "ከፍተኛ",
      om: "Ol",
    },
    medium: {
      en: "Medium",
      am: "መካከለኛ",
      om: "Giddugaleessa",
    },
    low: {
      en: "Low",
      am: "ዝቅተኛ",
      om: "Gadi",
    },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary/5 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
              {tValue(headers.id)}
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
              {tValue(headers.material)}
            </th>
            <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
              {tValue(headers.stock)}
            </th>
            {showTruckEstimate && (
              <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                {tValue(headers.trucks)}
              </th>
            )}
            {showPrice && (
              <>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  {tValue(headers.price)}
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground">
                  {tValue(headers.perTruck)}
                </th>
              </>
            )}
            <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
              {tValue(headers.status)}
            </th>
            {showActions && (
              <th className="px-6 py-3 text-center text-sm font-medium text-muted-foreground">
                {tValue(headers.actions)}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const stockStr = tValue(item.stokeRemaining_in_m3);
            const priceStr = tValue(item.price_in_m3);
            const stockValue = getStockValue(stockStr);
            const priceValue = getPriceValue(priceStr);
            const estimatedTrucks = Math.round(stockValue / truckCapacity);
            // Per truck value = truck capacity * price per m³
            const perTruckValue = truckCapacity * priceValue;

            const getStatus = () => {
              if (stockValue > 400)
                return {
                  label: statusLabels.high,
                  color:
                    "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
                };
              if (stockValue > 200)
                return {
                  label: statusLabels.medium,
                  color:
                    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
                };
              return {
                label: statusLabels.low,
                color:
                  "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
              };
            };
            const status = getStatus();

            return (
              <tr
                key={item.id}
                className="border-b hover:bg-secondary/5 transition-colors"
              >
                <td className="px-6 py-4 text-sm">#{item.id}</td>
                <td className="px-6 py-4">
                  <span className="font-medium capitalize">
                    {tValue(item.materialName)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">{stockStr}</td>
                {showTruckEstimate && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Truck className="h-4 w-4 text-primary/60" />
                      <span className="font-medium">{estimatedTrucks}</span>
                    </div>
                  </td>
                )}
                {showPrice && (
                  <>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="h-4 w-4 text-primary/60" />
                        <span className="font-medium">{priceStr}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-primary">
                      {formatCurrency(perTruckValue)}
                    </td>
                  </>
                )}
                <td className="px-6 py-4">
                  <Badge className={status.color}>{tValue(status.label)}</Badge>
                </td>
                {showActions && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

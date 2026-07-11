"use client";

import { Truck, Package, DollarSign, Edit2, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  item,
  truckCapacity = 16.74,
  showTruckEstimate = true,
  showPrice = true,
  className = "",
  transparent = false,
  onEdit,
  onDelete,
  showActions = false,
}: InventoryCardProps) {
  const { language } = useLanguage();

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Parse numeric values from formatted strings
  const getStockValue = (str: string) => {
    return parseFloat(str.replace(/[^0-9.]/g, ""));
  };

  const getPriceValue = (str: string) => {
    return parseFloat(str.replace(/[^0-9.]/g, ""));
  };

  const stockValue = getStockValue(tValue(item.stokeRemaining_in_m3));
  const priceValue = getPriceValue(tValue(item.price_in_m3));

  // Calculate estimated trucks (rounded)
  const estimatedTrucks = Math.round(stockValue / truckCapacity);

  // Calculate total value = truck capacity * price per m³ (estimated payment per vehicle)
  const totalValue = truckCapacity * priceValue;

  // Format currency for total
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Determine stock level status
  const getStockStatus = () => {
    if (stockValue > 400)
      return {
        label: {
          en: "High",
          am: "ከፍተኛ",
          om: "Ol",
        },
        color: "bg-green-500",
      };
    if (stockValue > 200)
      return {
        label: {
          en: "Medium",
          am: "መካከለኛ",
          om: "Giddugaleessa",
        },
        color: "bg-yellow-500",
      };
    return {
      label: {
        en: "Low",
        am: "ዝቅተኛ",
        om: "Gadi",
      },
      color: "bg-red-500",
    };
  };

  const stockStatus = getStockStatus();

  // Determine color scheme based on transparent mode
  const isTransparent = transparent;

  // Text color classes - either white or black
  const textWhite = "text-white";
  const textPrimary = "text-primary";

  return (
    <Card
      className={`p-6 transition-all duration-300 ${
        isTransparent
          ? "bg-white backdrop-blur-sm border-white/30 hover:bg-white"
          : "bg-white border-border hover:shadow-lg"
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`font-semibold text-lg text-white${textWhite}`}>
            {tValue(item.materialName)}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge
              variant="outline"
              className={`text-xs ${isTransparent ? "border-gray-300 text-white" : "text-white"}`}
            >
              ID: {item.id}
            </Badge>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${stockStatus.color}`} />
              <span className={`text-xs ${textWhite}`}>
                {tValue(stockStatus.label)}
              </span>
            </div>
          </div>
        </div>
        <Package className={`h-5 w-5 ${textWhite}`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className={`text-sm ${textWhite}`}>
            {language === "en" && "Stock Remaining"}
            {language === "am" && "የቀረ ክምችት"}
            {language === "om" && "Hafuun Kuusa"}
          </p>
          <p className={`text-2xl font-bold ${textWhite}`}>
            {tValue(item.stokeRemaining_in_m3)}
          </p>
        </div>

        {showTruckEstimate && (
          <div className="space-y-1">
            <p className={`text-sm ${textWhite}`}>
              {language === "en" && "Estimated Trucks"}
              {language === "am" && "የሚገመቱ መኪናዎች"}
              {language === "om" && "Mootoroowwan Tilmaaman"}
            </p>
            <div className="flex items-center gap-2">
              <Truck className={`h-5 w-5 ${textWhite}`} />
              <p className={`text-2xl font-bold ${textWhite}`}>
                {estimatedTrucks}
                <span className={`text-sm font-normal ml-1 ${textWhite}`}>
                  {language === "en" &&
                    `truck${estimatedTrucks !== 1 ? "s" : ""}`}
                  {language === "am" && "መኪና"}
                  {language === "om" && "mootoro"}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Price Information */}
      {showPrice && (
        <div
          className={`grid grid-cols-2 gap-4 mt-4 pt-4 ${isTransparent ? "border-white" : "border-border"} border-t`}
        >
          <div className="space-y-1">
            <p className={`text-sm ${textWhite}`}>
              {language === "en" && "Price per m³"}
              {language === "am" && "ዋጋ በአንድ ኪዩቢክ ሜትር"}
              {language === "om" && "Gatii m³ tokko"}
            </p>
            <div className="flex items-center gap-2">
              <DollarSign className={`h-4 w-4 ${textWhite}`} />
              <p className={`text-lg font-semibold ${textWhite}`}>
                {tValue(item.price_in_m3)}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-sm ${textWhite}`}>
              {language === "en" && "Per Truck Value"}
              {language === "am" && "የአንድ መኪና ዋጋ"}
              {language === "om" && "Gatii Mootoro Tokkoo"}
            </p>
            <p className={`text-lg font-bold ${textWhite}`}>
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="mt-4">
        <div
          className={`w-full h-2 ${isTransparent ? "bg-gray-200" : "bg-secondary"} rounded-full overflow-hidden`}
        >
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.min((stockValue / 500) * 100, 100)}%`,
            }}
          />
        </div>
        <div className={`flex justify-between text-xs mt-1 ${textWhite}`}>
          <span>0 m³</span>
          <span>500 m³</span>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (onEdit || onDelete) && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-white">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => onEdit(item)}
            >
              <Edit2 className="h-4 w-4" />
              {language === "en" && "Edit"}
              {language === "am" && "አርትዕ"}
              {language === "om" && "Jijjiiri"}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 gap-2"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
              {language === "en" && "Delete"}
              {language === "am" && "ሰርዝ"}
              {language === "om" && "Haqi"}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

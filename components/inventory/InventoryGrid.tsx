"use client";

import { InventoryCard } from "./InventoryCard";

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

interface InventoryGridProps {
  items: InventoryItem[];
  truckCapacity?: number;
  showTruckEstimate?: boolean;
  showPrice?: boolean;
  transparent?: boolean;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export function InventoryGrid({
  items,
  truckCapacity = 16.74,
  showTruckEstimate = true,
  showPrice = true,
  transparent = false,
  columns = 3,
  className = "",
  onEdit,
  onDelete,
  showActions = false,
}: InventoryGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-6 ${className}`}>
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          truckCapacity={truckCapacity}
          showTruckEstimate={showTruckEstimate}
          showPrice={showPrice}
          transparent={transparent}
          onEdit={onEdit}
          onDelete={onDelete}
          showActions={showActions}
        />
      ))}
    </div>
  );
}

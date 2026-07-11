"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardHat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import homeHero from "@/data/homeHero.json";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import inventoryData from "@/data/inventory.json";

export function HeroSection() {
  const { language } = useLanguage();

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get hero data from JSON
  const hero = homeHero[0];

  return (
    <section
      className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden py-20 px-4"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center space-y-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white/90 border border-white/20">
          <HardHat className="h-4 w-4" />
          <span>{tValue(hero.badge)}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-balance text-white drop-shadow-lg max-w-4xl mx-auto">
          {tValue(hero.title)}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto text-balance drop-shadow-md">
          {tValue(hero.subtitle)}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
          <Link href="/contact">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              {tValue(hero.cta)}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border-white/20 text-white hover:text-white"
            >
              {tValue(hero.secondaryCta)}
            </Button>
          </Link>
        </div>

        {/* Inventory Cards - Display below CTAs */}
        <div className="w-full pt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inventoryData.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                truckCapacity={16.74}
                showTruckEstimate={true}
                className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

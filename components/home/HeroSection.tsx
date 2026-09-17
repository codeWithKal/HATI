"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, HardHat } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import homeHero from "@/data/homeHero.json";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import inventoryData from "@/data/inventory.json";

const BACKGROUND_IMAGES = [
  "/images/bg/IMG_20201130_102959.jpg",
  "/images/bg/IMG_20201130_103454.jpg",
  "/images/bg/IMG_20201130_103841.jpg",
  "/images/bg/IMG_20260815_110622_332.jpg",
  "/images/bg/IMG_20260815_110623_648.jpg",
  "/images/bg/IMG_20260815_110624_489.jpg",
  "/images/bg/IMG_20260815_110626_528.jpg",
  "/images/bg/bg.jpg",
  "/images/bg/IMG_20260815_110636_592.jpg",
  "/images/bg/IMG_20260815_110638_380.jpg",
  "/images/bg/IMG_20260815_110639_312.jpg",
  "/images/bg/IMG_20260815_110640_880.jpg",
];

const SLIDE_INTERVAL_MS = 5000; // 6 seconds per image
const TRANSITION_MS = 1500; // crossfade duration

export function HeroSection() {
  const { language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const tValue = (obj: any) => obj?.[language] ?? obj?.["en"] ?? "";

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Slideshow timer
  useEffect(() => {
    if (reduceMotion) return;
    if (BACKGROUND_IMAGES.length <= 1) return;

    let timer: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      timer = setInterval(() => {
        setIndex((i) => (i + 1) % BACKGROUND_IMAGES.length);
      }, SLIDE_INTERVAL_MS);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    // Pause when tab is hidden
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduceMotion]);

  // Get hero data from JSON
  const hero = homeHero[0];

  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background slideshow */}
      <div className="absolute inset-0">
        {BACKGROUND_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
              willChange: "opacity",
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-[1]"></div>
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10 z-[2]"></div>

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

        {/* Slideshow indicator dots */}
        {!reduceMotion && BACKGROUND_IMAGES.length > 1 && (
          <div className="flex items-center gap-2 pt-4">
            {BACKGROUND_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

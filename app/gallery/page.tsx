"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Images,
  Building2,
  ArrowRight,
  ZoomIn,
  Grid,
  LayoutGrid,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  HardHat,
  Users,
} from "lucide-react";
import galleryData from "@/data/gallery.json";
import galleryStatsData from "@/data/galleryStats.json";

const iconMap: Record<string, any> = {
  Images: Images,
  Building2: Building2,
  LayoutGrid: LayoutGrid,
};

const categoryIconMap: Record<string, any> = {
  building: Building2,
  infrastructure: HardHat,
  development: Users,
};

export default function Gallery() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState("all");

  const t = {
    title: {
      en: "Project Gallery",
      am: "ፕሮጀክት ጋለሪ",
      om: "Galaanii Porjeektii",
    },
    subtitle: {
      en: "Capturing Excellence in Every Frame",
      am: "በእያንዳንዱ ፍሬም ውስጥ ምርጥነትን መቅረጽ",
      om: "Ogummaata Frame Hundaa Keessatti Qabachuu",
    },
    description: {
      en: "Explore our visual portfolio showcasing the quality and craftsmanship of our construction projects across Ethiopia.",
      am: "በምስራቅ አፍሪካ ያሉ የግንባታ ፕሮጀክቶቻችንን ጥራት እና የእደ ጥበብ ስራ የሚያሳይ ምስላዊ ፖርትፎሊዮችን ያስሱ።",
      om: "Midhaa fi ogummaa porjeektota ijaarsaa keenyaa Gareeffannoo Bahaasaa Ilaalcha keessatti agarsiisu portfolio visual keenya ilaalaa.",
    },
    filters: {
      all: { en: "All Projects", am: "ሁሉም ፕሮጀክቶች", om: "Porjeektota Hunda" },
      building: { en: "Buildings", am: "ህንጻዎች", om: "Manneen" },
      infrastructure: { en: "Infrastructure", am: "መሠረተ ልማት", om: "Midhaa" },
      development: { en: "Development", am: "ልማት", om: "Ijaarsa" },
    },
    viewProject: {
      en: "View Project",
      am: "ፕሮጀክት ይመልከቱ",
      om: "Porjeektii Ilaalaa",
    },
    stats: {
      title: {
        en: "Gallery Highlights",
        am: "የጋለሪ ድምቀቶች",
        om: "Galaanii Ijaarsa",
      },
    },
    cta: {
      title: {
        en: "See Our Work in Person?",
        am: "ስራችንን በአካል ማየት ይፈልጋሉ?",
        om: "Hojii Keenyaa Ilaaluu Barbaaddaa?",
      },
      description: {
        en: "Schedule a site visit to see our quality craftsmanship firsthand",
        am: "ስራችንን በአካል ለማየት የጣቢያ ጉብኝት ያዘጋጁ",
        om: "Hojii keenya ilaaluuf daawwanna godina tokko qabaa",
      },
      button: {
        en: "Schedule Visit",
        am: "ጉብኝት ያዘጋጁ",
        om: "Daawwanna Qabaa",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const galleryItems = galleryData;
  const stats = galleryStatsData;

  const filteredItems =
    filter === "all"
      ? galleryItems
      : galleryItems.filter((item: any) => item.category === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "ongoing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  // Get active items only
  const activeItems = galleryItems.filter(
    (item: any) => item.isActive !== false,
  );

  // Filter active items
  const activeFilteredItems =
    filter === "all"
      ? activeItems
      : activeItems.filter((item: any) => item.category === filter);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Images className="h-4 w-4" />
              <span>
                {language === "en" && "Visual Portfolio"}
                {language === "am" && "ምስላዊ ፖርትፎሊዮ"}
                {language === "om" && "Portfolio Visual"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {tValue(t.title)}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light mb-4">
              {tValue(t.subtitle)}
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              {tValue(t.description)}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              {stats.map((stat: any) => {
                const Icon = iconMap[stat.icon] || Images;
                return (
                  <div key={stat.id} className="text-center group">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tValue(stat.label)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            {/* Filter Bar */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Project Highlights"}
                  {language === "am" && "የፕሮጀክት ድምቀቶች"}
                  {language === "om" && "Ijaarsa Porjeektii"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activeFilteredItems.length} projects displayed`}
                  {language === "am" &&
                    `${activeFilteredItems.length} ፕሮጀክቶች ታይተዋል`}
                  {language === "om" &&
                    `${activeFilteredItems.length} porjeektota agarsiifaman`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={filter === "all" ? "default" : "outline"}
                  className={`px-4 py-2 cursor-pointer transition-all ${
                    filter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  <Grid className="h-3 w-3 mr-1" />
                  {tValue(t.filters.all)}
                </Badge>
                <Badge
                  variant={filter === "building" ? "default" : "outline"}
                  className={`px-4 py-2 cursor-pointer transition-all ${
                    filter === "building"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setFilter("building")}
                >
                  <Building2 className="h-3 w-3 mr-1" />
                  {tValue(t.filters.building)}
                </Badge>
                <Badge
                  variant={filter === "infrastructure" ? "default" : "outline"}
                  className={`px-4 py-2 cursor-pointer transition-all ${
                    filter === "infrastructure"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setFilter("infrastructure")}
                >
                  <HardHat className="h-3 w-3 mr-1" />
                  {tValue(t.filters.infrastructure)}
                </Badge>
                <Badge
                  variant={filter === "development" ? "default" : "outline"}
                  className={`px-4 py-2 cursor-pointer transition-all ${
                    filter === "development"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setFilter("development")}
                >
                  <Users className="h-3 w-3 mr-1" />
                  {tValue(t.filters.development)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeFilteredItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={tValue(item.title)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Content - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              {tValue(item.title)}
                            </h3>
                            <p className="text-sm text-gray-200/80">
                              {tValue(item.categoryLabel)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {item.status === "completed"
                              ? language === "en"
                                ? "Done"
                                : language === "am"
                                  ? "ተጠናቀቀ"
                                  : "Xumuramee"
                              : language === "en"
                                ? "Progress"
                                : language === "am"
                                  ? "በመቀጠል"
                                  : "Itti Fufa"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-200/70">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {tValue(item.location)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.year || "2024"}
                          </span>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="mt-2 gap-1 w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20"
                        >
                          <ZoomIn className="h-3 w-3" />
                          {tValue(t.viewProject)}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {activeFilteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "en" && "No projects found"}
                  {language === "am" && "ምንም ፕሮጀክቶች አልተገኙም"}
                  {language === "om" && "Porjeektota hin argamu"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "en" && "Try adjusting your filter selection"}
                  {language === "am" && "ማጣሪያ ምርጫዎን ለማስተካከል ይሞክሩ"}
                  {language === "om" && "Filannoo keessan jijjiiruun yaalaa"}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
              <span>
                {language === "en" && "Visit Our Sites"}
                {language === "am" && "ጣቢያችንን ይጎብኙ"}
                {language === "om" && "Bakka Keenyaa Daawwadhaa"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {tValue(t.cta.title)}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {tValue(t.cta.description)}
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
              >
                <Calendar className="h-5 w-5" />
                {tValue(t.cta.button)}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package,
  HardHat,
  ArrowRight,
  CheckCircle2,
  Shield,
  Wrench,
  Sparkles,
} from "lucide-react";
import productsData from "@/data/products.json";

type Filter = "all" | "materials";

export default function Products() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<Filter>("all");

  const t = {
    eyebrow: {
      en: "Our Collection",
      am: "ስብስባችን",
      om: "Walitti Qabannaa Keenyaa",
    },
    title: { en: "Our Products", am: "ምርቶቻችን", om: "Ala Keenyaa" },
    subtitle: {
      en: "Premium Construction Materials & Solutions",
      am: "ከፍተኛ ጥራት ያላቸው የግንባታ ቁሳቁሶች እና መፍትሄዎች",
      om: "Alaa Ijaarsa Midhaa & Furmaata",
    },
    description: {
      en: "Discover our comprehensive range of high-quality construction materials, systems, and equipment designed to meet the demands of modern construction projects.",
      am: "ዘመናዊ የግንባታ ፕሮጀክቶችን ፍላጎቶች ለማሟላት የተቀየሱ ከፍተኛ ጥራት ያላቸውን የግንባታ ቁሳቁሶች፣ ስርዓቶች እና መሳሪያዎች ያግኙ።",
      om: "Alaa ijaarsa midhaa, sirnaa fi meeshaalee porjeektota ijaarsaa haaraa fedhii guutuu qabnu argachuu.",
    },
    categories: {
      all: { en: "All Products", am: "ሁሉም ምርቶች", om: "Alaa Hunda" },
      materials: { en: "Materials", am: "ቁሳቁሶች", om: "Alaa" },
      systems: { en: "Systems", am: "ስርዓቶች", om: "Sirna" },
      equipment: { en: "Equipment", am: "መሳሪያዎች", om: "Meeshaalee" },
    },
    features: {
      quality: { en: "Premium Quality", am: "ከፍተኛ ጥራት", om: "Midhaa Gubbaa" },
      certified: {
        en: "Certified Materials",
        am: "የተረጋገጡ ቁሳቁሶች",
        om: "Alaa Mirkaneessaa",
      },
      sustainable: {
        en: "Sustainable Solutions",
        am: "ዘላለማዊ መፍትሄዎች",
        om: "Furmaata Itti Fufiinsa Qabu",
      },
    },
    productRange: {
      en: "Our Product Range",
      am: "የምርቶቻችን ዝርዝር",
      om: "Danaa Alaa Keenyaa",
    },
    productsAvailable: {
      en: "products available",
      am: "ምርቶች ይገኛሉ",
      om: "alaa jira",
    },
    viewDetails: {
      en: "View Details",
      am: "ዝርዝር ይመልከቱ",
      om: "Gari Dhaabi",
    },
    openProduct: {
      en: "Open Product",
      am: "ምርቱን ክፈት",
      om: "Alaa Bani",
    },
    noProducts: {
      en: "No products found in this category.",
      am: "በዚህ ምድብ ውስጥ ምንም ምርቶች አልተገኙም።",
      om: "Ramaddii kana keessatti alaan hin argamne.",
    },
    cta: {
      eyebrow: {
        en: "Custom Solutions",
        am: "ብጁ መፍትሄዎች",
        om: "Furmaata Addaddaa",
      },
      title: {
        en: "Need Custom Solutions?",
        am: "ብጁ መፍትሄዎች ያስፈልግዎታል?",
        om: "Furmaata Addaddaa Barbaaddaa?",
      },
      description: {
        en: "Contact our team for custom quotes and bulk orders",
        am: "ብጁ ዋጋዎች እና የጅምላ ትዕዛዞች ቡድናችንን ያግኙ",
        om: "Maqa addaddaa fi ajaja baayʼinaaf garee keenya qunnamaa",
      },
      button: { en: "Contact Us", am: "ያግኙን", om: "Qunnamaa" },
    },
  };

  const tValue = (obj: any) => obj?.[language] ?? obj?.["en"] ?? "";
  const products = productsData;

  // Safe category label lookup — falls back to "materials" only if key truly missing
  const categoryLabel = (category: string) => {
    const cat = (t.categories as Record<string, any>)[category];
    return tValue(cat ?? t.categories.materials);
  };

  const filteredProducts = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p: any) => p.category === filter);
  }, [filter, products]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "materials":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
      case "systems":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25";
      case "equipment":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      default:
        return "bg-primary/10 text-primary border-primary/25";
    }
  };

  const getProductIcon = (product: any) => {
    const name = (product.name?.en ?? "").toLowerCase();
    if (name.includes("steel") || name.includes("beam")) return "🏗️";
    if (name.includes("cement") || name.includes("concrete")) return "🧱";
    if (name.includes("electrical")) return "⚡";
    if (name.includes("piping") || name.includes("pipe")) return "🔧";
    if (name.includes("safety") || name.includes("protection")) return "🛡️";
    return "📦";
  };

  const filters: { key: Filter; label: any; icon: any }[] = [
    { key: "all", label: t.categories.all, icon: Sparkles },
    { key: "materials", label: t.categories.materials, icon: Package },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl" />
          <div className="container mx-auto text-center relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Package className="h-4 w-4" />
              <span>{tValue(t.eyebrow)}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-primary via-primary/85 to-primary/60 bg-clip-text text-transparent">
              {tValue(t.title)}
            </h1>
            <p className="text-lg md:text-2xl text-foreground/80 max-w-3xl mx-auto font-light mb-4 tracking-tight">
              {tValue(t.subtitle)}
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {tValue(t.description)}
            </p>
          </div>
        </section>

        {/* Features Banner */}
        <section className="py-10 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: Shield, label: t.features.quality },
                { icon: CheckCircle2, label: t.features.certified },
                { icon: HardHat, label: t.features.sustainable },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="p-2.5 rounded-full bg-primary/10 border border-primary/15">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium tracking-tight">
                    {tValue(feature.label)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 md:py-24 px-4 bg-background">
          <div className="container mx-auto">
            {/* Section header */}
            <div className="mb-10 md:mb-14">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80 mb-3">
                    {language === "en" && "Catalog"}
                    {language === "am" && "ካታሎግ"}
                    {language === "om" && "Kataaloogii"}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {tValue(t.productRange)}
                  </h2>
                  <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/30 rounded-full mt-4" />
                  <p className="text-sm text-muted-foreground mt-4">
                    {filteredProducts.length} {tValue(t.productsAvailable)}
                  </p>
                </div>

                {/* Filters — only All + Materials */}
                <div className="flex flex-wrap gap-2">
                  {filters.map((f) => {
                    const active = filter === f.key;
                    const Icon = f.icon;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        aria-pressed={active}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-transparent hover:bg-primary/10 border-border text-foreground/80"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tValue(f.label)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                {tValue(t.noProducts)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredProducts.map((product: any) => {
                  const categoryColor = getCategoryColor(product.category);
                  const productIcon = getProductIcon(product);

                  return (
                    <Card
                      key={product.id}
                      tabIndex={0}
                      className="group overflow-hidden border border-border/60 bg-card shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 flex flex-col"
                    >
                      {/* Image box with hover zoom + gradient */}
                      <div className="relative">
                        <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-secondary/40 via-secondary/20 to-primary/5">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name?.[language] || product.name?.en}
                              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-focus-within:scale-110"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                                const parent = (e.target as HTMLImageElement)
                                  .parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="text-6xl flex items-center justify-center h-full">${productIcon}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl transition-transform duration-500 group-hover:scale-110 group-focus-within:scale-110">
                              {productIcon}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          <Badge
                            className={`absolute top-4 right-4 z-20 ${categoryColor} border backdrop-blur-sm text-[11px] font-medium`}
                          >
                            {categoryLabel(product.category)}
                          </Badge>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-6 space-y-4 flex flex-col flex-1">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold tracking-tight leading-snug line-clamp-2">
                            {tValue(product.name)}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {tValue(product.description)}
                          </p>
                        </div>

                        {/* Extra navigation button — asChild pattern */}
                        <Button
                          asChild
                          size="sm"
                          className="w-full gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                        >
                          <Link href={`/products/${product.id}`}>
                            {tValue(t.openProduct)}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider font-medium text-muted-foreground">
                            {categoryLabel(product.category)}
                          </span>
                          <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            {tValue(t.viewDetails)}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
              <Wrench className="h-4 w-4" />
              <span>{tValue(t.cta.eyebrow)}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
              {tValue(t.cta.title)}
            </h2>
            <p className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
              {tValue(t.cta.description)}
            </p>

            {/* asChild: Link must be the single child, no outer Link wrapper */}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-white text-primary hover:bg-white/95 shadow-lg shadow-black/10 rounded-full px-6"
            >
              <Link href="/contact">
                {tValue(t.cta.button)}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

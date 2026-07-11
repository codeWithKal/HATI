"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Package,
  Building2,
  Settings,
  Wrench,
  HardHat,
  Truck,
  ArrowRight,
  CheckCircle2,
  Tag,
  Layers,
  Shield,
  Image as ImageIcon,
} from "lucide-react";
import productsData from "@/data/products.json";

export default function Products() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "Our Products",
      am: "ምርቶቻችን",
      om: "Ala Keenyaa",
    },
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
      title: {
        en: "Categories",
        am: "ምድቦች",
        om: "Ramaddii",
      },
      materials: {
        en: "Materials",
        am: "ቁሳቁሶች",
        om: "Alaa",
      },
      systems: {
        en: "Systems",
        am: "ስርዓቶች",
        om: "Sirnaa",
      },
      equipment: {
        en: "Equipment",
        am: "መሳሪያዎች",
        om: "Meeshaa",
      },
    },
    features: {
      quality: {
        en: "Premium Quality",
        am: "ከፍተኛ ጥራት",
        om: "Midhaa Gubbaa",
      },
      certified: {
        en: "Certified Materials",
        am: "የተረጋገጡ ቁሳቁሶች",
        om: "Alaa Mirkaneessaa",
      },
      sustainable: {
        en: "Sustainable Solutions",
        am: "ዘላቂ መፍትሄዎች",
        om: "Furmaata Dhaabaa",
      },
    },
    viewDetails: {
      en: "View Details",
      am: "ዝርዝር ይመልከቱ",
      om: "Gari Dhaabi",
    },
    cta: {
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
      button: {
        en: "Contact Us",
        am: "ያግኙን",
        om: "Qunnamaa",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get products from the data
  const products = productsData;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "materials":
        return Package;
      case "systems":
        return Layers;
      case "equipment":
        return Settings;
      default:
        return Package;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "materials":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "systems":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "equipment":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Map product to icon emoji based on category or name
  const getProductIcon = (product: any) => {
    const name = product.name.en.toLowerCase();
    if (name.includes("steel") || name.includes("beam")) return "🏗️";
    if (name.includes("cement") || name.includes("concrete")) return "🧱";
    if (name.includes("electrical")) return "⚡";
    if (name.includes("piping") || name.includes("pipe")) return "🔧";
    if (name.includes("safety") || name.includes("protection")) return "🛡️";
    return "📦";
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Package className="h-4 w-4" />
              <span>
                {language === "en" && "Our Collection"}
                {language === "am" && "ስብስባችን"}
                {language === "om" && "Walitti Qabannaa Keenyaa"}
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

        {/* Features Banner */}
        <section className="py-12 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Shield, label: t.features.quality },
                { icon: CheckCircle2, label: t.features.certified },
                { icon: HardHat, label: t.features.sustainable },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">
                    {tValue(feature.label)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Our Product Range"}
                  {language === "am" && "የምርቶቻችን ዝርዝር"}
                  {language === "om" && "Danaa Alaa Keenyaa"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" && `${products.length} products available`}
                  {language === "am" && `${products.length} ምርቶች ይገኛሉ`}
                  {language === "om" && `${products.length} alaa jira`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                >
                  {tValue(t.categories.materials)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                >
                  {tValue(t.categories.systems)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                >
                  {tValue(t.categories.equipment)}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => {
                const CategoryIcon = getCategoryIcon(product.category);
                const categoryColor = getCategoryColor(product.category);
                const productIcon = getProductIcon(product);

                return (
                  <Card
                    key={product.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5"
                  >
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        {product.image ? (
                          <div className="relative w-full h-full">
                            <img
                              src={product.image}
                              alt={product.name[language] || product.name.en}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                            {/* Fallback emoji if image fails */}
                            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {productIcon}
                            </div>
                          </div>
                        ) : (
                          <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300">
                            {productIcon}
                          </div>
                        )}
                        <Badge
                          className={`absolute top-4 right-4 ${categoryColor} border backdrop-blur-sm`}
                        >
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {tValue(
                            t.categories[
                              product.category as
                                | "materials"
                                | "systems"
                                | "equipment"
                            ],
                          )}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tValue(product.name)}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {tValue(product.description)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Tag className="h-4 w-4" />
                          <span>
                            {language === "en" && "Category"}
                            {language === "am" && "ምድብ"}
                            {language === "om" && "Ramaddii"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 group-hover:gap-2 transition-all"
                        >
                          {tValue(t.viewDetails)}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <Wrench className="h-4 w-4" />
              <span>
                {language === "en" && "Custom Solutions"}
                {language === "am" && "ብጁ መፍትሄዎች"}
                {language === "om" && "Furmaata Addaddaa"}
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

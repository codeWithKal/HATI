"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  Images,
  Building2,
  ArrowRight,
  Calendar,
  LayoutGrid,
} from "lucide-react";
import galleryData from "@/data/gallery.json";
import galleryStatsData from "@/data/galleryStats.json";

const iconMap: Record<string, any> = {
  Images: Images,
  Building2: Building2,
  LayoutGrid: LayoutGrid,
};

export default function Gallery() {
  const { language } = useLanguage();

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

  // Safe translation getter — returns "" if obj is undefined/null
  const tValue = (obj: any) => obj?.[language] ?? obj?.["en"] ?? "";

  const galleryItems = galleryData;
  const stats = galleryStatsData;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
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
            {/* Header */}
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Project Highlights"}
                  {language === "am" && "የፕሮጀክት ድምቀቶች"}
                  {language === "om" && "Ijaarsa Porjeektii"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${galleryItems.length} projects displayed`}
                  {language === "am" && `${galleryItems.length} ፕሮጀክቶች ታይተዋል`}
                  {language === "om" &&
                    `${galleryItems.length} porjeektota agarsiifaman`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item: any) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-secondary/5 to-primary/5 border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={`Project ${item.id}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Overlay Gradient only — no text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                </div>
              ))}
            </div>

            {galleryItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "en" && "No projects found"}
                  {language === "am" && "ምንም ፕሮጀክቶች አልተገኙም"}
                  {language === "om" && "Porjeektota hin argamu"}
                </h3>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section — Button asChild, Link inside */}
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

            <Button
              asChild
              size="lg"
              variant="secondary"
              className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
            >
              <Link href="/contact">
                <Calendar className="h-5 w-5" />
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

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, Building2, X, Download, Trophy } from "lucide-react";
import certificationsData from "@/data/certifications.json";

type Localized = { en: string; am?: string; om?: string };

type Certification = {
  id: string;
  title: Localized;
  issuer: Localized;
  year: string;
  image: string;
};

const t = {
  badge: {
    en: "Our Credentials",
    am: "የእኛ ማረጋገጫዎች",
    om: "Ragaa Keenya",
  },
  title: {
    en: "Certifications & Licenses",
    am: "ማረጋገጫዎች እና ፈቃዶች",
    om: "Ragaalee fi Hayyamoota",
  },
  subtitle: {
    en: "Standards, licenses, and awards that back our commitment to quality, safety, and compliance.",
    am: "ለጥራት፣ ለደህንነት እና ለተገዢነት ያለንን ቁርጠኝነት የሚደግፉ ደረጃዎች፣ ፈቃዶች እና ሽልማቶች።",
    om: "Sadarkaalee, hayyamoota fi badhaasota kutannoo keenya qulqullina, nageenya fi kabajaaf deeggaran.",
  },
  featured: {
    en: "Our products say more than words",
    am: "ምርቶቻችን ከቃላት በላይ ይናገራሉ",
    om: "Oomishni keenya jechaa caalaa dubbata",
  },
  allCertificates: {
    en: "All Certifications",
    am: "ሁሉም ማረጋገጫዎች",
    om: "Ragaalee Hunda",
  },
  empty: {
    en: "No certifications available yet.",
    am: "እስካሁን ምንም ማረጋገጫ የለም።",
    om: "Ragaan amma hin jiru.",
  },
  view: {
    en: "View certificate",
    am: "ማረጋገጫ ይመልከቱ",
    om: "Ragaa ilaali",
  },
  viewFeatured: {
    en: "View featured certificate",
    am: "የተመረጠውን ማረጋገጫ ይመልከቱ",
    om: "Ragaa filatamaa ilaali",
  },
  download: {
    en: "Download",
    am: "አውርድ",
    om: "Buufadhu",
  },
  close: {
    en: "Close",
    am: "ዝጋ",
    om: "Cufi",
  },
};

export default function CertificationsPage() {
  const { language } = useLanguage();
  const [selected, setSelected] = useState<Certification | null>(null);

  const l = (language as "en" | "am" | "om") || "en";
  const tv = (obj?: Localized) => obj?.[l] ?? obj?.en ?? "";

  const items = certificationsData as Certification[];

  // Pull out the trophy item as the featured one
  const { featured, rest } = useMemo(() => {
    const featuredItem = items.find((i) =>
      i.image.toLowerCase().includes("trophy"),
    );
    return {
      featured: featuredItem ?? null,
      rest: featuredItem
        ? items.filter((i) => i.id !== featuredItem.id)
        : items,
    };
  }, [items]);

  const count = items.length;

  const countLabel = useMemo(() => {
    if (l === "am") return `${count} ማረጋገጫዎች`;
    if (l === "om") return `Ragaalee ${count}`;
    return `${count} ${count === 1 ? "certificate" : "certificates"}`;
  }, [count, l]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl" />
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Award className="h-4 w-4" />
              <span>{tv(t.badge)}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {tv(t.title)}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {tv(t.subtitle)}
            </p>
            <p className="text-sm text-muted-foreground mt-4">{countLabel}</p>
          </div>
        </section>

        {/* Featured Trophy */}
        {featured && (
          <section className="relative py-16 px-4 bg-gradient-to-b from-amber-500/5 via-background to-background overflow-hidden">
            {/* Gold glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto relative z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-amber-500/30 shadow-sm">
                  <Trophy className="h-4 w-4" />
                  <span>{tv(t.featured)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(featured)}
                aria-label={tv(t.viewFeatured)}
                className="group block w-full max-w-4xl mx-auto text-left rounded-3xl overflow-hidden border-2 border-amber-500/30 bg-card shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 hover:border-amber-500/50 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-400/5">
                  <Image
                    src={featured.image}
                    alt={tv(featured.title)}
                    fill
                    sizes="(max-width: 1024px) 100vw, 896px"
                    className="object-contain p-4 sm:p-8 group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  {/* Corner glow */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-400/30 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />
                </div>

                <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500/5 to-transparent border-t border-amber-500/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold leading-snug bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-300 bg-clip-text text-transparent">
                        {tv(featured.title)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{tv(featured.issuer)}</span>
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs gap-1 border-amber-500/40 text-amber-700 dark:text-amber-400 shrink-0 w-fit"
                    >
                      <Calendar className="h-3 w-3" />
                      {featured.year}
                    </Badge>
                  </div>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* All Certificates */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto">
            {rest.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{tv(t.allCertificates)}</h2>
                <div className="h-1 w-16 bg-gradient-to-r from-primary to-primary/40 rounded-full mt-2" />
              </div>
            )}

            {items.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                {tv(t.empty)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    aria-label={tv(t.view)}
                    className="group text-left rounded-xl border overflow-hidden bg-card hover:shadow-2xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image
                        src={item.image}
                        alt={tv(item.title)}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-semibold text-base leading-snug line-clamp-2">
                        {tv(item.title)}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-start gap-1.5 line-clamp-2">
                        <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>{tv(item.issuer)}</span>
                      </p>
                      <div className="pt-1">
                        <Badge variant="outline" className="text-xs gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.year}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label={tv(t.close)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-w-5xl w-full max-h-[92vh] bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative flex-1 min-h-0 bg-black/40">
              <Image
                src={selected.image}
                alt={tv(selected.title)}
                width={1600}
                height={1200}
                className="w-full h-full object-contain"
                priority
              />
            </div>

            <div className="p-5 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {tv(selected.title)}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {tv(selected.issuer)} — {selected.year}
                </p>
              </div>
              <a
                href={selected.image}
                download
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors shrink-0"
              >
                <Download className="h-4 w-4" />
                {tv(t.download)}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

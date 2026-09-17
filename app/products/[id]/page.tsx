"use client";

import { useMemo, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  Tag,
  Shield,
} from "lucide-react";
import productsData from "@/data/products.json";

export default function ProductDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  const id = params?.id as string;

  const product = useMemo(
    () => productsData.find((p: any) => String(p.id) === String(id)),
    [id],
  );

  if (!product) {
    notFound();
  }

  const tValue = (obj: any) => obj?.[language] ?? obj?.["en"] ?? "";

  // Build image list from product.images, falling back to product.image
  const productImages: string[] = useMemo(() => {
    const p = product as any;
    if (Array.isArray(p.images) && p.images.length > 0) return p.images;
    if (p.image) return [p.image];
    return [];
  }, [product]);

  const t = {
    back: {
      en: "Back to Products",
      am: "ወደ ምርቶች ተመለስ",
      om: "Gara Alaatti Deebi'i",
    },
    specs: {
      en: "Specifications",
      am: "ዝርዝር መረጃ",
      om: "Ibsa",
    },
    category: { en: "Category", am: "ምድብ", om: "Ramaddii" },
    inquire: {
      en: "Inquire About This Product",
      am: "ስለዚህ ምርት ይጠይቁ",
      om: "Waa'ee Ala Kanaa Gaafadhu",
    },
    contact: {
      en: "Contact Sales",
      am: "ሽያጭን ያግኙ",
      om: "Gurgurtaa Qunnamaa",
    },
    features: {
      en: "Why choose this product",
      am: "ይህን ምርት ለምን ይመርጡ",
      om: "Alaa kana maaliif filatta",
    },
    productId: { en: "Product ID", am: "የምርት መለያ", om: "Eenyummaa Ala" },
    noImages: {
      en: "No images available",
      am: "ምንም ምስሎች አልተገኙም",
      om: "Suuraan hin jiru",
    },
    highlights: [
      {
        en: "Premium-grade certified material",
        am: "ከፍተኛ ደረጃ የተረጋገጠ ቁሳቁስ",
        om: "Alaa sadarkaa olaanaa mirkanaa'e",
      },
      {
        en: "Durable and weather-resistant",
        am: "ዘላቂ እና ለአየር ሁኔታ የሚቋቋም",
        om: "Dhaabbataa fi haala qilleensaaf danda'aa",
      },
      {
        en: "Fast nationwide delivery",
        am: "ፈጣን በአገር አቀፍ ደረጃ ማድረስ",
        om: "Biyya guutuu saffisaan geejjiba",
      },
      {
        en: "Backed by our quality guarantee",
        am: "በጥራት ዋስትናችን የተደገፈ",
        om: "Wabii qulqullina keenyaan deeggarame",
      },
    ],
  };

  const categoryLabel =
    product.category === "materials"
      ? { en: "Materials", am: "ቁሳቁሶች", om: "Alaa" }
      : product.category === "systems"
        ? { en: "Systems", am: "ስርዓቶች", om: "Sirnaa" }
        : { en: "Equipment", am: "መሳሪያዎች", om: "Meeshaa" };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Top bar */}
        <section className="border-b bg-secondary/5">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {tValue(t.back)}
            </Link>
          </div>
        </section>

        {/* Main product hero */}
        <section className="py-12 md:py-16 px-4">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Gallery */}
              <div className="space-y-4">
                {/* Main image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border bg-gradient-to-br from-secondary/40 via-secondary/20 to-primary/5">
                  {productImages.length > 0 ? (
                    <Image
                      src={productImages[activeImage]}
                      alt={tValue(product.name)}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                      {tValue(t.noImages)}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {productImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-3">
                    {productImages.map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setActiveImage(i)}
                        aria-label={`View image ${i + 1}`}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          activeImage === i
                            ? "border-primary shadow-sm"
                            : "border-transparent hover:border-primary/40"
                        }`}
                      >
                        <Image
                          src={src}
                          alt=""
                          fill
                          sizes="20vw"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col">
                <Badge
                  variant="outline"
                  className="w-fit mb-4 border-primary/30 text-primary"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tValue(categoryLabel)}
                </Badge>

                <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
                  {tValue(product.name)}
                </h1>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
                  {tValue(product.description)}
                </p>

                {/* Highlights */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/80 mb-3">
                    {tValue(t.features)}
                  </h3>
                  <ul className="space-y-2.5">
                    {t.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-foreground/80"
                      >
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span>{tValue(h)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Link href="/contact" className="flex-1">
                    <Button
                      size="lg"
                      className="w-full gap-2 rounded-full shadow-sm"
                    >
                      <Mail className="h-4 w-4" />
                      {tValue(t.inquire)}
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full gap-2 rounded-full"
                    >
                      <Phone className="h-4 w-4" />
                      {tValue(t.contact)}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="py-16 px-4 border-t bg-secondary/5">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10 border border-primary/15">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                {tValue(t.specs)}
              </h2>
            </div>

            <Card className="p-6 md:p-8 border-border/60 bg-card">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">
                    {tValue(t.category)}
                  </p>
                  <p className="font-medium">{tValue(categoryLabel)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">
                    {tValue(t.productId)}
                  </p>
                  <p className="font-medium">#{product.id}</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-16 md:py-20 px-4 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="container mx-auto max-w-3xl text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              {tValue(t.inquire)}
            </h2>
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/95 shadow-lg shadow-black/10 rounded-full px-6"
              >
                {tValue(t.contact)}
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

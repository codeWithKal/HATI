"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  User,
  Newspaper,
  ArrowRight,
  Clock,
  Tag,
  Share2,
  Bookmark,
  TrendingUp,
  Award,
  Building2,
  Users,
} from "lucide-react";
import newsData from "@/data/news.json";
import newsStatsData from "@/data/newsStats.json";

const iconMap: Record<string, any> = {
  Newspaper: Newspaper,
  Tag: Tag,
  Users: Users,
};

const categoryIconMap: Record<string, any> = {
  projects: Building2,
  innovation: TrendingUp,
  company: Users,
};

export default function News() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "Latest News",
      am: "የዚህ ወቅት ዜና",
      om: "Oddeeffannoo Jidduu Baay",
    },
    subtitle: {
      en: "Stories That Shape Our Industry",
      am: "ኢንዱስትሪያችንን የሚቀርጹ ታሪኮች",
      om: "Seenaan Daldala Keenyaa Ijaaru",
    },
    description: {
      en: "Stay updated with the latest news, announcements, and insights from HATI Construction",
      am: "ከ HATI ግንባታ የቅርብ ጊዜ ዜናዎች፣ ማስታወቂያዎች እና ግንዛቤዎች ይወቁ",
      om: "Oddeeffannoo haaraa, labsii fi hubannoo HATI Ijaarsa irraa argachuu",
    },
    categories: {
      all: { en: "All News", am: "ሁሉም ዜና", om: "Oduu Hunda" },
      projects: { en: "Projects", am: "ፕሮጀክቶች", om: "Porjeektota" },
      company: { en: "Company", am: "ኩባንያ", om: "Dhaabbata" },
      innovation: { en: "Innovation", am: "ፈጠራ", om: "Jijjiiraa" },
    },
    stats: {
      title: {
        en: "News Highlights",
        am: "የዜና ድምቀቶች",
        om: "Ijaarsa Oduu",
      },
    },
    readMore: {
      en: "Read More",
      am: "ተጨማሪ ያንብቡ",
      om: "Gari Dhaabi",
    },
    cta: {
      title: {
        en: "Subscribe to Our Newsletter",
        am: "ለጋዜጣችን ይመዝገቡ",
        om: "Nuusleeta Keenyaaf Subscribe Godhaa",
      },
      description: {
        en: "Get the latest news and updates delivered to your inbox",
        am: "የቅርብ ጊዜ ዜናዎችን እና ዝማኔዎችን በኢሜልዎ ይቀበሉ",
        om: "Oduu haaraa fi fooyyaʼinsa poostaa keessan argadhaa",
      },
      button: {
        en: "Subscribe Now",
        am: "አሁን ይመዝገቡ",
        om: "Amma Subscribe Godhaa",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const newsArticles = newsData;
  const stats = newsStatsData;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      projects:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      innovation:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      company:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
    };
    return colors[category] || "bg-primary/20 text-primary border-primary/30";
  };

  const getCategoryIcon = (category: string) => {
    return categoryIconMap[category] || Newspaper;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, any> = {
      projects: { en: "Projects", am: "ፕሮጀክቶች", om: "Porjeektota" },
      innovation: { en: "Innovation", am: "ፈጠራ", om: "Jijjiiraa" },
      company: { en: "Company", am: "ኩባንያ", om: "Dhaabbata" },
    };
    return labels[category] || { en: "General", am: "አጠቃላይ", om: "Waliigala" };
  };

  // Get active articles only
  const activeArticles = newsArticles.filter(
    (article: any) => article.isActive !== false,
  );

  // Get featured articles
  const featuredArticles = activeArticles.filter(
    (article: any) => article.featured === true,
  );

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
              <Newspaper className="h-4 w-4" />
              <span>
                {language === "en" && "News & Updates"}
                {language === "am" && "ዜና እና ዝማኔዎች"}
                {language === "om" && "Oduu fi Fooyyaʼinsa"}
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
                const Icon = iconMap[stat.icon] || Newspaper;
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

        {/* News Articles */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Featured Articles"}
                  {language === "am" && "ታዋቂ ጽሁፎች"}
                  {language === "om" && "Barreeffamoota Filataman"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activeArticles.length} articles in our news feed`}
                  {language === "am" &&
                    `${activeArticles.length} ጽሁፎች በዜና መስመራችን ውስጥ`}
                  {language === "om" &&
                    `${activeArticles.length} barreeffamoota news feed keenyatti`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="px-4 py-2 cursor-pointer">
                  {tValue(t.categories.all)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500/10 border-blue-500/30"
                >
                  {tValue(t.categories.projects)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-purple-500/10 border-purple-500/30"
                >
                  {tValue(t.categories.innovation)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-green-500/10 border-green-500/30"
                >
                  {tValue(t.categories.company)}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              {activeArticles.map((article: any) => {
                const CategoryIcon = getCategoryIcon(article.category);
                const categoryColor = getCategoryColor(article.category);
                const categoryLabel = getCategoryLabel(article.category);

                return (
                  <Card
                    key={article.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-b from-card to-secondary/5"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge className={categoryColor}>
                              <CategoryIcon className="h-3 w-3 mr-1" />
                              {tValue(categoryLabel)}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            {article.featured && (
                              <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30">
                                <Award className="h-3 w-3 mr-1" />
                                {language === "en" && "Featured"}
                                {language === "am" && "ታዋቂ"}
                                {language === "om" && "Filatame"}
                              </Badge>
                            )}
                          </div>

                          <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {tValue(article.title)}
                          </h2>

                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {tValue(article.excerpt)}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <time dateTime={article.date}>
                                  {new Date(article.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}
                                </time>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                <span>{article.author}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary/10"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full hover:bg-primary/10"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Link href={`/news/${article.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1 group-hover:bg-primary/10 transition-all"
                                >
                                  {tValue(t.readMore)}
                                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-6xl md:text-7xl transform group-hover:scale-110 transition-transform duration-500">
                          {article.image}
                        </div>
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
              <Newspaper className="h-4 w-4" />
              <span>
                {language === "en" && "Stay Informed"}
                {language === "am" && "የተዘመነ ይሁኑ"}
                {language === "om" && "Beekumsaa Jiraadhaa"}
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
                <Award className="h-5 w-5" />
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

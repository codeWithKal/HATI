"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  Building2,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import newsData from "@/data/news.json";

const categoryIconMap: Record<string, any> = {
  projects: Building2,
  innovation: TrendingUp,
  company: Users,
};

export default function NewsArticle() {
  const { language } = useLanguage();
  const params = useParams();
  const articleId = params.id as string;

  // Find the article by ID
  const article = newsData.find((item: any) => item.id === articleId);

  if (!article) {
    return (
      <>
        <Header />
        <main className="min-h-screen">
          <section className="py-20 px-4">
            <div className="container mx-auto text-center">
              <div className="text-6xl mb-4">📰</div>
              <h1 className="text-4xl font-bold mb-4">
                {language === "en" && "Article Not Found"}
                {language === "am" && "ጽሁፉ አልተገኘም"}
                {language === "om" && "Barreeffanni Hin Argamu"}
              </h1>
              <p className="text-muted-foreground mb-8">
                {language === "en" &&
                  "The article you're looking for doesn't exist."}
                {language === "am" && "እርስዎ የሚፈልጉት ጽሁፍ የለም።"}
                {language === "om" &&
                  "Barreeffanni keenya barbaddan jira miti."}
              </p>
              <Link href="/news">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === "en" && "Back to News"}
                  {language === "am" && "ወደ ዜና ይመለሱ"}
                  {language === "om" && "Oduu Gaʼe Deebi'i"}
                </Button>
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

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
    return categoryIconMap[category] || Users;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, any> = {
      projects: { en: "Projects", am: "ፕሮጀክቶች", om: "Porjeektota" },
      innovation: { en: "Innovation", am: "ፈጠራ", om: "Jijjiiraa" },
      company: { en: "Company", am: "ኩባንያ", om: "Dhaabbata" },
    };
    return labels[category] || { en: "General", am: "አጠቃላይ", om: "Waliigala" };
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";
  const CategoryIcon = getCategoryIcon(article.category);
  const categoryColor = getCategoryColor(article.category);
  const categoryLabel = getCategoryLabel(article.category);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Article Header */}
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="container mx-auto max-w-3xl">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === "en" && "Back to News"}
              {language === "am" && "ወደ ዜና ይመለሱ"}
              {language === "om" && "Oduu Gaʼe Deebi'i"}
            </Link>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={categoryColor}>
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {tValue(categoryLabel)}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
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

              <h1 className="text-4xl md:text-5xl font-bold">
                {tValue(article.title)}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <time dateTime={article.date}>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  <span>{article.author}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-3xl">
            <div className="space-y-8">
              {/* Article Image/Icon */}
              <div className="text-center text-8xl py-8 bg-gradient-to-b from-secondary/20 to-transparent rounded-xl">
                {article.image}
              </div>

              {/* Article Body */}
              <div className="prose prose-invert max-w-none space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {tValue(article.excerpt)}
                </p>

                {/* Generate detailed content based on article */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    {language === "en" && "Article Details"}
                    {language === "am" && "ጽሁፍ ዝርዝሮች"}
                    {language === "om" && "Xumura Barreeffannaa"}
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {language === "en" &&
                      "This article covers important developments in our organization. We are committed to transparency and keeping our stakeholders informed about our initiatives, projects, and achievements. Our team continues to work diligently to deliver excellence in every aspect of our business."}
                    {language === "am" &&
                      "ይህ ጽሁፍ በኛ ድርጅት ውስጥ ጠቃሚ ሚና ይሸፍናል። በአጭሩ እና ወስብ በኤጀንሲዎችን እና ሚናዎንም መታወቁን እንዲህ እኛ ታማኞች ሊቅ ስለ ሂደቶቻችን በምሩ።"}
                    {language === "om" &&
                      "Barreeffanni kun hoggantuu yaada ofii keenyaa keessatti mijaa gidduu dubbisi. Nu wal-irraa dhaabummaa fi beekumsa jabaa hojii keenyaa irratti xiyyeeffachuuf waliigalummaa taasise. Mijaa hojii keenyaa guddina guddaa keenyaa hanga mirgaan jalqabuuf itti fufe."}
                  </p>
                </div>

                {/* Key Points Section */}
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    {language === "en" && "Key Highlights"}
                    {language === "am" && "ዋና ጠያቂዎች"}
                    {language === "om" && "Ijaarsa Guddaa"}
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        {language === "en" &&
                          "Strategic initiatives driving growth and innovation"}
                        {language === "am" && "ስልታዊ ፕሮግራሞች ልማት እና ፈጠራን አስገድደዋል"}
                        {language === "om" &&
                          "Yaadanni maliyoo midhaa fi jijjiirraa ajjeessu"}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        {language === "en" &&
                          "Commitment to sustainable and responsible practices"}
                        {language === "am" && "ዘላቂ እና ሃላፊ ልምዶች ለመተግበር ቃል ገብቷል"}
                        {language === "om" &&
                          "Waadaa hojii dhaabaa eegumsaa fi itti-gaafatummaa"}
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-bold">•</span>
                      <span className="text-muted-foreground">
                        {language === "en" &&
                          "Investment in team development and excellence"}
                        {language === "am" && "ቡድን ልማት እና ጥሩነት ላይ ኢንቬስትመንት"}
                        {language === "om" &&
                          "Giddir hojjattoota guddina fi faalummaa keessatti"}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Closing Section */}
                <div className="space-y-4 bg-secondary/5 p-6 rounded-lg border">
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {language === "en" &&
                      "We believe in the power of collaboration and innovation to drive positive change in our industry. As we continue to grow, we remain committed to our core values of integrity, excellence, and customer satisfaction."}
                    {language === "am" &&
                      "ቁራ በሥራ ስራ ክስ ደህና ግንባታ ውስብስብ ኢንዱስትሪ አሻንፉ ለውጥ ከሰወር ኯስ ገብታ በዋናነት ላይ ይኖር።"}
                    {language === "om" &&
                      "Nu walqannoota fi jijjiirraa harcaasuu midhaa hir'isuuf dinagdee mataa isaa keessatti guddina guddaa agarsiisu itti amanu."}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-8 border-t">
                <Button variant="outline" className="gap-2" size="lg">
                  <Bookmark className="h-4 w-4" />
                  {language === "en" && "Save Article"}
                  {language === "am" && "ጽሁፍ ያስቀምጡ"}
                  {language === "om" && "Barreeffanni Kufsuu"}
                </Button>
                <Button variant="outline" className="gap-2" size="lg">
                  <Share2 className="h-4 w-4" />
                  {language === "en" && "Share"}
                  {language === "am" && "ተጋሩ"}
                  {language === "om" && "Wal-qabsiisu"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-20 px-4 bg-secondary/5">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold mb-8">
              {language === "en" && "More News"}
              {language === "am" && "ተጨማሪ ዜና"}
              {language === "om" && "Oduu Xtra"}
            </h2>
            <div className="grid gap-6">
              {newsData
                .filter(
                  (item: any) =>
                    item.id !== articleId && item.isActive !== false,
                )
                .slice(0, 3)
                .map((relatedArticle: any) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/news/${relatedArticle.id}`}
                    className="group p-6 bg-card rounded-lg border hover:shadow-lg transition-all duration-300 hover:border-primary"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="text-4xl">{relatedArticle.image}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {tValue(relatedArticle.title)}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(relatedArticle.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

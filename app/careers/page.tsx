"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Users,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  Building2,
  Mail,
  Send,
  Heart,
  Target,
  Sparkles,
  FileText,
  HardHat,
} from "lucide-react";
import careersData from "@/data/careers.json";
import benefitsData from "@/data/benefits.json";

const iconMap: Record<string, any> = {
  TrendingUp: TrendingUp,
  Users: Users,
  Award: Award,
  Target: Target,
};

export default function Careers() {
  const { language } = useLanguage();

  const t = {
    title: { en: "Careers at HATI", am: "በHATI ስራዎች", om: "Hojii HATI" },
    subtitle: {
      en: "Build Your Future With Us",
      am: "የወደፊት ህይወትዎን ከእኛ ጋር ይገንቡ",
      om: "Fuuldura Keessan Nu Waliin Ijaarsaa",
    },
    description: {
      en: "Join our team of dedicated professionals and be part of exciting projects that are shaping the future of East Africa.",
      am: "ቁርጠኛ የሆኑ ባለሙያዎች ቡድናችንን ይቀላቀሉ እና የምስራቅ አፍሪካን የወደፊት ህይወት በሚቀርጹ አስደሳች ፕሮጀክቶች ውስጥ ይሳተፉ።",
      om: "Garee ogummaa of qopheessan nutti seenaa fi porjeektota babaasaan fuuldura Gareeffannoo Bahaasaa Ilaalcha ijaaru keessatti qooda fudhadhaa.",
    },
    values: {
      title: {
        en: "Why Work With Us",
        am: "ለምን ከእኛ ጋር ይስሩ",
        om: "Maaliif Nu Waliin Hoji",
      },
      subtitle: {
        en: "Discover what makes HATI a great place to work",
        am: "HATI ለስራ ጥሩ ቦታ የሚያደርገውን ያግኙ",
        om: "Waan HATI iddoo hojii gaarii taasisu argadhaa",
      },
    },
    openPositions: { en: "Open Positions", am: "ክፍት ስራዎች", om: "Hojii Banaa" },
    apply: { en: "Apply Now", am: "አሁን ያመልክቱ", om: "Amma Galmaa" },
    viewDetails: {
      en: "View Details",
      am: "ዝርዝር ይመልከቱ",
      om: "Gari Ilaalaa",
    },
    cta: {
      title: {
        en: "Don't See Your Dream Role?",
        am: "የህልምዎን ስራ አላዩም?",
        om: "Hojii Abdi Keessan Hin Argine?",
      },
      description: {
        en: "Send us your resume and let us know how you can contribute to our team",
        am: "የስራ ታሪክዎን ይላኩልን እና ለቡድናችን እንዴት አስተዋፅዖ እንደሚያደርጉ ያሳውቁን",
        om: "Gageetii keessan nuuf ergaa fi akkamitti garee keenyaaf gumaacha akka dandeen danu nuuf himaa",
      },
      button: {
        en: "Send Resume",
        am: "የስራ ታሪክ ይላኩ",
        om: "Gageetii Ergi",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get careers data - both are arrays
  const positions = careersData;
  const benefits = benefitsData;

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Engineering:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Operations:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      Construction:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
    };
    return colors[department] || "bg-primary/20 text-primary border-primary/30";
  };

  const getDepartmentIcon = (department: string) => {
    const icons: Record<string, any> = {
      Engineering: Building2,
      Operations: Briefcase,
      Construction: HardHat,
    };
    return icons[department] || Briefcase;
  };

  // Get active positions only
  const activePositions = positions.filter(
    (pos: any) => pos.isActive !== false,
  );

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Briefcase className="h-4 w-4" />
              <span>
                {language === "en" && "Join Our Team"}
                {language === "am" && "ቡድናችንን ይቀላቀሉ"}
                {language === "om" && "Garee Keenyaa Join Godhaa"}
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

        {/* Why Work With Us - Benefits Section */}
        <section className="py-20 px-4 bg-secondary/5">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {tValue(t.values.title)}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {tValue(t.values.subtitle)}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit: any) => {
                const Icon = iconMap[benefit.icon] || Award;
                return (
                  <Card
                    key={benefit.id}
                    className="group p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {tValue(benefit.title)}
                    </h3>
                    <p className="text-muted-foreground">
                      {tValue(benefit.description)}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-4xl font-bold">
                  {tValue(t.openPositions)}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activePositions.length} positions available`}
                  {language === "am" && `${activePositions.length} ክፍት ስራዎች አሉ`}
                  {language === "om" &&
                    `${activePositions.length} hojii banaa jira`}
                </p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                <Sparkles className="h-3 w-3 mr-1" />
                {language === "en" && "New opportunities added weekly"}
                {language === "am" && "ሳምንታዊ አዳዲስ እድሎች"}
                {language === "om" && "Fayyadama haaraa torbanitti"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {activePositions.map((position: any) => {
                const DepartmentIcon = getDepartmentIcon(
                  position.department.en,
                );
                const deptColor = getDepartmentColor(position.department.en);

                return (
                  <Card
                    key={position.id}
                    className="group p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/20"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {tValue(position.title)}
                      </h3>
                      <Badge className={deptColor}>
                        <DepartmentIcon className="h-3 w-3 mr-1" />
                        {tValue(position.department)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{tValue(position.location)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span>{tValue(position.type)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{tValue(position.experience)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>
                          {language === "en" && "Posted: "}
                          {language === "am" && "ተለጠፈ: "}
                          {language === "om" && "Maxxanfame: "}
                          {new Date(position.posted).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          {tValue(t.viewDetails)}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                        <Button size="sm" className="gap-1">
                          {tValue(t.apply)}
                          <Send className="h-3 w-3" />
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
              <Heart className="h-4 w-4" />
              <span>
                {language === "en" && "We Want You"}
                {language === "am" && "እንፈልግዎታለን"}
                {language === "om" && "Nu Sin Barbaanna"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {tValue(t.cta.title)}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {tValue(t.cta.description)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
                >
                  <FileText className="h-5 w-5" />
                  {tValue(t.cta.button)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10"
                >
                  <Mail className="h-5 w-5" />
                  {language === "en" && "Contact HR"}
                  {language === "am" && "የሰው ሃብት ያግኙ"}
                  {language === "om" && "HR Qunnamaa"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

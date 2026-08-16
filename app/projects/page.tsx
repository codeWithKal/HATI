"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Building2,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  HardHat,
  Trophy,
  Briefcase,
} from "lucide-react";
import projectsData from "@/data/projects.json";
import projectStatsData from "@/data/projectStats.json";

const iconMap: Record<string, any> = {
  Briefcase: Briefcase,
  CheckCircle2: CheckCircle2,
  Clock: Clock,
  MapPin: MapPin,
};

export default function Projects() {
  const { language } = useLanguage();

  const t = {
    title: { en: "Our Projects", am: "ፕሮጀክቶቻችን", om: "Porjeektota Keenyaa" },
    subtitle: {
      en: "Building the Future, One Project at a Time",
      am: "የወደፊቱን እየገነባን፣ አንድ ፕሮጀክት በአንድ ጊዜ",
      om: "Fuuldura ijaarsuu, Porjeektii Tokko Tokkoon",
    },
    description: {
      en: "Explore our portfolio of successful construction and engineering projects across Ethiopia, showcasing our commitment to excellence and innovation.",
      am: "በምስራቅ አፍሪካ ያሉ የተሳካላቸው የግንባታ እና የምህንድስና ፕሮጀክቶች ፖርትፎሊዮችን ያስሱ፣ ለምርጥነት እና ለፈጠራ ያለን ቁርጠኝነት የሚያሳዩ።",
      om: "Porjeektota ijaarsaa fi injineerrii milkaaʼina Gareeffannoo Bahaasaa Ilaalcha keessatti argaman ilaalaa, ogummaa fi jijjiiraaf kennuun keenya agarsiisuu.",
    },
    status: {
      completed: { en: "Completed", am: "ተጨርሷል", om: "Xumuramee" },
      ongoing: { en: "Ongoing", am: "ቀጣይ", om: "Itti Fufa" },
      planned: { en: "Planned", am: "የታቀደ", om: "Yaalkee" },
    },
    viewDetails: {
      en: "View Project Details",
      am: "የፕሮጀክት ዝርዝር ይመልከቱ",
      om: "Gari Porjeektii Ilaalaa",
    },
    cta: {
      title: {
        en: "Have a Project in Mind?",
        am: "በአዕምሮዎ ውስጥ ፕሮጀክት አለ?",
        om: "Porjeektii Yaadduu Qabdaa?",
      },
      description: {
        en: "Let's discuss how we can bring your vision to life",
        am: "ራዕይዎን እንዴት ወደ ህይወት እንደምናመጣው እንወያይ",
        om: "Akkamitti araaraa keessan jiraachisuu akka dandeennyu mariʼannaa",
      },
      button: {
        en: "Start a Project",
        am: "ፕሮጀክት ይጀምሩ",
        om: "Porjeektii Jalqabi",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const projects = projectsData;
  const stats = projectStatsData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "ongoing":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "planned":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30";
      default:
        return "bg-primary/20 text-primary border-primary/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "ongoing":
        return Clock;
      default:
        return Clock;
    }
  };

  // Get active projects only
  const activeProjects = projects.filter(
    (project: any) => project.isActive !== false,
  );

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
              <Building2 className="h-4 w-4" />
              <span>
                {language === "en" && "Our Portfolio"}
                {language === "am" && "ፖርትፎሊዮችን"}
                {language === "om" && "Portfolio Keenyaa"}
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
        <section className="py-16 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat: any) => {
                const Icon = iconMap[stat.icon] || Briefcase;
                return (
                  <div key={stat.id} className="text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tValue(stat.label)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Featured Projects"}
                  {language === "am" && "ታዋቂ ፕሮጀክቶች"}
                  {language === "om" && "Porjeektota Filataman"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activeProjects.length} projects in our portfolio`}
                  {language === "am" &&
                    `${activeProjects.length} ፕሮጀክቶች በፖርትፎሊዮዎቻችን ውስጥ`}
                  {language === "om" &&
                    `${activeProjects.length} porjeektota portfolio keenyatti`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                >
                  {language === "en" && "All Projects"}
                  {language === "am" && "ሁሉም ፕሮጀክቶች"}
                  {language === "om" && "Porjeektota Hunda"}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-green-500/10 border-green-500/30"
                >
                  {tValue(t.status.completed)}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500/10 border-blue-500/30"
                >
                  {tValue(t.status.ongoing)}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeProjects.map((project: any) => {
                const StatusIcon = getStatusIcon(project.status);
                const statusColor = getStatusColor(project.status);

                // Calculate project duration or end date display
                const endDateDisplay = project.endDate
                  ? new Date(project.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })
                  : null;

                return (
                  <Card
                    key={project.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5"
                  >
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
                        <div className="text-7xl transform group-hover:scale-110 transition-transform duration-500">
                          {project.image || "🏗️"}
                        </div>
                        <Badge
                          className={`absolute top-4 right-4 ${statusColor} border backdrop-blur-sm`}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {tValue(t.status[project.status])}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent"></div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tValue(project.title)}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {tValue(project.description)}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{tValue(project.location)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>
                            {new Date(project.startDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                              },
                            )}
                            {endDateDisplay && ` - ${endDateDisplay}`}
                            {!endDateDisplay &&
                              language === "en" &&
                              " - Present"}
                            {!endDateDisplay &&
                              language === "am" &&
                              " - እስከ አሁን"}
                            {!endDateDisplay &&
                              language === "om" &&
                              " - Hanga Ammaa"}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full justify-between group-hover:bg-primary/10 transition-all"
                      >
                        <span>{tValue(t.viewDetails)}</span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </Button>
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
              <Users className="h-4 w-4" />
              <span>
                {language === "en" && "Work With Us"}
                {language === "am" && "ከእኛ ጋር ይስሩ"}
                {language === "om" && "Nu Waliin Hojii"}
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
                <Trophy className="h-5 w-5" />
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

"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Zap,
  ClipboardList,
  PenTool,
  HardHat,
  Truck,
  Wrench,
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  Award,
  Users,
  BookOpen,
  Home,
  FileText,
  Compass,
} from "lucide-react";
import servicesData from "@/data/services.json";

const iconMap: Record<string, any> = {
  "1": Building2,
  "2": Home,
  "3": Briefcase,
  "4": FileText,
  "5": PenTool,
  "6": HardHat,
  "7": Truck,
  "8": Wrench,
};

export default function Services() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "Our Services",
      am: "አገልግሎቶቻችን",
      om: "Seervistii Keenyaa",
    },
    subtitle: {
      en: "Excellence in Every Project",
      am: "በእያንዳንዱ ፕሮጀክት ምርጥነት",
      om: "Ogummaata Porjeektii Hunda Keessatti",
    },
    description: {
      en: "Discover our comprehensive range of construction and engineering services designed to bring your vision to life with precision and excellence.",
      am: "በትክክለኛነት እና ምርጥነት ራዕይዎን ለማሳካት የተቀየሱ ሙሉ የግንባታ እና የምህንድስና አገልግሎቶቻችንን ያግኙ።",
      om: "Seervisii ijaarsaa fi injineerrii guutuu araaraa keessan jiraachisuu fi ogummaan hojii qabnu argachaa.",
    },
    whyChoose: {
      title: {
        en: "Why Choose HATI Services?",
        am: "ለምን HATI አገልግሎቶችን ይመርጣሉ?",
        om: "Maaliif Seervisii HATI Filadhu?",
      },
      items: [
        {
          icon: Shield,
          title: {
            en: "Quality Assured",
            am: "የተረጋገጠ ጥራት",
            om: "Midhaa Mirkanaa'e",
          },
          desc: {
            en: "Industry-leading quality standards",
            am: "የኢንዱስትሪ መሪ ጥራት ደረጃዎች",
            om: "Sadarkaa midhaa daldalaa",
          },
        },
        {
          icon: Clock,
          title: {
            en: "On-Time Delivery",
            am: "በጊዜው ማቅረብ",
            om: "Yeroof Galii",
          },
          desc: {
            en: "Projects completed on schedule",
            am: "ፕሮጀክቶች በጊዜ ተጠናቀዋል",
            om: "Porjeektota yeroof xumuran",
          },
        },
        {
          icon: Award,
          title: { en: "Expert Team", am: "ባለሙያ ቡድን", om: "Garee Ogummaa" },
          desc: {
            en: "Experienced professionals",
            am: "ልምድ ያላቸው ባለሙያዎች",
            om: "Ogummaa hojii qabani",
          },
        },
        {
          icon: Users,
          title: {
            en: "Client Focused",
            am: "ለደንበኛ ያማከለ",
            om: "Maamiltoota Xiyyeeffate",
          },
          desc: {
            en: "Tailored solutions for every client",
            am: "ለእያንዳንዱ ደንበኛ የተበጁ መፍትሄዎች",
            om: "Furmaata maamiltoota hundaaf",
          },
        },
      ],
    },
    cta: {
      title: {
        en: "Ready to Start Your Project?",
        am: "ፕሮጀክትዎን ለመጀመር ዝግጁ ነዎት?",
        om: "Porjeektii Keessan Jalqabuuf Qophoo?",
      },
      description: {
        en: "Contact our expert team today for a consultation",
        am: "ለማማከር ዛሬ የባለሙያ ቡድናችንን ያግኙ",
        om: "Gorsaaf garee ogummaa keenya har'a qunnamaa",
      },
      button: {
        en: "Get a Free Quote",
        am: "ነጻ ዋጋ ያግኙ",
        om: "Gatii Bisaanaa Argadhu",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get services from the data
  const services = servicesData;

  const getServiceColor = (id: string) => {
    const colors: Record<string, string> = {
      "1": "from-blue-500/10 to-blue-500/5 border-blue-500/20",
      "2": "from-purple-500/10 to-purple-500/5 border-purple-500/20",
      "3": "from-green-500/10 to-green-500/5 border-green-500/20",
      "4": "from-orange-500/10 to-orange-500/5 border-orange-500/20",
      "5": "from-red-500/10 to-red-500/5 border-red-500/20",
      "6": "from-teal-500/10 to-teal-500/5 border-teal-500/20",
      "7": "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
      "8": "from-pink-500/10 to-pink-500/5 border-pink-500/20",
    };
    return colors[id] || "from-primary/10 to-primary/5 border-primary/20";
  };

  const getIconColor = (id: string) => {
    const colors: Record<string, string> = {
      "1": "text-blue-500",
      "2": "text-purple-500",
      "3": "text-green-500",
      "4": "text-orange-500",
      "5": "text-red-500",
      "6": "text-teal-500",
      "7": "text-indigo-500",
      "8": "text-pink-500",
    };
    return colors[id] || "text-primary";
  };

  // Get icon for service based on name or id
  const getServiceIcon = (service: any) => {
    const id = service.id;
    const name = service.name.en.toLowerCase();

    // First check if we have a specific icon mapped by ID
    if (iconMap[id]) return iconMap[id];

    // Fallback: map by name keywords
    if (name.includes("civil") || name.includes("infrastructure"))
      return Building2;
    if (
      name.includes("building") ||
      name.includes("residential") ||
      name.includes("commercial")
    )
      return Home;
    if (name.includes("project") || name.includes("management"))
      return Briefcase;
    if (name.includes("consultation") || name.includes("feasibility"))
      return FileText;
    if (name.includes("design")) return PenTool;
    if (name.includes("construction")) return HardHat;
    if (name.includes("logistics") || name.includes("supply")) return Truck;
    if (name.includes("maintenance") || name.includes("repair")) return Wrench;

    return Compass;
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
              <Briefcase className="h-4 w-4" />
              <span>
                {language === "en" && "What We Do"}
                {language === "am" && "ምን እናደርጋለን"}
                {language === "om" && "Waan Hojinna"}
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

        {/* Why Choose Us */}
        <section className="py-16 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              {tValue(t.whyChoose.title)}
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {t.whyChoose.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{tValue(item.title)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tValue(item.desc)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold mb-4">
                {language === "en" && "Our Service Categories"}
                {language === "am" && "የአገልግሎት ምድቦቻችን"}
                {language === "om" && "Ramaddii Seervisii Keenyaa"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "en" &&
                  "Explore our comprehensive range of professional services"}
                {language === "am" && "ሙሉ የባለሙያ አገልግሎቶቻችንን ያስሱ"}
                {language === "om" && "Seervisii ogummaa guutuu keenya ilaalaa"}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {services.map((service: any) => {
                const Icon = getServiceIcon(service);
                const serviceColor = getServiceColor(service.id);
                const iconColor = getIconColor(service.id);

                return (
                  <Card
                    key={service.id}
                    className={`group relative p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br ${serviceColor}`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-2xl"></div>
                    <div className="relative">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${serviceColor} w-fit mb-4`}
                      >
                        <Icon className={`h-8 w-8 ${iconColor}`} />
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                        {tValue(service.name)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {tValue(service.description)}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>
                          {language === "en" && "Learn More"}
                          {language === "am" && "ተጨማሪ ይወቁ"}
                          {language === "om" && "Gari Dhaabi"}
                        </span>
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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
              <Zap className="h-4 w-4" />
              <span>
                {language === "en" && "Get Started Today"}
                {language === "am" && "ዛሬ ይጀምሩ"}
                {language === "om" && "Har'a Jalqabi"}
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

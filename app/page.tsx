"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Zap,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Shield,
  Wrench,
  HardHat,
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import homeStats from "@/data/homeStats.json";
import homeServices from "@/data/products.json";
import homeWhyChoose from "@/data/homeWhyChoose.json";
import homeCta from "@/data/homeCta.json";
import homeLearnMore from "@/data/homeLearnMore.json";

const iconMap: Record<string, any> = {
  Building2: Building2,
  Zap: Zap,
  Briefcase: Briefcase,
  Award: Award,
  Shield: Shield,
  Clock: Clock,
  CheckCircle2: CheckCircle2,
  Users: Users,
  Wrench: Wrench,
  HardHat: HardHat,
};

export default function Home() {
  const { language } = useLanguage();

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON arrays
  const stats = homeStats;
  const services = homeServices;
  const whyChoose = homeWhyChoose;
  const cta = homeCta[0];
  const learnMore = homeLearnMore[0];

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section - Separated Component */}
        <HeroSection />

        {/* Stats Section */}
        <section className="py-12 px-4 border-y bg-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center group">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {tValue(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Wrench className="h-4 w-4" />
                <span>
                  {language === "en" && "What We Do"}
                  {language === "am" && "የምንሰራው"}
                  {language === "om" && "Waan Hojinna"}
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                {language === "en" && "Our Products"}
                {language === "am" && "ምርቶቻችን"}
                {language === "om" && "Oomishaalee Keenya"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "en" &&
                  "Comprehensive construction solutions tailored to your needs"}
                {language === "am" && "ለፍላጎትዎ የተበጁ ሙሉ የግንባታ ቁሳቁሶች"}
                {language === "om" &&
                  "Furmaata ijaarsa guutuu fedhii keessan irrattii"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = Building2;
                return (
                  <Card
                    key={service.id}
                    className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5 text-center group"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {tValue(service.name)}
                    </h3>
                    <p className="text-muted-foreground">
                      {tValue(service.description)}
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>{tValue(learnMore.text)}</span>
                      <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-20 px-4 bg-secondary/5">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {language === "en" && "Why Us"}
                  {language === "am" && "ለምን እኛ"}
                  {language === "om" && "Maaliif Nu"}
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                {language === "en" && "Why Choose HATI?"}
                {language === "am" && "ለምን HATI ን ይመርጣሉ?"}
                {language === "om" && "Maaliif HATI Filadhu?"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "en" &&
                  "We deliver excellence through expertise, quality, and reliability"}
                {language === "am" && "በእውቀት፣ በጥራት እና በአስተማማኝነት ልቀትን እናቀርባለን"}
                {language === "om" &&
                  "Ogummaa, qulqullina, fi amanannaan caalmaa kennina"}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {whyChoose.map((item) => {
                const Icon = iconMap[item.icon] || Award;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-background transition-colors duration-300 group"
                  >
                    <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {tValue(item.title)}
                    </h3>
                    <p className="text-muted-foreground">
                      {tValue(item.description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="container relative z-10 mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              <span>{tValue(cta.badge)}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {tValue(cta.title)}
            </h2>

            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {tValue(cta.description)}
            </p>

            <div className="flex justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 shadow-lg shadow-black/20"
                >
                  {tValue(cta.button)}
                  <ArrowRight className="h-4 w-4" />
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

"use client";

import Link from "next/link";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import homeStats from "@/data/homeStats.json";
import {
  Building2,
  Target,
  Eye,
  Award,
  Shield,
  Lightbulb,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "About HATI Construction",
      am: "ስለ HATI ግንባታ",
      om: "Waa'ee HATI Ijaarsa",
    },
    subtitle: {
      en: "Building Excellence, Transforming Communities",
      am: "ልቀትን በመገንባት፣ ማህበረሰቦችን በመቀየር",
      om: "Ogummaa Ijaaruu, Hawaasota Jijjiiruu",
    },
    mission: {
      title: { en: "Our Mission", am: "ተልዕኳችን", om: "Ergannoo Keenyaa" },
      content: {
        en: "To deliver world-class construction and engineering solutions that transform communities and create lasting value for our clients, partners, and stakeholders.",
        am: "ዓለም አቀፍ ደረጃ ያላቸውን የግንባታ እና የምህንድስና መፍትሄዎች በማቅረብ ማህበረሰቦችን መለወጥ እና ለደንበኞቻችን፣ ለአጋሮቻችን እና ለባለድርሻ አካላት ዘላቂ እሴት መፍጠር።",
        om: "Furmaata ijaarsaa fi injineerii sadarkaa addunyaa kennuun hawaasota jijjiiruu fi maamiltoota, michoota, fi qoodduu keenyaaf gatii dhaabaa uumuu.",
      },
    },
    vision: {
      title: {
        en: "Our Vision",
        am: "ራዕያችን",
        om: "Mul'ata Keenyaa",
      },
      content: {
        en: "To be the leading construction company in Ethiopia, recognized for innovation, quality, and integrity, setting new standards in the industry.",
        am: "በምስራቅ አፍሪካ መሪ የግንባታ ኩባንያ መሆን፣ በፈጠራ፣ በጥራት እና በታማኝነት የሚታወቅ፣ በኢንዱስትሪው ውስጥ አዳዲስ ደረጃዎችን ማውጣት።",
        om: "Gara Bahaa Afriikaa keessatti dhaabbata ijaarsaa fulbaana ta'uu, ogummaa, qulqullina, fi amanamummaadhaan beekamuu, sadarkaa haaraa industirii keessatti ramaddiinsa uumuu.",
      },
    },
    values: {
      title: {
        en: "Our Core Values",
        am: "ዋና እሴቶቻችን",
        om: "Gatii Bu'uuraa Keenyaa",
      },
      items: [
        {
          icon: Award,
          title: { en: "Excellence", am: "ልቀት", om: "Ogummaa" },
          desc: {
            en: "We strive for excellence in every project and interaction, setting the highest standards in construction.",
            am: "በእያንዳንዱ ፕሮጀክት እና ግንኙነት ልቀትን እንፈልጋለን፣ በግንባታ ውስጥ ከፍተኛ ደረጃዎችን እናስቀምጣለን።",
            om: "Porjeektii fi walitti dhufeenyaa hunda keessatti ogummaa barbaanna, sadarkaa olaanaa ijaarsaa keessatti ramadna.",
          },
        },
        {
          icon: Shield,
          title: { en: "Integrity", am: "ታማኝነት", om: "Amanamummaa" },
          desc: {
            en: "We operate with transparency and ethical business practices, building trust with every client.",
            am: "በግልጽነት እና በሥነ ምግባራዊ የንግድ አሰራር እንሰራለን፣ ከእያንዳንዱ ደንበኛ ጋር እምነት እንገነባለን።",
            om: "Ifaafi dhaabbata daldalaa safuu wajjin hojiina, maamiltoota hunda wajjin amantii uumna.",
          },
        },
        {
          icon: Lightbulb,
          title: { en: "Innovation", am: "ፈጠራ", om: "Uumama" },
          desc: {
            en: "We embrace modern technologies and creative solutions to deliver better results.",
            am: "ዘመናዊ ቴክኖሎጂዎችን እና የፈጠራ መፍትሄዎችን እንቀበላለን የተሻለ ውጤት ለማምጣት።",
            om: "Teeknolojiilee haaraa fi furmaata uumamaa fudhanna bu'aa gaarii argachuuf.",
          },
        },
        {
          icon: Users,
          title: { en: "Collaboration", am: "ትብብር", om: "Toloo" },
          desc: {
            en: "We work closely with clients and partners to achieve shared success and mutual growth.",
            am: "ለጋራ ስኬት እና የጋራ እድገት ከደንበኞቻችን እና አጋሮቻችን ጋር በቅርበት እንሰራለን።",
            om: "Milkaa'ina walii fi guddina walii galmaan gaafachuuf maamiltoota fi michoota waliin walitti dhiyeenyaan hojiina.",
          },
        },
      ],
    },
    // stats: {
    //   title: {
    //     en: "Our Impact in Numbers",
    //     am: "ተጽኖአችን በቁጥሮች",
    //     om: "Dhiibbaa Keenyaa Lakkoofsaan",
    //   },
    //   projects: {
    //     en: "Projects Completed",
    //     am: "የተጠናቀቁ ፕሮጀክቶች",
    //     om: "Porjeektota Xumuuraman",
    //   },
    //   clients: {
    //     en: "Happy Clients",
    //     am: "ደስተኛ ደንበኞች",
    //     om: "Maamiltoota Gammachuu",
    //   },
    //   countries: {
    //     en: "Countries Served",
    //     am: "ያገለገልናቸው አገሮች",
    //     om: "Birootawwan Tajaajilaman",
    //   },
    //   years: {
    //     en: "Years of Excellence",
    //     am: "የልቀት ዓመታት",
    //     om: "Waggaa Ogummaa",
    //   },
    // },
    history: {
      title: {
        en: "Our Story",
        am: "ታሪካችን",
        om: "Seenaa Keenyaa",
      },
      content: {
        en: "Founded in 2010, HATI Construction has grown to become one of the most trusted construction companies in Ethiopia. With offices in multiple countries and a team of experienced professionals, we have successfully completed over 500 projects ranging from residential to large-scale infrastructure developments. Our commitment to quality, innovation, and client satisfaction has earned us a reputation as a reliable partner in the construction industry.",
        am: "እ.ኤ.አ. በ2010 የተመሰረተው HATI ግንባታ በምስራቅ አፍሪካ ከሚታመኑ የግንባታ ኩባንያዎች አንዱ ሆኗል። በበርካታ አገሮች ቢሮዎች እና ልምድ ባላቸው ባለሙያዎች ቡድን፣ ከ500 በላይ ፕሮጀክቶችን ከመኖሪያ ቤቶች እስከ መጠነ ሰፊ የመሠረተ ልማት ልማቶች ድረስ በተሳካ ሁኔታ አጠናቀናል። ለጥራት፣ ለፈጠራ እና ለደንበኞች እርካታ ያለን ቁርጠኝነት በግንባታ ኢንዱስትሪ ውስጥ እንደ አስተማማኝ አጋር ስም አትርፈናል።",
        om: "HATI Ijaarsa waggaa 2010 jalqabamee, Gara Bahaa Afriikaa keessatti dhaabbata ijaarsaa amanamaa ta'e keessaa tokko ta'ee guddate. Birootawwan hedduu keessatti waajjirootaa fi ogummaa hojii qabduun, porjeektota 500 caalaa manneen jireenyaa jalqabee hanga ijansaa baay'ina guddaatti hojii xumurran. Qulqullina, uumama, fi gammachuu maamiltootaaf kennuun keenya daldala ijaarsaa keessatti michuu amanamaa akka ta'u kabajama uumee jira.",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";
  const stats = homeStats;

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5 bg-repeat"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Building2 className="h-4 w-4" />
              <span>
                {language === "en" && "About Us"}
                {language === "am" && "ስለ እኛ"}
                {language === "om" && "Waaʼee Keenyaa"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {tValue(t.title)}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
              {tValue(t.subtitle)}
            </p>
          </div>
        </section>

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

        {/* Mission and Vision */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20">
                <div className="absolute -top-4 left-8">
                  <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-3xl font-bold mb-4">
                    {tValue(t.mission.title)}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {tValue(t.mission.content)}
                  </p>
                </div>
              </div>
              <div className="group relative p-8 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20">
                <div className="absolute -top-4 left-8">
                  <div className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                    <Eye className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-3xl font-bold mb-4">
                    {tValue(t.vision.title)}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {tValue(t.vision.content)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {tValue(t.values.title)}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {language === "en" &&
                  "The principles that guide everything we do"}
                {language === "am" && "ሁሉንም የምናደርገውን የሚመሩ መርሆች"}
                {language === "om" && "Hojii hunduma nu qajeelchu seerota"}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {t.values.items.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-6 rounded-xl bg-card border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {tValue(value.title)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {tValue(value.desc)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* History */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="relative">
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-full"></div>
              <div className="pl-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold">
                    {tValue(t.history.title)}
                  </h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {tValue(t.history.content)}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {language === "en" && "Established 2010"}
                      {language === "am" && "የተመሰረተው 2010"}
                      {language === "om" && "Waggaa 2010"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {language === "en" && "500+ Projects"}
                      {language === "am" && "500+ ፕሮጀክቶች"}
                      {language === "om" && "500+ Porjeektota"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      {language === "en" && "5 Countries"}
                      {language === "am" && "5 ሀገራት"}
                      {language === "om" && "5 Birootawwan"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "en" && "Ready to Build Your Vision?"}
              {language === "am" && "ራዕይዎን ለመገንባት ዝግጁ ነዎት?"}
              {language === "om" && "Mul'ata Keessan Ijaarsuuf Qophoo?"}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {language === "en" &&
                "Contact us today and let's discuss how we can bring your construction project to life."}
              {language === "am" &&
                "ዛሬ ያግኙን እና የግንባታ ፕሮጀክትዎን እንዴት ወደ እውነት እንደምናመጣው እንወያይ።"}
              {language === "om" &&
                "Har'a nu qunnamaa fi akkamitti porjeektii ijaarsaa keessan jiraachisuu akka dandeenye mari'anna."}
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
              >
                {language === "en" && "Get in Touch"}
                {language === "am" && "አግኙን"}
                {language === "om" && "Quunnamaa"}
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

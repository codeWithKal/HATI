"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign } from "lucide-react";
import tendersData from "@/data/tenders.json";
import tenderInfoData from "@/data/tenderInfo.json";

export default function Tenders() {
  const { language } = useLanguage();

  const t = {
    title: {
      en: "Public Tenders",
      am: "ይህ የህዝብ ውል",
      om: "Walta Manyaanyaa Ummataa",
    },
    description: {
      en: "Open tenders and procurement opportunities",
      am: "ክፍት ውል እና ግዥ ዐውደ",
      om: "Walta banaa fi sagantaa bitaa",
    },
    download: { en: "Download", am: "ወረድ", om: "Gad Buusi" },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const tenders = tendersData;
  const info = tenderInfoData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30";
      case "closed":
        return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
      case "awarded":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return language === "en" ? "Open" : language === "am" ? "ክፍት" : "Banaa";
      case "closed":
        return language === "en"
          ? "Closed"
          : language === "am"
            ? "ዝግ"
            : "Cufame";
      case "awarded":
        return language === "en"
          ? "Awarded"
          : language === "am"
            ? "ተሰጠ"
            : "Kennaa";
      default:
        return "";
    }
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${(amount / 1000000).toFixed(1)}M`;
  };

  // Get active tenders only
  const activeTenders = tenders.filter(
    (tender: any) => tender.isActive !== false,
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
          <div className="container mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <DollarSign className="h-4 w-4" />
              <span>
                {language === "en" && "Procurement Opportunities"}
                {language === "am" && "የግዥ እድሎች"}
                {language === "om" && "Fayyadama Bitaa"}
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {tValue(t.title)}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {tValue(t.description)}
            </p>
          </div>
        </section>

        {/* Tenders List */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Current Tenders"}
                  {language === "am" && "የአሁን ውሎች"}
                  {language === "om" && "Walta Ammaa"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activeTenders.length} tenders available`}
                  {language === "am" && `${activeTenders.length} ውሎች ይገኛሉ`}
                  {language === "om" && `${activeTenders.length} walta jira`}
                </p>
              </div>
              <Badge variant="outline" className="px-4 py-2">
                <Calendar className="h-3 w-3 mr-1" />
                {language === "en" && "Deadlines approaching"}
                {language === "am" && "የደርሰ ጊዜ እየተቃረበ ነው"}
                {language === "om" && "Yeroo xumuraa dhiyaachaa jira"}
              </Badge>
            </div>

            <div className="space-y-6">
              {activeTenders.map((tender: any) => (
                <Card
                  key={tender.id}
                  className="p-6 border hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {tValue(tender.title)}
                      </h3>
                      <p className="text-muted-foreground">
                        {tValue(tender.description)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(tender.status)}>
                      {getStatusLabel(tender.status)}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 py-4 border-y mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === "en" && "Budget"}
                        {language === "am" && "ቅድመ ሙላት"}
                        {language === "om" && "Kaffaltii"}
                      </p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <p className="font-semibold">
                          {formatCurrency(tender.budget)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {language === "en" && "Deadline"}
                        {language === "am" && "የደርሰ ጊዜ"}
                        {language === "om" && "Yeroo Xumuraa"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <time dateTime={tender.deadline}>
                          {new Date(tender.deadline).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                    <div className="flex items-end">
                      {tender.status === "open" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2"
                        >
                          <DollarSign className="h-4 w-4" />
                          {tValue(t.download)}
                        </Button>
                      )}
                      {tender.status === "closed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          {language === "en" && "Closed"}
                          {language === "am" && "ተዘጋ"}
                          {language === "om" && "Cufame"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-20 px-4 bg-secondary/5">
          <div className="container mx-auto max-w-3xl">
            {info.map((item: any) => (
              <div key={item.id}>
                <h2 className="text-3xl font-bold mb-6">
                  {tValue(item.title)}
                </h2>
                {item.paragraphs.map((paragraph: any, index: number) => (
                  <p
                    key={index}
                    className={`text-lg text-muted-foreground leading-relaxed ${
                      index < item.paragraphs.length - 1 ? "mb-4" : ""
                    }`}
                  >
                    {tValue(paragraph)}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const { language } = useLanguage();

  const t = {
    aboutUs: { en: "About Us", am: "ስለ እኛ", om: "Waa'ee Keenyaa" },
    services: { en: "Products", am: "ምርቶቻችን", om: "Oomishaalee Keenya" },
    projects: { en: "Projects", am: "ፕሮጀክቶች", om: "Porjeektota" },
    contact: { en: "Contact", am: "አግኙን", om: "Quunnama" },
    quickLinks: {
      en: "Quick Links",
      am: "ፈጣን አገናኞች",
      om: "Geessituu Jarjaraa",
    },
    contactInfo: {
      en: "Contact Info",
      am: "የግንኙነት መረጃ",
      om: "Odeeffannoo Quunnamaa",
    },
    address: {
      en: "Addis Ababa, Ethiopia",
      am: "አዲስ አበባ፣ ኢትዮጵያ",
      om: "Addis Ababaa, Itoophiyaa",
    },
    phone: { en: "Phone", am: "ስልክ", om: "Bilbila" },
    email: { en: "Email", am: "ኢሜይል", om: "Imeliiti" },
    copyright: {
      en: "All rights reserved.",
      am: "ሁሉም መብቶች የተጠበቁ ናቸው።",
      om: "Mirga hunda kun eegama.",
    },
    madeBy: {
      en: "Made with care by HATI Construction",
      am: "በHATI ግንባታ በፍቅር ተሰራ",
      om: "HATI Construction keessaan jaalalaan hojjetame",
    },
  };

  const t_val = (key: keyof typeof t) => t[key][language as "en" | "am" | "om"];

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info - Left aligned */}
          <div className="flex flex-col items-start">
            <h3 className="mb-4 font-bold text-lg">HATI Construction</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {language === "en" &&
                "Premium construction and engineering services across East Africa"}
              {language === "am" &&
                "በምስራቅ አፍሪካ ውስጥ የላቁ የግንባታ እና የምህንድስና አገልግሎቶች"}
              {language === "om" &&
                "Tajaajila ijaarsa fi injineerii kan qulqullina olaanaa gara Bahaa Afriikaa"}
            </p>
          </div>

          {/* Quick Links - Left aligned */}
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-semibold">{t_val("quickLinks")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-primary transition-colors"
                >
                  {t_val("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-primary transition-colors"
                >
                  {t_val("services")}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-primary transition-colors"
                >
                  {t_val("projects")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-primary transition-colors"
                >
                  {t_val("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services - Left aligned */}
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-semibold">{t_val("services")}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {language === "en" && "Civil Engineering"}
                  {language === "am" && "ሲቪል ምህንድስና"}
                  {language === "om" && "Injineerii Sivilii"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {language === "en" && "Building Construction"}
                  {language === "am" && "ህንጻ ግንባታ"}
                  {language === "om" && "Ijaarsa Gamoo"}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {language === "en" && "Project Management"}
                  {language === "am" && "ፕሮጀክት አስተዳደር"}
                  {language === "om" && "Bulchiinsa Porjeektii"}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info - Left aligned */}
          <div className="flex flex-col items-start">
            <h4 className="mb-4 font-semibold">{t_val("contactInfo")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>{t_val("address")}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+251911234567"
                  className="hover:text-primary transition-colors"
                >
                  +251 91 123 4567
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@haticonst.com"
                  className="hover:text-primary transition-colors break-all"
                >
                  info@haticonst.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section - Centered */}
        <div className="mt-8 border-t pt-8 flex flex-col items-center justify-center space-y-2 text-center text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} HATI Construction. {t_val("copyright")}
          </p>
          <p>{t_val("madeBy")}</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Shield, Heart, Building2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminFooter() {
  const { resolvedTheme } = useTheme();
  const { language } = useLanguage();
  const year = new Date().getFullYear();

  const t = {
    adminPanel: {
      en: "Admin Panel",
      am: "የአስተዳደር ፓነል",
      om: "Paaneelii Bulchiinsaa",
    },
    version: {
      en: "Version",
      am: "ስሪት",
      om: "Fooyya",
    },
    secure: {
      en: "Secure",
      am: "ደህንነቱ የተጠበቀ",
      om: "Nageenya",
    },
    builtWith: {
      en: "Built with",
      am: "የተሰራው በ",
      om: "Kan ijaarame",
    },
    love: {
      en: "❤️",
      am: "❤️",
      om: "❤️",
    },
    copyright: {
      en: "All rights reserved",
      am: "መብቱ በህግ የተጠበቀ ነው",
      om: "Mirgi hundumaa kun eegama",
    },
    quickLinks: {
      en: "Quick Links",
      am: "ፈጣን መያዣዎች",
      om: "Liinkii Dafaa",
    },
    dashboard: {
      en: "Dashboard",
      am: "ዳሽቦርድ",
      om: "Daashboordii",
    },
    content: {
      en: "Content",
      am: "ይዘት",
      om: "Qabiyyee",
    },
    settings: {
      en: "Settings",
      am: "ቅንጅቶች",
      om: "Qindaa'ina",
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  return (
    <footer className="border-t bg-card/95 backdrop-blur-sm shadow-inner">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Footer */}
        <div className="py-4 md:py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Brand Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-sm">HATI</span>
                  <span className="text-[10px] text-muted-foreground block -mt-0.5">
                    {tValue(t.adminPanel)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {tValue(t.copyright)} © {year}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{tValue(t.builtWith)}</span>
                <span className="text-primary">{tValue(t.love)}</span>
                <span>Next.js</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {tValue(t.quickLinks)}
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {tValue(t.dashboard)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/products"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {tValue(t.content)}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {tValue(t.settings)}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Status & Info */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {tValue(t.secure)}
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3 text-primary" />
                  <span>256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={`h-2 w-2 rounded-full ${resolvedTheme === "dark" ? "bg-blue-500" : "bg-amber-500"}`}
                  />
                  <span>
                    {resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>System Online</span>
                </div>
              </div>
            </div>

            {/* Social & Version */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                {tValue(t.version)}
              </h4>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">v2.0.0 • {year}</p>

                <p className="text-[10px] text-muted-foreground">
                  {tValue(t.adminPanel)} • {tValue(t.secure)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-muted-foreground text-center sm:text-left">
            © {year} HATI Construction. {tValue(t.copyright)}.
          </p>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <Link
              href="/admin/privacy"
              className="hover:text-primary transition-colors duration-200"
            >
              Privacy
            </Link>
            <span className="w-px h-3 bg-border" />
            <Link
              href="/admin/terms"
              className="hover:text-primary transition-colors duration-200"
            >
              Terms
            </Link>
            <span className="w-px h-3 bg-border" />
            <Link
              href="/admin/security"
              className="hover:text-primary transition-colors duration-200"
            >
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

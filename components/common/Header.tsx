"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Info,
  Package,
  Briefcase,
  FolderGit2,
  Images,
  Users,
  Newspaper,
  UserCircle,
  Mail,
  Building2,
} from "lucide-react";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const languages: { code: "en" | "am" | "om"; label: string }[] = [
    { code: "en", label: "English" },
    { code: "am", label: "አማርኛ" },
    { code: "om", label: "Afaan Oromoo" },
  ];

  const navigationLinks = [
    { href: "/", label: { en: "Home", am: "መግቢያ", om: "Mana" }, icon: Home },
    {
      href: "/about",
      label: { en: "About", am: "ስለ እኛ", om: "Waa'ee Keenyaa" },
      icon: Info,
    },
    {
      href: "/products",
      label: { en: "Products", am: "ምርቶች", om: "Oomisha" },
      icon: Package,
    },
    // {
    //   href: "/services",
    //   label: { en: "Services", am: "አገልግሎቶች", om: "Tajaajila" },
    //   icon: Briefcase,
    // },
    // {
    //   href: "/projects",
    //   label: { en: "Projects", am: "ፕሮጀክቶች", om: "Porjeektota" },
    //   icon: FolderGit2,
    // },
    {
      href: "/gallery",
      label: { en: "Gallery", am: "ማሳያ", om: "Albumii" },
      icon: Images,
    },
    {
      href: "/staff",
      label: { en: "Staff", am: "ሰራተኞች", om: "Hojjattoota" },
      icon: Users,
    },
    {
      href: "/news",
      label: { en: "News", am: "ዜና", om: "Oduu" },
      icon: Newspaper,
    },
    {
      href: "/careers",
      label: { en: "Careers", am: "ሥራ", om: "Hojii" },
      icon: UserCircle,
    },
    {
      href: "/contact",
      label: { en: "Contact", am: "አግኙን", om: "Quunnama" },
      icon: Mail,
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-lg border-b shadow-sm"
          : "bg-background/80 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - Left aligned */}
        <Link
          href="/"
          className="flex items-center space-x-2 flex-shrink-0 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight">HATI</span>
            <span className="text-xs text-muted-foreground block -mt-1">
              Construction
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Center aligned */}
        <nav className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1 lg:space-x-1">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 group ${
                  active
                    ? "text-primary bg-primary/10"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"}`}
                />
                {link.label[language]}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls - Right aligned */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-1.5 min-w-[80px] bg-transparent hover:bg-accent/50"
              >
                <span className="text-xs">
                  {languages.find((l) => l.code === language)?.label}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer gap-2 ${
                    language === lang.code ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="text-sm">{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          {/* Mobile language selector (simplified) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden min-w-[40px] px-2 bg-transparent hover:bg-accent/50"
              >
                <span className="text-xs">
                  {languages
                    .find((l) => l.code === language)
                    ?.label.substring(0, 2)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`cursor-pointer gap-2 ${
                    language === lang.code ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <span className="text-sm">{lang.label}</span>
                  {language === lang.code && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-9 w-9 p-0 hover:bg-accent/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-4 duration-200">
          <nav className="container mx-auto flex flex-col py-4 px-4 max-h-[80vh] overflow-y-auto">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-accent/50 hover:text-accent-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground/70"}`}
                  />
                  <span>{link.label[language]}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
            <div className="mt-4 pt-4 border-t">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="h-4 w-4" />
                {language === "en" && "Get a Quote"}
                {language === "am" && "ዋጋ ያግኙ"}
                {language === "om" && "Gatii Argadhu"}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

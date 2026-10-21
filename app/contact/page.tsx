"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Building2,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import contactInfoData from "@/data/contactInfo.json";
import businessHoursData from "@/data/businessHours.json";

const iconMap: Record<string, any> = {
  MapPin: MapPin,
  Phone: Phone,
  Mail: Mail,
  Globe: Globe,
  Clock: Clock,
  Send: Send,
};

// Formspree endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mvkzezkp";

export default function Contact() {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: { en: "Contact Us", am: "ያግኙን", om: "Nuqunnamaa" },
    subtitle: {
      en: "We'd Love to Hear From You",
      am: "ከእርስዎ መስማት እንወዳለን",
      om: "We'd Love to Hear From You",
    },
    description: {
      en: "Have a project in mind or need more information? Our team is ready to assist you with any inquiries.",
      am: "ተጨማሪ መረጃ ያስፈልግዎታል? ቡድናችን ለማንኛውም ጥያቄዎች እርዳታ ለመስጠት ዝግጁ ነው።",
      om: "Porjeektii yaadduu qabdaa ykn odeeffannoo dabalataa barbaaddaa? Gareen keenya gaaffii hundaaf gargaaruu qophaaʼe.",
    },
    contactInfo: {
      en: "Contact Information",
      am: "የግንኙነት መረጃ",
      om: "Odeeffannoo Walitti Qeebeeffannaa",
    },
    form: {
      name: { en: "Full Name", am: "ሙሉ ስም", om: "Maqaa Guutuu" },
      email: { en: "Email Address", am: "ኢሜይል አድራሻ", om: "Ergaa Aadiressa" },
      phone: { en: "Phone Number", am: "ስልክ ቁጥር", om: "Bilbilsa Lakkoobsa" },
      subject: { en: "Subject", am: "ርዕስ", om: "Seenaa" },
      message: { en: "Message", am: "መልእክት", om: "Ergaa" },
      submit: { en: "Send Message", am: "መልእክት ይላኩ", om: "Ergaa Ergi" },
      sending: { en: "Sending...", am: "በመላክ ላይ...", om: "Ergaa Jira..." },
      success: {
        en: "Thank you for your message! We will get back to you within 24 hours.",
        am: "ለመልእክትዎ እናመሰግናለን! በ24 ሰዓታት ውስጥ እንመልስልዎታለን።",
        om: "Ergaa keessaniif galatoomaa! Saʼaatii 24 keessatti deebii isinif kennina.",
      },
      error: {
        en: "Something went wrong. Please try again or contact us directly.",
        am: "የተሳሳተ ነገር ተከስቷል። እባክዎ እንደገና ይሞክሩ ወይም በቀጥታ ያግኙን።",
        om: "Wanti tokko dogoggore. Maaloo ammas yaali ykn kallattiin nu qunnami.",
      },
    },
    successScreen: {
      title: {
        en: "Message Sent Successfully!",
        am: "መልእክትዎ በተሳካ ሁኔታ ተልኳል!",
        om: "Ergaan Milkaaʼinaan Ergameera!",
      },
      subtitle: {
        en: "Your message has been received",
        am: "መልእክትዎ ደርሶናል",
        om: "Ergaan keessan nu bira gaʼeera",
      },
      description: {
        en: "Thank you for reaching out to HATI Sandstone. Our team has received your message and will get back to you within 24 hours.",
        am: "ሃቲ የአሸዋ ድንጋይን ስለጎበኙ እናመሰግናለን። ቡድናችን መልእክትዎን ተቀብሏል እና በ24 ሰዓታት ውስጥ ይመልስልዎታል።",
        om: "HATI Sandstone qunnamaa keessaniif galatoomaa. Gareen keenya ergaa keessan fudhatee saʼaatii 24 keessatti deebii isinif kenna.",
      },
      nextSteps: {
        en: "What happens next?",
        am: "ቀጥሎ ምን ይሆናል?",
        om: "Itti aansuun maal taʼa?",
      },
      steps: {
        en: [
          "Our team reviews your message",
          "We prepare a tailored response",
          "You'll hear from us within 24 hours",
        ],
        am: [
          "ቡድናችን መልእክትዎን ይገመግማል",
          "ለእርስዎ የተዘጋጀ ምላሽ እናዘጋጃለን",
          "በ24 ሰዓታት ውስጥ ከእኛ ይሰማሉ",
        ],
        om: [
          "Gareen keenya ergaa keessan gamaaggama",
          "Deebii isinif qophaa'e qopheessina",
          "Saʼaatii 24 keessatti nu dhaggeeffattu",
        ],
      },
      sendAnother: {
        en: "Send Another Message",
        am: "ሌላ መልእክት ይላኩ",
        om: "Ergaa Biraa Ergi",
      },
      contactDirectly: {
        en: "Need urgent help? Contact us directly",
        am: "አስቸኳይ እርዳታ ይፈልጋሉ? በቀጥታ ያግኙን",
        om: "Gargaarsa ariifachiisaa barbaaddaa? Kallattiin nu qunnamaa",
      },
    },
    hours: { en: "Business Hours", am: "የስራ ሰዓታት", om: "Yeroo Hojii" },
    getInTouch: {
      en: "Get in Touch",
      am: "ያግኙን",
      om: "Nu Qunnamaa",
    },
    followUs: {
      en: "Follow Us",
      am: "ተከተሉን",
      om: "Nu Hordofaa",
    },
    quickResponse: {
      en: "Quick Response",
      am: "ፈጣን ምላሽ",
      om: "Deebii saffisaa",
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const contactInfo = contactInfoData;
  const businessHours = businessHoursData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          _subject: `New contact form submission: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Form submission failed");
      }
    } catch (err) {
      console.error("Formspree submission error:", err);
      setError(tValue(t.form.error));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setError(null);
  };

  // Get active contact info
  const activeContactInfo = contactInfo.filter(
    (item: any) => item.isActive !== false,
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
              <MessageCircle className="h-4 w-4" />
              <span>
                {language === "en" && "Get in Touch"}
                {language === "am" && "ያግኙን"}
                {language === "om" && "Nu qunnamaa"}
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

        {/* Contact Cards */}
        <section className="py-12 px-4 -mt-6 relative z-20">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {activeContactInfo.map((item: any) => {
                const Icon = iconMap[item.icon] || MapPin;
                const BadgeIcon = iconMap[item.badgeIcon] || Globe;

                const detailsArray = tValue(item.details).split("\n");

                return (
                  <Card
                    key={item.id}
                    className="p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {tValue(item.title)}
                        </h3>
                        <div className="space-y-1 text-sm">
                          {detailsArray.map((line: string, idx: number) => (
                            <p
                              key={idx}
                              className="text-muted-foreground leading-relaxed"
                            >
                              {line}
                            </p>
                          ))}
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          <BadgeIcon className="h-3 w-3 mr-1" />
                          {tValue(item.badge)}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Contact Form and Business Hours */}
        <section className="py-16 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Form OR Success Screen */}
              <div className="md:col-span-2">
                {submitted ? (
                  /* ===== SUCCESS COMPONENT ===== */
                  <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-500/5 via-background to-primary/5 p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/10 rounded-full blur-3xl -z-0"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-0"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                      {/* Animated check icon */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative p-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                          <CheckCircle2
                            className="h-12 w-12 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-primary bg-clip-text text-transparent">
                        {tValue(t.successScreen.title)}
                      </h2>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-4">
                        {tValue(t.successScreen.subtitle)}
                      </p>
                      <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                        {tValue(t.successScreen.description)}
                      </p>

                      {/* Next steps */}
                      <div className="w-full max-w-md bg-background/60 backdrop-blur-sm border rounded-xl p-5 mb-8 text-left">
                        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-primary" />
                          {tValue(t.successScreen.nextSteps)}
                        </h3>
                        <ul className="space-y-2.5">
                          {(
                            t.successScreen.steps[language] ||
                            t.successScreen.steps.en
                          ).map((step: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 text-sm text-muted-foreground"
                            >
                              <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                        <Button
                          onClick={handleReset}
                          variant="outline"
                          className="flex-1 gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          {tValue(t.successScreen.sendAnother)}
                        </Button>
                        <Button asChild className="flex-1 gap-2">
                          <Link href="/">
                            <ArrowRight className="h-4 w-4" />
                            {language === "en" && "Back to Home"}
                            {language === "am" && "ወደ መነሻ ተመለስ"}
                            {language === "om" && "Gara Manaatti Deebi'i"}
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground mt-6">
                        {tValue(t.successScreen.contactDirectly)}
                      </p>
                    </div>
                  </Card>
                ) : (
                  /* ===== FORM ===== */
                  <>
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold">
                        {tValue(t.getInTouch)}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {language === "en" &&
                          "Fill out the form and we'll respond within 24 hours"}
                        {language === "am" &&
                          "ቅጹን ይሙሉ እና በ24 ሰዓታት ውስጥ እንመልስልዎታለን"}
                        {language === "om" &&
                          "Formicha guutaa fi saʼaatii 24 keessatti deebii isinif kennina"}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            {tValue(t.form.name)}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            {tValue(t.form.email)}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            {tValue(t.form.phone)}
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="+251 91 123 4567"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">
                            {tValue(t.form.subject)}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="subject"
                            placeholder={
                              language === "en"
                                ? "Project Inquiry"
                                : "የፕሮጀክት ጥያቄ"
                            }
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1.5 block">
                          {tValue(t.form.message)}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="message"
                          placeholder={
                            language === "en"
                              ? "Tell us about your project..."
                              : "ስለ ፕሮጀክትዎ ይንገሩን..."
                          }
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2.5 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full gap-2"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                            {tValue(t.form.sending)}
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            {tValue(t.form.submit)}
                          </>
                        )}
                      </Button>

                      {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400 rounded-lg flex items-start gap-3 transition-all duration-300">
                          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                          <p>{error}</p>
                        </div>
                      )}
                    </form>
                  </>
                )}
              </div>

              {/* Business Hours & Info */}
              <div className="space-y-6">
                <Card className="p-6 border-0 bg-gradient-to-b from-secondary/5 to-background">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{tValue(t.hours)}</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    {businessHours.map((item: any) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center pb-2 border-b last:border-b-0 last:pb-0"
                      >
                        <span className="text-muted-foreground">
                          {tValue(item.day)}
                        </span>
                        {item.isOpen ? (
                          <Badge className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                            {item.hours}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            {tValue(item.hours)}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 border-0 bg-gradient-to-b from-primary/5 to-background">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      {tValue(t.followUs)}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {language === "en" && "Connect with us on social media"}
                      {language === "am" && "በማህበራዊ ሚዲያ ያገናኙን"}
                      {language === "om" &&
                        "Media Social keessatti nu qunnamaa"}
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-primary/10"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-primary/10"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full hover:bg-primary/10"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 px-4 bg-secondary/5">
          <div className="container mx-auto">
            {/* Section heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4 border border-primary/20">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>
                  {language === "en" && "Our Location"}
                  {language === "am" && "የእኛ አድራሻ"}
                  {language === "om" && "Bakka Keenya"}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {language === "en" && "Visit Us"}
                {language === "am" && "ይጎብኙን"}
                {language === "om" && "Nu Daawwadhaa"}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {language === "en" &&
                  "HATI Sandstone and selected materials manufacturing PLC — Addis Ababa, Ethiopia"}
                {language === "am" &&
                  "ሃቲ የአሸዋ ድንጋይ እና የተመረጡ ቁሳቁሶች ማምረቻ PLC — አዲስ አበባ፣ ኢትዮጵያ"}
                {language === "om" &&
                  "HATI Sandstone and selected materials manufacturing PLC — Finfinnee, Itoophiyaa"}
              </p>
            </div>

            {/* Map embed */}
            <div className="relative rounded-2xl overflow-hidden border shadow-xl group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.8625439886505!2d39.145424!3d9.1668702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164bc7004d2cc17f%3A0xc54078f00a57f6c4!2sHATI%20Sandstone%20and%20selected%20materials%20manufacturing%20PLC!5e0!3m2!1sen!2set!4v1791294880594!5m2!1sen!2set"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HATI Sandstone Location"
                className="w-full h-80 md:h-[450px] grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
              ></iframe>

              {/* Overlay card with actions */}
              <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-sm bg-background/95 backdrop-blur-md rounded-xl p-4 shadow-lg border pointer-events-none">
                <div className="flex items-start gap-3 pointer-events-auto">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Building2
                      className="h-5 w-5 text-primary"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 truncate">
                      HATI Sandstone & Materials PLC
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {language === "en" && "Open 24 hours (Sun: Closed)"}
                      {language === "am" && "24 ሰዓት ክፍት (እሁድ፦ ዝግ)"}
                      {language === "om" &&
                        "Saʼaatii 24 banaa (Dilbata: Cufaa)"}
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="default"
                      className="w-full gap-1.5"
                    >
                      <a
                        href="https://maps.app.goo.gl/qeM96fXB8j47A9pz7"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {language === "en" && "Open in Google Maps"}
                        {language === "am" && "በGoogle Maps ክፈት"}
                        {language === "om" && "Google Maps keessatti bani"}
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action buttons below map */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Button asChild variant="outline" className="gap-2">
                <a
                  href="https://maps.app.goo.gl/qeM96fXB8j47A9pz7"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {language === "en" && "Get Directions"}
                  {language === "am" && "አቅጣጫ ያግኙ"}
                  {language === "om" && "Qajeelfama Argadhu"}
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=HATI+Sandstone+and+selected+materials+manufacturing+PLC"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  {language === "en" && "View Larger Map"}
                  {language === "am" && "ትልቅ ካርታ ይመልከቱ"}
                  {language === "om" && "Kaartaa Guddaa Ilaali"}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

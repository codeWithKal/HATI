"use client";

import { useState } from "react";
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
  X,
  CheckCircle,
  Calendar,
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
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"details" | "apply">("details");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const t = {
    title: { en: "Careers at HATI", am: "በHATI ስራዎች", om: "Hojii HATI" },
    subtitle: {
      en: "Build Your Future With Us",
      am: "የወደፊት ህይወትዎን ከእኛ ጋር ይገንቡ",
      om: "Fuuldura Keessan Nu Waliin Ijaarsaa",
    },
    description: {
      en: "Join our team of dedicated professionals and be part of exciting projects that are shaping the future of Ethiopia.",
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
    modal: {
      details: {
        en: "Job Details",
        am: "የስራ ዝርዝር",
        om: "Gari Hojii",
      },
      apply: {
        en: "Apply for this Position",
        am: "ለዚህ ስራ ያመልክቱ",
        om: "Hojii kanaaf Galmaa",
      },
      requirements: {
        en: "Requirements",
        am: "መስፈርቶች",
        om: "Barbaachisoota",
      },
      description: {
        en: "Job Description",
        am: "የስራ መግለጫ",
        om: "Ibsa Hojii",
      },
      overview: {
        en: "Position Overview",
        am: "የስራ አጠቃላይ እይታ",
        om: "Muulexxensa Hojii",
      },
      fullName: {
        en: "Full Name",
        am: "ሙሉ ስም",
        om: "Maqaa Guutuu",
      },
      email: {
        en: "Email Address",
        am: "ኢሜል አድራሻ",
        om: "Teessoo Imelii",
      },
      phone: {
        en: "Phone Number",
        am: "ስልክ ቁጥር",
        om: "Lakkoobsa Bilbilaa",
      },
      coverLetter: {
        en: "Cover Letter",
        am: "ሽፋን ደብዳቤ",
        om: "Xalayaa Haguuggaa",
      },
      resume: {
        en: "Upload Resume/CV",
        am: "የስራ ታሪክ ስቀል",
        om: "Gageetii Baasanii",
      },
      submit: {
        en: "Submit Application",
        am: "ማመልከቻ ያስገቡ",
        om: "Galmaa Galchaa",
      },
      submitting: {
        en: "Submitting...",
        am: "በመላክ ላይ...",
        om: "Ergaa jira...",
      },
      success: {
        en: "Application Submitted Successfully!",
        am: "ማመልከቻ በተሳካ ሁኔታ ተልኳል!",
        om: "Galmee Baga Booddeetti Ergame!",
      },
      close: {
        en: "Close",
        am: "ዝጋ",
        om: "Cufi",
      },
      posted: {
        en: "Posted",
        am: "ተለጠፈ",
        om: "Maxxanfame",
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

  const handleOpenModal = (position: any, view: "details" | "apply") => {
    setSelectedPosition(position);
    setModalView(view);
    setIsModalOpen(true);
    setSubmitSuccess(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      coverLetter: "",
      resume: null,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPosition(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would actually send the data to your backend
    console.log("Application submitted:", {
      position: selectedPosition,
      ...formData,
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

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
                        <Calendar className="h-3 w-3" />
                        <span>
                          {language === "en" && "Posted: "}
                          {language === "am" && "ተለጠፈ: "}
                          {language === "om" && "Maxxanfame: "}
                          {new Date(position.posted).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleOpenModal(position, "details")}
                        >
                          {tValue(t.viewDetails)}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="gap-1"
                          onClick={() => handleOpenModal(position, "apply")}
                        >
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

      {/* Modal */}
      {isModalOpen && selectedPosition && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={handleCloseModal}
        >
          <div
            className="bg-background rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pr-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    {modalView === "details"
                      ? tValue(t.modal.details)
                      : tValue(t.modal.apply)}
                  </h2>
                  <h3 className="text-xl text-primary mt-1">
                    {tValue(selectedPosition.title)}
                  </h3>
                </div>
                <Badge
                  className={getDepartmentColor(selectedPosition.department.en)}
                >
                  {tValue(selectedPosition.department)}
                </Badge>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b">
              <button
                onClick={() => setModalView("details")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  modalView === "details"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tValue(t.modal.details)}
              </button>
              <button
                onClick={() => setModalView("apply")}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  modalView === "apply"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tValue(t.modal.apply)}
              </button>
            </div>

            {/* Modal Content */}
            {modalView === "details" ? (
              <div className="space-y-6">
                {/* Job Info */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{tValue(selectedPosition.location)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>{tValue(selectedPosition.type)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{tValue(selectedPosition.experience)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {tValue(t.modal.posted)}:{" "}
                      {new Date(selectedPosition.posted).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {selectedPosition.description && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {tValue(t.modal.overview)}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {tValue(selectedPosition.description)}
                    </p>
                  </div>
                )}

                {/* Requirements */}
                {selectedPosition.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {tValue(t.modal.requirements)}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {tValue(selectedPosition.requirements).map(
                        (req: string, index: number) => (
                          <li key={index} className="pl-2">
                            {req}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Apply Button in Details View */}
                <div className="pt-4 border-t">
                  <Button
                    className="w-full gap-2"
                    onClick={() => setModalView("apply")}
                  >
                    <Send className="h-4 w-4" />
                    {tValue(t.apply)}
                  </Button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <div>
                {submitSuccess ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {tValue(t.modal.success)}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === "en" &&
                        "We'll review your application and get back to you soon."}
                      {language === "am" &&
                        "ማመልከቻዎን እንገመግማለን እና በቅርቡ እንመልስልዎታለን።"}
                      {language === "om" &&
                        "Galmee keessan ilaaltaa fi yeroo dhiyoo deebii isiniif nimanna."}
                    </p>
                    <Button onClick={handleCloseModal}>
                      {tValue(t.modal.close)}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.fullName)} *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={language === "en" ? "John Doe" : "ጆን ዶ"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.email)} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.phone)}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+251 9XX XXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.coverLetter)}
                      </label>
                      <textarea
                        name="coverLetter"
                        rows={4}
                        value={formData.coverLetter}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        placeholder={
                          language === "en"
                            ? "Tell us why you're interested in this position..."
                            : ""
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.resume)} *
                      </label>
                      <input
                        type="file"
                        name="resume"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === "en" &&
                          "Accepted formats: PDF, DOC, DOCX (Max 5MB)"}
                        {language === "am" &&
                          "ተቀባይነት ያላቸው ቅርጾች፡ PDF, DOC, DOCX (ከፍተኛው 5MB)"}
                        {language === "om" &&
                          "Faayilaalee fudhatama: PDF, DOC, DOCX (Max 5MB)"}
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          {tValue(t.modal.submitting)}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {tValue(t.modal.submit)}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

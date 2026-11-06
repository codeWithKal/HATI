"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { cn } from "@/lib/utils";

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
    address: "",
    portfolioUrl: "",
    education: "",
    fieldOfStudy: "",
    experienceYears: "",
    previousEmployer: "",
    coverLetter: "",
    resume: null as File | null,
    supporting: [] as File[],
    certificates: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [applicationReference, setApplicationReference] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [reviewing, setReviewing] = useState(false);

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
      details: { en: "Job Details", am: "የስራ ዝርዝር", om: "Gari Hojii" },
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
      fullName: { en: "Full Name", am: "ሙሉ ስም", om: "Maqaa Guutuu" },
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
      close: { en: "Close", am: "ዝጋ", om: "Cufi" },
      posted: { en: "Posted", am: "ተለጠፈ", om: "Maxxanfame" },
    },
  };

  const tValue = (obj: any) => obj?.[language] ?? obj?.["en"] ?? "";

  const [positionsList, setPositionsList] = useState<any[]>([]);
  const [benefitsList, setBenefitsList] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/careers?public=1", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data?.careers)) setPositionsList(data.careers);
        if (Array.isArray(data?.benefits)) setBenefitsList(data.benefits);
      })
      .catch(() => {});
  }, []);

  const positions = positionsList;
  const benefits = benefitsList;

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

  const activePositions = positions.filter(
    (pos: any) => pos.isActive !== false,
  );

  const dateLocale =
    language === "am" ? "am-ET" : language === "om" ? "om-ET" : "en-US";

  const handleOpenModal = (position: any, view: "details" | "apply") => {
    setSelectedPosition(position);
    setModalView(view);
    setIsModalOpen(true);
    setSubmitSuccess(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      portfolioUrl: "",
      education: "",
      fieldOfStudy: "",
      experienceYears: "",
      previousEmployer: "",
      coverLetter: "",
      resume: null,
      supporting: [],
      certificates: [],
    });
    setApplicationError(""); setApplicationReference(""); setReviewing(false);
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
      const file = e.target.files[0];
      if (file.type !== "application/pdf" || file.size > 5 * 1024 * 1024) { setApplicationError("Upload a PDF resume smaller than 5 MB."); e.target.value = ""; return; }
      setApplicationError("");
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const acceptingApplications = (position: any) => position?.isActive && position?.vacancyStatus !== "closed" && (!position?.applicationDeadline || position.applicationDeadline >= new Date().toISOString().slice(0, 10));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewing) { setReviewing(true); return; }
    setIsSubmitting(true);
    setApplicationError("");
    try {
      const payload = new FormData();
      payload.set("careerId", String(selectedPosition.id));
      for (const field of ["fullName", "email", "phone", "address", "portfolioUrl", "education", "fieldOfStudy", "experienceYears", "previousEmployer", "coverLetter"] as const) payload.set(field, formData[field]);
      if (formData.resume) payload.set("resume", formData.resume);
      formData.supporting.forEach((file) => payload.append("supporting", file));
      formData.certificates.forEach((file) => payload.append("certificate", file));
      const response = await fetch("/api/job-applications", { method: "POST", body: payload });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to submit your application.");
      setApplicationReference(result.referenceNo); setSubmitSuccess(true);
    } catch (error) { setApplicationError(error instanceof Error ? error.message : "Unable to submit your application."); }
    finally { setIsSubmitting(false); }
  };

  const getLocalizedArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (Array.isArray(value[language])) return value[language];
    if (Array.isArray(value.en)) return value.en;
    return [];
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

        {/* Benefits */}
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

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
              {activePositions.map((position: any) => {
                const deptKey = position.department?.en ?? "";
                const DepartmentIcon = getDepartmentIcon(deptKey);
                const deptColor = getDepartmentColor(deptKey);

                return (
                  <Card
                    key={position.id}
                    className="group h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border hover:border-primary/20"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3 w-full">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors min-w-0 pr-2">
                          {tValue(position.title)}
                        </CardTitle>
                        <CardAction>
                          <Badge
                            variant="outline"
                            className={cn(deptColor, "shrink-0 text-[11px]")}
                          >
                            <DepartmentIcon className="h-3 w-3 mr-1" />
                            {tValue(position.department)}
                          </Badge>
                        </CardAction>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span>{tValue(position.location)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 text-primary shrink-0" />
                        <span>{tValue(position.type)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span>{tValue(position.experience)}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="mt-auto flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="whitespace-nowrap">
                          {tValue(t.modal.posted)}:{" "}
                          {new Date(position.posted).toLocaleDateString(
                            dateLocale,
                          )}
                        </span>
                        {position.applicationDeadline && <span className="whitespace-nowrap">Deadline: {new Date(`${position.applicationDeadline}T00:00:00`).toLocaleDateString(dateLocale)}</span>}
                      </div>
                      {position.vacancies && <span className="text-xs text-muted-foreground">{position.vacancies} {language === "am" ? "ክፍት ቦታዎች" : language === "om" ? "Bakka hojii" : "vacancy(s)"}</span>}
                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          onClick={() => handleOpenModal(position, "details")}
                        >
                          {tValue(t.viewDetails)}
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1 bg-primary text-primary-foreground"
                          disabled={!acceptingApplications(position)}
                          onClick={() => handleOpenModal(position, "apply")}
                        >
                          {tValue(t.apply)}
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardFooter>
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
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
              >
                <Link href="/contact">
                  <FileText className="h-5 w-5" />
                  {tValue(t.cta.button)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10"
              >
                <Link href="/contact">
                  <Mail className="h-5 w-5" />
                  {language === "en" && "Contact HR"}
                  {language === "am" && "የሰው ሃብት ያግኙ"}
                  {language === "om" && "HR Qunnamaa"}
                </Link>
              </Button>
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
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

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
                  className={getDepartmentColor(
                    selectedPosition.department?.en ?? "",
                  )}
                >
                  {tValue(selectedPosition.department)}
                </Badge>
              </div>
            </div>

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

            {modalView === "details" ? (
              <div className="space-y-6">
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
                      {new Date(selectedPosition.posted).toLocaleDateString(
                        dateLocale,
                      )}
                    </span>
                  </div>
                </div>

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

                {selectedPosition.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">
                      {tValue(t.modal.requirements)}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {getLocalizedArray(selectedPosition.requirements).map(
                        (req: string, index: number) => (
                          <li key={index} className="pl-2">
                            {req}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {selectedPosition.responsibilities && tValue(selectedPosition.responsibilities) && <div><h4 className="mb-2 font-semibold">Responsibilities</h4><p className="whitespace-pre-line leading-relaxed text-muted-foreground">{tValue(selectedPosition.responsibilities)}</p></div>}
                {selectedPosition.qualifications && tValue(selectedPosition.qualifications) && <div><h4 className="mb-2 font-semibold">Qualifications</h4><p className="whitespace-pre-line leading-relaxed text-muted-foreground">{tValue(selectedPosition.qualifications)}</p></div>}
                {selectedPosition.skills && tValue(selectedPosition.skills) && <div><h4 className="mb-2 font-semibold">Required skills</h4><p className="whitespace-pre-line leading-relaxed text-muted-foreground">{tValue(selectedPosition.skills)}</p></div>}

                <div className="pt-4 border-t">
                  <Button
                    type="button"
                    className="w-full gap-2"
                    disabled={!acceptingApplications(selectedPosition)}
                    onClick={() => setModalView("apply")}
                  >
                    <Send className="h-4 w-4" />
                    {tValue(t.apply)}
                  </Button>
                </div>
              </div>
            ) : (
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
                    <p className="mb-6 rounded-lg border border-green-600/30 bg-green-500/10 p-3 font-mono font-semibold text-green-800 dark:text-green-300">Application reference: {applicationReference}</p>
                    <Button type="button" onClick={handleCloseModal}>
                      {tValue(t.modal.close)}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {reviewing && <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4"><h4 className="font-semibold">Review your application</h4><dl className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2"><div><dt className="inline font-medium text-foreground">Position: </dt><dd className="inline">{tValue(selectedPosition.title)}</dd></div><div><dt className="inline font-medium text-foreground">Candidate: </dt><dd className="inline">{formData.fullName}</dd></div><div><dt className="inline font-medium text-foreground">Email: </dt><dd className="inline">{formData.email}</dd></div><div><dt className="inline font-medium text-foreground">Phone: </dt><dd className="inline">{formData.phone}</dd></div><div><dt className="inline font-medium text-foreground">Education: </dt><dd className="inline">{formData.education} · {formData.fieldOfStudy}</dd></div><div><dt className="inline font-medium text-foreground">Resume: </dt><dd className="inline">{formData.resume?.name}</dd></div></dl><Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setReviewing(false)}>Edit application details</Button></div>}
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
                        placeholder={
                          language === "en"
                            ? "John Doe"
                            : language === "am"
                              ? "ጆን ዶ"
                              : "Fulanaa Fulaan"
                        }
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

                    <div><label className="mb-1 block text-sm font-medium">Current address / location *</label><input type="text" name="address" required maxLength={500} value={formData.address} onChange={handleInputChange} className="w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                    <div><label className="mb-1 block text-sm font-medium">Professional profile or portfolio (optional)</label><input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleInputChange} placeholder="https://" className="w-full rounded-md border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" /></div>
                    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Education / qualification *<input name="education" required maxLength={255} value={formData.education} onChange={handleInputChange} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground" /></label><label className="text-sm font-medium">Field of study *<input name="fieldOfStudy" required maxLength={255} value={formData.fieldOfStudy} onChange={handleInputChange} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground" /></label></div>
                    <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-medium">Years of experience *<input name="experienceYears" required type="number" min="0" max="80" step="0.5" value={formData.experienceYears} onChange={handleInputChange} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground" /></label><label className="text-sm font-medium">Current or previous employer<input name="previousEmployer" maxLength={255} value={formData.previousEmployer} onChange={handleInputChange} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground" /></label></div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {tValue(t.modal.coverLetter)}
                      </label>
                      <textarea
                        name="coverLetter"
                        rows={4}
                        required
                        maxLength={15000}
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
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === "en" &&
                          "Accepted format: PDF (Max 5MB)"}
                        {language === "am" &&
                          "ተቀባይነት ያለው ቅርጽ፡ PDF (ከፍተኛው 5MB)"}
                        {language === "om" &&
                          "Faayila fudhatama: PDF (Max 5MB)"}
                      </p>
                    </div>

                    <div><label className="mb-1 block text-sm font-medium">Supporting documents (optional, up to 4)</label><input type="file" multiple accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" onChange={(event) => { const files = Array.from(event.target.files || []); if (files.some((file) => file.size > 5 * 1024 * 1024)) { setApplicationError("Each supporting document must be smaller than 5 MB."); return; } setFormData((previous) => ({ ...previous, supporting: files.slice(0, 4) })); }} className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" /></div>
                    <div><label className="mb-1 block text-sm font-medium">Certificates (optional)</label><input type="file" multiple accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png" onChange={(event) => { const files = Array.from(event.target.files || []); if (files.some((file) => file.size > 5 * 1024 * 1024)) { setApplicationError("Each certificate must be smaller than 5 MB."); return; } setFormData((previous) => ({ ...previous, certificates: files.slice(0, 4) })); }} className="w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" /></div>

                    {applicationError && <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-300">{applicationError}</p>}

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
                      {reviewing ? "Confirm & submit application" : "Review application"}
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

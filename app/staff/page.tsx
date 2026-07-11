"use client";

import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Building2,
  Mail,
  ArrowRight,
  Award,
  Clock,
  Shield,
  TrendingUp,
  UserCheck,
  Star,
} from "lucide-react";
import staffData from "@/data/staff.json";
import staffStatsData from "@/data/staffStats.json";

const iconMap: Record<string, any> = {
  Users: Users,
  Briefcase: Briefcase,
  Clock: Clock,
  Award: Award,
};

const departmentIconMap: Record<string, any> = {
  Management: Briefcase,
  Engineering: Building2,
  Operations: TrendingUp,
  Finance: Shield,
  "Human Resources": Users,
  Safety: Shield,
};

export default function Staff() {
  const { language } = useLanguage();

  const t = {
    title: { en: "Our Team", am: "የእኛ ቡድን", om: "Garee Keenyaa" },
    subtitle: {
      en: "Meet the Experts Behind Our Success",
      am: "ከስኬታችን ጀርባ ያሉ ባለሙያዎችን ያግኙ",
      om: "Ogummaa Milkaaʼina Keenyaa Duraa Argadhaa",
    },
    description: {
      en: "Our team of experienced professionals is dedicated to delivering excellence in every project we undertake.",
      am: "የባለሙያዎች ቡድናችን በምንሰራው እያንዳንዱ ፕሮጀክት ምርጥነትን ለማቅረብ ቁርጠኛ ነው።",
      om: "Garee ogummaa keenyaa porjeektii hunda keessatti midhaa kennuuf of qopheesse.",
    },
    viewProfile: {
      en: "View Profile",
      am: "መገለጫ ይመልከቱ",
      om: "Profile Ilaalaa",
    },
    cta: {
      title: {
        en: "Join Our Team?",
        am: "ቡድናችንን ይቀላቀሉ?",
        om: "Garee Keenyaa Join Godhaa?",
      },
      description: {
        en: "We're always looking for talented professionals to join our growing team",
        am: "እያደገ ያለውን ቡድናችንን ለመቀላቀል ሁልጊዜ ችሎታ ያላቸውን ባለሙያዎች እንፈልጋለን",
        om: "Garee keenya guddachaa jiruuf ogummaa qaban ittuma barbaanna",
      },
      button: {
        en: "View Careers",
        am: "ስራዎችን ይመልከቱ",
        om: "Hojii Ilaalaa",
      },
    },
  };

  const tValue = (obj: any) => obj[language] || obj["en"] || "";

  // Get data from JSON files
  const staffMembers = staffData;
  const stats = staffStatsData;

  const getDepartmentColor = (department: string) => {
    const colors: Record<string, string> = {
      Management:
        "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
      Engineering:
        "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
      Operations:
        "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
      Finance:
        "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
      "Human Resources":
        "bg-pink-500/20 text-pink-700 dark:text-pink-400 border-pink-500/30",
      Safety: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
    };
    return colors[department] || "bg-primary/20 text-primary border-primary/30";
  };

  const getDepartmentIcon = (department: string) => {
    return departmentIconMap[department] || Users;
  };

  // Get active staff members only
  const activeStaff = staffMembers.filter(
    (member: any) => member.isActive !== false,
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
              <Users className="h-4 w-4" />
              <span>
                {language === "en" && "Our People"}
                {language === "am" && "ሰዎቻችን"}
                {language === "om" && "Ummata Keenyaa"}
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

        {/* Stats Section */}
        <section className="py-16 px-4 border-y bg-secondary/5">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat: any) => {
                const Icon = iconMap[stat.icon] || Users;
                return (
                  <div key={stat.id} className="text-center group">
                    <div className="flex justify-center mb-3">
                      <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {tValue(stat.label)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Staff Grid */}
        <section className="py-20 px-4 bg-background">
          <div className="container mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold">
                  {language === "en" && "Meet Our Team"}
                  {language === "am" && "ቡድናችንን ያግኙ"}
                  {language === "om" && "Garee Keenyaa Argadhaa"}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {language === "en" &&
                    `${activeStaff.length} talented professionals`}
                  {language === "am" && `${activeStaff.length} ችሎታ ያላቸው ባለሙያዎች`}
                  {language === "om" && `${activeStaff.length} ogummaa qabatan`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="px-4 py-2 cursor-pointer hover:bg-primary/10"
                >
                  {language === "en" && "All Departments"}
                  {language === "am" && "ሁሉም ክፍሎች"}
                  {language === "om" && "Hiriyoota Hunda"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeStaff.map((member: any) => {
                const DepartmentIcon = getDepartmentIcon(member.department.en);
                const deptColor = getDepartmentColor(member.department.en);

                return (
                  <Card
                    key={member.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-b from-card to-secondary/5"
                  >
                    <div className="relative">
                      <div className="aspect-square bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5"></div>
                        <div className="text-8xl transform group-hover:scale-110 transition-transform duration-500">
                          {member.avatar}
                        </div>
                        <Badge
                          className={`absolute top-4 right-4 ${deptColor} border`}
                        >
                          <DepartmentIcon className="h-3 w-3 mr-1" />
                          {tValue(member.department)}
                        </Badge>
                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background/80 to-transparent"></div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                          {tValue(member.name)}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span>{member.experience}y</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">
                        {tValue(member.position)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Briefcase className="h-3 w-3" />
                        <span>{tValue(member.department)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {tValue(member.bio)}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-primary/10"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 group-hover:bg-primary/10 transition-all"
                        >
                          {tValue(t.viewProfile)}
                          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
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
              <UserCheck className="h-4 w-4" />
              <span>
                {language === "en" && "Careers"}
                {language === "am" && "ስራዎች"}
                {language === "om" && "Hojii"}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {tValue(t.cta.title)}
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {tValue(t.cta.description)}
            </p>
            <Link href="/careers">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 bg-white text-primary hover:bg-white/90 shadow-lg shadow-primary/20"
              >
                <Users className="h-5 w-5" />
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

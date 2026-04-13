"use client";

import { motion } from "framer-motion";
import { Target, Users, Clock, MapPin, Lightbulb, Rocket, Brain, Flag, Smartphone } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import PriceTicker from "@/components/ui/PriceTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useInView } from "@/hooks/useInView";

const stats = [
  { value: "369+", label: "Mahsulotlar kuzatilmoqda", icon: Target, color: "from-indigo-500 to-purple-500" },
  { value: "50+", label: "Kategoriyalar", icon: Users, color: "from-cyan-500 to-blue-500" },
  { value: "7", label: "Hudud qamrovi", icon: MapPin, color: "from-orange-500 to-red-500" },
  { value: "24/7", label: "Uzluksiz monitoring", icon: Clock, color: "from-emerald-500 to-teal-500" },
];

const team = [
  {
    name: "Ozodbek Karimov",
    role: "Asoschisi va CEO",
    initials: "OK",
    gradient: "from-indigo-500 to-purple-600",
    bio: "10+ yillik biznes analytika tajribasi. Avval McKinsey va Deloitte'da maslahatchi bo'lib ishlagan.",
  },
  {
    name: "Jasur Toshmatov",
    role: "Texnik direktor (CTO)",
    initials: "JT",
    gradient: "from-cyan-500 to-blue-600",
    bio: "Full-stack muhandis, avval Google va Yandex'da ishlagan. Katta hajmli tizimlar mutaxassisi.",
  },
  {
    name: "Nilufar Rahimova",
    role: "Ma'lumotlar bo'limi boshlig'i",
    initials: "NR",
    gradient: "from-pink-500 to-rose-600",
    bio: "Data Science PhD, statistika va ekonometrika bo'yicha mutaxassis. 50+ ilmiy maqola muallifi.",
  },
  {
    name: "Sardor Aliyev",
    role: "AI va ML muhandisi",
    initials: "SA",
    gradient: "from-emerald-500 to-teal-600",
    bio: "Machine Learning muhandisi, NLP va vaqt qatorlari prognozlash bo'yicha tajribali.",
  },
];

const timeline = [
  {
    date: "2024-yil Q3",
    title: "G'oya tug'ildi",
    description: "O'zbekiston bozor analytikasi platformasi konsepsiyasi ishlab chiqildi va tadqiqot boshlandi.",
    icon: Lightbulb,
  },
  {
    date: "2025-yil Q1",
    title: "Prototip ishlab chiqildi",
    description: "50+ mahsulot kuzatuvi boshlandi. Birinchi foydalanuvchilar bilan sinovlar o'tkazildi.",
    icon: Rocket,
  },
  {
    date: "2025-yil Q3",
    title: "AI prognozlash moduli",
    description: "Sun'iy intellekt asosidagi narx bashorat tizimi qo'shildi. Aniqlik 87%+ ga yetdi.",
    icon: Brain,
  },
  {
    date: "2026-yil Q1",
    title: "Rasmiy ishga tushirish",
    description: "369+ mahsulot, 7 hudud qamrovi bilan platforma rasman ishga tushirildi.",
    icon: Flag,
  },
  {
    date: "2026-yil Q3",
    title: "Kelajak rejalari",
    description: "Mobil ilova va ochiq API rejalashtirilmoqda. Hamkorlik dasturi boshlanadi.",
    icon: Smartphone,
  },
];

export default function HaqidaPage() {
  const { ref: missionRef, inView: missionInView } = useInView(0.15);
  const { ref: statsRef, inView: statsInView } = useInView(0.15);
  const { ref: teamRef, inView: teamInView } = useInView(0.1);
  const { ref: timelineRef, inView: timelineInView } = useInView(0.1);

  return (
    <div className="min-h-screen">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-24 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <section className="text-center py-16 sm:py-24">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground dark:text-white"
            >
              EconUz{" "}
              <span className="gradient-text">haqida</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl text-muted max-w-2xl mx-auto"
            >
              O&apos;zbekiston bozorini raqamlar bilan tushunish
            </motion.p>
          </section>

          {/* Mission */}
          <motion.section
            ref={missionRef}
            initial={{ opacity: 0, y: 18 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-16"
          >
            <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-purple-500 to-cyan-500" />
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-4">
                Bizning missiyamiz
              </h2>
              <p className="text-muted leading-relaxed text-base sm:text-lg max-w-4xl">
                EconUz — O&apos;zbekiston bozorining birinchi real vaqt analytika platformasi.
                Biz bozor narxlari, trendlar va AI bashoratlarini bir joyga to&apos;plab,
                biznes egalari, tadbirkorlar va oddiy fuqarolar uchun qulay va tushunarli
                shaklda taqdim etamiz.
              </p>
            </div>
          </motion.section>

          {/* Stats */}
          <motion.section
            ref={statsRef}
            initial={{ opacity: 0, y: 18 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                className="glass-card p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} mb-4`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                <p className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.section>

          {/* Team */}
          <motion.section
            ref={teamRef}
            initial={{ opacity: 0, y: 18 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-20"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white text-center mb-10">
              Jamoamiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  className="glass-card p-6 text-center hover:-translate-y-1 transition-transform"
                >
                  <div
                    className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} mb-4`}
                  >
                    <span className="text-white font-heading font-bold text-xl">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-foreground dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent font-medium mt-1">{member.role}</p>
                  <p className="text-sm text-muted mt-3 leading-relaxed">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Timeline */}
          <motion.section
            ref={timelineRef}
            initial={{ opacity: 0, y: 18 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="mb-20"
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white text-center mb-12">
              Bizning yo&apos;limiz
            </h2>
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-purple-500 to-transparent" />

              <div className="space-y-8">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    className="relative pl-16 sm:pl-20"
                  >
                    {/* Icon dot */}
                    <div className="absolute left-2 sm:left-4 top-1 w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/25">
                      <item.icon size={14} className="text-white" />
                    </div>

                    <div className="glass-card p-5 sm:p-6">
                      <span className="glass-pill !text-xs !px-3 !py-1 text-accent font-semibold">
                        {item.date}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-foreground dark:text-white mt-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <section className="text-center">
            <div className="relative glass-animated-border inline-block">
              <div className="glass-border-glow" />
              <div className="glass-card relative z-[1] !border-0 !rounded-[19px] p-8 sm:p-12">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-3">
                  Platformani sinab ko&apos;ring
                </h2>
                <p className="text-muted mb-6 max-w-md mx-auto">
                  O&apos;zbekiston bozori haqida to&apos;liq ma&apos;lumot — bitta platformada.
                </p>
                <Link
                  href="/"
                  className="glass-btn-accent !py-3 !px-8 !text-base inline-block"
                  data-glass-glow=""
                >
                  <span className="glass-btn-content">Bosh sahifaga o&apos;tish</span>
                  <span className="glass-shine-sweep" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </motion.main>

      <Footer />
      <PriceTicker />
      <ScrollToTop />
    </div>
  );
}

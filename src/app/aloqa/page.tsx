"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import PriceTicker from "@/components/ui/PriceTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import GlassInput from "@/components/ui/GlassInput";
import { useInView } from "@/hooks/useInView";

function TelegramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

const contactInfo = [
  { icon: Mail, label: "Email", value: "info@econuz.uz", href: "mailto:info@econuz.uz" },
  { icon: Phone, label: "Telefon", value: "+998 71 123 45 67", href: "tel:+998711234567" },
  { icon: TelegramIcon, label: "Telegram", value: "@econuz_support", href: "https://t.me/econuz_support" },
  { icon: MapPin, label: "Manzil", value: "Toshkent sh., Amir Temur ko'chasi 1", href: "#" },
];

const mavzuOptions = [
  "Umumiy savol",
  "Texnik yordam",
  "Hamkorlik",
  "Reklama",
  "Boshqa",
];

const faqItems = [
  {
    q: "EconUz nima?",
    a: "EconUz — O'zbekiston bozorining birinchi real vaqt analytika platformasi. Biz bozor narxlari, trendlar va AI bashoratlarini bir joyga to'plab, qulay shaklda taqdim etamiz.",
  },
  {
    q: "Narxlar qayerdan olinadi?",
    a: "Narxlar O'zbekistonning asosiy bozorlaridan, ulgurji savdo markazlaridan va rasmiy statistika manbalaridan yig'iladi. Ma'lumotlar har kuni yangilanib turadi.",
  },
  {
    q: "AI prognoz qanchalik aniq?",
    a: "Bizning AI prognozlash tizimimiz o'rtacha 87% aniqlikka ega. Model vaqt qatorlari tahlili, mavsumiy o'zgarishlar va makroiqtisodiy ko'rsatkichlarni hisobga oladi.",
  },
  {
    q: "Platforma bepulmi?",
    a: "Ha, asosiy funksiyalar bepul. Premium rejalar qo'shimcha imkoniyatlar — kengaytirilgan prognozlar, API kirish va shaxsiy hisobotlar bilan ta'minlaydi.",
  },
  {
    q: "Mobil ilova bormi?",
    a: "Hozirda mobil ilova ishlab chiqilmoqda. 2026-yil 3-chorakda iOS va Android uchun chiqarilishi rejalashtirilgan.",
  },
  {
    q: "Hamkorlik qanday qilish mumkin?",
    a: "Hamkorlik bo'yicha info@econuz.uz manziliga yozing yoki ushbu sahifadagi aloqa formasidan foydalaning. Biz barcha takliflarni ko'rib chiqamiz.",
  },
];

export default function AloqaPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Umumiy savol",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { ref: faqRef, inView: faqInView } = useInView(0.1);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Ismingizni kiriting";
    if (!formData.email.trim()) errs.email = "Email kiriting";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Email formati noto'g'ri";
    if (!formData.message.trim()) errs.message = "Xabar kiriting";
    return errs;
  }, [formData]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs = validate();
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      setToast(true);
      setFormData({ name: "", email: "", subject: "Umumiy savol", message: "" });
      setTimeout(() => setToast(false), 4000);
    },
    [validate],
  );

  const updateField = useCallback(
    (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    },
    [errors],
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-card !border-success/30 px-6 py-3 flex items-center gap-3"
          >
            <CheckCircle size={18} className="text-success" />
            <span className="text-sm text-foreground dark:text-white">
              Xabaringiz qabul qilindi! Tez orada javob beramiz.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="pt-24 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="text-center py-12 sm:py-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-heading text-4xl sm:text-5xl font-bold text-foreground dark:text-white"
            >
              Biz bilan{" "}
              <span className="gradient-text">aloqa</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg text-muted max-w-xl mx-auto"
            >
              Savol, taklif yoki hamkorlik — biz doimo aloqadamiz.
            </motion.p>
          </section>

          {/* Form + Info */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-8">
                <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-6">
                  Xabar yuborish
                </h2>
                <div className="space-y-4">
                  <div>
                    <GlassInput
                      placeholder="Ismingiz"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                    {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <GlassInput
                      type="email"
                      placeholder="Email"
                      icon={<Mail size={16} />}
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <div className="glass-input-wrapper" data-glass-glow="">
                      <select
                        className="glass-input bg-transparent outline-none cursor-pointer"
                        value={formData.subject}
                        onChange={(e) => updateField("subject", e.target.value)}
                      >
                        {mavzuOptions.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="glass-input-wrapper !h-auto" data-glass-glow="">
                      <textarea
                        className="glass-input !h-auto resize-none"
                        rows={5}
                        placeholder="Xabaringiz..."
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                      />
                    </div>
                    {errors.message && <p className="text-xs text-danger mt-1">{errors.message}</p>}
                  </div>
                  <button
                    type="submit"
                    className="glass-btn-accent w-full !py-3 !text-base"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content flex items-center justify-center gap-2">
                      <Send size={16} />
                      Yuborish
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              {contactInfo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="glass-card p-5 block hover:-translate-y-0.5 transition-transform"
                    data-glass-glow=""
                  >
                    <div className="flex items-start gap-4">
                      <div className="glass-circle w-10 h-10 text-accent shrink-0">
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs text-muted">{item.label}</p>
                        <p className="text-sm font-medium text-foreground dark:text-white mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}

              <div className="glass-card p-5" data-glass-glow="">
                <div className="flex items-start gap-4">
                  <div className="glass-circle w-10 h-10 text-accent shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Ish vaqti</p>
                    <p className="text-sm font-medium text-foreground dark:text-white mt-0.5">
                      Dush-Jum: 9:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* FAQ */}
          <motion.section
            ref={faqRef}
            initial={{ opacity: 0, y: 18 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white text-center mb-10">
              Ko&apos;p so&apos;raladigan savollar
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqItems.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={faqInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                  >
                    <div className="glass-card overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <span className="font-heading font-semibold text-foreground dark:text-white pr-4">
                          {item.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="text-muted shrink-0"
                        >
                          <ChevronDown size={18} />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          >
                            <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-white/10 pt-4">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        </div>
      </motion.main>

      <Footer />
      <PriceTicker />
      <ScrollToTop />
    </div>
  );
}

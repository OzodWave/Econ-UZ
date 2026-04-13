"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { LayoutGrid, BarChart3, Lightbulb } from "lucide-react";
import { useCallback } from "react";

const steps = [
  {
    number: "01",
    title: "Kategoriyani tanlang",
    description: "500+ mahsulot ichidan kerakligini toping",
    icon: LayoutGrid,
  },
  {
    number: "02",
    title: "Ma'lumotlarni tahlil qiling",
    description: "Real vaqt grafiklar va trendlarni kuzating",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Qaror qabul qiling",
    description: "AI prognozlari bilan kelajakni rejalashtiring",
    icon: Lightbulb,
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView(0.15);

  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-4px) translateZ(0)`;
    el.style.transition = "transform 0.1s ease";
  }, []);

  const handleTiltLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) translateZ(0)";
    e.currentTarget.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, []);

  return (
    <section ref={ref} id="howit" className="py-20 relative">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-4">
            Qanday ishlaydi?
          </h2>
          <p className="text-muted text-lg">Uch oddiy qadam bilan boshlang</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Glass connector line replacing dashed line */}
          <div className="hidden md:block absolute top-20 left-[18%] h-[2px] glass-connector" style={{ width: "64%" }} />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative text-center"
              >
                <div
                  className="glass-card glass-card-hover p-10 cursor-pointer"
                  onMouseMove={handleTiltMove}
                  onMouseLeave={handleTiltLeave}
                  data-glass-glow=""
                >
                  <div className="relative z-10">
                    {/* Step number — glass circle with glow */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{
                        delay: i * 0.15 + 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="glass-circle w-12 h-12 mx-auto mb-5 relative z-10 glass-pulse-glow !bg-accent/10 text-accent font-heading font-bold text-lg"
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5,
                      }}
                      className="inline-flex items-center justify-center w-18 h-18 rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 text-accent mb-6 p-5"
                    >
                      <Icon size={32} />
                    </motion.div>

                    <h3 className="font-heading font-semibold text-xl text-foreground dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useRouter } from "next/navigation";
import { Apple, Building2, Shirt, Laptop, TrendingUp, TrendingDown, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { categories } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Building2,
  Shirt,
  Laptop,
};

const glassTintMap: Record<string, string> = {
  "oziq-ovqat": "glass-tint-warm",
  "qurilish": "glass-tint-cool",
  "tekstil": "glass-tint-purple",
  "elektronika": "glass-tint-green",
};

const accentLineMap: Record<string, string> = {
  "oziq-ovqat": "cat-accent-oziq",
  "qurilish": "cat-accent-qurilish",
  "tekstil": "cat-accent-tekstil",
  "elektronika": "cat-accent-elektronika",
};

const accentGlowVar: Record<string, string> = {
  "oziq-ovqat": "rgba(249, 115, 22, 0.45)",
  "qurilish": "rgba(59, 130, 246, 0.45)",
  "tekstil": "rgba(168, 85, 247, 0.45)",
  "elektronika": "rgba(16, 185, 129, 0.45)",
};

function TrendIndicator({ up, pct }: { up: boolean; pct: number }) {
  return (
    <div className="mt-auto flex items-center gap-3 pt-4 border-t border-black/[0.06] dark:border-white/[0.08]">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
          up
            ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/35 dark:text-emerald-400 dark:ring-emerald-400/30"
            : "bg-red-500/15 text-red-600 ring-1 ring-red-500/35 dark:text-red-400 dark:ring-red-400/30"
        }`}
        aria-hidden
      >
        {up ? <ArrowBigUp size={28} strokeWidth={2.5} /> : <ArrowBigDown size={28} strokeWidth={2.5} />}
      </motion.div>
      <div className="min-w-0 text-left">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Trend</p>
        <p
          className={`font-heading text-xl font-bold tabular-nums leading-tight ${
            up ? "text-success" : "text-danger"
          }`}
        >
          {pct}%
        </p>
      </div>
    </div>
  );
}

export default function Categories() {
  const router = useRouter();
  const { ref, inView } = useInView(0.1);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const tilt = useTiltEffect(6);

  const activeCat = categories.find((c) => c.slug === activeCategory);

  return (
    <section ref={ref} id="kategoriyalar" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white mb-4">
            Kategoriyalarni o&apos;rganing
          </h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            O&apos;zbekiston bozorining barcha sektorlari bir platformada
          </p>
        </motion.div>

        {/* Category Grid — glass cards with colored tint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Apple;
            const isActive = activeCategory === cat.slug;
            const tintClass = glassTintMap[cat.slug] || "";
            const lineClass = accentLineMap[cat.slug] || "";
            const glow = accentGlowVar[cat.slug] || "rgba(99, 102, 241, 0.4)";

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={`group glass-card ${tintClass} cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "!border-accent/40 shadow-lg shadow-accent/10 ring-1 ring-accent/20"
                      : "hover:!border-accent/30"
                  } ${activeCategory && !isActive ? "opacity-50" : "opacity-100"}`}
                  style={
                    {
                      minHeight: "250px",
                      ["--accent-line-color" as string]: glow,
                    } as CSSProperties
                  }
                  onClick={() => router.push(`/category/${cat.slug}`)}
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  onMouseDown={tilt.onMouseDown}
                  onMouseUp={tilt.onMouseUp}
                  data-glass-glow=""
                >
                  <div className={`glass-accent-line ${lineClass}`} />

                  <div className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[3]">
                    <div className="absolute top-0 left-0 right-0 h-[1px] shimmer-border" />
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] shimmer-border" />
                  </div>

                  <div className="relative p-6 flex flex-col h-full z-10">
                    {/* Icon */}
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} mb-4 shadow-lg ring-2 ring-black/10 dark:ring-white/25`}
                    >
                      <Icon size={26} strokeWidth={2.5} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="font-heading font-semibold text-lg text-foreground dark:text-white mb-2">
                      {cat.name}
                    </h3>

                    {/* Stats */}
                    <p className="text-sm text-muted flex items-center gap-2 mb-2">
                      <span>{cat.productCount} mahsulot</span>
                      <span>·</span>
                      <span className={`flex items-center gap-0.5 ${cat.growthType === "up" ? "text-success" : "text-danger"}`}>
                        {cat.growthType === "up" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {cat.avgGrowth}%
                      </span>
                    </p>

                    <TrendIndicator up={cat.growthType === "up"} pct={cat.avgGrowth} />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCategory(activeCategory === cat.slug ? null : cat.slug);
                      }}
                      className="mt-3 glass-pill !text-xs hover:!border-accent"
                    >
                      Bo&apos;limlarni ko&apos;rish
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Accordion Expansion — glass panel */}
        <AnimatePresence mode="wait">
          {activeCat && (
            <motion.div
              key={activeCat.slug}
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="mt-8 overflow-hidden"
            >
              <div className="glass-card p-6 sm:p-8 !border-accent/20 shadow-lg shadow-accent/5" data-glass-glow="">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    {(() => {
                      const Icon = iconMap[activeCat.icon] || Apple;
                      return (
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${activeCat.gradient}`}>
                          <Icon size={18} className="text-white" />
                        </div>
                      );
                    })()}
                    <h4 className="font-heading font-semibold text-lg text-foreground dark:text-white">
                      {activeCat.name} — bo&apos;limlar
                    </h4>
                  </div>
                  <div className="space-y-5">
                    {activeCat.subCategories.map((sub, subIdx) => (
                      <motion.div
                        key={sub.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: subIdx * 0.08 }}
                      >
                        <h5 className="text-sm font-semibold text-foreground dark:text-white mb-2.5">
                          {sub.name}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {sub.items.map((item) => (
                            <button
                              key={item}
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/category/${activeCat.slug}?tab=${sub.slug}`);
                              }}
                              className="glass-pill !py-1.5 !px-3.5 !text-sm text-foreground dark:text-white hover:!border-accent hover:text-accent transition-all cursor-pointer"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

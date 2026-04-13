"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import {
  Apple,
  ArrowRight,
  Building2,
  Laptop,
  Shirt,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import PriceTicker from "@/components/ui/PriceTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useInView } from "@/hooks/useInView";
import {
  getCategoryBySlug,
  getCategoryIndexSeries,
  getCategoryProducts,
} from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Building2,
  Shirt,
  Laptop,
};

const periodOptions = [
  { label: "1 Hafta", days: 7 },
  { label: "1 Oy", days: 30 },
  { label: "3 Oy", days: 90 },
  { label: "6 Oy", days: 180 },
  { label: "1 Yil", days: 365 },
];

function formatPrice(value: number, unit: string): string {
  return `${value.toLocaleString()} so'm/${unit}`;
}

function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "short" });
}

function CategoryPageInner() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { ref: chartRef, inView: chartInView } = useInView(0.15);

  const category = getCategoryBySlug(params.slug);
  const categoryProducts = useMemo(
    () => getCategoryProducts(params.slug),
    [params.slug],
  );
  const [activeTab, setActiveTab] = useState("hammasi");
  const [periodDays, setPeriodDays] = useState(90);

  const tabs = useMemo(() => {
    if (!category) return [];
    return [{ name: "Hammasi", slug: "hammasi" }, ...category.subCategories];
  }, [category]);

  useEffect(() => {
    if (!category) return;
    const tab = searchParams.get("tab");
    const exists = tabs.some((item) => item.slug === tab);
    setActiveTab(exists && tab ? tab : "hammasi");
  }, [category, searchParams, tabs]);

  const filteredProducts = useMemo(() => {
    if (activeTab === "hammasi") return categoryProducts;
    return categoryProducts.filter((product) => product.subCategory === activeTab);
  }, [activeTab, categoryProducts]);

  const indexSeries = useMemo(() => {
    const all = getCategoryIndexSeries(params.slug);
    return all.slice(-periodDays);
  }, [params.slug, periodDays]);

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8">
            <h1 className="font-heading text-3xl font-bold text-foreground dark:text-white">
              Kategoriya topilmadi
            </h1>
            <Link href="/" className="inline-block mt-4 glass-btn-accent !px-5 !py-2.5">
              <span className="glass-btn-content">Bosh sahifaga qaytish</span>
              <span className="glass-shine-sweep" />
            </Link>
          </div>
        </main>
        <PriceTicker />
      </div>
    );
  }

  const Icon = iconMap[category.icon] || Apple;
  const upCount = categoryProducts.filter((item) => item.changeType === "up").length;
  const downCount = Math.max(0, categoryProducts.length - upCount);

  return (
    <div className="min-h-screen">
      <Navbar />

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="pt-24 pb-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:underline underline-offset-4 transition-all">
              Bosh sahifa
            </Link>
            <span>&gt;</span>
            <Link href="/#kategoriyalar" className="hover:underline underline-offset-4 transition-all">
              Kategoriyalar
            </Link>
            <span>&gt;</span>
            <span className="text-foreground dark:text-white">{category.name}</span>
          </nav>

          <section className="glass-card p-6 sm:p-8 mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`shrink-0 mt-1 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient}`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
                    {category.name}
                  </h1>
                  <p className="mt-2 text-muted max-w-2xl">{category.description}</p>
                </div>
              </div>
              <div className="glass-pill !py-2 !px-4 !text-xs sm:!text-sm">
                So&apos;nggi yangilanish: bugun
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span>{category.productCount} mahsulot</span>
              <span>·</span>
              <span>{category.subCategories.length} bo&apos;lim</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                {category.growthType === "up" ? (
                  <TrendingUp size={14} className="text-success" />
                ) : (
                  <TrendingDown size={14} className="text-danger" />
                )}
                <span className={category.growthType === "up" ? "text-success" : "text-danger"}>
                  {category.avgGrowth}%
                </span>
              </span>
              <span>·</span>
              <span className="text-success">{upCount} ko&apos;tarildi</span>
              <span>/</span>
              <span className="text-danger">{downCount} tushdi</span>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1">
              {tabs.map((tab) => {
                const active = tab.slug === activeTab;
                return (
                  <button
                    key={tab.slug}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.slug);
                      const query = tab.slug === "hammasi" ? "" : `?tab=${tab.slug}`;
                      router.push(`${pathname}${query}`, { scroll: false });
                    }}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm transition-all border ${
                      active
                        ? "glass-btn-accent border-transparent text-white"
                        : "glass-pill border-white/20 hover:border-accent/40"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.section
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.25 }}
                >
                  <Link
                    href={`/product/${product.slug}`}
                    className="group glass-card p-5 block transition-all hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-base text-foreground dark:text-white">
                        {product.name}
                      </h3>
                      <ArrowRight
                        size={16}
                        className="text-muted group-hover:text-accent transition-colors mt-1 shrink-0"
                      />
                    </div>
                    <p className="mt-2 text-lg font-heading font-bold text-foreground dark:text-white tabular-nums">
                      {formatPrice(product.price, product.unit)}
                    </p>
                    <p
                      className={`mt-1 text-sm font-medium ${
                        product.changeType === "up" ? "text-success" : "text-danger"
                      }`}
                    >
                      {product.changeType === "up" ? "↑" : "↓"} {product.change}%
                    </p>
                    <div className="mt-3 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={product.sparkline.map((value, i) => ({ i, value }))}
                          margin={{ top: 6, right: 0, bottom: 6, left: 0 }}
                        >
                          <Line
                            type="monotone"
                            dataKey="value"
                            dot={false}
                            strokeWidth={2}
                            stroke={product.changeType === "up" ? "#10B981" : "#EF4444"}
                            isAnimationActive
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.section>
          </AnimatePresence>

          <section ref={chartRef} className="mt-12">
            <div className="glass-card p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground dark:text-white">
                  Kategoriya narx indeksi
                </h2>
                <div className="flex flex-wrap gap-2">
                  {periodOptions.map((option) => (
                    <button
                      key={option.days}
                      type="button"
                      onClick={() => setPeriodDays(option.days)}
                      className={`rounded-full px-3 py-1.5 text-xs sm:text-sm border transition-all ${
                        periodDays === option.days
                          ? "glass-btn-accent border-transparent text-white"
                          : "glass-pill border-white/20"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={indexSeries}>
                    <defs>
                      <linearGradient id="indexGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 15, 25, 0.8)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: "10px",
                      }}
                      labelFormatter={(value) => formatDay(String(value))}
                      formatter={(value: number) => [`${Number(value).toFixed(2)} indeks`, "Qiymat"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="index"
                      stroke="#6366F1"
                      fill="url(#indexGradient)"
                      strokeWidth={2.5}
                      isAnimationActive={chartInView}
                      animationDuration={900}
                    />
                  </AreaChart>
                </ResponsiveContainer>
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

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CategoryPageInner />
    </Suspense>
  );
}

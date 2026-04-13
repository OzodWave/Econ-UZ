"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import PriceTicker from "@/components/ui/PriceTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useInView } from "@/hooks/useInView";
import {
  categories,
  getCategoryWeeklyPerformance,
  getDashboardAccuracy,
  getDashboardAlerts,
  getDashboardIndexSeries,
  getProductChangePercent,
  products,
} from "@/lib/data";

const periodFilters = [
  { label: "1H", days: 7 },
  { label: "1O", days: 30 },
  { label: "1Y", days: 365 },
];

function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let raf = 0;
    let startTime = 0;
    const duration = 850;
    const start = 0;
    const tick = (t: number) => {
      if (!startTime) startTime = t;
      const p = Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (value - start) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  return (
    <div className="h-12 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.map((value, i) => ({ i, value }))}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function HeatCell({
  name,
  slug,
  price,
  change,
  size,
}: {
  name: string;
  slug: string;
  price: number;
  change: number;
  size: number;
}) {
  const bg =
    change > 0.5
      ? `rgba(16,185,129,${Math.min(0.12 + change / 30, 0.42)})`
      : change < -0.5
        ? `rgba(239,68,68,${Math.min(0.12 + Math.abs(change) / 30, 0.42)})`
        : "rgba(113,113,122,0.2)";
  return (
    <Link
      href={`/product/${slug}`}
      title={`${name} • ${price.toLocaleString()} so'm • ${change >= 0 ? "+" : ""}${change.toFixed(1)}%`}
      className="rounded-xl border border-white/10 px-3 py-2 hover:border-accent/40 transition-all"
      style={{
        background: bg,
        gridColumn: `span ${size > 0.75 ? 3 : size > 0.45 ? 2 : 1}`,
      }}
    >
      <p className="text-xs text-foreground dark:text-white truncate">{name}</p>
      <p className="text-[11px] text-muted tabular-nums">{price.toLocaleString()} so&apos;m</p>
      <p className={`text-[11px] font-semibold tabular-nums ${change >= 0 ? "text-success" : "text-danger"}`}>
        {change >= 0 ? "+" : ""}
        {change.toFixed(1)}%
      </p>
    </Link>
  );
}

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("hammasi");
  const [days, setDays] = useState(30);
  const [flashTick, setFlashTick] = useState(0);
  const [liveAdjustments, setLiveAdjustments] = useState<Record<string, number>>({});
  const [visibleLines, setVisibleLines] = useState({
    overall: true,
    "oziq-ovqat": true,
    qurilish: true,
    tekstil: true,
    elektronika: true,
  });
  const { ref: heatmapRef, inView: heatmapInView } = useInView(0.1);
  const { ref: compareRef, inView: compareInView } = useInView(0.1);
  const { ref: accuracyRef, inView: accuracyInView } = useInView(0.1);

  const dashboardAccuracy = useMemo(() => getDashboardAccuracy(), []);
  const fullIndexData = useMemo(() => getDashboardIndexSeries(), []);
  const filteredProducts = useMemo(
    () =>
      selectedCategory === "hammasi"
        ? products
        : products.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    const id = setInterval(() => {
      const source = selectedCategory === "hammasi" ? products : filteredProducts;
      if (!source.length) return;
      const patch: Record<string, number> = {};
      const count = Math.min(6, source.length);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * source.length);
        const product = source[idx];
        const delta = (Math.random() * 0.4 + 0.1) * (Math.random() > 0.5 ? 1 : -1);
        patch[product.slug] = delta;
      }
      setLiveAdjustments((prev) => ({ ...prev, ...patch }));
      setFlashTick((prev) => prev + 1);
    }, 30000);
    return () => clearInterval(id);
  }, [filteredProducts, selectedCategory]);

  const adjustedProducts = useMemo(
    () =>
      filteredProducts.map((product) => {
        const adj = liveAdjustments[product.slug] || 0;
        const adjustedPrice = Math.round(product.price * (1 + adj / 100));
        return {
          ...product,
          adjustedPrice,
          adjustedChange: getProductChangePercent(product, 7) + adj,
        };
      }),
    [filteredProducts, liveAdjustments],
  );

  const movers = useMemo(() => {
    const scored = adjustedProducts.map((product) => ({
      name: product.name,
      slug: product.slug,
      change: Number(product.adjustedChange.toFixed(1)),
      price: product.adjustedPrice,
    }));
    return {
      gainers: [...scored]
        .filter((item) => item.change > 0)
        .sort((a, b) => b.change - a.change)
        .slice(0, 10),
      losers: [...scored]
        .filter((item) => item.change < 0)
        .sort((a, b) => a.change - b.change)
        .slice(0, 10),
    };
  }, [adjustedProducts]);

  const categoryPerformance = useMemo(() => {
    const base = categories.map((category) => ({
      slug: category.slug,
      name: category.name,
      change: getCategoryWeeklyPerformance(category.slug),
      color:
        category.slug === "oziq-ovqat"
          ? "#F97316"
          : category.slug === "qurilish"
            ? "#06B6D4"
            : category.slug === "tekstil"
              ? "#A855F7"
              : "#10B981",
    }));
    if (selectedCategory === "hammasi") return base;
    return base.filter((item) => item.slug === selectedCategory);
  }, [selectedCategory]);

  const alerts = useMemo(() => getDashboardAlerts(selectedCategory as "hammasi"), [selectedCategory]);

  const chartData = useMemo(() => {
    const sliced = fullIndexData.slice(-days);
    if (selectedCategory === "hammasi") return sliced;
    return sliced.map((row) => ({
      date: row.date,
      overall: row.overall,
      [selectedCategory]: row[selectedCategory as keyof typeof row],
    }));
  }, [fullIndexData, days, selectedCategory]);

  const lineMeta = [
    { key: "overall", label: "Umumiy indeks", color: "#6366F1" },
    { key: "oziq-ovqat", label: "Oziq-ovqat", color: "#F97316" },
    { key: "qurilish", label: "Qurilish", color: "#06B6D4" },
    { key: "tekstil", label: "Tekstil", color: "#A855F7" },
    { key: "elektronika", label: "Elektronika", color: "#10B981" },
  ];

  const marketSeries =
    selectedCategory === "hammasi"
      ? fullIndexData.map((row) => row.overall)
      : fullIndexData.map((row) => Number(row[selectedCategory as keyof typeof row] || row.overall));
  const marketLatest = marketSeries[marketSeries.length - 1] || 100;
  const marketPrev = marketSeries[Math.max(0, marketSeries.length - 8)] || marketLatest;
  const marketChange = Number((((marketLatest - marketPrev) / marketPrev) * 100).toFixed(2));
  const trackedProducts = adjustedProducts.length;
  const inflation =
    trackedProducts > 0
      ? Number(
          (
            adjustedProducts.reduce((acc, product) => acc + product.adjustedChange, 0) /
            trackedProducts /
            4
          ).toFixed(2),
        )
      : 0;
  const usdBase = 12750;
  const usdRate = Math.round(usdBase + Math.sin(flashTick / 2) * 40 + (selectedCategory === "hammasi" ? 0 : 18));
  const usdChange = Number((Math.sin(flashTick / 3) * 0.8).toFixed(2));

  const summaryCards = [
    {
      title: "Bozor indeksi",
      value: marketLatest,
      suffix: "",
      change: marketChange,
      sparkline: marketSeries.slice(-30),
      decimals: 2,
    },
    {
      title: "Kuzatilgan mahsulotlar",
      value: trackedProducts,
      suffix: "",
      change: 4.2 + (selectedCategory === "hammasi" ? 0 : 1.1),
      sparkline: Array.from({ length: 24 }, (_, i) => trackedProducts - 8 + Math.round(Math.sin(i / 3) * 6)),
      decimals: 0,
    },
    {
      title: "O'rtacha inflyatsiya",
      value: inflation,
      suffix: "%",
      change: inflation,
      sparkline: Array.from({ length: 24 }, (_, i) => Number((inflation + Math.sin(i / 4) * 0.6).toFixed(2))),
      decimals: 2,
    },
    {
      title: "Dollar kursi",
      value: usdRate,
      suffix: " so'm",
      change: usdChange,
      sparkline: Array.from({ length: 24 }, (_, i) => Math.round(usdRate - 30 + Math.sin(i / 4) * 22)),
      decimals: 0,
    },
  ];

  const groupedHeatmap = useMemo(() => {
    const group = new Map<string, typeof adjustedProducts>();
    adjustedProducts.forEach((product) => {
      const arr = group.get(product.category) || [];
      arr.push(product);
      group.set(product.category, arr);
    });
    return Array.from(group.entries()).map(([slug, items]) => ({
      slug,
      name: categories.find((c) => c.slug === slug)?.name || slug,
      items: items.slice(0, 40),
      maxPrice: Math.max(...items.map((item) => item.adjustedPrice)),
    }));
  }, [adjustedProducts]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <head>
        <title>Bozor Dashboard | EconUz</title>
        <meta name="description" content="O'zbekiston bozorining jonli monitoring paneli. Real vaqt narxlar, bozor indekslari, heatmap va kategoriya tahlili." />
      </head>
      <motion.main initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="mb-6">
            <div className="glass-card p-6 sm:p-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
                    Bozor Dashboard
                  </h1>
                  <p className="text-muted mt-2">
                    {new Date().toLocaleDateString("uz-UZ", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="glass-pill !text-xs !py-1.5 !px-3">
                    <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2" />
                    Auto-refresh
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="glass-pill !py-2 !px-3 text-sm bg-transparent outline-none"
                  >
                    <option value="hammasi">Hammasi</option>
                    {categories.map((category) => (
                      <option key={category.slug} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {summaryCards.map((card, index) => {
              const up = card.change >= 0;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="glass-card p-5"
                >
                  <p className="text-sm text-muted">{card.title}</p>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground dark:text-white tabular-nums">
                    <CountUp value={card.value} decimals={card.decimals} />
                    {card.suffix}
                  </p>
                  <p className={`mt-1 text-sm inline-flex items-center gap-1 ${up ? "text-success" : "text-danger"}`}>
                    {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {up ? "+" : ""}
                    {card.change.toFixed(2)}%
                  </p>
                  <Sparkline data={card.sparkline} color={up ? "#10B981" : "#EF4444"} />
                </motion.div>
              );
            })}
          </section>

          <section className="glass-card p-5 sm:p-7 mb-6">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {periodFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={() => setDays(filter.days)}
                    className={`rounded-full px-3 py-1.5 text-xs sm:text-sm border transition-all ${
                      days === filter.days
                        ? "glass-btn-accent border-transparent text-white"
                        : "glass-pill border-white/20"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {lineMeta.map((line) => (
                  <button
                    key={line.key}
                    type="button"
                    onClick={() =>
                      setVisibleLines((prev) => ({ ...prev, [line.key]: !prev[line.key as keyof typeof prev] }))
                    }
                    className={`glass-pill !text-xs !px-3 !py-1.5 border ${visibleLines[line.key as keyof typeof visibleLines] ? "" : "opacity-45"}`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ background: line.color }} />
                    {line.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 15, 24, 0.82)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: "12px",
                    }}
                    formatter={(value: number, name: string) => [`${Number(value).toFixed(2)}`, name]}
                  />
                  {lineMeta.map((line) => {
                    if (!visibleLines[line.key as keyof typeof visibleLines]) return null;
                    if (selectedCategory !== "hammasi" && line.key !== "overall" && line.key !== selectedCategory) {
                      return null;
                    }
                    return (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        stroke={line.color}
                        dot={false}
                        strokeWidth={line.key === "overall" ? 3 : 2}
                        isAnimationActive
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-5">
              <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                O&apos;sganlar
              </h2>
              <div className="space-y-2">
                {movers.gainers.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 hover:border-accent/40 transition-all"
                  >
                    <span className="text-sm text-foreground dark:text-white truncate pr-4">{item.name}</span>
                    <span className="text-sm font-semibold text-success tabular-nums">+{item.change}%</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                Tushganlar
              </h2>
              <div className="space-y-2">
                {movers.losers.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/product/${item.slug}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 px-3 py-2 hover:border-accent/40 transition-all"
                  >
                    <span className="text-sm text-foreground dark:text-white truncate pr-4">{item.name}</span>
                    <span className="text-sm font-semibold text-danger tabular-nums">{item.change}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <motion.section
            ref={heatmapRef}
            initial={{ opacity: 0, y: 18 }}
            animate={heatmapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="glass-card p-5 sm:p-6 mb-6"
          >
            <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
              Market Heatmap
            </h2>
            <div className="space-y-4">
              {groupedHeatmap.map((group) => (
                <div key={group.slug}>
                  <h3 className="text-sm font-semibold text-foreground dark:text-white mb-2">{group.name}</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 xl:grid-cols-9 gap-2">
                    {group.items.map((item) => (
                      <HeatCell
                        key={item.id}
                        name={item.name}
                        slug={item.slug}
                        price={item.adjustedPrice}
                        change={item.adjustedChange}
                        size={item.adjustedPrice / Math.max(1, group.maxPrice)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            ref={compareRef}
            initial={{ opacity: 0, y: 18 }}
            animate={compareInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 xl:grid-cols-5 gap-4 mb-6"
          >
            <div className="glass-card p-5 xl:col-span-2">
              <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                Kategoriya performance
              </h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPerformance} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={90}
                      tick={{ fill: "#71717A", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip formatter={(value: number) => [`${Number(value).toFixed(2)}%`, "Haftalik"]} />
                    <Bar dataKey="change" radius={[0, 6, 6, 0]}>
                      {categoryPerformance.map((item) => (
                        <Cell key={item.slug} fill={item.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5 xl:col-span-3">
              <h2 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                So&apos;nggi narx ogohlantirishlari
              </h2>
              <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2">
                {alerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/product/${alert.slug}`}
                    className="glass-card glass-card-static p-3 block hover:!border-accent/40 transition-all"
                  >
                    <p className="text-sm text-foreground dark:text-white">
                      <span className="mr-2">{alert.icon}</span>
                      {alert.text}
                    </p>
                    <p className="text-xs text-muted mt-1">{alert.time}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            ref={accuracyRef}
            initial={{ opacity: 0, y: 16 }}
            animate={accuracyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3 }}
            className="glass-card p-5 sm:p-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#6366F1 ${dashboardAccuracy.overall * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                    }}
                  />
                  <div className="relative z-10 w-14 h-14 rounded-full bg-[var(--bg)] flex items-center justify-center text-sm font-bold text-foreground dark:text-white">
                    {dashboardAccuracy.overall}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted">Oxirgi 30 kun aniqligi</p>
                  <p className="font-heading text-xl font-bold text-foreground dark:text-white">
                    {dashboardAccuracy.overall}%
                  </p>
                </div>
              </div>
              <div className="text-sm space-y-2">
                <p className="text-foreground dark:text-white">
                  Eng aniq: <span className="text-success">{dashboardAccuracy.best.name} ({dashboardAccuracy.best.accuracy}%)</span>
                </p>
                <p className="text-foreground dark:text-white">
                  Eng past: <span className="text-danger">{dashboardAccuracy.worst.name} ({dashboardAccuracy.worst.accuracy}%)</span>
                </p>
              </div>
              <div className="space-y-2">
                {Object.entries(dashboardAccuracy.byCategory).map(([slug, accuracy]) => (
                  <div key={slug}>
                    <div className="flex items-center justify-between text-xs text-muted mb-1">
                      <span>{categories.find((c) => c.slug === slug)?.name || slug}</span>
                      <span>{accuracy}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-purple-500" style={{ width: `${accuracy}%` }} />
                    </div>
                  </div>
                ))}
              </div>
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

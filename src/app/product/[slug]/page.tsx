"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import PriceTicker from "@/components/ui/PriceTicker";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { useInView } from "@/hooks/useInView";
import {
  getCategoryBySlug,
  getMarketComposition,
  getProductBySlug,
  getProductChangePercent,
  getProductForecastSeries,
  getRegionalComparison,
  getRelatedProducts,
  getProductStats,
  getSupplyDemandSeries,
  getSubCategoryName,
} from "@/lib/data";

const timeFilters = [
  { label: "1H", days: 7 },
  { label: "1O", days: 30 },
  { label: "3O", days: 90 },
  { label: "6O", days: 180 },
  { label: "1Y", days: 365 },
  { label: "Hammasi", days: -1 },
];

function formatPrice(value: number, unit: string): string {
  return `${value.toLocaleString()} so'm/${unit}`;
}

function formatDateLabel(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const [activeDays, setActiveDays] = useState<number>(180);
  const [forecastMode, setForecastMode] = useState<30 | 150 | 365>(30);
  const { ref: forecastRef, inView: forecastInView } = useInView(0.1);
  const { ref: supplyRef, inView: supplyInView } = useInView(0.1);
  const { ref: regionRef, inView: regionInView } = useInView(0.1);
  const { ref: relatedRef, inView: relatedInView } = useInView(0.1);

  const product = useMemo(
    () => getProductBySlug(params.slug),
    [params.slug],
  );

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-28 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8">
            <h1 className="font-heading text-3xl font-bold text-foreground dark:text-white">
              Mahsulot topilmadi
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

  const category = getCategoryBySlug(product.category);
  const subCategoryName =
    getSubCategoryName(product.category, product.subCategory) || product.subCategory;

  const weeklyChange = getProductChangePercent(product, 7);
  const monthlyChange = getProductChangePercent(product, 30);
  const yearlyChange = getProductChangePercent(product, 365);
  const stats = getProductStats(product, 30);
  const lastUpdated = product.history[product.history.length - 1]?.date;
  const forecast = getProductForecastSeries(product);
  const supplyDemand = getSupplyDemandSeries(product);
  const composition = getMarketComposition(product);
  const regionRows = getRegionalComparison(product);
  const related = getRelatedProducts(product, 8);

  const chartData =
    activeDays === -1 ? product.history : product.history.slice(-activeDays);
  const forecastData = forecast.points.slice(
    Math.max(0, forecast.points.length - (365 + 90)),
  );
  const forecastCutoff = product.history.length + forecastMode;
  const pieColors = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981"];

  const statusStyle: Record<string, string> = {
    Yuqori: "text-danger border-danger/30 bg-danger/10",
    "O'rtacha": "text-amber-500 border-amber-400/30 bg-amber-500/10",
    Past: "text-success border-success/30 bg-success/10",
  };

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
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:underline underline-offset-4">Bosh sahifa</Link>
            <span>&gt;</span>
            <Link href={`/category/${product.category}`} className="hover:underline underline-offset-4">
              {category?.name || product.category}
            </Link>
            <span>&gt;</span>
            <span>{subCategoryName}</span>
            <span>&gt;</span>
            <span className="text-foreground dark:text-white">{product.name}</span>
          </nav>

          <section className="glass-card p-6 sm:p-8 mb-6">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white">
              {product.name}
            </h1>
            <p className="mt-3 font-heading text-4xl sm:text-5xl font-extrabold text-foreground dark:text-white tabular-nums">
              {formatPrice(product.price, product.unit)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span
                className={`glass-pill !px-3 !py-1.5 ${weeklyChange >= 0 ? "text-success" : "text-danger"}`}
              >
                Haftalik: {weeklyChange >= 0 ? "+" : ""}{weeklyChange.toFixed(2)}%
              </span>
              <span
                className={`glass-pill !px-3 !py-1.5 ${monthlyChange >= 0 ? "text-success" : "text-danger"}`}
              >
                Oylik: {monthlyChange >= 0 ? "+" : ""}{monthlyChange.toFixed(2)}%
              </span>
              <span
                className={`glass-pill !px-3 !py-1.5 ${yearlyChange >= 0 ? "text-success" : "text-danger"}`}
              >
                Yillik: {yearlyChange >= 0 ? "+" : ""}{yearlyChange.toFixed(2)}%
              </span>
            </div>
            <p className="mt-4 text-xs text-muted">
              Last updated: {lastUpdated ? formatDateLabel(lastUpdated) : "—"}
            </p>
          </section>

          <section className="glass-card p-5 sm:p-7 mb-6">
            <div className="flex flex-wrap gap-2 mb-5">
              {timeFilters.map((filter) => (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() => setActiveDays(filter.days)}
                  className={`rounded-full px-3 py-1.5 text-xs sm:text-sm border transition-all ${
                    activeDays === filter.days
                      ? "glass-btn-accent border-transparent text-white"
                      : "glass-pill border-white/20"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="productAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 15, 24, 0.82)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      borderRadius: "12px",
                    }}
                    labelFormatter={(label) => formatDateLabel(String(label))}
                    formatter={(value: number) => [
                      `${Number(value).toLocaleString()} so'm/${product.unit}`,
                      "Narx",
                    ]}
                  />
                  <Area
                    dataKey="price"
                    type="monotone"
                    stroke="#6366F1"
                    strokeWidth={2.5}
                    fill="url(#productAreaGradient)"
                    isAnimationActive
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5">
              <p className="text-sm text-muted">O&apos;rtacha narx (30 kun)</p>
              <p className="mt-2 text-2xl font-heading font-bold text-foreground dark:text-white tabular-nums">
                {stats.average.toLocaleString()} so&apos;m
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="text-sm text-muted">Eng yuqori (30 kun)</p>
              <p className="mt-2 text-2xl font-heading font-bold text-success tabular-nums">
                {stats.max.toLocaleString()} so&apos;m
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="text-sm text-muted">Eng past (30 kun)</p>
              <p className="mt-2 text-2xl font-heading font-bold text-danger tabular-nums">
                {stats.min.toLocaleString()} so&apos;m
              </p>
            </div>
            <div className="glass-card p-5">
              <p className="text-sm text-muted">Volatillik (30 kun)</p>
              <p className="mt-2 text-2xl font-heading font-bold text-foreground dark:text-white tabular-nums">
                {stats.volatility.toFixed(2)}%
              </p>
            </div>
          </section>

          <motion.section
            ref={forecastRef}
            initial={{ opacity: 0, y: 18 }}
            animate={forecastInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <div className="relative glass-animated-border">
              <div className="glass-border-glow" />
              <div className="glass-card forecast-card-inner relative z-[1] !border-0 !rounded-[19px] p-5 sm:p-7">
                <div className="grid lg:grid-cols-[58%_42%] gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      {[30, 150, 365].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setForecastMode(days as 30 | 150 | 365)}
                          className={`rounded-full px-3 py-1.5 text-xs border ${
                            forecastMode === days
                              ? "glass-btn-accent text-white border-transparent"
                              : "glass-pill border-white/20"
                          }`}
                        >
                          {days === 30 ? "1 oy" : days === 150 ? "5 oy" : "1 yil"}
                        </button>
                      ))}
                    </div>
                    <div className="h-[330px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={forecastData}>
                          <defs>
                            <linearGradient id="forecastMainFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="confidenceFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.22} />
                              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={["dataMin - 500", "dataMax + 500"]} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 15, 24, 0.82)",
                              border: "1px solid rgba(255,255,255,0.16)",
                              borderRadius: "12px",
                            }}
                            labelFormatter={(label) => formatDateLabel(String(label))}
                            formatter={(value: number, name: string) => [
                              `${Number(value).toLocaleString()} so'm/${product.unit}`,
                              name === "price" ? "Tarixiy" : name === "forecast" ? "Bashorat" : name,
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#6366F1"
                            strokeWidth={2.5}
                            fill="url(#forecastMainFill)"
                            isAnimationActive
                            animationDuration={800}
                          />
                          <Area
                            type="monotone"
                            dataKey="upper"
                            stroke="none"
                            fill="url(#confidenceFill)"
                            isAnimationActive
                            animationDuration={900}
                            connectNulls
                          />
                          <Area
                            type="monotone"
                            dataKey="forecast"
                            stroke="#8B5CF6"
                            strokeWidth={2.2}
                            strokeDasharray="7 5"
                            fill="none"
                            connectNulls
                            isAnimationActive
                            animationDuration={1000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="glass-card p-5 glass-card-static">
                    <h3 className="font-heading text-xl font-bold text-foreground dark:text-white mb-3">
                      AI Bashorat
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between text-muted">
                        <span>1 oyda</span>
                        <span className="text-foreground dark:text-white tabular-nums">
                          {forecast.summary.oneMonth.toLocaleString()} so&apos;m
                        </span>
                      </p>
                      <p className="flex justify-between text-muted">
                        <span>5 oyda</span>
                        <span className="text-foreground dark:text-white tabular-nums">
                          {forecast.summary.fiveMonths.toLocaleString()} so&apos;m
                        </span>
                      </p>
                      <p className="flex justify-between text-muted">
                        <span>1 yilda</span>
                        <span className="text-foreground dark:text-white tabular-nums">
                          {forecast.summary.oneYear.toLocaleString()} so&apos;m
                        </span>
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted mb-1">
                        <span>Ishonchlilik</span>
                        <span>{forecast.summary.confidence}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-purple-500"
                          style={{ width: `${forecast.summary.confidence}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {forecast.factors.map((factor) => (
                        <span key={factor} className="glass-pill !text-xs !px-3 !py-1.5">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            ref={supplyRef}
            initial={{ opacity: 0, y: 18 }}
            animate={supplyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <div className="glass-card p-5 sm:p-6">
              <h3 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                Taklif va talab
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supplyDemand}>
                    <XAxis dataKey="month" tick={{ fill: "#71717A", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#71717A", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 15, 24, 0.82)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="supply" fill="#6366F1" radius={[6, 6, 0, 0]} name="Taklif" />
                    <Bar dataKey="demand" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Talab" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-5 sm:p-6">
              <h3 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                {product.category === "oziq-ovqat"
                  ? "Ichki ishlab chiqarish vs Import"
                  : "Hududiy taqsimot"}
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={composition}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={96}
                      paddingAngle={2}
                    >
                      {composition.map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Ulush"]}
                      contentStyle={{
                        background: "rgba(15, 15, 24, 0.82)",
                        border: "1px solid rgba(255,255,255,0.16)",
                        borderRadius: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {composition.map((entry, index) => (
                  <span key={entry.name} className="glass-pill !text-xs !py-1.5 !px-3">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2"
                      style={{ background: pieColors[index % pieColors.length] }}
                    />
                    {entry.name}: {entry.value}%
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            ref={regionRef}
            initial={{ opacity: 0, y: 18 }}
            animate={regionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <div className="glass-card p-5 sm:p-6">
              <h3 className="font-heading text-xl font-bold text-foreground dark:text-white mb-4">
                Hududlar kesimida narxlar
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted border-b border-white/10">
                      <th className="py-3 pr-3">Hudud</th>
                      <th className="py-3 pr-3">Narx ({product.unit})</th>
                      <th className="py-3 pr-3">O&apos;zgarish</th>
                      <th className="py-3 pr-3">Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionRows.map((row) => (
                      <tr key={row.region} className="border-b border-white/5">
                        <td className="py-3 pr-3 text-foreground dark:text-white">{row.region}</td>
                        <td className="py-3 pr-3 tabular-nums text-foreground dark:text-white">
                          {row.price.toLocaleString()} so&apos;m
                        </td>
                        <td
                          className={`py-3 pr-3 tabular-nums font-medium ${
                            row.change >= 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {row.change >= 0 ? "+" : ""}
                          {row.change}%
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`glass-pill !text-xs !px-3 !py-1 border ${statusStyle[row.status]}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.section>

          <motion.section
            ref={relatedRef}
            initial={{ opacity: 0, y: 18 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.35 }}
            className="mt-8"
          >
            <h3 className="font-heading text-2xl font-bold text-foreground dark:text-white mb-4">
              O&apos;xshash mahsulotlar
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.slug}`}
                  className="glass-card p-4 min-w-[250px] max-w-[250px] shrink-0 hover:-translate-y-1 transition-transform"
                >
                  <h4 className="font-semibold text-foreground dark:text-white text-sm">{item.name}</h4>
                  <p className="mt-2 font-heading text-xl font-bold text-foreground dark:text-white tabular-nums">
                    {item.price.toLocaleString()} so&apos;m
                  </p>
                  <p
                    className={`mt-1 text-sm ${item.changeType === "up" ? "text-success" : "text-danger"}`}
                  >
                    {item.changeType === "up" ? "↑" : "↓"} {item.change}%
                  </p>
                </Link>
              ))}
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

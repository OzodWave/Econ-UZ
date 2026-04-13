"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { forecastChartData } from "@/lib/data";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* Glass tooltip for chart */
function GlassChartTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !rounded-xl !p-0 !border-white/15" data-glass-glow="">
      <div className="relative z-10 px-3 py-2 space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="text-xs text-foreground dark:text-white">
            <span className="text-muted">{p.name}: </span>
            <span className="font-semibold tabular-nums">{Number(p.value).toLocaleString()} so&apos;m</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIForecast() {
  const { ref, inView } = useInView(0.1);
  const [chartTheme, setChartTheme] = useState({
    axis: "#71717A",
    hist: "#6366F1",
    forecast: "#8B5CF6",
  });

  useEffect(() => {
    const read = () => {
      const dark = document.documentElement.classList.contains("dark");
      setChartTheme(
        dark
          ? {
              axis: "#D1D5DB",
              hist: "#C7D2FE",
              forecast: "#F5D0FE",
            }
          : {
              axis: "#52525B",
              hist: "#4F46E5",
              forecast: "#7C3AED",
            }
      );
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  return (
    <section ref={ref} id="forecast" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative glass-animated-border"
        >
          {/* Animated gradient border */}
          <div className="glass-border-glow" />

          <div
            className="glass-card forecast-card-inner relative z-[1] !border-0 !rounded-[19px]"
            data-glass-glow=""
          >
            <div className="relative p-8 sm:p-10 lg:p-12 z-10">
              <div className="grid lg:grid-cols-[55%_45%] gap-10 items-center">
                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <ResponsiveContainer width="100%" height={380}>
                    <AreaChart data={forecastChartData}>
                      <defs>
                        <linearGradient id="histGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.hist} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={chartTheme.hist} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="forecastGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartTheme.forecast} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={chartTheme.forecast} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: chartTheme.axis, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                      />
                      <Tooltip content={<GlassChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill={chartTheme.forecast}
                        fillOpacity={0.08}
                        name="Yuqori chegarasi"
                      />
                      <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill={chartTheme.forecast}
                        fillOpacity={0.08}
                        name="Pastki chegarasi"
                      />
                      <Area
                        type="monotone"
                        dataKey="historical"
                        stroke={chartTheme.hist}
                        strokeWidth={2.5}
                        fill="url(#histGrad2)"
                        name="Tarixiy narx"
                        animationDuration={2000}
                      />
                      <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke={chartTheme.forecast}
                        strokeWidth={2.5}
                        strokeDasharray="8 5"
                        fill="url(#forecastGrad2)"
                        name="AI Bashorat"
                        animationDuration={2500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-3 text-xs text-foreground/70 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 bg-accent rounded" /> Tarixiy
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-4 h-0.5 bg-purple-400 rounded border-dashed" style={{ borderTop: "2px dashed #8B5CF6", height: 0 }} /> Bashorat
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-purple-400/20 rounded-sm" /> Ishonchlilik
                    </span>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25, duration: 0.5 }}
                >
                  <div className="glass-pill text-accent text-sm mb-4 shadow-[0_0_12px_rgba(99,102,241,0.12)]">
                    <Sparkles size={14} />
                    AI Bashorat
                  </div>

                  <h2 className="font-heading text-3xl font-bold text-foreground dark:text-white mb-4">
                    Kelajakni ko&apos;ring
                  </h2>

                  <p className="mb-6 leading-relaxed text-foreground/85 dark:text-zinc-300">
                    Sun&apos;iy intellekt algoritmimiz tarixiy ma&apos;lumotlar, mavsumiy trendlar
                    va global bozor signallariga asoslanib, narx o&apos;zgarishlarini 1 oydan
                    1 yilgacha bashorat qiladi.
                  </p>

                  <ul className="space-y-3 mb-8">
                    {[
                      "1 oylik qisqa muddatli prognoz",
                      "5 oylik o'rta muddatli prognoz",
                      "1 yillik uzoq muddatli prognoz",
                      "Ishonchlilik darajasi ko'rsatkichi",
                    ].map((item) => (
                      <li key={item}>
                        <span className="inline-flex items-center gap-2.5 glass-pill !py-2 !px-3.5 !text-sm text-foreground dark:text-white w-full sm:w-auto">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent border border-accent/25">
                            <Check size={12} strokeWidth={2.5} />
                          </span>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="glass-btn-accent !px-6 !py-3 shadow-md shadow-accent/20 cursor-pointer group"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content">
                      Prognozlarni ko&apos;rish
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

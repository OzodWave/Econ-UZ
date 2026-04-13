"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { topGainers, topLosers } from "@/lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";

const gainersData = topGainers.map((d) => ({ ...d, fill: "#10B981" }));
const losersData = topLosers.map((d) => ({
  ...d,
  absChange: Math.abs(d.change),
  fill: "#EF4444",
}));

/* Custom glass tooltip */
function GlassTooltipContent({ active, payload, formatter }: { active?: boolean; payload?: Array<{ value: number }>; formatter: (v: number) => [string, string] }) {
  if (!active || !payload?.[0]) return null;
  const [label, desc] = formatter(payload[0].value);
  return (
    <div className="glass-card !rounded-xl !p-0 !border-white/15" data-glass-glow="">
      <div className="relative z-10 px-3 py-2 text-xs text-foreground dark:text-white">
        <span className="font-semibold">{label}</span>
        {desc && <span className="text-muted ml-1">{desc}</span>}
      </div>
    </div>
  );
}

export default function MarketOverview() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} id="bozor" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="font-heading text-3xl sm:text-4xl font-bold text-foreground dark:text-white text-center mb-12"
        >
          Bozor holati
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Top Gainers — glass card */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-card p-6" data-glass-glow="">
              <div className="relative z-10">
                <h3 className="font-heading font-semibold text-lg text-foreground dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Eng ko&apos;p o&apos;sgan narxlar
                </h3>
                <div className="text-muted [&_.recharts-text]:fill-current">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={gainersData} layout="vertical" barSize={22}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10B981" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                    <XAxis type="number" hide domain={[0, 22]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={75}
                      tick={{ fill: "currentColor", fontSize: 13, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<GlassTooltipContent formatter={(v) => [`+${v}%`, "O'sish"]} />}
                      cursor={{ fill: "rgba(99,102,241,0.05)" }}
                    />
                    <Bar dataKey="change" fill="url(#greenGrad)" radius={[0, 4, 4, 0]}>
                      <LabelList
                        dataKey="change"
                        position="right"
                        formatter={(v) => `+${v}%`}
                        style={{ fill: "#10B981", fontSize: 12, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Losers — glass card */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-card p-6" data-glass-glow="">
              <div className="relative z-10">
                <h3 className="font-heading font-semibold text-lg text-foreground dark:text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger" />
                  Eng ko&apos;p tushgan narxlar
                </h3>
                <div className="text-muted [&_.recharts-text]:fill-current">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={losersData} layout="vertical" barSize={22}>
                    <defs>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#EF4444" stopOpacity={0.9} />
                      </linearGradient>
                    </defs>
                    <XAxis type="number" hide domain={[0, 12]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={75}
                      tick={{ fill: "currentColor", fontSize: 13, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      content={<GlassTooltipContent formatter={(v) => [`-${v}%`, "Tushish"]} />}
                      cursor={{ fill: "rgba(239,68,68,0.05)" }}
                    />
                    <Bar dataKey="absChange" fill="url(#redGrad)" radius={[0, 4, 4, 0]}>
                      <LabelList
                        dataKey="absChange"
                        position="right"
                        formatter={(v) => `-${v}%`}
                        style={{ fill: "#EF4444", fontSize: 12, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

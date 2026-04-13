"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useEffect, useState, useRef } from "react";
import { Package, Activity, Target, FolderOpen } from "lucide-react";
import { useTiltEffect } from "@/hooks/useTiltEffect";

const stats = [
  { label: "Mahsulotlar", value: 500, suffix: "+", icon: Package },
  { label: "Monitoring", value: "24/7", suffix: "", icon: Activity, isText: true },
  { label: "Prognoz aniqligi", value: 95, suffix: "%", icon: Target },
  { label: "Kategoriyalar", value: 50, suffix: "+", icon: FolderOpen },
];

const statBar = [
  "stat-bar-products",
  "stat-bar-monitor",
  "stat-bar-target",
  "stat-bar-folders",
];

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>();

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(target * eased));
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [inView, target]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { ref, inView } = useInView(0.3);
  const tilt = useTiltEffect(6);

  return (
    <section ref={ref} className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="glass-card glass-card-hover relative p-6 text-center cursor-default"
                  onMouseMove={tilt.onMouseMove}
                  onMouseLeave={tilt.onMouseLeave}
                  onMouseDown={tilt.onMouseDown}
                  onMouseUp={tilt.onMouseUp}
                  data-glass-glow=""
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-[20px] z-[6] ${statBar[i]}`}
                    aria-hidden
                  />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass-circle text-accent mb-4 border-accent/20">
                      <Icon size={24} />
                    </div>
                    <div className="text-4xl sm:text-5xl font-heading font-bold text-foreground dark:text-white mb-2 glass-number-glow leading-none tracking-tight">
                      {stat.isText ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={inView ? { opacity: 1 } : {}}
                          transition={{ delay: i * 0.1 + 0.25 }}
                        >
                          {stat.value as string}
                        </motion.span>
                      ) : (
                        <AnimatedCounter
                          target={stat.value as number}
                          suffix={stat.suffix}
                          inView={inView}
                        />
                      )}
                    </div>
                    <p className="text-sm text-muted font-medium">{stat.label}</p>
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

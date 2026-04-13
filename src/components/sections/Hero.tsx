"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, TrendingDown, BarChart3, PieChart, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

function MiniChart() {
  const [points, setPoints] = useState<string>("");

  useEffect(() => {
    const pts = [];
    let y = 50;
    for (let i = 0; i < 12; i++) {
      y += (Math.random() - 0.4) * 15;
      y = Math.max(15, Math.min(85, y));
      pts.push(`${i * 18},${y}`);
    }
    setPoints(pts.join(" "));
  }, []);

  return (
    <svg viewBox="0 0 200 100" className="w-full h-20">
      <defs>
        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      {points && (
        <>
          <polygon
            points={`0,100 ${points} 200,100`}
            fill="url(#heroChartGrad)"
            opacity="0.6"
          />
          <motion.polyline
            points={points}
            fill="none"
            stroke="#6366F1"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </>
      )}
    </svg>
  );
}

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-10">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.05] blur-[100px] pointer-events-none" />

      {/* Soft glow behind dashboard cards — kept subtle for legibility */}
      <div className="absolute top-1/3 right-[15%] w-[320px] h-[320px] rounded-full bg-accent/[0.04] dark:bg-accent/[0.05] blur-[90px] pointer-events-none animate-pulse" />

      {/* Grid dots */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-[52%_48%] gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Badge — glass pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="glass-pill text-accent text-sm mb-8 shadow-[0_0_20px_rgba(99,102,241,0.12)] border-accent/25 ring-1 ring-accent/10"
            >
              <span>🚀</span>
              <span>O&apos;zbekistonda birinchi</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[52px] xl:text-[58px] font-bold leading-[1.08] mb-7 text-foreground dark:text-white tracking-[-0.02em]">
              O&apos;zbekiston bozorining{" "}
              <span className="gradient-text glow-text">real vaqt</span>{" "}
              tahlili
            </h1>

            {/* Subheading */}
            <p className="text-lg text-muted max-w-xl mb-12 leading-[1.7] font-normal">
              Narxlar, trendlar, va AI bashoratlari — barcha ma&apos;lumotlar bir joyda.
              Biznes qarorlaringizni ma&apos;lumotlarga asoslang.
            </p>

            {/* CTA Buttons — glass */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/kirish">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="glass-btn-accent !px-7 !py-3.5 !text-base shadow-lg shadow-accent/25 cursor-pointer inline-flex"
                data-glass-glow=""
              >
                <span className="glass-btn-content">
                  Bepul boshlash
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <span className="glass-shine-sweep" />
              </motion.span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const el = document.getElementById("kategoriyalar");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="glass-btn-outline !px-7 !py-3.5 !text-base cursor-pointer"
                data-glass-glow=""
              >
                <span className="glass-btn-content">
                  Demo ko&apos;rish
                  <Play size={16} fill="currentColor" />
                </span>
                <span className="glass-shine-sweep" />
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span>500+ mahsulot</span>
              <span className="w-1 h-1 rounded-full bg-muted" />
              <span>Real vaqt yangilanish</span>
              <span className="w-1 h-1 rounded-full bg-muted" />
              <span>AI prognoz</span>
            </div>
          </motion.div>

          {/* Right — layered glass deck + parallax */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block relative min-h-[460px]"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,400px)] h-[min(100%,400px)] rounded-full bg-accent/[0.05] dark:bg-accent/[0.07] blur-[80px] pointer-events-none"
              style={{ animation: "heroGlowPulse 8s ease-in-out infinite" }}
            />

            {/* Rear plane — smaller, softer */}
            <div
              className="absolute left-1/2 top-8 z-0 w-[88%] max-w-md -translate-x-1/2 will-change-transform pointer-events-none"
              style={{
                transform: `translate(calc(-50% + ${mousePos.x * 0.1}px), ${8 + mousePos.y * 0.1}px)`,
              }}
            >
              <div
                className="glass-card p-5 shadow-xl scale-[0.86] opacity-[0.5]"
                style={{ animation: "heroFloat3 6s ease-in-out infinite" }}
              >
                <div className="h-28 rounded-2xl bg-gradient-to-br from-accent/20 via-purple-500/10 to-transparent border border-white/10" />
              </div>
            </div>

            {/* Main floating glass card — front plane */}
            <div
              className="relative z-20 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * 0.42}px, ${mousePos.y * 0.42}px)`,
              }}
            >
              <div
                className="glass-card p-6 shadow-2xl"
                data-glass-glow=""
                style={{ animation: "heroFloat1 5s ease-in-out infinite" }}
              >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-foreground dark:text-white text-sm">
                    Bozor ko&apos;rsatkichlari
                  </h3>
                  <span className="glass-pill !px-2 !py-0.5 !text-xs text-accent">Live</span>
                </div>
                <MiniChart />
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-success/10">
                    <span className="text-sm font-medium text-foreground dark:text-white">Sabzi</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground dark:text-white">8,500 so&apos;m</span>
                      <span className="text-xs text-success flex items-center gap-0.5"><TrendingUp size={12} /> +12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-danger/10">
                    <span className="text-sm font-medium text-foreground dark:text-white">Kartoshka</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground dark:text-white">4,500 so&apos;m</span>
                      <span className="text-xs text-danger flex items-center gap-0.5"><TrendingDown size={12} /> -8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-success/10">
                    <span className="text-sm font-medium text-foreground dark:text-white">Piyoz</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums text-foreground dark:text-white">6,000 so&apos;m</span>
                      <span className="text-xs text-success flex items-center gap-0.5"><TrendingUp size={12} /> +7.5%</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Middle — bar chart */}
            <div
              className="absolute -bottom-6 -left-6 z-10 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * -0.26}px, ${mousePos.y * -0.26}px)`,
              }}
            >
              <div
                className="glass-card p-4 shadow-xl w-52"
                data-glass-glow=""
                style={{ animation: "heroFloat2 7s ease-in-out infinite" }}
              >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 size={14} className="text-accent" />
                  <span className="text-xs font-medium text-foreground dark:text-white">Haftalik trend</span>
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  {[35, 55, 40, 70, 50, 80, 60].map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-accent to-purple-400 rounded-sm"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                    />
                  ))}
                </div>
              </div>
              </div>
            </div>

            {/* AI card */}
            <div
              className="absolute -top-4 -right-4 z-30 will-change-transform"
              style={{
                transform: `translate(${mousePos.x * 0.48}px, ${mousePos.y * -0.48}px)`,
              }}
            >
              <div
                className="glass-card p-3 shadow-xl w-44"
                data-glass-glow=""
                style={{ animation: "heroFloat1 6.5s ease-in-out infinite" }}
              >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-warning" />
                  <span className="text-xs font-medium text-foreground dark:text-white">AI Bashorat</span>
                </div>
                <div className="text-lg font-heading font-bold text-success tabular-nums">↑ 12.4%</div>
                <div className="text-xs text-muted">Kelgusi 30 kun</div>
              </div>
              </div>
            </div>

            {/* Pie icon */}
            <div
              className="absolute top-1/2 -right-10 z-[28] will-change-transform"
              style={{
                transform: `translate(${mousePos.x * -0.18}px, ${mousePos.y * 0.28}px)`,
              }}
            >
              <div
                className="glass-circle w-12 h-12 shadow-xl flex items-center justify-center"
                data-glass-glow=""
                style={{ animation: "heroFloat2 5.5s ease-in-out infinite" }}
              >
                <PieChart size={20} className="text-accent relative z-10" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted/30 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-muted/50"
          />
        </div>
      </motion.div>
    </section>
  );
}

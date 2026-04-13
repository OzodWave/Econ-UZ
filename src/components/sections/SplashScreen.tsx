"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPLASH_MS = 5000;
const EXIT_MS = 500;
const EXIT_START_MS = SPLASH_MS - EXIT_MS;

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);
  const onCompleteRef = useRef(onComplete);
  const skipExitCallbackRef = useRef(false);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const shown = sessionStorage.getItem("econuz-splash-shown");
    if (shown) {
      skipExitCallbackRef.current = true;
      setShow(false);
      onCompleteRef.current();
      return;
    }

    const exitTimer = window.setTimeout(() => {
      setShow(false);
    }, EXIT_START_MS);

    return () => {
      window.clearTimeout(exitTimer);
    };
  }, []);

  const handleExitComplete = () => {
    if (skipExitCallbackRef.current) return;
    sessionStorage.setItem("econuz-splash-shown", "true");
    onCompleteRef.current();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="absolute inset-0 opacity-[0.28] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 72% 48% at 32% 18%, rgba(99,102,241,0.14), transparent 58%), radial-gradient(ellipse 58% 42% at 78% 72%, rgba(139,92,246,0.08), transparent 52%)",
            }}
          />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none mesh-gradient" />
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(99,102,241,0.35) 1px, transparent 0)",
                backgroundSize: "44px 44px",
              }}
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(88vw,420px)] h-[min(88vw,420px)] rounded-full bg-accent/[0.07] blur-[88px] pointer-events-none" />

          {/* Logo mark — restrained scale-in */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-6"
          >
            <svg width="72" height="72" viewBox="0 0 80 80" className="drop-shadow-[0_0_24px_rgba(99,102,241,0.15)]">
              <rect x="5" y="45" width="12" height="25" rx="3" fill="#6366F1" opacity="0.55" />
              <rect x="22" y="30" width="12" height="40" rx="3" fill="#6366F1" opacity="0.75" />
              <rect x="39" y="15" width="12" height="55" rx="3" fill="#818CF8" />
              <rect x="56" y="25" width="12" height="45" rx="3" fill="#6366F1" opacity="0.85" />
              <path
                d="M11 42 L28 28 L45 13 L62 22"
                stroke="#A5B4FC"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.9"
              />
              <circle cx="11" cy="42" r="2.5" fill="#C7D2FE" />
              <circle cx="28" cy="28" r="2.5" fill="#C7D2FE" />
              <circle cx="45" cy="13" r="2.5" fill="#C7D2FE" />
              <circle cx="62" cy="22" r="2.5" fill="#C7D2FE" />
            </svg>
          </motion.div>

          {/* Wordmark — single premium gradient, tight tracking */}
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[2rem] sm:text-4xl font-semibold tracking-[-0.02em] text-center px-6"
          >
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400/90 bg-clip-text text-transparent">
              Econ
            </span>
            <span className="bg-gradient-to-br from-indigo-200/95 via-violet-200/85 to-violet-400/70 bg-clip-text text-transparent">
              UZ
            </span>
          </motion.h1>

          {/* Tagline — soft fade, no typing cursor */}
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-center text-sm sm:text-base font-body font-normal tracking-[0.12em] uppercase text-zinc-500"
          >
            Bozorni his qiling
          </motion.p>

          {/* Hairline accent — glass polish */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 h-px w-[min(12rem,40vw)] origin-center bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

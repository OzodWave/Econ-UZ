"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, Clock } from "lucide-react";

const recentSearches = [
  "Pomidor narxi",
  "Olma",
  "Qurilish materiallari",
  "Guruch",
];

const trending = [
  { name: "Sabzi", change: "+18.5%" },
  { name: "Piyoz", change: "+12.8%" },
  { name: "Olma", change: "+15.2%" },
];

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal — glass card */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl mx-4 glass-card overflow-hidden shadow-2xl"
            data-glass-glow=""
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="relative z-10 flex items-center gap-3 px-5 border-b border-white/10 dark:border-white/5">
              <Search size={20} className="text-muted flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mahsulot yoki kategoriya qidiring..."
                className="flex-1 py-4 bg-transparent text-foreground dark:text-white placeholder-muted outline-none text-base"
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden sm:inline-flex glass-pill !px-2 !py-0.5 !text-[10px] text-muted font-mono">
                  ESC
                </kbd>
                <button onClick={onClose} className="glass-circle w-7 h-7 text-muted hover:text-foreground dark:hover:text-white cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-5 py-4 max-h-[50vh] overflow-y-auto">
              {!query && (
                <>
                  {/* Recent */}
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      So&apos;nggi qidiruvlar
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground dark:text-white rounded-lg transition-colors cursor-pointer text-left hover:bg-white/10 dark:hover:bg-white/5"
                        >
                          <Clock size={14} className="text-muted" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Trending */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                      Trendda
                    </h4>
                    <div className="space-y-1">
                      {trending.map((t) => (
                        <button
                          key={t.name}
                          onClick={() => setQuery(t.name)}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm text-foreground dark:text-white rounded-lg transition-colors cursor-pointer hover:bg-white/10 dark:hover:bg-white/5"
                        >
                          <span className="flex items-center gap-2">
                            <TrendingUp size={14} className="text-success" />
                            {t.name}
                          </span>
                          <span className="text-xs text-success">{t.change}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {query && (
                <div className="text-center py-8 text-muted text-sm">
                  &quot;{query}&quot; uchun natijalar tez kunda...
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="relative z-10 px-5 py-3 border-t border-white/10 dark:border-white/5 text-xs text-muted flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="glass-pill !px-1.5 !py-0.5 !text-[10px] font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="glass-pill !px-1.5 !py-0.5 !text-[10px] font-mono">K</kbd>
                <span className="ml-1">Qidirish</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="glass-pill !px-1.5 !py-0.5 !text-[10px] font-mono">ESC</kbd>
                <span className="ml-1">Yopish</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

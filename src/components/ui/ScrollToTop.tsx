"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-[44] glass-circle w-12 h-12 min-w-[48px] min-h-[48px] text-accent cursor-pointer border-accent/15 hover:border-accent/35"
          data-glass-glow=""
          aria-label="Yuqoriga qaytish"
          type="button"
        >
          <ChevronUp size={22} strokeWidth={2.25} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

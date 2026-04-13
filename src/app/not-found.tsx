"use client";

import { motion } from "framer-motion";
import { Search, Home, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import GlassInput from "@/components/ui/GlassInput";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center max-w-lg w-full">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
          className="mb-8"
        >
          <motion.h1
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="font-heading font-extrabold text-[120px] sm:text-[160px] leading-none gradient-text select-none"
          >
            404
          </motion.h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-3">
            Sahifa topilmadi
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan bo&apos;lishi mumkin.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="max-w-sm mx-auto mb-8"
        >
          <GlassInput
            placeholder="Qidirish..."
            icon={<Search size={16} />}
            readOnly
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="glass-btn-accent !py-3 !px-6 inline-flex items-center gap-2"
            data-glass-glow=""
          >
            <span className="glass-btn-content flex items-center gap-2">
              <Home size={16} />
              Bosh sahifaga qaytish
            </span>
            <span className="glass-shine-sweep" />
          </Link>
          <Link
            href="/dashboard"
            className="glass-btn-outline !py-3 !px-6 inline-flex items-center gap-2"
            data-glass-glow=""
          >
            <span className="glass-btn-content flex items-center gap-2">
              <LayoutDashboard size={16} />
              Dashboard&apos;ga o&apos;tish
            </span>
            <span className="glass-shine-sweep" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

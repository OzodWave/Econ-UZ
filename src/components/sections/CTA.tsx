"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function CTA() {
  const { ref, inView } = useInView(0.15);
  const [email, setEmail] = useState("");

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative rounded-[20px] overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/90 to-purple-600/90" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-10 left-[10%] w-16 h-16 rounded-full bg-white/10 blur-sm"
              style={{ animation: "float1 8s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-10 right-[15%] w-20 h-20 rounded-full bg-white/8 blur-sm"
              style={{ animation: "float2 10s ease-in-out infinite" }}
            />
            <div
              className="absolute top-1/2 left-[60%] w-12 h-12 rounded-lg bg-white/5 blur-sm rotate-45"
              style={{ animation: "float1 12s ease-in-out infinite reverse" }}
            />
            <div
              className="absolute top-[20%] right-[30%] w-8 h-8 rounded-full bg-white/10"
              style={{ animation: "float2 7s ease-in-out infinite" }}
            />
          </div>

          {/* Content — glass card overlay */}
          <div className="relative px-8 py-20 sm:px-16 text-center">
            {/* Inner glass card for the form area */}
            <div className="max-w-2xl mx-auto">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                Bozor yangiliklaridan xabardor bo&apos;ling
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                Har hafta eng muhim narx o&apos;zgarishlari va prognozlar
              </p>

              {/* Glass input + button */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <div className="flex items-center rounded-[12px] overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                      boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <Mail size={20} className="ml-4 text-white/50 flex-shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email manzilingiz"
                      className="flex-1 bg-transparent py-4 pl-3 pr-4 text-base text-white placeholder-white/50 outline-none"
                    />
                  </div>
                </div>
                <button
                  className="px-8 py-4 text-base font-semibold rounded-[12px] cursor-pointer transition-all"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.5)",
                    color: "#6366F1",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
                  }}
                  onMouseDown={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.96)";
                    (e.currentTarget as HTMLElement).style.transition = "transform 80ms ease";
                  }}
                  onMouseUp={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
                  }}
                >
                  Obuna bo&apos;lish
                </button>
              </div>

              <p className="text-white/40 text-xs mt-5">
                Spam yo&apos;q. Istalgan vaqtda bekor qilish mumkin.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

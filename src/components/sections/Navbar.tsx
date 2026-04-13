"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTheme } from "@/hooks/useTheme";
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Apple,
  Building2,
  Shirt,
  Laptop,
  ChevronDown,
} from "lucide-react";
import { categories } from "@/lib/data";
import Link from "next/link";

const navLinks = [
  { name: "Bosh sahifa", href: "/" },
  { name: "Kategoriyalar", href: "#kategoriyalar", hasMega: true },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Haqida", href: "/haqida" },
  { name: "Aloqa", href: "/aloqa" },
];

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Building2,
  Shirt,
  Laptop,
};

export default function Navbar({ onSearchOpen }: { onSearchOpen?: () => void }) {
  const { scrolled } = useScrollDirection();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Bosh sahifa");
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelMegaClose = useCallback(() => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
  }, []);

  const scheduleMegaClose = useCallback(() => {
    cancelMegaClose();
    megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 180);
  }, [cancelMegaClose]);

  const openMega = useCallback(() => {
    cancelMegaClose();
    setMegaOpen(true);
  }, [cancelMegaClose]);

  useEffect(() => {
    return () => cancelMegaClose();
  }, [cancelMegaClose]);

  const handleNavClick = useCallback((e: React.MouseEvent, href: string, name: string) => {
    setActiveLink(name);
    setMobileOpen(false);
    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    // Page routes are handled by Link/next navigation naturally
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onSearchOpen?.();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSearchOpen]);

  return (
    <>
      {/* Desktop mega: backdrop dims page below nav — avoids “cheap” overlap with hero */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block fixed inset-0 top-16 z-[48] bg-black/25 dark:bg-black/50 backdrop-blur-sm"
            aria-hidden
            onClick={() => setMegaOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {megaOpen && (
          <motion.div
            key="mega-panel"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:block fixed left-0 right-0 top-16 z-[49] glass-mega-panel border-x-0"
            data-glass-glow=""
            onMouseEnter={openMega}
            onMouseLeave={scheduleMegaClose}
          >
            <div className="max-w-7xl mx-auto px-8 py-8 relative z-10 max-h-[min(70vh,calc(100vh-5rem))] overflow-y-auto overscroll-contain">
              <div className="grid grid-cols-4 gap-8">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Apple;
                  return (
                    <div key={cat.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${cat.gradient}`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <h3 className="font-heading font-semibold text-sm text-foreground dark:text-white">
                          {cat.name}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {cat.subCategories.map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/category/${cat.slug}?tab=${sub.slug}`}
                              onClick={() => {
                                setMegaOpen(false);
                              }}
                              className="text-sm text-muted hover:text-accent transition-all block py-1 hover:pl-2 cursor-pointer rounded"
                            >
                              {sub.name}
                              <span className="text-xs text-muted/50 ml-1">({sub.items.length})</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className={`fixed top-0 left-0 right-0 z-[50] glass-nav ${scrolled ? "glass-nav-scrolled" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <rect x="2" y="16" width="4" height="10" rx="1" fill="#6366F1" opacity="0.6" />
                <rect x="8" y="10" width="4" height="16" rx="1" fill="#6366F1" opacity="0.8" />
                <rect x="14" y="4" width="4" height="22" rx="1" fill="#6366F1" />
                <rect x="20" y="8" width="4" height="18" rx="1" fill="#6366F1" opacity="0.9" />
              </svg>
              <span className="font-heading text-xl font-bold">
                <span className="text-foreground dark:text-white">Econ</span>
                <span className="text-accent">Uz</span>
              </span>
              <span className="glass-pill ml-1 !px-2 !py-0.5 !text-[10px] font-semibold text-accent">
                Beta
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasMega && openMega()}
                  onMouseLeave={() => link.hasMega && scheduleMegaClose()}
                >
                  {link.href.startsWith("/") || link.href.startsWith("#") ? (
                    link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        onClick={() => setActiveLink(link.name)}
                        className={`glass-nav-link text-sm font-medium flex items-center gap-1 cursor-pointer ${
                          activeLink === link.name
                            ? "text-accent"
                            : "text-muted hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          if (link.hasMega) {
                            e.preventDefault();
                            setMegaOpen((o) => !o);
                          } else {
                            handleNavClick(e, link.href, link.name);
                          }
                          setActiveLink(link.name);
                        }}
                        className={`glass-nav-link text-sm font-medium flex items-center gap-1 cursor-pointer ${
                          activeLink === link.name
                            ? "text-accent"
                            : "text-muted hover:text-foreground dark:hover:text-white"
                        }`}
                      >
                        {link.name}
                        {link.hasMega && (
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                          />
                        )}
                      </a>
                    )
                  ) : null}
                  {activeLink === link.name && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.45)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => onSearchOpen?.()}
                className="glass-circle w-9 h-9 text-muted hover:text-accent"
                title="Qidirish (Ctrl+K)"
                type="button"
              >
                <Search size={16} />
              </button>

              <button
                type="button"
                onClick={toggle}
                className="glass-circle w-9 h-9 text-muted hover:text-accent"
              >
                <motion.div
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                </motion.div>
              </button>

              <select className="glass-pill !py-1 !px-2 !text-sm text-muted outline-none cursor-pointer bg-transparent">
                <option value="uz">UZ</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>

              <Link
                href="/kirish"
                className="glass-btn-outline !py-2 !px-4 !text-sm !font-medium cursor-pointer"
                data-glass-glow=""
              >
                <span className="glass-btn-content">Kirish</span>
                <span className="glass-shine-sweep" />
              </Link>
              <Link
                href="/kirish"
                className="glass-btn-accent !py-2 !px-4 !text-sm cursor-pointer"
                data-glass-glow=""
              >
                <span className="glass-btn-content">Boshlash</span>
                <span className="glass-shine-sweep" />
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden glass-circle w-10 h-10 text-foreground dark:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] pt-20 px-6 md:hidden overflow-y-auto"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(60px) saturate(200%)",
              WebkitBackdropFilter: "blur(60px) saturate(200%)",
            }}
          >
            <div className="dark:hidden absolute inset-0 pointer-events-none" />
            <div
              className="hidden dark:block absolute inset-0 pointer-events-none"
              style={{
                background: "rgba(10,10,10,0.92)",
                backdropFilter: "blur(60px)",
                WebkitBackdropFilter: "blur(60px)",
              }}
            />
            <div className="relative flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.href.startsWith("/") ? (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 text-lg font-heading font-semibold text-foreground dark:text-white hover:text-accent transition-colors cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href, link.name)}
                      className="block py-3 text-lg font-heading font-semibold text-foreground dark:text-white hover:text-accent transition-colors cursor-pointer"
                    >
                      {link.name}
                    </a>
                  )}
                </motion.div>
              ))}
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={toggle} className="glass-circle w-12 h-12">
                  {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <div className="flex gap-3 mt-4">
                <Link
                  href="/kirish"
                  className="glass-btn-outline flex-1 !justify-center !py-3"
                  data-glass-glow=""
                >
                  <span className="glass-btn-content">Kirish</span>
                  <span className="glass-shine-sweep" />
                </Link>
                <Link
                  href="/kirish"
                  className="glass-btn-accent flex-1 !justify-center !py-3"
                  data-glass-glow=""
                >
                  <span className="glass-btn-content">Boshlash</span>
                  <span className="glass-shine-sweep" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

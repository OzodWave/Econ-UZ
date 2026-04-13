"use client";

import Link from "next/link";

const footerLinks = {
  Platforma: [
    { name: "Kategoriyalar", href: "#kategoriyalar" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Prognozlar", href: "#forecast" },
    { name: "Narxlar", href: "#" },
  ],
  Kompaniya: [
    { name: "Haqimizda", href: "/haqida" },
    { name: "Jamoa", href: "/haqida" },
    { name: "Karyera", href: "/aloqa" },
    { name: "Blog", href: "#" },
  ],
  Yordam: [
    { name: "FAQ", href: "/aloqa" },
    { name: "Aloqa", href: "/aloqa" },
    { name: "Qo'llanma", href: "#" },
    { name: "API", href: "#" },
  ],
  Huquqiy: [
    { name: "Maxfiylik", href: "#" },
    { name: "Foydalanish shartlari", href: "#" },
  ],
};

function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="glass-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo & description */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs">
              O&apos;zbekiston bozorining real vaqt tahlili va AI bashoratlari.
              Biznes qarorlaringizni ma&apos;lumotlarga asoslang.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="glass-circle w-9 h-9 text-muted transition-all duration-300 footer-social-tg"
                aria-label="Telegram"
              >
                <TelegramIcon size={16} />
              </a>
              <a
                href="#"
                className="glass-circle w-9 h-9 text-muted transition-all duration-300 footer-social-ig"
                aria-label="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href="#"
                className="glass-circle w-9 h-9 text-muted transition-all duration-300 footer-social-li"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={16} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-[15px] text-accent mb-4 tracking-tight">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="footer-link text-sm text-muted hover:text-accent transition-colors inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">
              &copy; 2026 EconUz. Barcha huquqlar himoyalangan.
            </p>
            <span className="text-xs text-muted/50">Versiya 1.0</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted">
            <span>Made with</span>
            <span className="text-danger heart-pulse inline-block">&#9829;</span>
            <span>in Uzbekistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

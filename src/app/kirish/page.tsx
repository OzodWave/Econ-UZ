"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";
import Link from "next/link";
import GlassInput from "@/components/ui/GlassInput";

function TelegramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function GoogleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

type PasswordStrength = "none" | "weak" | "medium" | "strong";

function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return "none";
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

const strengthConfig: Record<PasswordStrength, { label: string; color: string; width: string }> = {
  none: { label: "", color: "", width: "0%" },
  weak: { label: "Kuchsiz", color: "bg-danger", width: "33%" },
  medium: { label: "O'rtacha", color: "bg-warning", width: "66%" },
  strong: { label: "Kuchli", color: "bg-success", width: "100%" },
};

export default function KirishPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [toast, setToast] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPw, setLoginShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regShowPw, setRegShowPw] = useState(false);
  const [regTerms, setRegTerms] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  const passwordStrength = useMemo(() => getPasswordStrength(regPassword), [regPassword]);
  const sc = strengthConfig[passwordStrength];

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs: Record<string, string> = {};
      if (!loginEmail.trim()) errs.email = "Email kiriting";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = "Email formati noto'g'ri";
      if (!loginPassword) errs.password = "Parol kiriting";
      setLoginErrors(errs);
      if (Object.keys(errs).length > 0) return;

      showToast("Demo rejim: Kirish muvaffaqiyatli!");
      setTimeout(() => router.push("/dashboard"), 1500);
    },
    [loginEmail, loginPassword, showToast, router],
  );

  const handleRegister = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const errs: Record<string, string> = {};
      if (!regName.trim()) errs.name = "Ismingizni kiriting";
      if (!regEmail.trim()) errs.email = "Email kiriting";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Email formati noto'g'ri";
      if (!regPassword) errs.password = "Parol kiriting";
      else if (regPassword.length < 6) errs.password = "Kamida 6 ta belgi";
      if (regPassword !== regConfirm) errs.confirm = "Parollar mos emas";
      if (!regTerms) errs.terms = "Shartlarni qabul qiling";
      setRegErrors(errs);
      if (Object.keys(errs).length > 0) return;

      showToast("Demo rejim: Ro'yxatdan o'tish muvaffaqiyatli!");
      setActiveTab("login");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirm("");
      setRegTerms(false);
    },
    [regName, regEmail, regPassword, regConfirm, regTerms, showToast],
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] glass-card !border-success/30 px-6 py-3 flex items-center gap-3"
          >
            <CheckCircle size={18} className="text-success" />
            <span className="text-sm text-foreground dark:text-white">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[480px]"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <svg width="32" height="32" viewBox="0 0 28 28">
            <rect x="2" y="16" width="4" height="10" rx="1" fill="#6366F1" opacity="0.6" />
            <rect x="8" y="10" width="4" height="16" rx="1" fill="#6366F1" opacity="0.8" />
            <rect x="14" y="4" width="4" height="22" rx="1" fill="#6366F1" />
            <rect x="20" y="8" width="4" height="18" rx="1" fill="#6366F1" opacity="0.9" />
          </svg>
          <span className="font-heading text-2xl font-bold">
            <span className="text-foreground dark:text-white">Econ</span>
            <span className="text-accent">Uz</span>
          </span>
        </Link>

        <div className="glass-card p-6 sm:p-8">
          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 rounded-full bg-white/5 border border-white/10 mb-6">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-full transition-all ${
                  activeTab === tab
                    ? "glass-btn-accent text-white"
                    : "text-muted hover:text-foreground dark:hover:text-white"
                }`}
              >
                <span className={activeTab === tab ? "glass-btn-content" : ""}>
                  {tab === "login" ? "Kirish" : "Ro'yxatdan o'tish"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <GlassInput
                    type="email"
                    placeholder="Email"
                    icon={<Mail size={16} />}
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginErrors.email) setLoginErrors((p) => { const n = { ...p }; delete n.email; return n; });
                    }}
                  />
                  {loginErrors.email && <p className="text-xs text-danger mt-1">{loginErrors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <GlassInput
                      type={loginShowPw ? "text" : "password"}
                      placeholder="Parol"
                      icon={<Lock size={16} />}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginErrors.password) setLoginErrors((p) => { const n = { ...p }; delete n.password; return n; });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setLoginShowPw(!loginShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      {loginShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-xs text-danger mt-1">{loginErrors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 accent-accent"
                    />
                    <span className="text-sm text-muted">Meni eslab qol</span>
                  </label>
                  <button type="button" className="text-sm text-accent hover:underline underline-offset-4">
                    Parolni unutdingizmi?
                  </button>
                </div>

                <button
                  type="submit"
                  className="glass-btn-accent w-full !py-3 !text-base"
                  data-glass-glow=""
                >
                  <span className="glass-btn-content">Kirish</span>
                  <span className="glass-shine-sweep" />
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-muted">yoki</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="glass-btn-outline !py-2.5 flex items-center justify-center gap-2 !text-sm"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content flex items-center gap-2">
                      <GoogleIcon size={16} />
                      Google
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                  <button
                    type="button"
                    className="glass-btn-outline !py-2.5 flex items-center justify-center gap-2 !text-sm"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content flex items-center gap-2">
                      <TelegramIcon size={16} />
                      Telegram
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <GlassInput
                    placeholder="Ism"
                    icon={<User size={16} />}
                    value={regName}
                    onChange={(e) => {
                      setRegName(e.target.value);
                      if (regErrors.name) setRegErrors((p) => { const n = { ...p }; delete n.name; return n; });
                    }}
                  />
                  {regErrors.name && <p className="text-xs text-danger mt-1">{regErrors.name}</p>}
                </div>

                <div>
                  <GlassInput
                    type="email"
                    placeholder="Email"
                    icon={<Mail size={16} />}
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      if (regErrors.email) setRegErrors((p) => { const n = { ...p }; delete n.email; return n; });
                    }}
                  />
                  {regErrors.email && <p className="text-xs text-danger mt-1">{regErrors.email}</p>}
                </div>

                <div>
                  <div className="relative">
                    <GlassInput
                      type={regShowPw ? "text" : "password"}
                      placeholder="Parol"
                      icon={<Lock size={16} />}
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (regErrors.password) setRegErrors((p) => { const n = { ...p }; delete n.password; return n; });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setRegShowPw(!regShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      {regShowPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {regErrors.password && <p className="text-xs text-danger mt-1">{regErrors.password}</p>}
                  {regPassword && (
                    <div className="mt-2">
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className={`h-full ${sc.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: sc.width }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className={`text-xs mt-1 ${
                        passwordStrength === "weak" ? "text-danger" :
                        passwordStrength === "medium" ? "text-warning" : "text-success"
                      }`}>
                        {sc.label}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <GlassInput
                    type="password"
                    placeholder="Parolni tasdiqlang"
                    icon={<Lock size={16} />}
                    value={regConfirm}
                    onChange={(e) => {
                      setRegConfirm(e.target.value);
                      if (regErrors.confirm) setRegErrors((p) => { const n = { ...p }; delete n.confirm; return n; });
                    }}
                  />
                  {regErrors.confirm && <p className="text-xs text-danger mt-1">{regErrors.confirm}</p>}
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regTerms}
                    onChange={(e) => {
                      setRegTerms(e.target.checked);
                      if (regErrors.terms) setRegErrors((p) => { const n = { ...p }; delete n.terms; return n; });
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-white/20 accent-accent"
                  />
                  <span className="text-sm text-muted">
                    <span className="text-accent hover:underline underline-offset-4 cursor-pointer">
                      Foydalanish shartlarini
                    </span>{" "}
                    qabul qilaman
                  </span>
                </label>
                {regErrors.terms && <p className="text-xs text-danger -mt-2">{regErrors.terms}</p>}

                <button
                  type="submit"
                  className="glass-btn-accent w-full !py-3 !text-base"
                  data-glass-glow=""
                >
                  <span className="glass-btn-content">Ro&apos;yxatdan o&apos;tish</span>
                  <span className="glass-shine-sweep" />
                </button>

                <div className="flex items-center gap-3 my-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-muted">yoki</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="glass-btn-outline !py-2.5 flex items-center justify-center gap-2 !text-sm"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content flex items-center gap-2">
                      <GoogleIcon size={16} />
                      Google
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                  <button
                    type="button"
                    className="glass-btn-outline !py-2.5 flex items-center justify-center gap-2 !text-sm"
                    data-glass-glow=""
                  >
                    <span className="glass-btn-content flex items-center gap-2">
                      <TelegramIcon size={16} />
                      Telegram
                    </span>
                    <span className="glass-shine-sweep" />
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          <Link href="/" className="text-accent hover:underline underline-offset-4">
            Bosh sahifaga qaytish
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

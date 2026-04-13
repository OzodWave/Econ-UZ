"use client";

import { useTheme } from "@/hooks/useTheme";

export default function PremiumBackground() {
  const { isDark } = useTheme();

  return (
    <div className={`premium-bg ${isDark ? "" : "light-orbs light-grid"}`}>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="noise" />
      <div className="grid-overlay" />
    </div>
  );
}

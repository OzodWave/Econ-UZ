"use client";

import { useEffect } from "react";

const ACTIVATION_DISTANCE = 420;

/**
 * Global cursor-follow specular highlight for [data-glass-glow] surfaces.
 */
export default function MouseFollowLight() {
  useEffect(() => {
    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;
    const isDark = () => document.documentElement.classList.contains("dark");

    const update = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-glass-glow]");
      const maxOpacity = isDark() ? 0.06 : 0.08;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouseX - centerX, mouseY - centerY);

        if (dist < ACTIVATION_DISTANCE) {
          const x = ((mouseX - rect.left) / rect.width) * 100;
          const y = ((mouseY - rect.top) / rect.height) * 100;
          const opacity = Math.max(0, 1 - dist / ACTIVATION_DISTANCE) * maxOpacity;
          el.style.setProperty("--glow-x", `${x}%`);
          el.style.setProperty("--glow-y", `${y}%`);
          el.style.setProperty("--glow-opacity", `${opacity}`);
        } else {
          el.style.setProperty("--glow-opacity", "0");
        }
      });
      rafId = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}

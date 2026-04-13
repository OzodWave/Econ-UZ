"use client";

import { useCallback, useRef } from "react";

const MIN_WIDTH = 768;

export function useTiltEffect(intensity = 6) {
  const rx = useRef(0);
  const ry = useRef(0);
  const pressed = useRef(false);

  const apply = useCallback(
    (el: HTMLDivElement) => {
      const p = pressed.current ? 0.97 : 1;
      if (typeof window !== "undefined" && window.innerWidth < MIN_WIDTH) {
        el.style.transform = `scale(${p})`;
        el.style.transition = pressed.current
          ? "transform 80ms ease"
          : "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
        return;
      }
      el.style.transform = `perspective(800px) rotateY(${rx.current * intensity}deg) rotateX(${-ry.current * intensity}deg) scale(${p})`;
    },
    [intensity]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (typeof window !== "undefined" && window.innerWidth < MIN_WIDTH) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      rx.current = (e.clientX - rect.left) / rect.width - 0.5;
      ry.current = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 0.1s ease";
      apply(el);
    },
    [apply]
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      rx.current = 0;
      ry.current = 0;
      pressed.current = false;
      el.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      apply(el);
    },
    [apply]
  );

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      pressed.current = true;
      const el = e.currentTarget;
      el.style.transition = "transform 80ms ease";
      apply(el);
    },
    [apply]
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      pressed.current = false;
      const el = e.currentTarget;
      el.style.transition = "transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      apply(el);
    },
    [apply]
  );

  return { onMouseMove, onMouseLeave, onMouseDown, onMouseUp };
}

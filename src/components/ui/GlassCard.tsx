"use client";

import { useRef, useCallback, ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  tiltIntensity?: number;
  press?: boolean;
  glow?: boolean;
  tint?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  id?: string;
}

export default function GlassCard({
  children,
  className = "",
  tilt = false,
  tiltIntensity = 3,
  press = false,
  glow = true,
  tint,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  id,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transform = `perspective(1000px) rotateX(${-y * tiltIntensity}deg) rotateY(${x * tiltIntensity}deg) translateZ(0)`;
      ref.current.style.transition = "transform 0.1s ease";
    },
    [tilt, tiltIntensity]
  );

  const handleMouseLeaveInternal = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (tilt && ref.current) {
        ref.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)";
        ref.current.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
      }
      onMouseLeave?.(e);
    },
    [tilt, onMouseLeave]
  );

  const handleMouseDown = useCallback(() => {
    if (!press || !ref.current) return;
    ref.current.style.transform = "scale(0.96)";
    ref.current.style.transition = "transform 80ms ease";
  }, [press]);

  const handleMouseUp = useCallback(() => {
    if (!press || !ref.current) return;
    ref.current.style.transform = "scale(1)";
    ref.current.style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, [press]);

  return (
    <div
      ref={ref}
      id={id}
      className={`glass-card ${className}`}
      style={{ ...(tint ? { backgroundColor: tint } : {}), ...style }}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={handleMouseLeaveInternal}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      data-glass-glow={glow ? "" : undefined}
    >
      {children}
    </div>
  );
}

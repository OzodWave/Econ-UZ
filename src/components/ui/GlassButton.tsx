"use client";

import { useRef, useCallback, ReactNode } from "react";

interface GlassButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "outline";
  onClick?: (e: React.MouseEvent) => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

export default function GlassButton({
  children,
  className = "",
  variant = "default",
  onClick,
  type = "button",
  disabled = false,
}: GlassButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseDown = useCallback(() => {
    if (!ref.current || disabled) return;
    ref.current.style.transform = "scale(0.96)";
    ref.current.style.transition = "transform 80ms ease";
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    if (!ref.current || disabled) return;
    ref.current.style.transform = "scale(1)";
    ref.current.style.transition = "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)";
  }, [disabled]);

  const variantClass =
    variant === "accent"
      ? "glass-btn-accent"
      : variant === "outline"
      ? "glass-btn-outline"
      : "glass-btn";

  return (
    <button
      ref={ref}
      type={type}
      className={`${variantClass} ${className}`}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      disabled={disabled}
      data-glass-glow=""
    >
      <span className="glass-btn-content">{children}</span>
      <span className="glass-shine-sweep" />
    </button>
  );
}

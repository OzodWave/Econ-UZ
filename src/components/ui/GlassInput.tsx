"use client";

import { forwardRef } from "react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className = "", icon, wrapperClassName = "", ...props }, ref) => {
    return (
      <div className={`glass-input-wrapper ${wrapperClassName}`} data-glass-glow="">
        {icon && <span className="glass-input-icon">{icon}</span>}
        <input ref={ref} className={`glass-input ${className}`} {...props} />
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
export default GlassInput;

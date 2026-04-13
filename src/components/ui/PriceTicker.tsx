"use client";

import { tickerData } from "@/lib/data";

export default function PriceTicker() {
  const tripled = [...tickerData, ...tickerData, ...tickerData];

  return (
    <div
      className="price-ticker-fixed glass-ticker border-t border-b border-white/10 dark:border-white/5"
      role="region"
      aria-label="Narxlar lenti"
    >
      <div className="flex ticker-scroll" style={{ width: "max-content" }}>
        {tripled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="flex items-center gap-3 px-6 whitespace-nowrap"
          >
            <span className="text-sm font-medium text-foreground dark:text-white">
              {item.name}:
            </span>
            <span className="text-sm tabular-nums font-semibold text-foreground dark:text-white">
              {item.price.toLocaleString()} so&apos;m
            </span>
            <span
              className={`text-sm font-bold ${
                item.changeType === "up" ? "text-success" : "text-danger"
              }`}
            >
              {item.changeType === "up" ? "↑" : "↓"}
              {item.change}%
            </span>
            <span className="ticker-divider mx-1 h-4 w-px shrink-0 bg-black/10 dark:bg-white/15" />
          </div>
        ))}
      </div>
    </div>
  );
}

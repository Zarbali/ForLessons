"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProgressRingProps = {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  children?: ReactNode;
};

export function ProgressRing({
  value,
  max = 100,
  size = 88,
  strokeWidth = 8,
  className,
  trackClassName,
  indicatorClassName,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, max === 0 ? 0 : value / max));
  const offset = circumference * (1 - progress);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-[var(--border)]", trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("stroke-[var(--brand)] transition-[stroke-dashoffset] duration-500 ease-out", indicatorClassName)}
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
          {children}
        </div>
      ) : null}
    </div>
  );
}

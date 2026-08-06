"use client";

import { useCallback } from "react";
import confetti from "canvas-confetti";

type ConfettiBurstOptions = {
  particleCount?: number;
  spread?: number;
  originY?: number;
};

/** Fire a Lingua-branded confetti burst (respects reduced motion). */
export function fireConfettiBurst(options: ConfettiBurstOptions = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

  confetti({
    particleCount: options.particleCount ?? 110,
    spread: options.spread ?? 75,
    origin: { y: options.originY ?? 0.65 },
    colors: ["#22c55e", "#4ade80", "#67e8f9", "#ecfeff", "#0f172a"],
  });
}

export function useConfettiBurst() {
  return useCallback((options?: ConfettiBurstOptions) => {
    fireConfettiBurst(options);
  }, []);
}

/** Tiny helper component if you need an imperative-friendly mount point. */
export function ConfettiBurst() {
  return null;
}

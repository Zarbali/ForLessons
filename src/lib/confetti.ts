import confetti from "canvas-confetti";

/** Fire a celebratory confetti burst (client-only). */
export function celebrate(opts?: { particleCount?: number }) {
  if (typeof window === "undefined") return;
  const count = opts?.particleCount ?? 120;
  confetti({
    particleCount: count,
    spread: 70,
    origin: { y: 0.65 },
    colors: ["#1FAF6B", "#0B1F17", "#A8E6CF", "#F4FBF7", "#E8F7EF"],
  });
}

export function celebrateWin() {
  celebrate({ particleCount: 160 });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ["#1FAF6B", "#A8E6CF"],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ["#0B1F17", "#E8F7EF"],
    });
  }, 200);
}

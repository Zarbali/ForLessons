import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** First emoji/pictograph from a string (for compact UI icons). */
export function leadingEmoji(value: string, fallback = "📘"): string {
  const match = value.match(
    /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u2600-\u27BF])(?:\uFE0F)?(?:\u200D(?:\p{Extended_Pictographic}|\p{Emoji_Presentation})(?:\uFE0F)?)*/u,
  );
  return match?.[0] ?? fallback;
}

/** Text after a leading emoji — useful as a short tip line. */
export function withoutLeadingEmoji(value: string): string {
  const emoji = leadingEmoji(value, "");
  if (!emoji) return value.trim();
  return value.slice(emoji.length).replace(/^[\s·\-–—→:]+/, "").trim();
}

/** Fisher–Yates shuffle (returns a new array). */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Pick one random item; throws if the array is empty. */
export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error("pickRandom: cannot pick from an empty array");
  }
  return items[Math.floor(Math.random() * items.length)]!;
}

/** Format seconds as m:ss or h:mm:ss. */
export function formatTime(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const mm = String(minutes).padStart(hours > 0 ? 2 : 1, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${mm.padStart(2, "0")}:${ss}`;
  }
  return `${minutes}:${ss}`;
}

/** Local calendar date key YYYY-MM-DD. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

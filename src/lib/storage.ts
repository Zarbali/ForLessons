/** Typed localStorage keys for Lingua progress & preferences. */
export const StorageKeys = {
  theme: "lingua:theme",
  favorites: "lingua:favorites",
  difficult: "lingua:difficult",
  progress: "lingua:progress",
  music: "lingua:music",
  notes: "lingua:notes",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Read and parse JSON from localStorage. Returns fallback on SSR / errors. */
export function getJSON<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serialize and write JSON to localStorage (no-op on SSR). */
export function setJSON<T>(key: string, value: T): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // QuotaExceeded or private mode — ignore
  }
}

/** Remove a key from localStorage (no-op on SSR). */
export function removeKey(key: string): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

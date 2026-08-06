"use client";

import { useCallback, useEffect, useState } from "react";
import { getJSON, setJSON } from "@/lib/storage";

/**
 * Generic localStorage-synced state hook (SSR-safe).
 * Starts with `initial` on the server / first paint, then hydrates from storage.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(getJSON<T>(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per key
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(key, value);
  }, [key, value, hydrated]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof next === "function" ? (next as (p: T) => T)(prev) : next));
  }, []);

  return [value, update, hydrated] as const;
}

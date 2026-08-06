"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Global navigation chords:
 * g then h → home
 * g then l → learn
 * g then g → games
 * g then a → ai
 * g then f → focus
 * g then p → progress
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const awaitingG = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearPending = () => {
      awaitingG.current = false;
      if (timer.current) clearTimeout(timer.current);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      if (awaitingG.current) {
        clearPending();
        const map: Record<string, string> = {
          h: "/",
          l: "/learn",
          g: "/games",
          a: "/ai",
          f: "/focus",
          p: "/progress",
        };
        const path = map[key];
        if (path) {
          e.preventDefault();
          router.push(path);
        }
        return;
      }

      if (key === "g" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        awaitingG.current = true;
        timer.current = setTimeout(clearPending, 900);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearPending();
    };
  }, [router]);

  return null;
}

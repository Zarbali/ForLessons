"use client";

import { useEffect, type ReactNode } from "react";
import { AppProvider } from "@/context/AppProvider";
import { MusicProvider } from "@/context/MusicProvider";
import { AppShell } from "@/components/layout/AppShell";
import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts";

function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  void navigator.serviceWorker.register("/sw.js").catch(() => {
    // Offline shell is optional during local/dev — ignore registration failures
  });
}

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AppProvider>
      <MusicProvider>
        <KeyboardShortcuts />
        <AppShell>{children}</AppShell>
      </MusicProvider>
    </AppProvider>
  );
}

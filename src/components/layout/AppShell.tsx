"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { MusicDock } from "@/components/layout/MusicDock";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden">
      <div className="ambient-bg pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="ambient-orb ambient-orb-a" />
        <div className="ambient-orb ambient-orb-b" />
        <div className="ambient-orb ambient-orb-c" />
      </div>

      <Navbar />

      <main
        className={cn(
          "relative z-10 w-full flex-1 pb-32 sm:pb-36",
          isHome
            ? "max-w-none px-0 pt-0"
            : "mx-auto max-w-6xl px-3 pt-5 sm:px-6 sm:pt-10",
        )}
      >
        {children}
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-2 text-center text-[11px] text-[var(--muted-foreground)] sm:px-6">
        Veronika · Сайт специально для моей любимой, удачи с учёбой)
      </footer>

      <MusicDock />
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GameShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto max-w-2xl px-1 py-6 sm:px-2 sm:py-10", className)}
    >
      <Link
        href="/games"
        className="mb-5 inline-flex items-center gap-1 text-sm text-ink/50 transition hover:text-spring dark:text-white/50"
      >
        <ChevronLeft className="h-4 w-4" /> Games
      </Link>
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Game
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-ink sm:text-3xl dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-ink/55 dark:text-white/55">{subtitle}</p>
        )}
      </header>
      {children}
    </motion.div>
  );
}

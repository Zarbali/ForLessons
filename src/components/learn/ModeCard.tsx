"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ModeCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: string;
  index?: number;
};

export function ModeCard({
  href,
  title,
  description,
  icon: Icon,
  accent = "bg-spring/15 text-spring",
  index = 0,
}: ModeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.35) }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
    >
      <Link
        href={href}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition hover:border-spring/35 hover:shadow-[var(--shadow-lift)] dark:border-white/10 dark:bg-ink/50"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-spring/10 blur-2xl transition group-hover:bg-spring/20" />
        <div className="relative flex items-start justify-between">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105",
              accent,
            )}
          >
            <Icon className="h-5 w-5" />
          </span>
          <ArrowUpRight className="h-4 w-4 text-ink/25 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-spring dark:text-white/30" />
        </div>
        <h3 className="font-display relative mt-4 text-lg font-semibold text-ink dark:text-white">
          {title}
        </h3>
        <p className="relative mt-1.5 text-sm leading-relaxed text-ink/55 dark:text-white/55">
          {description}
        </p>
      </Link>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { motivations } from "@/lib/data/motivations";
import { todayKey } from "@/lib/utils";

function dailyMotivation() {
  const day = todayKey();
  const seed = [...day].reduce((a, c) => a + c.charCodeAt(0), 0);
  return motivations[seed % motivations.length]!;
}

export function MotivationBanner() {
  const item = dailyMotivation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="flex items-start gap-3 rounded-2xl border border-spring/25 bg-spring/10 px-4 py-4 sm:px-5"
    >
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-spring/20 text-spring">
        <Flame className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-spring uppercase">
          Today&apos;s spark
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink sm:text-base dark:text-white">
          {item.line}
        </p>
      </div>
    </motion.div>
  );
}

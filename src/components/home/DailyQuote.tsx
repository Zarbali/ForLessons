"use client";

import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";
import { quotes } from "@/lib/data/quotes";
import { todayKey } from "@/lib/utils";

function dailyQuote() {
  const day = todayKey();
  const seed = [...day].reduce((a, c) => a + c.charCodeAt(0) * 7, 0);
  return quotes[seed % quotes.length]!;
}

export function DailyQuote() {
  const q = dailyQuote();

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl border border-ink/8 bg-ink p-5 text-white shadow-lg sm:p-7 dark:border-white/10"
    >
      <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-spring/20 blur-3xl" />
      <QuoteIcon className="relative h-6 w-6 text-spring" aria-hidden />
      <p className="font-display relative mt-4 text-lg leading-relaxed font-medium sm:text-xl">
        {q.text}
      </p>
      <footer className="relative mt-5 text-sm text-white/50">— {q.author}</footer>
    </motion.blockquote>
  );
}

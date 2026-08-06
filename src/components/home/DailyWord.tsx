"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { words } from "@/lib/data/words";
import { speak } from "@/lib/speech";
import { todayKey } from "@/lib/utils";

function dailyWord() {
  const day = todayKey();
  const seed = [...day].reduce((a, c) => a + c.charCodeAt(0) * 3, 0);
  return words[seed % words.length]!;
}

export function DailyWord() {
  const w = dailyWord();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: 0.05 }}
      className="relative overflow-hidden rounded-3xl border border-ink/8 bg-white/80 p-5 shadow-[var(--shadow-soft)] backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-ink/40"
    >
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-spring/15 blur-2xl" />
      <p className="text-xs font-semibold tracking-wide text-spring uppercase">
        Word of the day
      </p>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-2xl font-semibold text-ink sm:text-3xl dark:text-white">
            <span className="mr-2 text-2xl" aria-hidden>
              {w.imageEmoji}
            </span>
            {w.word}
          </p>
          <p className="mt-1 text-sm text-ink/50 dark:text-white/50">{w.phonetic}</p>
          <p className="mt-3 text-base text-ink/80 sm:text-lg dark:text-white/80">
            {w.translation}
          </p>
        </div>
        <button
          type="button"
          onClick={() => speak(w.word, { lang: "en-US", rate: 0.95 })}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-spring hover:text-[#052e16] active:scale-95 dark:bg-white/10"
          aria-label={`Pronounce ${w.word}`}
        >
          <Volume2 className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-5 border-t border-ink/8 pt-4 text-sm leading-relaxed text-ink/65 italic dark:border-white/10 dark:text-white/60">
        “{w.example}”
      </p>
      <p className="mt-1 text-xs text-ink/40 dark:text-white/40">{w.exampleTranslation}</p>
    </motion.article>
  );
}

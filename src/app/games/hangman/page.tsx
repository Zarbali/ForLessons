"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { pickRandom, cn } from "@/lib/utils";

const ALPHA = "abcdefghijklmnopqrstuvwxyz".split("");
const PLAYABLE = words.filter((w) => /^[a-zA-Z]+$/.test(w.word) && w.word.length >= 4);

function nextWord() {
  return pickRandom(PLAYABLE.length ? PLAYABLE : words);
}

export default function HangmanPage() {
  const { addXp } = useApp();
  const [target, setTarget] = useState(nextWord);
  const word = target.word.toLowerCase().replace(/[^a-z]/g, "");
  const [guessed, setGuessed] = useState<string[]>([]);
  const maxWrong = 6;

  const wrong = guessed.filter((g) => !word.includes(g)).length;
  const display = word
    .split("")
    .map((c) => (guessed.includes(c) ? c : "_"))
    .join(" ");
  const won = word.length > 0 && word.split("").every((c) => guessed.includes(c));
  const lost = wrong >= maxWrong;

  const guess = (letter: string) => {
    if (won || lost || guessed.includes(letter) || !word) return;
    const next = [...guessed, letter];
    setGuessed(next);
    if (word.includes(letter)) addXp(2);
    const nowWon = word.split("").every((c) => next.includes(c));
    if (nowWon) {
      addXp(20);
      celebrateWin();
    }
  };

  const reset = () => {
    setTarget(nextWord());
    setGuessed([]);
  };

  const stages = useMemo(
    () => ["🙂", "😮", "😟", "😰", "😱", "😵", "💀"],
    [],
  );

  return (
    <GameShell title="Hangman" subtitle="Guess the English word.">
      <div className="text-center">
        <motion.p
          key={wrong}
          initial={{ scale: 0.85, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl"
          aria-hidden
        >
          {stages[Math.min(wrong, stages.length - 1)]}
        </motion.p>
        <p className="mt-2 text-xs text-ink/40 dark:text-white/40">
          {wrong} / {maxWrong} misses · hint: {target.category}
        </p>
        <p className="font-display mt-6 text-2xl tracking-[0.18em] text-ink sm:text-3xl dark:text-white">
          {display || "—"}
        </p>
        {(won || lost) && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-ink/70 dark:text-white/70"
          >
            {won
              ? "You got it!"
              : `It was “${target.word}” — ${target.translation}`}
          </motion.p>
        )}
      </div>

      <div className="mt-8 grid grid-cols-7 gap-1.5 sm:flex sm:flex-wrap sm:justify-center">
        {ALPHA.map((l) => {
          const used = guessed.includes(l);
          const correct = used && word.includes(l);
          const miss = used && !word.includes(l);
          return (
            <button
              key={l}
              type="button"
              disabled={used || won || lost}
              onClick={() => guess(l)}
              className={cn(
                "h-10 rounded-xl border text-sm font-semibold uppercase transition active:scale-95 sm:h-9 sm:w-9",
                correct && "border-spring/40 bg-spring/20 text-spring",
                miss && "border-rose-400/30 bg-rose-500/10 text-rose-400 opacity-50",
                !used &&
                  "border-ink/10 hover:border-spring/40 dark:border-white/15",
                "disabled:cursor-default",
              )}
            >
              {l}
            </button>
          );
        })}
      </div>

      {(won || lost) && (
        <button
          type="button"
          onClick={reset}
          className="mt-8 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] transition hover:brightness-110 active:scale-[0.99]"
        >
          New word
        </button>
      )}
    </GameShell>
  );
}

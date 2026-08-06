"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, shuffle } from "@/lib/utils";

const SIZE = 8;

function newRound() {
  const round = shuffle(words).slice(0, SIZE);
  return {
    round,
    left: shuffle(round),
    right: shuffle(round.map((w) => ({ id: w.id, label: w.translation, emoji: w.imageEmoji }))),
  };
}

export default function MatchGamePage() {
  const { addXp } = useApp();
  const [deck, setDeck] = useState(newRound);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const { round, left, right } = deck;
  const done = matched.length === round.length && round.length > 0;

  const onPickRight = (id: string) => {
    if (!selectedLeft || matched.includes(id)) return;
    if (selectedLeft === id) {
      const nextLen = matched.length + 1;
      setMatched((m) => [...m, id]);
      setSelectedLeft(null);
      setStreak((s) => s + 1);
      addXp(5 + Math.min(streak, 4));
      if (nextLen === round.length) {
        celebrateWin();
        addXp(20);
      }
    } else {
      setWrong(id);
      setStreak(0);
      setTimeout(() => setWrong(null), 420);
      setSelectedLeft(null);
    }
  };

  const restart = () => {
    setDeck(newRound());
    setMatched([]);
    setSelectedLeft(null);
    setWrong(null);
    setStreak(0);
  };

  return (
    <GameShell
      title="Word Match"
      subtitle={`Connect ${SIZE} words · pool of ${words.length}+`}
    >
      <div className="mb-3 flex justify-between text-xs text-[var(--muted-foreground)]">
        <span>
          Matched{" "}
          <span className="font-semibold text-spring">{matched.length}</span> /{" "}
          {SIZE}
        </span>
        {streak > 1 && (
          <motion.span
            key={streak}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-semibold text-spring"
          >
            Streak ×{streak}
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          {left.map((w, i) => (
            <motion.button
              key={w.id}
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              disabled={matched.includes(w.id)}
              onClick={() => setSelectedLeft(w.id)}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left text-sm font-medium transition",
                matched.includes(w.id) && "opacity-35",
                selectedLeft === w.id
                  ? "border-spring bg-spring/20 shadow-[var(--shadow-glow)]"
                  : "border-[var(--border)] bg-[var(--surface-elevated)]",
              )}
            >
              <span className="mr-1.5" aria-hidden>
                {w.imageEmoji}
              </span>
              {w.word}
            </motion.button>
          ))}
        </div>
        <div className="space-y-2">
          {right.map((r, i) => (
            <motion.button
              key={r.id}
              type="button"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              disabled={matched.includes(r.id)}
              onClick={() => onPickRight(r.id)}
              className={cn(
                "w-full rounded-2xl border px-3 py-3 text-left text-sm transition",
                matched.includes(r.id) && "opacity-35",
                wrong === r.id && "border-rose-400 bg-rose-500/15",
                "border-[var(--border)] bg-[var(--surface-elevated)]",
              )}
            >
              {r.label}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <p className="font-display text-xl font-semibold text-spring">
              Perfect match!
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16]"
            >
              New round
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}

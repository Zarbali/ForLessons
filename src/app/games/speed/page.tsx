"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, pickRandom, shuffle } from "@/lib/utils";

export default function SpeedPage() {
  const { addXp } = useApp();
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(45);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(() => pickRandom(words));
  const [options, setOptions] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [flash, setFlash] = useState<"ok" | "bad" | null>(null);

  const loadRound = () => {
    const w = pickRandom(words);
    setCurrent(w);
    const distractors = shuffle(words.filter((x) => x.id !== w.id))
      .slice(0, 3)
      .map((x) => x.translation);
    setOptions(shuffle([w.translation, ...distractors]));
  };

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setFinished(true);
      if (score >= 10) {
        celebrateWin();
        addXp(25 + score);
      } else addXp(score * 2);
      return;
    }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, time, score, addXp]);

  const start = () => {
    setScore(0);
    setStreak(0);
    setTime(45);
    setFinished(false);
    setRunning(true);
    loadRound();
  };

  const choose = (opt: string) => {
    if (!running) return;
    if (opt === current.translation) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      setFlash("ok");
      addXp(3 + Math.min(streak, 5));
    } else {
      setStreak(0);
      setFlash("bad");
    }
    setTimeout(() => setFlash(null), 220);
    loadRound();
  };

  return (
    <GameShell
      title="Speed Challenge"
      subtitle={`45 seconds · ${words.length}+ words`}
    >
      {!running && !finished && (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={start}
          className="w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] shadow-[var(--shadow-glow)]"
        >
          Start sprint
        </motion.button>
      )}

      {(running || finished) && (
        <>
          <div className="mb-6 flex justify-between text-sm">
            <span>
              Score <strong className="text-spring">{score}</strong>
              {streak > 1 && (
                <span className="ml-2 text-xs text-spring">×{streak}</span>
              )}
            </span>
            <span className={cn("font-mono", time <= 8 && "text-rose-500")}>
              {time}s
            </span>
          </div>
          {!finished && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "rounded-3xl border p-5 transition",
                flash === "ok" && "border-spring bg-spring/10",
                flash === "bad" && "border-rose-400 bg-rose-500/10",
                !flash && "border-[var(--border)] bg-[var(--surface-elevated)]",
              )}
            >
              <p className="text-center text-3xl" aria-hidden>
                {current.imageEmoji}
              </p>
              <p className="font-display mt-2 text-center text-3xl font-semibold text-[var(--foreground)]">
                {current.word}
              </p>
              <div className="mt-6 grid gap-2">
                {options.map((o, i) => (
                  <motion.button
                    key={o + i}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => choose(o)}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-left text-sm transition hover:border-spring/40"
                  >
                    {o}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          <AnimatePresence>
            {finished && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="font-display text-5xl font-semibold text-spring">
                  {score}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  words in 45 seconds
                </p>
                <button
                  type="button"
                  onClick={start}
                  className="mt-6 w-full rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
                >
                  Play again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </GameShell>
  );
}

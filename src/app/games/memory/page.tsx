"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, shuffle } from "@/lib/utils";

type Card = {
  id: string;
  pairId: string;
  label: string;
  face: "word" | "translation";
  emoji: string;
};

const PAIR_COUNT = 8;

export default function MemoryGamePage() {
  const { addXp } = useApp();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [combo, setCombo] = useState(0);
  const [moves, setMoves] = useState(0);

  const start = () => {
    const picks = shuffle(words).slice(0, PAIR_COUNT);
    const deck: Card[] = shuffle(
      picks.flatMap((w) => [
        {
          id: `${w.id}-w`,
          pairId: w.id,
          label: w.word,
          face: "word" as const,
          emoji: w.imageEmoji,
        },
        {
          id: `${w.id}-t`,
          pairId: w.id,
          label: w.translation,
          face: "translation" as const,
          emoji: w.imageEmoji,
        },
      ]),
    );
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setCombo(0);
    setMoves(0);
  };

  useEffect(() => {
    start();
  }, []);

  const won = matched.length === PAIR_COUNT && cards.length > 0;

  useEffect(() => {
    if (won) {
      addXp(30 + combo * 2);
      celebrateWin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const onFlip = (id: string) => {
    if (lock || flipped.includes(id)) return;
    const card = cards.find((c) => c.id === id);
    if (!card || matched.includes(card.pairId)) return;

    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setLock(true);
      setMoves((m) => m + 1);
      const [a, b] = next;
      const ca = cards.find((c) => c.id === a)!;
      const cb = cards.find((c) => c.id === b)!;
      if (ca.pairId === cb.pairId && ca.face !== cb.face) {
        setMatched((m) => [...m, ca.pairId]);
        setCombo((c) => c + 1);
        setFlipped([]);
        setLock(false);
        addXp(5 + Math.min(combo, 5));
      } else {
        setCombo(0);
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 750);
      }
    }
  };

  return (
    <GameShell
      title="Memory Cards"
      subtitle={`Match ${PAIR_COUNT} pairs from ${words.length}+ words.`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-[var(--muted-foreground)]">
          Matched{" "}
          <span className="font-semibold text-spring">{matched.length}</span> /{" "}
          {PAIR_COUNT}
        </p>
        <div className="flex gap-3 text-xs text-[var(--muted-foreground)]">
          <span>Moves {moves}</span>
          <AnimatePresence>
            {combo > 1 && (
              <motion.span
                key={combo}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-semibold text-spring"
              >
                Combo ×{combo}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cards.map((c, i) => {
          const isUp = flipped.includes(c.id) || matched.includes(c.pairId);
          const isMatch = matched.includes(c.pairId);
          return (
            <motion.button
              key={c.id}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onFlip(c.id)}
              className={cn(
                "relative flex min-h-[84px] items-center justify-center overflow-hidden rounded-2xl border p-2 text-center text-[11px] font-medium sm:min-h-[104px] sm:text-sm",
                isUp
                  ? isMatch
                    ? "border-spring/50 bg-spring/20 text-[var(--foreground)]"
                    : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[#0f172a] text-white/70",
              )}
              style={{ perspective: 800 }}
            >
              <motion.span
                animate={{ rotateY: isUp ? 0 : 180 }}
                transition={{ duration: 0.35 }}
                className="block w-full"
              >
                {isUp ? (
                  <span className="flex flex-col items-center gap-1 px-0.5">
                    <span className="text-base" aria-hidden>
                      {c.emoji}
                    </span>
                    <span className="leading-snug break-words">{c.label}</span>
                  </span>
                ) : (
                  <span className="font-display text-lg text-spring/80">?</span>
                )}
              </motion.span>
              {isMatch && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 h-2 w-2 rounded-full bg-spring"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="font-display text-xl font-semibold text-spring">
              Perfect memory!
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {moves} moves · combo bonus applied
            </p>
            <button
              type="button"
              onClick={start}
              className="mt-4 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] transition hover:brightness-110"
            >
              New round
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}

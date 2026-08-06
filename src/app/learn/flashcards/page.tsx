"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Heart,
  AlertTriangle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { words, type Word } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { speak } from "@/lib/speech";
import { cn, shuffle } from "@/lib/utils";

export default function FlashcardsPage() {
  const { favorites, toggleFavorite, difficult, toggleDifficult, addXp } =
    useApp();
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(words.map((w) => w.category))).sort()],
    [],
  );
  const [category, setCategory] = useState("All");
  const [difficultOnly, setDifficultOnly] = useState(false);
  const [deck, setDeck] = useState<Word[]>(() => shuffle(words));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const filtered = useMemo(() => {
    let list = deck;
    if (category !== "All") list = list.filter((w) => w.category === category);
    if (difficultOnly) list = list.filter((w) => difficult.includes(w.id));
    return list;
  }, [deck, category, difficultOnly, difficult]);

  useEffect(() => {
    if (index >= filtered.length) setIndex(0);
  }, [filtered.length, index]);

  const card = filtered.length ? filtered[index % filtered.length] : undefined;

  const reshuffle = () => {
    setDeck(shuffle(words));
    setIndex(0);
    setFlipped(false);
  };

  const next = () => {
    if (!filtered.length) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % filtered.length);
    addXp(2);
  };

  const prev = () => {
    if (!filtered.length) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + filtered.length) % filtered.length);
  };

  if (!card) {
    return (
      <div className="page-enter mx-auto max-w-lg px-1 py-12 text-center sm:py-16">
        <p className="text-[var(--muted-foreground)]">
          No difficult words yet. Mark some cards first.
        </p>
        <button
          type="button"
          onClick={() => setDifficultOnly(false)}
          className="mt-4 rounded-full bg-spring px-5 py-2.5 text-sm font-semibold text-[#052e16]"
        >
          Show all cards
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-2xl px-1 pb-8 pt-6 sm:px-2 sm:py-10">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-spring uppercase">
            Flashcards
          </p>
          <h1 className="font-display mt-1 text-2xl font-semibold text-[var(--foreground)]">
            Flip & remember
          </h1>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          {index + 1} / {filtered.length}
        </p>
      </header>

      <div className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setIndex(0);
              setFlipped(false);
            }}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition",
              category === c
                ? "bg-spring text-[#052e16]"
                : "bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reshuffle}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)]"
        >
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </button>
        <button
          type="button"
          onClick={() => {
            setDifficultOnly((v) => !v);
            setIndex(0);
            setFlipped(false);
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
            difficultOnly
              ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-300"
              : "border-[var(--border)] text-[var(--foreground)]",
          )}
        >
          <RotateCcw className="h-3.5 w-3.5" /> Difficult only
        </button>
      </div>

      {/* Reliable flip: no bg-ink (broken in dark mode) */}
      <div className="relative" style={{ perspective: "1400px" }}>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="relative block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
          aria-label={flipped ? "Show word" : "Show translation"}
        >
          <motion.div
            className="relative h-[320px] w-full sm:h-[360px]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* FRONT — English word */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-[1.75rem] border border-[var(--border)] p-6 shadow-[var(--shadow-lift)] sm:p-8"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                background: "var(--surface-elevated)",
                color: "var(--foreground)",
              }}
            >
              <motion.span
                key={card.id + "-emoji"}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl"
                aria-hidden
              >
                {card.imageEmoji}
              </motion.span>
              <p className="font-display mt-5 text-2xl font-semibold sm:mt-6 sm:text-3xl">
                {card.word}
              </p>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {card.phonetic}
              </p>
              <p className="mt-6 text-xs text-[var(--muted-foreground)]">
                Tap to flip
              </p>
            </div>

            {/* BACK — always dark surface + light text (theme-proof) */}
            <div
              className="absolute inset-0 flex flex-col justify-center rounded-[1.75rem] border border-spring/30 p-6 shadow-[var(--shadow-lift)] sm:p-8"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background:
                  "linear-gradient(160deg, #0c1a14 0%, #102820 55%, #0a1620 100%)",
                color: "#f8fafc",
              }}
            >
              <p className="text-sm font-medium text-[#4ade80]">{card.category}</p>
              <p className="font-display mt-2 text-xl font-semibold text-white sm:text-2xl">
                {card.translation}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-white/80 italic sm:mt-6">
                “{card.example}”
              </p>
              <p className="mt-2 text-xs text-white/55">{card.exampleTranslation}</p>
              <p className="mt-6 text-xs text-white/35">Tap to flip back</p>
            </div>
          </motion.div>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={prev}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)] transition active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              speak(card.word);
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-spring text-[#052e16] shadow-[var(--shadow-glow)] transition active:scale-95"
            aria-label="Pronounce"
          >
            <Volume2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => toggleFavorite(card.id)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95",
              favorites.includes(card.id)
                ? "border-rose-400 bg-rose-500/20 text-rose-500"
                : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)]",
            )}
            aria-label="Favorite"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                favorites.includes(card.id) && "fill-current",
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => toggleDifficult(card.id)}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95",
              difficult.includes(card.id)
                ? "border-amber-400 bg-amber-500/20 text-amber-500"
                : "border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground)]",
            )}
            aria-label="Mark difficult"
          >
            <AlertTriangle className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={next}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-spring text-[#052e16] shadow-[var(--shadow-glow)] transition active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-center text-xs text-[var(--muted-foreground)]"
          >
            Synonyms: {card.synonyms.slice(0, 3).join(", ") || "—"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

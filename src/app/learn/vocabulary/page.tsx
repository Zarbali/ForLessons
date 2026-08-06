"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Volume2, Heart, Bookmark } from "lucide-react";
import { words, type Word } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

export default function VocabularyPage() {
  const { favorites, toggleFavorite, toggleBookmark, progress } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Word | null>(words[0] ?? null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(words.map((w) => w.category))).sort()],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (category !== "All" && w.category !== category) return false;
      if (!q) return true;
      return (
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q) ||
        w.example.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Vocabulary
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          Word library
        </h1>
      </header>

      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search words, translations…"
          className="w-full rounded-2xl border border-ink/10 bg-white/80 py-3 pr-4 pl-10 text-sm outline-none focus:border-spring dark:border-white/10 dark:bg-ink/50"
        />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              category === c
                ? "bg-ink text-white dark:bg-spring dark:text-[#052e16]"
                : "bg-ink/5 dark:bg-white/10",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <ul className="max-h-[70vh] space-y-1 overflow-y-auto rounded-3xl border border-ink/8 bg-white/60 p-2 dark:border-white/10 dark:bg-ink/40">
          {filtered.map((w) => (
            <li key={w.id}>
              <button
                type="button"
                onClick={() => setSelected(w)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition",
                  selected?.id === w.id
                    ? "bg-spring/15"
                    : "hover:bg-ink/5 dark:hover:bg-white/5",
                )}
              >
                <span className="text-xl" aria-hidden>
                  {w.imageEmoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink dark:text-white">
                    {w.word}
                  </span>
                  <span className="block truncate text-xs text-ink/45 dark:text-white/45">
                    {w.translation} · {w.category}
                  </span>
                </span>
                <span className="text-[10px] text-ink/30">
                  {"★".repeat(w.difficulty)}
                </span>
              </button>
            </li>
          ))}
          {!filtered.length && (
            <li className="px-4 py-8 text-center text-sm text-ink/45">
              No matches
            </li>
          )}
        </ul>

        {selected && (
          <motion.aside
            key={selected.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-ink/8 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-ink/50"
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl">{selected.imageEmoji}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => speak(selected.word)}
                  className="rounded-full bg-ink p-2.5 text-white dark:bg-spring dark:text-[#052e16]"
                  aria-label="Speak word"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavorite(selected.id)}
                  className={cn(
                    "rounded-full border p-2.5",
                    favorites.includes(selected.id) &&
                      "border-rose-400 text-rose-500",
                  )}
                  aria-label="Favorite"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      favorites.includes(selected.id) && "fill-current",
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => toggleBookmark(selected.id)}
                  className={cn(
                    "rounded-full border p-2.5",
                    progress.bookmarks.includes(selected.id) &&
                      "border-spring text-spring",
                  )}
                  aria-label="Bookmark"
                >
                  <Bookmark
                    className={cn(
                      "h-4 w-4",
                      progress.bookmarks.includes(selected.id) && "fill-current",
                    )}
                  />
                </button>
              </div>
            </div>
            <h2 className="font-display mt-4 text-2xl font-semibold text-ink dark:text-white">
              {selected.word}
            </h2>
            <p className="text-sm text-ink/45">{selected.phonetic}</p>
            <p className="mt-2 text-lg text-ink/80 dark:text-white/80">
              {selected.translation}
            </p>
            <p className="mt-1 text-xs text-spring">
              {selected.category} · Level {selected.difficulty}
            </p>

            <div className="mt-5 space-y-3 border-t border-ink/8 pt-5 dark:border-white/10">
              <div>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Example
                </p>
                <p className="mt-1 text-sm italic dark:text-white/80">
                  “{selected.example}”
                </p>
                <p className="text-xs text-ink/40">{selected.exampleTranslation}</p>
                <button
                  type="button"
                  onClick={() => speak(selected.example, { rate: 0.9 })}
                  className="mt-2 text-xs font-medium text-spring"
                >
                  Hear example
                </button>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Synonyms
                </p>
                <p className="mt-1 text-sm">{selected.synonyms.join(", ") || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Antonyms
                </p>
                <p className="mt-1 text-sm">{selected.antonyms.join(", ") || "—"}</p>
              </div>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
}

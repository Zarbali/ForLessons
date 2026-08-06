"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { stories } from "@/lib/data/stories";
import { useApp } from "@/context/AppProvider";
import { cn } from "@/lib/utils";

export default function ReadingPage() {
  const { addXp, completeLesson } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<number | "all">("all");
  const [tooltip, setTooltip] = useState<{
    word: string;
    gloss: string;
    x: number;
    y: number;
  } | null>(null);

  const filtered = useMemo(() => {
    if (difficulty === "all") return stories;
    return stories.filter((s) => s.difficulty === difficulty);
  }, [difficulty]);

  const story = stories.find((s) => s.id === activeId);

  const renderParagraph = (text: string, gloss: Record<string, string>) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, i) => {
      const clean = part.replace(/[^\w'-]/gi, "").toLowerCase();
      const glossHit =
        gloss[clean] ||
        gloss[part.replace(/[^\w'-]/gi, "")] ||
        Object.entries(gloss).find(
          ([k]) => k.toLowerCase() === clean,
        )?.[1];

      if (glossHit && clean) {
        return (
          <button
            key={i}
            type="button"
            className="rounded-sm text-spring underline decoration-spring/30 decoration-dotted underline-offset-2 transition hover:bg-spring/15"
            onClick={(e) => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              setTooltip({
                word: part.trim(),
                gloss: glossHit,
                x: rect.left + rect.width / 2,
                y: rect.top,
              });
              addXp(1);
            }}
          >
            {part}
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (story) {
    const paragraphs: string[] = Array.isArray(story.content)
      ? story.content
      : String(story.content).split(/\n\n+/);
    const gloss = story.gloss ?? story.vocabulary ?? {};

    return (
      <div className="relative mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <button
          type="button"
          onClick={() => {
            setActiveId(null);
            setTooltip(null);
          }}
          className="mb-6 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-spring"
        >
          <ChevronLeft className="h-4 w-4" /> Stories
        </button>

        <p className="text-xs text-spring uppercase">
          Level {story.difficulty}
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          {story.title}
        </h1>
        <p className="mt-2 text-xs text-ink/40">
          Tap highlighted words for translation
        </p>

        <article className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85 dark:text-white/85">
          {paragraphs.map((p, i) => (
            <p key={i}>{renderParagraph(p, gloss)}</p>
          ))}
        </article>

        <button
          type="button"
          onClick={() => completeLesson(`story-${story.id}`)}
          className="mt-10 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16]"
        >
          Mark as read
        </button>

        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed z-50 -translate-x-1/2 -translate-y-full rounded-xl bg-ink px-3 py-2 text-sm text-white shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y - 8 }}
            role="tooltip"
          >
            <strong className="text-spring">{tooltip.word}</strong>
            <span className="mx-1.5 text-white/40">·</span>
            {tooltip.gloss}
            <button
              type="button"
              className="ml-2 text-xs text-white/50"
              onClick={() => setTooltip(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Reading
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          Stories
        </h1>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDifficulty("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium",
            difficulty === "all"
              ? "bg-ink text-white dark:bg-spring dark:text-[#052e16]"
              : "bg-ink/5 dark:bg-white/10",
          )}
        >
          All
        </button>
        {[1, 2, 3, 4, 5].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDifficulty(d)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium",
              difficulty === d
                ? "bg-ink text-white dark:bg-spring dark:text-[#052e16]"
                : "bg-ink/5 dark:bg-white/10",
            )}
          >
            Level {d}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setActiveId(s.id)}
            className="rounded-3xl border border-ink/8 bg-white/80 p-5 text-left transition hover:border-spring/30 dark:border-white/10 dark:bg-ink/40"
          >
            <span className="text-xs text-spring">Level {s.difficulty}</span>
            <span className="font-display mt-1 block text-xl font-semibold text-ink dark:text-white">
              {s.title}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

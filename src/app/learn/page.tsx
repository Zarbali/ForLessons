"use client";

import {
  Layers,
  BookA,
  SpellCheck2,
  Headphones,
  BookOpen,
  PenLine,
  Mic,
} from "lucide-react";
import { ModeCard } from "@/components/learn/ModeCard";
import { motion } from "framer-motion";
import { words } from "@/lib/data/words";
import { grammarLessons } from "@/lib/data/grammar";

const modes = [
  {
    href: "/learn/flashcards",
    title: "Flashcards",
    description: "Flip, listen, and master words with spaced visual memory.",
    icon: Layers,
  },
  {
    href: "/learn/vocabulary",
    title: "Vocabulary",
    description: "Browse categories with synonyms, examples, and audio.",
    icon: BookA,
  },
  {
    href: "/learn/grammar",
    title: "Grammar",
    description: "Interactive lessons with instant exercise feedback.",
    icon: SpellCheck2,
  },
  {
    href: "/learn/listening",
    title: "Listening",
    description: "British & American voices, speed control, transcripts.",
    icon: Headphones,
  },
  {
    href: "/learn/reading",
    title: "Reading",
    description: "Stories with tap-to-translate gloss for every key word.",
    icon: BookOpen,
  },
  {
    href: "/learn/writing",
    title: "Writing",
    description: "Practice sentences with tips, vocab hints, and a score.",
    icon: PenLine,
  },
  {
    href: "/learn/speaking",
    title: "Speaking",
    description: "Speech recognition, pronunciation scores, conversations.",
    icon: Mic,
  },
];

export default function LearnHubPage() {
  return (
    <div className="page-enter mx-auto max-w-5xl px-1 py-6 sm:px-2 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-10"
      >
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Learn
        </p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-[var(--foreground)] sm:text-4xl">
          Choose your mode
        </h1>
        <p className="mt-2 max-w-lg text-sm text-[var(--muted-foreground)] sm:text-base">
          {words.length}+ words · {grammarLessons.length} grammar lessons · mix
          modes and earn XP on this device.
        </p>
      </motion.header>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {modes.map((mode, i) => (
          <ModeCard key={mode.href} {...mode} index={i} />
        ))}
      </div>
    </div>
  );
}

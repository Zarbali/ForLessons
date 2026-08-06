"use client";

import {
  LayoutGrid,
  Link2,
  Ghost,
  Puzzle,
  Zap,
  AlignLeft,
  Keyboard,
  Headphones,
  ImageIcon,
  Grid3X3,
  Search,
  CalendarDays,
} from "lucide-react";
import { ModeCard } from "@/components/learn/ModeCard";
import { motion } from "framer-motion";
import { words } from "@/lib/data/words";

const games = [
  {
    href: "/games/memory",
    title: "Memory Cards",
    description: "Match words with their translations.",
    icon: LayoutGrid,
  },
  {
    href: "/games/match",
    title: "Word Match",
    description: "Connect English words to meanings fast.",
    icon: Link2,
  },
  {
    href: "/games/hangman",
    title: "Hangman",
    description: "Guess the word letter by letter.",
    icon: Ghost,
  },
  {
    href: "/games/builder",
    title: "Word Builder",
    description: "Unscramble letters to form the word.",
    icon: Puzzle,
  },
  {
    href: "/games/speed",
    title: "Speed Challenge",
    description: "Race the clock — pick the right meaning.",
    icon: Zap,
  },
  {
    href: "/games/sentence",
    title: "Sentence Builder",
    description: "Arrange words into a correct sentence.",
    icon: AlignLeft,
  },
  {
    href: "/games/typing",
    title: "Typing Challenge",
    description: "Type what you hear and see accurately.",
    icon: Keyboard,
  },
  {
    href: "/games/listening-challenge",
    title: "Listening Challenge",
    description: "Hear a word, choose the spelling.",
    icon: Headphones,
  },
  {
    href: "/games/image-guess",
    title: "Image Guess",
    description: "Guess the word from an emoji clue.",
    icon: ImageIcon,
  },
  {
    href: "/games/crossword",
    title: "Crossword",
    description: "A tiny crossword from your vocab.",
    icon: Grid3X3,
  },
  {
    href: "/games/wordsearch",
    title: "Word Search",
    description: "Find hidden words in the grid.",
    icon: Search,
  },
  {
    href: "/games/daily",
    title: "Daily Challenge",
    description: "A mixed mini-quest that resets daily.",
    icon: CalendarDays,
  },
];

export default function GamesHubPage() {
  return (
    <div className="page-enter mx-auto max-w-5xl px-1 py-6 sm:px-2 sm:py-12">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-10"
      >
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Games
        </p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-[var(--foreground)] sm:text-4xl">
          Play to remember
        </h1>
        <p className="mt-2 max-w-lg text-sm text-[var(--muted-foreground)] sm:text-base">
          {words.length}+ words · combos · confetti. Every win earns XP — keep
          the streak alive.
        </p>
      </motion.header>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {games.map((g, i) => (
          <ModeCard key={g.href} {...g} index={i} />
        ))}
      </div>
    </div>
  );
}

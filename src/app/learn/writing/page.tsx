"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrate } from "@/lib/confetti";
import { pickRandom, shuffle } from "@/lib/utils";

const COMMON_MISTAKES: { pattern: RegExp; tip: string }[] = [
  { pattern: /\bi\b/, tip: 'Capitalize the pronoun "I".' },
  { pattern: /\bteh\b/i, tip: 'Did you mean "the"?' },
  { pattern: /\bdont\b/i, tip: 'Use an apostrophe: "don\'t".' },
  { pattern: /\bcant\b/i, tip: 'Use an apostrophe: "can\'t".' },
  { pattern: /\bim\b/i, tip: 'Use an apostrophe: "I\'m".' },
  { pattern: /\bits\s+(a|the|my|an)\b/i, tip: 'Check "its" (possessive) vs "it\'s" (it is).' },
  { pattern: /\byour\s+(welcome|right|going)\b/i, tip: 'Maybe you need "you\'re" (you are)?' },
  { pattern: /\btheir\s+(is|are|was)\b/i, tip: 'Maybe you need "there"?' },
  { pattern: /\bgoed\b/i, tip: 'Past of go is "went".' },
  { pattern: /\bbuyed\b/i, tip: 'Past of buy is "bought".' },
];

type Feedback = {
  score: number;
  tips: string[];
  suggestions: string[];
};

function analyze(text: string): Feedback {
  const tips: string[] = [];
  const trimmed = text.trim();
  if (!trimmed) {
    return { score: 0, tips: ["Write something first."], suggestions: [] };
  }

  if (trimmed[0] !== trimmed[0]?.toUpperCase()) {
    tips.push("Start with a capital letter.");
  }
  if (!/[.!?]$/.test(trimmed)) {
    tips.push("End with punctuation (. ! or ?).");
  }
  if (trimmed.length < 20) {
    tips.push("Try writing a longer sentence (20+ characters).");
  }
  if (!/\b(the|a|an|is|are|was|were|have|has|will|can|to)\b/i.test(trimmed)) {
    tips.push("Include common function words for more natural English.");
  }

  for (const m of COMMON_MISTAKES) {
    if (m.pattern.test(trimmed)) tips.push(m.tip);
  }

  const tokens = trimmed.toLowerCase().split(/\W+/).filter(Boolean);
  const bank = shuffle(words).slice(0, 40);
  const suggestions = bank
    .filter((w) => !tokens.includes(w.word.toLowerCase()))
    .slice(0, 5)
    .map((w) => w.word);

  let score = 55;
  score += Math.min(25, Math.floor(trimmed.length / 8));
  score -= tips.length * 8;
  if (/[.!?]$/.test(trimmed)) score += 8;
  if (/^[A-Z]/.test(trimmed)) score += 7;
  score = Math.max(0, Math.min(100, score));

  return { score, tips: tips.length ? tips : ["Looking solid — nice work!"], suggestions };
}

const prompts = [
  "Describe your morning routine in 3–4 sentences.",
  "Write about a place you want to visit and why.",
  "Explain a hobby you enjoy.",
  "Write a short email thanking a friend.",
];

export default function WritingPage() {
  const { addXp, completeLesson } = useApp();
  const [prompt] = useState(() => pickRandom(prompts));
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const wordCount = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean).length,
    [text],
  );

  const submit = () => {
    const fb = analyze(text);
    setFeedback(fb);
    addXp(Math.max(5, Math.floor(fb.score / 10)));
    if (fb.score >= 70) {
      completeLesson("writing-practice");
      celebrate({ particleCount: 80 });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Writing
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          Put it into words
        </h1>
      </header>

      <div className="rounded-3xl border border-spring/25 bg-spring/10 p-4 text-sm text-[#052e16] dark:text-white">
        <p className="text-xs font-semibold text-spring uppercase">Prompt</p>
        <p className="mt-1">{prompt}</p>
      </div>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setFeedback(null);
        }}
        rows={8}
        placeholder="Start writing here…"
        className="mt-5 w-full resize-y rounded-3xl border border-ink/10 bg-white/80 p-5 text-base leading-relaxed outline-none focus:border-spring dark:border-white/10 dark:bg-ink/50 dark:text-white"
      />
      <div className="mt-2 flex justify-between text-xs text-ink/40">
        <span>{wordCount} words</span>
        <span>Rule-based tips · no account needed</span>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={!text.trim()}
        className="mt-5 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] disabled:opacity-40"
      >
        Get feedback
      </button>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-3xl border border-ink/8 bg-white p-6 dark:border-white/10 dark:bg-ink/50"
        >
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">Score</h2>
            <p className="font-display text-4xl font-semibold text-spring">
              {feedback.score}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
            <motion.div
              className="h-full bg-spring"
              initial={{ width: 0 }}
              animate={{ width: `${feedback.score}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <h3 className="mt-6 text-xs font-semibold tracking-wide text-ink/40 uppercase">
            Tips
          </h3>
          <ul className="mt-2 space-y-2">
            {feedback.tips.map((t, i) => (
              <li key={i} className="text-sm text-ink/75 dark:text-white/75">
                · {t}
              </li>
            ))}
          </ul>

          {feedback.suggestions.length > 0 && (
            <>
              <h3 className="mt-6 text-xs font-semibold tracking-wide text-ink/40 uppercase">
                Vocabulary ideas
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {feedback.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setText((t) => (t ? `${t} ${s}` : s))}
                    className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium dark:bg-white/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}

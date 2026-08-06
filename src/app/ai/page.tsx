"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { words } from "@/lib/data/words";
import { grammarLessons } from "@/lib/data/grammar";
import { shuffle, pickRandom } from "@/lib/utils";

type Msg = { role: "user" | "ai"; text: string };

function typingDelay(text: string) {
  return Math.min(1800, 400 + text.length * 8);
}

function respond(input: string): string {
  const q = input.toLowerCase().trim();

  if (!q) return "Ask me about grammar, vocabulary, quizzes, or mistakes.";

  if (/quiz|test|exercise/.test(q)) {
    const sample = shuffle(words).slice(0, 4);
    return [
      "Here's a mini quiz from your Veronika word bank:",
      ...sample.map(
        (w, i) =>
          `${i + 1}. What does “${w.word}” mean?\n   Hint: category ${w.category} · ${w.imageEmoji}`,
      ),
      "Reply with your answers and I’ll explain!",
    ].join("\n\n");
  }

  if (/flashcard|cards/.test(q)) {
    const pack = shuffle(words).slice(0, 5);
    return [
      "Flashcard pack ready:",
      ...pack.map(
        (w) =>
          `• ${w.imageEmoji} ${w.word} (${w.phonetic}) → ${w.translation}\n  e.g. ${w.example}`,
      ),
    ].join("\n\n");
  }

  if (/vocab|vocabulary|words|list/.test(q)) {
    const catMatch = words.find((w) =>
      q.includes(w.category.toLowerCase()),
    )?.category;
    const pool = catMatch
      ? words.filter((w) => w.category === catMatch)
      : shuffle(words).slice(0, 8);
    const list = (catMatch ? shuffle(pool).slice(0, 8) : pool);
    return [
      catMatch
        ? `Vocabulary list · ${catMatch}:`
        : "Here's a mixed vocabulary list:",
      ...list.map((w) => `• ${w.word} — ${w.translation}`),
    ].join("\n");
  }

  if (/grammar|tense|article|preposition|present|past|conditional/.test(q)) {
    const lesson =
      grammarLessons.find((l) =>
        q.includes(l.title.toLowerCase().split(" ")[0]!),
      ) ?? pickRandom(grammarLessons);
    return [
      `${lesson.illustration} ${lesson.title} (${lesson.level})`,
      "",
      lesson.explanation,
      "",
      "Examples:",
      ...lesson.examples.map((e) => `• ${e}`),
      "",
      "Try this: " + lesson.exercises[0]?.question,
      "Options: " + (lesson.exercises[0]?.options.join(" / ") ?? ""),
    ].join("\n");
  }

  if (/mistake|wrong|error|correct|fix/.test(q)) {
    return [
      "Common mistake patterns I watch for:",
      "• Capitalize “I” and sentence starts",
      "• Don’t forget ending punctuation",
      "• its vs it’s, your vs you’re, their/there/they’re",
      "• Irregular past: go→went, buy→bought",
      "",
      "Paste a sentence and I’ll give rule-based tips (no account needed).",
    ].join("\n");
  }

  if (/hello|hi|hey|help/.test(q)) {
    return "Hi — I’m your on-device Veronika tutor. Ask me to explain grammar, generate a quiz, make flashcards, build a vocab list, or review mistakes.";
  }

  // word lookup
  const found = words.find(
    (w) =>
      w.word.toLowerCase() === q ||
      q.includes(w.word.toLowerCase()) ||
      w.translation.toLowerCase() === q,
  );
  if (found) {
    return [
      `${found.imageEmoji} ${found.word} ${found.phonetic}`,
      found.translation,
      `Category: ${found.category} · Difficulty ${found.difficulty}`,
      `Example: ${found.example}`,
      `Synonyms: ${found.synonyms.join(", ") || "—"}`,
    ].join("\n");
  }

  return [
    "I work offline with pattern matching — try phrases like:",
    "• “explain present perfect”",
    "• “generate a quiz”",
    "• “flashcards for travel”",
    "• “vocabulary list business”",
    "• “fix my mistakes”",
    "• or type any word from the library",
  ].join("\n");
}

const suggestions = [
  "Explain present perfect",
  "Generate a quiz",
  "Make flashcards",
  "Travel vocabulary list",
  "Help with mistakes",
];

export default function AIPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "I’m your Smart AI teacher — no API key, all on-device. What shall we practice?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setTyping(true);
    const reply = respond(trimmed);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: reply }]);
      setTyping(false);
    }, typingDelay(reply));
  };

  return (
    <div className="mx-auto flex h-[calc(100svh-8rem)] max-w-2xl flex-col px-5 py-8 sm:px-8">
      <header className="mb-4 shrink-0">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Smart AI
        </p>
        <h1 className="font-display mt-1 flex items-center gap-2 text-3xl font-semibold text-ink dark:text-white">
          <Bot className="h-7 w-7 text-spring" /> Teacher
        </h1>
        <p className="mt-1 text-sm text-ink/50">
          Pattern-matched tutor · local data only
        </p>
      </header>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-3xl border border-ink/8 bg-white/50 p-4 dark:border-white/10 dark:bg-ink/40">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              m.role === "user"
                ? "ml-8 rounded-2xl bg-ink px-4 py-3 text-sm whitespace-pre-wrap text-white"
                : "mr-8 rounded-2xl bg-spring/15 px-4 py-3 text-sm whitespace-pre-wrap text-[#052e16] dark:text-white"
            }
          >
            {m.text}
          </motion.div>
        ))}
        {typing && (
          <div className="mr-8 flex items-center gap-1 rounded-2xl bg-spring/10 px-4 py-3 text-sm text-[#052e16]/50">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-spring" />
            Thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-ink/10 px-3 py-1.5 text-xs dark:border-white/15"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about English…"
          className="flex-1 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm outline-none focus:border-spring dark:border-white/10 dark:bg-ink/50"
        />
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-spring text-[#052e16]"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

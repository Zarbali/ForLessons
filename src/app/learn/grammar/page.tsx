"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronLeft } from "lucide-react";
import { grammarLessons } from "@/lib/data/grammar";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, leadingEmoji, withoutLeadingEmoji } from "@/lib/utils";

export default function GrammarPage() {
  const { completeLesson, progress } = useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const lesson = grammarLessons.find((l) => l.id === activeId);

  const finish = () => {
    if (!lesson) return;
    setSubmitted(true);
    const correct = lesson.exercises.filter(
      (ex, i) => answers[i] === ex.answer,
    ).length;
    if (correct === lesson.exercises.length) {
      completeLesson(lesson.id);
      celebrateWin();
    } else {
      completeLesson(lesson.id);
    }
  };

  if (lesson) {
    const allAnswered = lesson.exercises.every((_, i) => answers[i] != null);
    const tip = withoutLeadingEmoji(lesson.illustration);

    return (
      <div className="mx-auto w-full min-w-0 max-w-2xl px-0 py-4 sm:px-2 sm:py-8">
        <button
          type="button"
          onClick={() => {
            setActiveId(null);
            setAnswers({});
            setSubmitted(false);
          }}
          className="mb-5 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-spring"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" /> All lessons
        </button>

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-spring/15 text-2xl">
          {leadingEmoji(lesson.illustration)}
        </div>
        <p className="text-xs font-semibold tracking-wide text-spring uppercase">
          {lesson.level}
        </p>
        <h1 className="font-display mt-1 text-balance break-words text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          {lesson.title}
        </h1>

        {tip ? (
          <p className="mt-3 break-words rounded-2xl border border-spring/20 bg-spring/10 px-3 py-2.5 text-sm leading-relaxed text-[#052e16] dark:text-white">
            {tip}
          </p>
        ) : null}

        <p className="mt-4 text-pretty break-words text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          {lesson.explanation}
        </p>

        <ul className="mt-5 space-y-2">
          {lesson.examples.map((ex, i) => (
            <li
              key={i}
              className="break-words rounded-2xl bg-spring/10 px-3 py-2.5 text-sm leading-relaxed text-[#052e16] sm:px-4 sm:py-3 dark:text-white"
            >
              {ex}
            </li>
          ))}
        </ul>

        <h2 className="font-display mt-8 text-lg font-semibold text-[var(--foreground)] sm:mt-10 sm:text-xl">
          Exercises
        </h2>
        <div className="mt-4 space-y-4 sm:space-y-6">
          {lesson.exercises.map((ex, i) => {
            const chosen = answers[i];
            const isCorrect = submitted && chosen === ex.answer;
            const isWrong = submitted && chosen != null && chosen !== ex.answer;

            return (
              <div
                key={i}
                className="min-w-0 rounded-2xl border border-[var(--border)] p-3.5 sm:rounded-3xl sm:p-5"
              >
                <p className="break-words text-sm font-medium text-[var(--foreground)] sm:text-base">
                  {i + 1}. {ex.question}
                </p>
                <div className="mt-3 grid gap-2">
                  {ex.options.map((opt, oi) => (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() =>
                        setAnswers((a) => ({ ...a, [i]: oi }))
                      }
                      className={cn(
                        "min-w-0 break-words rounded-xl border px-3 py-2.5 text-left text-sm transition",
                        chosen === oi && !submitted && "border-spring bg-spring/10",
                        submitted && oi === ex.answer && "border-spring bg-spring/20",
                        isWrong && chosen === oi && "border-rose-400 bg-rose-500/10",
                        chosen !== oi &&
                          !submitted &&
                          "border-[var(--border)] hover:border-[var(--border-strong)]",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <AnimatePresence>
                  {submitted && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={cn(
                        "mt-3 flex items-start gap-2 break-words text-sm",
                        isCorrect ? "text-spring" : "text-amber-600",
                      )}
                    >
                      {isCorrect ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      <span>{ex.explanation}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={finish}
            className="mt-6 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] disabled:opacity-40 sm:mt-8"
          >
            Check answers
          </button>
        ) : (
          <p className="mt-6 text-center text-sm text-[var(--muted-foreground)] sm:mt-8">
            Lesson saved · +XP added to your progress
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-3xl px-0 py-4 sm:px-2 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Grammar
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Interactive lessons
        </h1>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Short explanations, examples, and quick checks.
        </p>
      </header>

      <div className="grid gap-2.5 sm:gap-3">
        {grammarLessons.map((l, i) => {
          const done = progress.lessonsCompleted.includes(l.id);
          return (
            <motion.button
              key={l.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.4) }}
              onClick={() => {
                setActiveId(l.id);
                setAnswers({});
                setSubmitted(false);
              }}
              className="flex min-w-0 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-left transition hover:border-spring/30 sm:gap-4 sm:rounded-3xl sm:p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-spring/15 text-xl">
                {leadingEmoji(l.illustration)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold text-spring sm:text-xs">
                  {l.level}
                </span>
                <span className="font-display block truncate text-base font-semibold text-[var(--foreground)] sm:text-lg">
                  {l.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-[var(--muted-foreground)]">
                  {withoutLeadingEmoji(l.illustration) || l.explanation}
                </span>
              </span>
              {done ? (
                <span className="shrink-0 rounded-full bg-spring/20 px-2 py-1 text-[10px] font-semibold text-spring">
                  Done
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

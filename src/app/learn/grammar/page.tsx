"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronLeft } from "lucide-react";
import { grammarLessons } from "@/lib/data/grammar";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn } from "@/lib/utils";

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

    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8">
        <button
          type="button"
          onClick={() => {
            setActiveId(null);
            setAnswers({});
            setSubmitted(false);
          }}
          className="mb-6 inline-flex items-center gap-1 text-sm text-ink/50 hover:text-spring"
        >
          <ChevronLeft className="h-4 w-4" /> All lessons
        </button>

        <div className="mb-2 text-4xl" aria-hidden>
          {lesson.illustration}
        </div>
        <p className="text-xs font-semibold text-spring uppercase">{lesson.level}</p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          {lesson.title}
        </h1>
        <p className="mt-4 leading-relaxed text-ink/70 dark:text-white/70">
          {lesson.explanation}
        </p>

        <ul className="mt-6 space-y-2">
          {lesson.examples.map((ex, i) => (
            <li
              key={i}
              className="rounded-2xl bg-spring/10 px-4 py-3 text-sm text-[#052e16] dark:text-white"
            >
              {ex}
            </li>
          ))}
        </ul>

        <h2 className="font-display mt-10 text-xl font-semibold">Exercises</h2>
        <div className="mt-4 space-y-6">
          {lesson.exercises.map((ex, i) => {
            const chosen = answers[i];
            const isCorrect = submitted && chosen === ex.answer;
            const isWrong = submitted && chosen != null && chosen !== ex.answer;

            return (
              <div
                key={i}
                className="rounded-3xl border border-ink/8 p-5 dark:border-white/10"
              >
                <p className="font-medium text-ink dark:text-white">
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
                        "rounded-xl border px-3 py-2.5 text-left text-sm transition",
                        chosen === oi && !submitted && "border-spring bg-spring/10",
                        submitted && oi === ex.answer && "border-spring bg-spring/20",
                        isWrong && chosen === oi && "border-rose-400 bg-rose-500/10",
                        !chosen && !submitted && "border-ink/10 hover:border-ink/25 dark:border-white/10",
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
                        "mt-3 flex items-start gap-2 text-sm",
                        isCorrect ? "text-spring" : "text-amber-600",
                      )}
                    >
                      {isCorrect ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                      )}
                      {ex.explanation}
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
            className="mt-8 w-full rounded-full bg-spring py-3.5 text-sm font-semibold text-[#052e16] disabled:opacity-40"
          >
            Check answers
          </button>
        ) : (
          <p className="mt-8 text-center text-sm text-ink/55 dark:text-white/55">
            Lesson saved · +XP added to your progress
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Grammar
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          Interactive lessons
        </h1>
      </header>

      <div className="grid gap-3">
        {grammarLessons.map((l, i) => {
          const done = progress.lessonsCompleted.includes(l.id);
          return (
            <motion.button
              key={l.id}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => {
                setActiveId(l.id);
                setAnswers({});
                setSubmitted(false);
              }}
              className="flex items-center gap-4 rounded-3xl border border-ink/8 bg-white/80 p-4 text-left transition hover:border-spring/30 dark:border-white/10 dark:bg-ink/40"
            >
              <span className="text-3xl">{l.illustration}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-spring">{l.level}</span>
                <span className="font-display block text-lg font-semibold text-ink dark:text-white">
                  {l.title}
                </span>
              </span>
              {done && (
                <span className="rounded-full bg-spring/20 px-2.5 py-1 text-[10px] font-semibold text-spring">
                  Done
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

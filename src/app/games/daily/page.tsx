"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { speak } from "@/lib/speech";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { todayKey, shuffle } from "@/lib/utils";
import { Volume2 } from "lucide-react";

function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

export default function DailyChallengePage() {
  const { addXp, completeLesson } = useApp();
  const day = todayKey();
  const deck = useMemo(() => seededShuffle(words, day).slice(0, 5), [day]);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const current = deck[step];
  const options = useMemo(() => {
    if (!current) return [];
    const distractors = shuffle(words.filter((w) => w.id !== current.id))
      .slice(0, 3)
      .map((w) => w.translation);
    return shuffle([current.translation, ...distractors]);
  }, [current]);

  const answer = (opt: string) => {
    if (!current || done) return;
    const correct = opt === current.translation;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    if (correct) addXp(6);
    if (step + 1 >= deck.length) {
      setDone(true);
      completeLesson(`daily-${day}`);
      if (nextScore >= 4) celebrateWin();
      addXp(15);
    } else {
      setStep((s) => s + 1);
    }
  };

  if (!current && !done) {
    return (
      <GameShell title="Daily Challenge">
        <p>No words available.</p>
      </GameShell>
    );
  }

  return (
    <GameShell
      title="Daily Challenge"
      subtitle={`A fresh mix for ${day}. Same for everyone today.`}
    >
      {!done && current ? (
        <>
          <p className="mb-4 text-sm text-ink/45">
            Question {step + 1} / {deck.length}
          </p>
          <div className="rounded-3xl border border-ink/8 bg-white/80 p-6 text-center dark:border-white/10 dark:bg-ink/50">
            <p className="text-4xl">{current.imageEmoji}</p>
            <p className="font-display mt-3 text-2xl font-semibold">{current.word}</p>
            <button
              type="button"
              onClick={() => speak(current.word)}
              className="mt-3 inline-flex items-center gap-1 text-sm text-spring"
            >
              <Volume2 className="h-4 w-4" /> Hear
            </button>
          </div>
          <div className="mt-5 grid gap-2">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => answer(o)}
                className="rounded-2xl border border-ink/10 bg-white px-4 py-3 text-left text-sm dark:border-white/10 dark:bg-ink/40"
              >
                {o}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="font-display text-4xl font-semibold text-spring">
            {score}/{deck.length}
          </p>
          <p className="mt-2 text-sm text-ink/50">Come back tomorrow for a new set.</p>
        </div>
      )}
    </GameShell>
  );
}

"use client";

import { useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { speak } from "@/lib/speech";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { pickRandom, shuffle } from "@/lib/utils";
import { Volume2 } from "lucide-react";

export default function ListeningChallengePage() {
  const { addXp } = useApp();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(() => pickRandom(words));
  const [options, setOptions] = useState(() => makeOptions(current.id));
  const [done, setDone] = useState(false);

  function makeOptions(correctId: string) {
    const correct = words.find((w) => w.id === correctId)!;
    const others = shuffle(words.filter((w) => w.id !== correctId))
      .slice(0, 3)
      .map((w) => w.word);
    return shuffle([correct.word, ...others]);
  }

  const nextRound = (correct: boolean) => {
    const nextScore = score + (correct ? 1 : 0);
    if (correct) addXp(5);
    if (round + 1 >= 8) {
      setScore(nextScore);
      setDone(true);
      if (nextScore >= 6) {
        celebrateWin();
        addXp(20);
      }
      return;
    }
    setScore(nextScore);
    setRound((r) => r + 1);
    const w = pickRandom(words);
    setCurrent(w);
    setOptions(makeOptions(w.id));
  };

  return (
    <GameShell
      title="Listening Challenge"
      subtitle="Hear the word, pick the correct spelling."
    >
      {!done ? (
        <>
          <p className="mb-4 text-sm text-ink/45">
            Round {round + 1} / 8 · Score {score}
          </p>
          <button
            type="button"
            onClick={() => speak(current.word, { rate: 0.9 })}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-ink text-white shadow-lg dark:bg-spring dark:text-[#052e16]"
            aria-label="Play audio"
          >
            <Volume2 className="h-8 w-8" />
          </button>
          <p className="mt-3 text-center text-xs text-ink/40">Tap to hear</p>
          <div className="mt-8 grid gap-2">
            {options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => nextRound(o === current.word)}
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
            {score}/8
          </p>
          <button
            type="button"
            onClick={() => {
              setRound(0);
              setScore(0);
              setDone(false);
              const w = pickRandom(words);
              setCurrent(w);
              setOptions(makeOptions(w.id));
            }}
            className="mt-6 w-full rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
          >
            Play again
          </button>
        </div>
      )}
    </GameShell>
  );
}

"use client";

import { useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { speak } from "@/lib/speech";
import { useApp } from "@/context/AppProvider";
import { celebrate } from "@/lib/confetti";
import { pickRandom } from "@/lib/utils";
import { Volume2 } from "lucide-react";

export default function TypingPage() {
  const { addXp } = useApp();
  const [target, setTarget] = useState(() => pickRandom(words));
  const [value, setValue] = useState("");
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState("");

  const check = () => {
    const ok =
      value.trim().toLowerCase() === target.word.toLowerCase() ||
      value.trim().toLowerCase() === target.example.toLowerCase();
    if (ok) {
      const next = streak + 1;
      setStreak(next);
      addXp(8);
      setFeedback("Correct!");
      if (next % 3 === 0) celebrate({ particleCount: 60 });
      const w = pickRandom(words);
      setTarget(w);
      setValue("");
    } else {
      setStreak(0);
      setFeedback(`Try: ${target.word}`);
    }
  };

  return (
    <GameShell title="Typing Challenge" subtitle="Type the word you see (or hear).">
      <div className="rounded-3xl border border-ink/8 bg-white/80 p-6 text-center dark:border-white/10 dark:bg-ink/50">
        <p className="text-4xl" aria-hidden>
          {target.imageEmoji}
        </p>
        <p className="font-display mt-3 text-3xl font-semibold text-ink dark:text-white">
          {target.word}
        </p>
        <p className="mt-1 text-sm text-ink/45">{target.translation}</p>
        <button
          type="button"
          onClick={() => speak(target.word)}
          className="mt-4 inline-flex items-center gap-2 text-sm text-spring"
        >
          <Volume2 className="h-4 w-4" /> Hear
        </button>
      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        placeholder="Type here…"
        className="mt-6 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-center text-lg outline-none focus:border-spring dark:border-white/10 dark:bg-ink/40"
        autoCapitalize="off"
        autoCorrect="off"
      />
      <button
        type="button"
        onClick={check}
        className="mt-4 w-full rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
      >
        Submit
      </button>
      <p className="mt-4 text-center text-sm text-ink/50">
        Streak: {streak} {feedback && `· ${feedback}`}
      </p>
    </GameShell>
  );
}

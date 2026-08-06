"use client";

import { useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrate } from "@/lib/confetti";
import { pickRandom } from "@/lib/utils";

export default function ImageGuessPage() {
  const { addXp } = useApp();
  const [word, setWord] = useState(() => pickRandom(words));
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (guess.trim().toLowerCase() === word.word.toLowerCase()) {
      setMsg("Yes!");
      addXp(12);
      celebrate({ particleCount: 70 });
      setTimeout(() => {
        setWord(pickRandom(words));
        setGuess("");
        setHint(false);
        setMsg("");
      }, 800);
    } else {
      setMsg("Not that one — try again or reveal a hint.");
    }
  };

  return (
    <GameShell title="Image Guess" subtitle="What English word matches the emoji?">
      <div className="rounded-3xl border border-ink/8 bg-ink py-14 text-center dark:border-white/10">
        <span className="text-7xl" aria-hidden>
          {word.imageEmoji}
        </span>
      </div>
      {hint && (
        <p className="mt-4 text-center text-sm text-ink/50">
          Category: {word.category} · starts with “{word.word[0]}”
        </p>
      )}
      <input
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Your guess…"
        className="mt-6 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-center outline-none focus:border-spring dark:border-white/10 dark:bg-ink/40"
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setHint(true)}
          className="rounded-full border border-ink/10 px-4 py-3 text-sm dark:border-white/15"
        >
          Hint
        </button>
        <button
          type="button"
          onClick={submit}
          className="flex-1 rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
        >
          Guess
        </button>
      </div>
      {msg && <p className="mt-4 text-center text-sm text-spring">{msg}</p>}
    </GameShell>
  );
}

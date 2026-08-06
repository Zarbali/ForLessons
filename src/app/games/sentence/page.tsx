"use client";

import { useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, pickRandom, shuffle } from "@/lib/utils";

export default function SentenceBuilderPage() {
  const { addXp } = useApp();
  const [word, setWord] = useState(() => pickRandom(words));
  const sentence = word.example.replace(/[^\w\s']/g, "").trim();
  const tokens = sentence.split(/\s+/);
  const [pool, setPool] = useState(() => shuffle(tokens));
  const [built, setBuilt] = useState<string[]>([]);
  const [ok, setOk] = useState<boolean | null>(null);

  const reset = () => {
    const w = pickRandom(words);
    setWord(w);
    const s = w.example.replace(/[^\w\s']/g, "").trim().split(/\s+/);
    setPool(shuffle(s));
    setBuilt([]);
    setOk(null);
  };

  const pick = (i: number) => {
    const t = pool[i];
    if (!t) return;
    setPool((p) => p.filter((_, idx) => idx !== i));
    setBuilt((b) => [...b, t]);
    setOk(null);
  };

  const check = () => {
    const good = built.join(" ").toLowerCase() === tokens.join(" ").toLowerCase();
    setOk(good);
    if (good) {
      addXp(18);
      celebrateWin();
    }
  };

  return (
    <GameShell
      title="Sentence Builder"
      subtitle="Rebuild the example sentence."
    >
      <p className="mb-4 text-sm text-ink/50">
        Clue: {word.word} · {word.translation}
      </p>
      <div className="min-h-[56px] rounded-2xl border border-ink/10 bg-white/70 p-3 dark:bg-ink/40">
        <div className="flex flex-wrap gap-2">
          {built.map((t, i) => (
            <button
              key={`${t}-${i}`}
              type="button"
              onClick={() => {
                setBuilt((b) => b.filter((_, idx) => idx !== i));
                setPool((p) => [...p, t]);
              }}
              className="rounded-lg bg-spring/20 px-2.5 py-1.5 text-sm"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((t, i) => (
          <button
            key={`${t}-${i}`}
            type="button"
            onClick={() => pick(i)}
            className="rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-sm dark:border-white/15 dark:bg-ink/50"
          >
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={check}
          className="flex-1 rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
        >
          Check
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-ink/10 px-5 py-3 text-sm dark:border-white/15"
        >
          Next
        </button>
      </div>
      {ok != null && (
        <p className={cn("mt-4 text-center text-sm", ok ? "text-spring" : "text-rose-500")}>
          {ok ? "Perfect sentence!" : "Keep arranging…"}
        </p>
      )}
    </GameShell>
  );
}

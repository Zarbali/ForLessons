"use client";

import { useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { pickRandom, shuffle } from "@/lib/utils";

export default function BuilderPage() {
  const { addXp } = useApp();
  const [word, setWord] = useState(() => pickRandom(words));
  const letters = word.word.toLowerCase().replace(/[^a-z]/g, "");
  const [pool, setPool] = useState(() => shuffle(letters.split("")));
  const [built, setBuilt] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  const next = () => {
    const w = pickRandom(words);
    setWord(w);
    const L = w.word.toLowerCase().replace(/[^a-z]/g, "");
    setPool(shuffle(L.split("")));
    setBuilt([]);
    setMsg("");
  };

  const pick = (i: number) => {
    const letter = pool[i];
    if (!letter) return;
    setPool((p) => p.filter((_, idx) => idx !== i));
    setBuilt((b) => [...b, letter]);
  };

  const undo = () => {
    const last = built[built.length - 1];
    if (!last) return;
    setBuilt((b) => b.slice(0, -1));
    setPool((p) => [...p, last]);
  };

  const check = () => {
    const attempt = built.join("");
    if (attempt === letters) {
      setMsg("Correct!");
      addXp(15);
      celebrateWin();
    } else {
      setMsg("Not quite — try again.");
    }
  };

  return (
    <GameShell
      title="Word Builder"
      subtitle={`Unscramble · ${word.translation} ${word.imageEmoji}`}
    >
      <div className="min-h-[48px] rounded-2xl border border-dashed border-ink/20 bg-white/50 px-4 py-3 text-center font-display text-2xl tracking-widest dark:bg-ink/30">
        {built.join("") || "—"}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {pool.map((l, i) => (
          <button
            key={`${l}-${i}`}
            type="button"
            onClick={() => pick(i)}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-lg font-semibold uppercase text-white dark:bg-spring dark:text-[#052e16]"
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={undo}
          className="flex-1 rounded-full border border-ink/10 py-3 text-sm dark:border-white/15"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={check}
          className="flex-1 rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
        >
          Check
        </button>
      </div>
      {msg && <p className="mt-4 text-center text-sm text-spring">{msg}</p>}
      <button type="button" onClick={next} className="mt-4 w-full text-sm text-ink/40">
        Skip word
      </button>
    </GameShell>
  );
}

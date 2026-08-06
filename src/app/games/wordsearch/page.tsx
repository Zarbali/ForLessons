"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { cn, shuffle } from "@/lib/utils";

const SIZE = 10;

function placeWords(list: string[]) {
  const grid: string[][] = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ""),
  );
  const placed: string[] = [];

  for (const raw of list) {
    const word = raw.toUpperCase();
    const across = Math.random() > 0.5;
    for (let attempt = 0; attempt < 40; attempt++) {
      const row = Math.floor(Math.random() * SIZE);
      const col = Math.floor(Math.random() * SIZE);
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = across ? row : row + i;
        const c = across ? col + i : col;
        if (r >= SIZE || c >= SIZE) {
          ok = false;
          break;
        }
        const cell = grid[r]![c]!;
        if (cell && cell !== word[i]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) {
        const r = across ? row : row + i;
        const c = across ? col + i : col;
        grid[r]![c] = word[i]!;
      }
      placed.push(word);
      break;
    }
  }

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r]![c]) {
        grid[r]![c] = letters[Math.floor(Math.random() * 26)]!;
      }
    }
  }
  return { grid, placed };
}

export default function WordSearchPage() {
  const { addXp } = useApp();
  const targets = useMemo(
    () =>
      shuffle(words)
        .map((w) => w.word.toUpperCase().replace(/[^A-Z]/g, ""))
        .filter((w) => w.length >= 3 && w.length <= 7)
        .slice(0, 5),
    [],
  );
  const { grid, placed } = useMemo(() => placeWords(targets), [targets]);
  const [found, setFound] = useState<string[]>([]);
  const [selecting, setSelecting] = useState<{ r: number; c: number }[]>([]);

  const finishSelect = () => {
    if (selecting.length < 2) {
      setSelecting([]);
      return;
    }
    const word = selecting.map(({ r, c }) => grid[r]![c]).join("");
    const rev = word.split("").reverse().join("");
    const hit = placed.find((p) => p === word || p === rev);
    if (hit && !found.includes(hit)) {
      const next = [...found, hit];
      setFound(next);
      addXp(8);
      if (next.length === placed.length) {
        celebrateWin();
        addXp(20);
      }
    }
    setSelecting([]);
  };

  return (
    <GameShell title="Word Search" subtitle="Find the hidden vocabulary.">
      <div className="mb-4 flex flex-wrap gap-2">
        {placed.map((w) => (
          <span
            key={w}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              found.includes(w)
                ? "bg-spring/20 text-spring line-through"
                : "bg-ink/5 dark:bg-white/10",
            )}
          >
            {w}
          </span>
        ))}
      </div>

      <div
        className="mx-auto grid w-fit touch-manipulation gap-0.5 select-none"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1.7rem)` }}
        onMouseLeave={finishSelect}
        onMouseUp={finishSelect}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const active = selecting.some((s) => s.r === r && s.c === c);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onMouseDown={() => setSelecting([{ r, c }])}
                onMouseEnter={() => {
                  if (selecting.length)
                    setSelecting((s) =>
                      s.some((x) => x.r === r && x.c === c)
                        ? s
                        : [...s, { r, c }],
                    );
                }}
                onClick={() => {
                  if (!selecting.length) setSelecting([{ r, c }]);
                }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-sm text-xs font-bold",
                  active
                    ? "bg-spring text-[#052e16]"
                    : "bg-white dark:bg-ink/50",
                )}
              >
                {letter}
              </button>
            );
          }),
        )}
      </div>
      <p className="mt-4 text-center text-xs text-ink/40">
        Drag across letters, then release to check
      </p>
      {found.length === placed.length && placed.length > 0 && (
        <p className="mt-4 text-center font-medium text-spring">All found!</p>
      )}
    </GameShell>
  );
}

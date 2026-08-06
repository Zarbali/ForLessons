"use client";

import { useMemo, useState } from "react";
import { GameShell } from "@/components/games/GameShell";
import { words } from "@/lib/data/words";
import { useApp } from "@/context/AppProvider";
import { celebrateWin } from "@/lib/confetti";
import { shuffle } from "@/lib/utils";

type Clue = { id: string; answer: string; clue: string; row: number; col: number; across: boolean };

function buildPuzzle(): { size: number; grid: (string | null)[][]; clues: Clue[] } {
  const picks = shuffle(words)
    .map((w) => ({
      ...w,
      clean: w.word.toUpperCase().replace(/[^A-Z]/g, ""),
    }))
    .filter((w) => w.clean.length >= 3 && w.clean.length <= 7)
    .slice(0, 4);

  const size = 9;
  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array(size).fill(null),
  );
  const clues: Clue[] = [];

  picks.forEach((w, i) => {
    const across = i % 2 === 0;
    const row = across ? 1 + i : 1 + (i % 3);
    const col = across ? 1 : 1 + (i % 2);
    let fits = true;
    for (let k = 0; k < w.clean.length; k++) {
      const r = across ? row : row + k;
      const c = across ? col + k : col;
      if (r >= size || c >= size) {
        fits = false;
        break;
      }
      const cell = grid[r]![c];
      if (cell && cell !== w.clean[k]) {
        fits = false;
        break;
      }
    }
    if (!fits) return;
    for (let k = 0; k < w.clean.length; k++) {
      const r = across ? row : row + k;
      const c = across ? col + k : col;
      grid[r]![c] = w.clean[k]!;
    }
    clues.push({
      id: w.id,
      answer: w.clean,
      clue: w.translation,
      row,
      col,
      across,
    });
  });

  return { size, grid, clues };
}

export default function CrosswordPage() {
  const { addXp } = useApp();
  const puzzle = useMemo(() => buildPuzzle(), []);
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const key = (r: number, c: number) => `${r}-${c}`;

  const check = () => {
    let all = true;
    for (let r = 0; r < puzzle.size; r++) {
      for (let c = 0; c < puzzle.size; c++) {
        const expected = puzzle.grid[r]![c];
        if (!expected) continue;
        if ((values[key(r, c)] || "").toUpperCase() !== expected) all = false;
      }
    }
    if (all) {
      setDone(true);
      addXp(30);
      celebrateWin();
    }
  };

  return (
    <GameShell title="Crossword" subtitle="Small puzzle from Veronika vocabulary.">
      <div className="w-full overflow-x-auto pb-1">
        <div
          className="mx-auto grid w-fit gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${puzzle.size}, minmax(1.5rem, 1.75rem))`,
          }}
        >
          {puzzle.grid.map((row, r) =>
            row.map((cell, c) =>
              cell ? (
                <input
                  key={key(r, c)}
                  maxLength={1}
                  value={values[key(r, c)] || ""}
                  onChange={(e) =>
                    setValues((v) => ({
                      ...v,
                      [key(r, c)]: e.target.value.replace(/[^a-zA-Z]/g, ""),
                    }))
                  }
                  className="h-6 w-6 rounded-sm border border-ink/20 bg-white text-center text-[11px] font-bold uppercase outline-none focus:border-spring sm:h-7 sm:w-7 sm:text-xs dark:bg-ink/60"
                />
              ) : (
                <div
                  key={key(r, c)}
                  className="h-6 w-6 rounded-sm bg-ink/10 sm:h-7 sm:w-7 dark:bg-white/5"
                />
              ),
            ),
          )}
        </div>
      </div>

      <ol className="mt-6 space-y-2 text-sm">
        {puzzle.clues.map((cl, i) => (
          <li key={cl.id}>
            <span className="font-semibold text-spring">{i + 1}.</span>{" "}
            {cl.across ? "Across" : "Down"} — {cl.clue} ({cl.answer.length})
          </li>
        ))}
      </ol>

      <button
        type="button"
        onClick={check}
        className="mt-6 w-full rounded-full bg-spring py-3 text-sm font-semibold text-[#052e16]"
      >
        Check puzzle
      </button>
      {done && (
        <p className="mt-3 text-center text-sm text-spring">Crossword complete!</p>
      )}
    </GameShell>
  );
}

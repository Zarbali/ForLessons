"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Flame, Star, Bookmark, StickyNote, Keyboard } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { words } from "@/lib/data/words";
import { todayKey, cn } from "@/lib/utils";
import { getJSON } from "@/lib/storage";

function ProgressRing({ value, size = 140 }: { value: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  const offset = c - (pct / 100) * c;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        className="text-ink/10 dark:text-white/10"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="text-spring"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function buildHeatmap(): { date: string; level: number }[] {
  const studyDays = getJSON<string[]>("lingua:studyDays", []);
  const set = new Set(studyDays);
  // Also infer from lastStudyDate patterns stored in progress — merge if present
  const days: { date: string; level: number }[] = [];
  const today = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = todayKey(d);
    days.push({ date: key, level: set.has(key) ? 2 : 0 });
  }
  return days;
}

export default function ProgressPage() {
  const { progress, favorites, difficult, updateNote } = useApp();
  const [noteKey, setNoteKey] = useState("general");
  const [noteDraft, setNoteDraft] = useState(progress.notes[noteKey] ?? "");
  const heatmap = useMemo(() => {
    const days = buildHeatmap();
    if (progress.lastStudyDate) {
      return days.map((d) =>
        d.date === progress.lastStudyDate ? { ...d, level: Math.max(d.level, 3) } : d,
      );
    }
    return days;
  }, [progress.lastStudyDate]);

  const goalPct = Math.min(
    100,
    Math.round((progress.dailyXp / Math.max(1, progress.dailyGoal)) * 100),
  );

  const favWords = words.filter((w) => favorites.includes(w.id));
  const bookmarked = words.filter((w) => progress.bookmarks.includes(w.id));

  useEffect(() => {
    if (!progress.lastStudyDate) return;
    const existing = getJSON<string[]>("lingua:studyDays", []);
    if (!existing.includes(progress.lastStudyDate)) {
      try {
        window.localStorage.setItem(
          "lingua:studyDays",
          JSON.stringify([...existing, progress.lastStudyDate].slice(-120)),
        );
      } catch {
        /* ignore */
      }
    }
  }, [progress.lastStudyDate]);

  return (
    <div className="page-enter mx-auto max-w-3xl px-1 py-6 sm:px-2 sm:py-10">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Progress
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-[var(--foreground)]">
          Your journey
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
          <span className="text-spring">♥</span>
          Сайт специально для моей любимой, удачи с учёбой)
        </p>
      </header>

      <div className="flex flex-col items-center gap-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-soft)] sm:flex-row sm:justify-between sm:p-8">
        <div className="relative">
          <ProgressRing value={goalPct} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {goalPct}%
            </span>
            <span className="text-[10px] tracking-wide text-[var(--muted-foreground)] uppercase">
              Daily
            </span>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 text-center sm:w-auto sm:text-left">
          <Stat label="XP" value={progress.xp} />
          <Stat
            label="Streak"
            value={progress.streak}
            icon={<Flame className="h-3.5 w-3.5 text-spring" />}
          />
          <Stat label="Lessons" value={progress.lessonsCompleted.length} />
          <Stat label="Today XP" value={progress.dailyXp} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">
          Study calendar
        </h2>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Last 12 weeks · local device
        </p>
        <div className="mt-4 flex flex-wrap gap-1">
          {heatmap.map((d) => (
            <div
              key={d.date}
              title={d.date}
              className={cn(
                "h-3 w-3 rounded-sm",
                d.level === 0 && "bg-ink/10 dark:bg-white/10",
                d.level === 2 && "bg-spring/50",
                d.level === 3 && "bg-spring",
              )}
            />
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-ink/8 p-5 dark:border-white/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Star className="h-4 w-4 text-spring" /> Favorites
          </h3>
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-sm">
            {favWords.length ? (
              favWords.map((w) => (
                <li key={w.id}>
                  {w.imageEmoji} {w.word}
                </li>
              ))
            ) : (
              <li className="text-ink/40">None yet</li>
            )}
          </ul>
          {difficult.length > 0 && (
            <p className="mt-3 text-xs text-amber-600">
              {difficult.length} marked difficult
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-ink/8 p-5 dark:border-white/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Bookmark className="h-4 w-4 text-spring" /> Bookmarks
          </h3>
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto text-sm">
            {bookmarked.length ? (
              bookmarked.map((w) => (
                <li key={w.id}>
                  {w.word} — {w.translation}
                </li>
              ))
            ) : (
              <li className="text-ink/40">None yet</li>
            )}
          </ul>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-ink/8 p-5 dark:border-white/10">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <StickyNote className="h-4 w-4 text-spring" /> Notes
        </h3>
        <input
          value={noteKey}
          onChange={(e) => {
            setNoteKey(e.target.value);
            setNoteDraft(progress.notes[e.target.value] ?? "");
          }}
          className="mt-3 w-full rounded-xl border border-ink/10 bg-transparent px-3 py-2 text-xs dark:border-white/10"
          placeholder="Note title key"
        />
        <textarea
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          rows={4}
          className="mt-2 w-full rounded-xl border border-ink/10 bg-transparent px-3 py-2 text-sm dark:border-white/10"
          placeholder="Write a study note…"
        />
        <button
          type="button"
          onClick={() => updateNote(noteKey || "general", noteDraft)}
          className="mt-2 rounded-full bg-spring px-4 py-2 text-xs font-semibold text-[#052e16]"
        >
          Save note
        </button>
      </section>

      <section className="mt-6 rounded-3xl border border-ink/8 bg-ink p-5 text-white dark:border-white/10">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-spring">
          <Keyboard className="h-4 w-4" /> Keyboard shortcuts
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-white/70">
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">h</kbd> —
            Home
          </li>
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">l</kbd> —
            Learn
          </li>
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd> —
            Games
          </li>
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">a</kbd> — AI
          </li>
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">f</kbd> —
            Focus
          </li>
          <li>
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">g</kbd>{" "}
            then{" "}
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-xs">p</kbd> —
            Progress
          </li>
          <li className="pt-1 text-white/40">
            Space — play/pause where games & listening support it
          </li>
        </ul>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[var(--surface-hover)] px-3 py-2.5">
      <p className="flex items-center justify-center gap-1 text-xs font-medium text-[var(--muted-foreground)] sm:justify-start">
        {icon}
        {label}
      </p>
      <motion.p
        className="font-display text-2xl font-semibold text-[var(--foreground)]"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {value}
      </motion.p>
    </div>
  );
}

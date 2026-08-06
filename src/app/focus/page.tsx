"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, Moon, Play, Pause, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { formatTime, cn } from "@/lib/utils";

type Mode = "pomodoro" | "study";

export default function FocusPage() {
  const { progress, addXp } = useApp();
  const [mode, setMode] = useState<Mode>("pomodoro");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [focusDim, setFocusDim] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const preset = mode === "pomodoro" ? 25 * 60 : 50 * 60;

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      addXp(mode === "pomodoro" ? 15 : 25);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds, addXp, mode]);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const reset = () => {
    setRunning(false);
    setSeconds(preset);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setRunning(false);
    setSeconds(m === "pomodoro" ? 25 * 60 : 50 * 60);
  };

  const toggleFs = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {});
    } else {
      await document.exitFullscreen().catch(() => {});
    }
  };

  const goalPct = Math.min(
    100,
    Math.round((progress.dailyXp / Math.max(1, progress.dailyGoal)) * 100),
  );

  return (
    <div className="page-enter relative mx-auto max-w-lg px-1 py-6 sm:px-2 sm:py-10">
      {focusDim && (
        <div className="pointer-events-none fixed inset-0 z-[40] bg-[#06140f]/85 backdrop-blur-md" />
      )}

      <div className={cn("relative", focusDim && "z-[45]")}>
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold tracking-widest text-spring uppercase">
            Focus
          </p>
          <h1
            className={cn(
              "font-display mt-1 text-2xl font-semibold sm:text-3xl",
              focusDim ? "text-white" : "text-ink dark:text-white",
            )}
          >
            Deep work
          </h1>
        </header>

        <div className="mb-6 flex gap-2">
          {(
            [
              ["pomodoro", "Pomodoro"],
              ["study", "Study 50"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => switchMode(id)}
              className={cn(
                "flex-1 rounded-full py-2.5 text-sm font-semibold transition",
                mode === id
                  ? "bg-spring text-[#052e16] shadow-[var(--shadow-glow)]"
                  : focusDim
                    ? "bg-white/10 text-white/70"
                    : "bg-ink/5 text-ink/70 dark:bg-white/10 dark:text-white/70",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <motion.div
          className="rounded-[2rem] border border-white/10 bg-ink px-6 py-12 text-center text-white shadow-2xl sm:py-14"
          animate={running ? { boxShadow: "0 0 60px rgba(34,197,94,0.25)" } : {}}
        >
          <motion.p
            key={seconds}
            initial={{ opacity: 0.7, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-display text-6xl font-semibold tracking-tight sm:text-7xl"
          >
            {formatTime(seconds)}
          </motion.p>
          <p className="mt-3 text-sm text-white/40">
            {mode === "pomodoro" ? "25-minute focus block" : "50-minute study block"}
          </p>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95",
              focusDim
                ? "border-white/20 text-white"
                : "border-ink/10 dark:border-white/15",
            )}
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-spring text-[#052e16] shadow-[0_0_30px_rgba(34,197,94,0.35)] transition active:scale-95"
            aria-label={running ? "Pause" : "Start"}
          >
            {running ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>
          <button
            type="button"
            onClick={toggleFs}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border transition active:scale-95",
              focusDim
                ? "border-white/20 text-white"
                : "border-ink/10 dark:border-white/15",
            )}
            aria-label="Fullscreen"
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setFocusDim((v) => !v)}
          className={cn(
            "mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm transition",
            focusDim
              ? "border-spring bg-spring/15 text-spring"
              : "border-ink/10 dark:border-white/15",
          )}
        >
          <Moon className="h-4 w-4" />
          Focus mode {focusDim ? "on" : "off"}
        </button>

        <div
          className={cn(
            "mt-8 rounded-3xl border p-5",
            focusDim
              ? "border-white/10 bg-white/5 text-white"
              : "border-ink/8 bg-white/70 dark:border-white/10 dark:bg-ink/40",
          )}
        >
          <div className="flex justify-between text-sm">
            <span className={focusDim ? "text-white/50" : "text-ink/50"}>Daily goal</span>
            <span className="font-medium">
              {progress.dailyXp} / {progress.dailyGoal} XP
            </span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <motion.div
              className="h-full rounded-full bg-spring"
              animate={{ width: `${goalPct}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 18 }}
            />
          </div>
          <p className={cn("mt-3 text-xs", focusDim ? "text-white/40" : "text-ink/40")}>
            Streak {progress.streak} days · Finish a timer to earn XP
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import confetti from "canvas-confetti";
import { getJSON, setJSON, StorageKeys } from "@/lib/storage";
import { todayKey } from "@/lib/utils";

export type ThemeMode = "light" | "dark";

export type ProgressState = {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  lessonsCompleted: string[];
  dailyGoal: number;
  dailyXp: number;
  bookmarks: string[];
  notes: Record<string, string>;
};

const DEFAULT_PROGRESS: ProgressState = {
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  lessonsCompleted: [],
  dailyGoal: 50,
  dailyXp: 0,
  bookmarks: [],
  notes: {},
};

type AppContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  favorites: string[];
  difficult: string[];
  progress: ProgressState;
  addXp: (amount: number) => void;
  toggleFavorite: (wordId: string) => void;
  toggleDifficult: (wordId: string) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  updateNote: (id: string, note: string) => void;
  toggleBookmark: (id: string) => void;
  hydrated: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

function applyThemeClass(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function nextStreak(prev: ProgressState, today: string): Pick<ProgressState, "streak" | "lastStudyDate" | "dailyXp"> {
  const yesterday = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return todayKey(d);
  })();

  if (prev.lastStudyDate === today) {
    return {
      streak: prev.streak,
      lastStudyDate: today,
      dailyXp: prev.dailyXp,
    };
  }

  const streak =
    prev.lastStudyDate === yesterday ? prev.streak + 1 : prev.lastStudyDate === null ? 1 : 1;

  return {
    streak: Math.max(1, streak),
    lastStudyDate: today,
    dailyXp: 0,
  };
}

function celebrate() {
  if (typeof window === "undefined") return;
  const prefersReduced =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  if (prefersReduced) return;

  confetti({
    particleCount: 90,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#22c55e", "#34d399", "#67e8f9", "#f8fafc", "#0f172a"],
  });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [difficult, setDifficult] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = getJSON<ThemeMode>(StorageKeys.theme, "light");
    const storedFavorites = getJSON<string[]>(StorageKeys.favorites, []);
    const storedDifficult = getJSON<string[]>(StorageKeys.difficult, []);
    const storedProgress = getJSON<ProgressState>(StorageKeys.progress, DEFAULT_PROGRESS);

    const today = todayKey();
    let progressValue = { ...DEFAULT_PROGRESS, ...storedProgress };

    // Reset daily XP if calendar day rolled over without study
    if (progressValue.lastStudyDate && progressValue.lastStudyDate !== today) {
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return todayKey(d);
      })();
      if (progressValue.lastStudyDate !== yesterday && progressValue.lastStudyDate !== today) {
        // streak break handled on next study; still reset dailyXp display
        progressValue = { ...progressValue, dailyXp: 0 };
      } else if (progressValue.lastStudyDate === yesterday) {
        progressValue = { ...progressValue, dailyXp: 0 };
      }
    }

    setThemeState(storedTheme);
    setFavorites(storedFavorites);
    setDifficult(storedDifficult);
    setProgress(progressValue);
    applyThemeClass(storedTheme);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(StorageKeys.theme, theme);
    applyThemeClass(theme);
  }, [theme, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(StorageKeys.favorites, favorites);
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(StorageKeys.difficult, difficult);
  }, [difficult, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(StorageKeys.progress, progress);
  }, [progress, hydrated]);

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const toggleFavorite = useCallback((wordId: string) => {
    setFavorites((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId],
    );
  }, []);

  const toggleDifficult = useCallback((wordId: string) => {
    setDifficult((prev) =>
      prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId],
    );
  }, []);

  const addXp = useCallback((amount: number) => {
    if (amount <= 0) return;
    const today = todayKey();
    setProgress((prev) => {
      const streakPatch = nextStreak(prev, today);
      return {
        ...prev,
        ...streakPatch,
        xp: prev.xp + amount,
        dailyXp: streakPatch.dailyXp + amount,
      };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, xpReward = 25) => {
    const today = todayKey();
    setProgress((prev) => {
      const already = prev.lessonsCompleted.includes(lessonId);
      const streakPatch = nextStreak(prev, today);
      const reward = already ? Math.max(5, Math.floor(xpReward / 4)) : xpReward;
      return {
        ...prev,
        ...streakPatch,
        xp: prev.xp + reward,
        dailyXp: streakPatch.dailyXp + reward,
        lessonsCompleted: already
          ? prev.lessonsCompleted
          : [...prev.lessonsCompleted, lessonId],
      };
    });
    celebrate();
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setProgress((prev) => {
      const notes = { ...prev.notes };
      if (!note.trim()) {
        delete notes[id];
      } else {
        notes[id] = note;
      }
      return { ...prev, notes };
    });
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.includes(id)
        ? prev.bookmarks.filter((b) => b !== id)
        : [...prev.bookmarks, id],
    }));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      favorites,
      difficult,
      progress,
      addXp,
      toggleFavorite,
      toggleDifficult,
      completeLesson,
      updateNote,
      toggleBookmark,
      hydrated,
    }),
    [
      theme,
      setTheme,
      toggleTheme,
      favorites,
      difficult,
      progress,
      addXp,
      toggleFavorite,
      toggleDifficult,
      completeLesson,
      updateNote,
      toggleBookmark,
      hydrated,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}

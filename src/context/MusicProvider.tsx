"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getJSON, setJSON, StorageKeys } from "@/lib/storage";
import {
  buildAmbient,
  type AmbientHandle,
  type AmbientTrackId,
} from "@/lib/ambient-audio";

export type { AmbientTrackId };

export type AmbientTrack = {
  id: AmbientTrackId;
  label: string;
  description: string;
  emoji: string;
};

export const AMBIENT_TRACKS: AmbientTrack[] = [
  { id: "rain", label: "Rain", description: "Soft rainfall on a window", emoji: "🌧️" },
  { id: "cafe", label: "Cafe", description: "Warm chatter & cups", emoji: "☕" },
  { id: "forest", label: "Forest", description: "Wind, leaves & birds", emoji: "🌲" },
  { id: "ocean", label: "Ocean", description: "Rolling shoreline waves", emoji: "🌊" },
  { id: "lofi", label: "Lo-fi", description: "Soft pads & vinyl crackle", emoji: "🎧" },
  { id: "whitenoise", label: "Focus", description: "Calm pink noise", emoji: "◯" },
];

export const EXTERNAL_MUSIC_LINKS = {
  spotify: "https://open.spotify.com/search/lofi%20study",
  apple: "https://music.apple.com/search?term=lofi%20study",
  youtube: "https://music.youtube.com/search?q=lofi%20study%20beats",
} as const;

type MusicPrefs = {
  trackId: AmbientTrackId;
  volume: number;
};

type MusicContextValue = {
  tracks: AmbientTrack[];
  currentTrack: AmbientTrack;
  isPlaying: boolean;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setTrack: (id: AmbientTrackId) => void;
  setVolume: (v: number) => void;
  externalLinks: typeof EXTERNAL_MUSIC_LINKS;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [trackId, setTrackId] = useState<AmbientTrackId>("rain");
  const [volume, setVolumeState] = useState(0.45);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const audioRef = useRef<AmbientHandle | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  useEffect(() => {
    const prefs = getJSON<MusicPrefs>(StorageKeys.music, {
      trackId: "rain",
      volume: 0.45,
    });
    setTrackId(prefs.trackId);
    setVolumeState(prefs.volume);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setJSON(StorageKeys.music, { trackId, volume } satisfies MusicPrefs);
  }, [trackId, volume, hydrated]);

  const tearDown = useCallback(() => {
    audioRef.current?.stop();
    audioRef.current = null;
  }, []);

  const ensureContext = useCallback(async () => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") {
      await ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const startTrack = useCallback(
    async (id: AmbientTrackId, vol: number) => {
      tearDown();
      const ctx = await ensureContext();
      audioRef.current = buildAmbient(ctx, id, vol);
      setIsPlaying(true);
    },
    [ensureContext, tearDown],
  );

  const play = useCallback(() => {
    void startTrack(trackId, volumeRef.current);
  }, [startTrack, trackId]);

  const pause = useCallback(() => {
    tearDown();
    setIsPlaying(false);
  }, [tearDown]);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const setTrack = useCallback(
    (id: AmbientTrackId) => {
      setTrackId(id);
      if (isPlaying) {
        void startTrack(id, volumeRef.current);
      }
    },
    [isPlaying, startTrack],
  );

  const setVolume = useCallback((v: number) => {
    const next = Math.max(0, Math.min(1, v));
    setVolumeState(next);
    audioRef.current?.setVolume(next);
  }, []);

  useEffect(() => {
    return () => {
      tearDown();
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [tearDown]);

  const currentTrack = useMemo(
    () => AMBIENT_TRACKS.find((t) => t.id === trackId) ?? AMBIENT_TRACKS[0]!,
    [trackId],
  );

  const value = useMemo<MusicContextValue>(
    () => ({
      tracks: AMBIENT_TRACKS,
      currentTrack,
      isPlaying,
      volume,
      play,
      pause,
      toggle,
      setTrack,
      setVolume,
      externalLinks: EXTERNAL_MUSIC_LINKS,
    }),
    [currentTrack, isPlaying, volume, play, pause, toggle, setTrack, setVolume],
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return ctx;
}

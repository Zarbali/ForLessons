"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Headphones,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useMusic, type AmbientTrackId } from "@/context/MusicProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getJSON, setJSON } from "@/lib/storage";

const HIDDEN_KEY = "veronika:musicHidden";

export function MusicDock() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    toggle,
    pause,
    setTrack,
    setVolume,
    externalLinks,
  } = useMusic();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setHidden(getJSON<boolean>(HIDDEN_KEY, false));
    setReady(true);
  }, []);

  const closePlayer = () => {
    pause();
    setExpanded(false);
    setHidden(true);
    setJSON(HIDDEN_KEY, true);
  };

  const reopenPlayer = () => {
    setHidden(false);
    setJSON(HIDDEN_KEY, false);
  };

  if (!ready) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] sm:p-4">
      <AnimatePresence mode="wait">
        {hidden ? (
          <motion.button
            key="reopen"
            type="button"
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            onClick={reopenPlayer}
            className="pointer-events-auto ml-auto mr-1 flex h-12 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-lift)] backdrop-blur-xl sm:mr-2"
            aria-label="Open music player"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-spring text-[#052e16]">
              <Headphones className="h-4 w-4" />
            </span>
            Music
          </motion.button>
        ) : (
          <motion.div
            key="dock"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="pointer-events-auto w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-elevated)_92%,transparent)] shadow-[var(--shadow-lift)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
              <Button
                variant="primary"
                size="icon"
                aria-label={isPlaying ? "Pause ambience" : "Play ambience"}
                onClick={toggle}
                className={cn(
                  "h-11 w-11 shrink-0 rounded-full",
                  isPlaying && "shadow-[var(--shadow-glow)]",
                )}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </Button>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="min-w-0 flex-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none" aria-hidden>
                    {currentTrack.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-display text-sm font-semibold text-[var(--foreground)]">
                      {currentTrack.label}
                      {isPlaying ? (
                        <span className="ml-2 inline-flex gap-0.5 align-middle">
                          <span className="eq-bar" />
                          <span className="eq-bar eq-bar-2" />
                          <span className="eq-bar eq-bar-3" />
                        </span>
                      ) : null}
                    </p>
                    <p className="truncate text-[11px] text-[var(--muted-foreground)] sm:text-xs">
                      {currentTrack.description}
                    </p>
                  </div>
                </div>
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-[var(--muted-foreground)]" />
                ) : (
                  <Volume2 className="h-4 w-4 text-[var(--muted-foreground)]" />
                )}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  aria-label="Ambience volume"
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="h-1.5 w-20 cursor-pointer accent-[var(--brand)] lg:w-28"
                />
              </div>

              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse player" : "Expand player"}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={closePlayer}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted-foreground)] transition hover:bg-rose-500/15 hover:text-rose-500"
                aria-label="Close music player"
                title="Close music"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden border-t border-[var(--border)]"
                >
                  <div className="space-y-3 px-3 py-3 sm:px-4">
                    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                      {tracks.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setTrack(track.id as AmbientTrackId)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-2xl px-2 py-2.5 text-center transition",
                            track.id === currentTrack.id
                              ? "bg-[var(--brand)] text-[var(--brand-foreground)] shadow-[var(--shadow-glow)]"
                              : "bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
                          )}
                        >
                          <span className="text-lg leading-none" aria-hidden>
                            {track.emoji}
                          </span>
                          <span className="text-[10px] font-semibold sm:text-[11px]">
                            {track.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 sm:hidden">
                      <Volume2 className="h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        aria-label="Ambience volume"
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="h-1.5 w-full cursor-pointer accent-[var(--brand)]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="mr-1 text-[10px] font-medium tracking-wide text-[var(--muted-foreground)] uppercase">
                        Your music
                      </span>
                      {(
                        [
                          ["Spotify", externalLinks.spotify],
                          ["Apple", externalLinks.apple],
                          ["YouTube", externalLinks.youtube],
                        ] as const
                      ).map(([label, href]) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] text-[var(--muted-foreground)] transition hover:border-[var(--brand)] hover:text-[var(--foreground)]"
                        >
                          {label}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

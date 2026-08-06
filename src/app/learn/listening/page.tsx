"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Eye, EyeOff } from "lucide-react";
import { listeningClips } from "@/lib/data/listening";
import { speak, stopSpeaking } from "@/lib/speech";
import { useApp } from "@/context/AppProvider";
import { cn } from "@/lib/utils";

export default function ListeningPage() {
  const { addXp } = useApp();
  const [activeId, setActiveId] = useState(listeningClips[0]?.id ?? "");
  const [accent, setAccent] = useState<"british" | "american">("american");
  const [rate, setRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [playing, setPlaying] = useState(false);

  const clip = useMemo(
    () => listeningClips.find((c) => c.id === activeId) ?? listeningClips[0],
    [activeId],
  );

  const play = () => {
    if (!clip) return;
    stopSpeaking();
    setPlaying(true);
    const text = clip.speakText || clip.transcript;
    speak(text, {
      lang: accent === "british" ? "en-GB" : "en-US",
      rate,
      voicePrefer: accent,
    });
    addXp(3);
    // Approximate end — speechSynthesis has no reliable onend without utterance ref
    const approxMs = (text.split(/\s+/).length / (rate * 2.2)) * 1000;
    setTimeout(() => setPlaying(false), Math.max(2000, approxMs));
  };

  const pause = () => {
    stopSpeaking();
    setPlaying(false);
  };

  if (!clip) {
    return (
      <div className="px-5 py-16 text-center text-ink/50">No clips yet.</div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Listening
        </p>
        <h1 className="font-display mt-1 text-3xl font-semibold text-ink dark:text-white">
          Train your ear
        </h1>
      </header>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {listeningClips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              pause();
              setActiveId(c.id);
              setShowTranscript(false);
            }}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs font-medium",
              activeId === c.id
                ? "bg-ink text-white dark:bg-spring dark:text-[#052e16]"
                : "bg-ink/5 dark:bg-white/10",
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <motion.div
        key={clip.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-[2rem] border border-ink/8 bg-ink p-6 text-white shadow-xl sm:p-8"
      >
        <p className="text-xs text-spring uppercase">
          Level {clip.difficulty} · {clip.accent}
        </p>
        <h2 className="font-display mt-2 text-2xl font-semibold">{clip.title}</h2>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={playing ? pause : play}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-spring text-[#052e16] shadow-[0_0_40px_rgba(34,197,94,0.4)] transition hover:scale-105"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="h-7 w-7" />
            ) : (
              <Play className="ml-1 h-7 w-7" />
            )}
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-white/40">Accent</p>
            <div className="flex gap-2">
              {(["american", "british"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAccent(a)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-xs font-semibold capitalize",
                    accent === a ? "bg-spring text-[#052e16]" : "bg-white/10",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs text-white/40">
              Speed · {rate.toFixed(1)}x
            </p>
            <input
              type="range"
              min={0.6}
              max={1.4}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-spring"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-spring"
        >
          {showTranscript ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showTranscript ? "Hide" : "Show"} transcript
        </button>

        {showTranscript && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 rounded-2xl bg-white/5 p-4 text-sm leading-relaxed text-white/80"
          >
            {clip.transcript}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

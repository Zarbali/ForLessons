"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Volume2, MessageCircle } from "lucide-react";
import {
  isSpeechRecognitionSupported,
  scorePronunciation,
  speak,
  startRecognition,
} from "@/lib/speech";
import { useApp } from "@/context/AppProvider";
import { celebrate } from "@/lib/confetti";
import { cn, pickRandom } from "@/lib/utils";

const phrases = [
  "Hello, how are you today?",
  "I would like a cup of coffee, please.",
  "Could you help me find the station?",
  "The weather is beautiful this morning.",
  "I have been learning English every day.",
  "Nice to meet you. What is your name?",
];

const conversation = [
  { role: "ai" as const, text: "Hi! Welcome to the cafe. What would you like?" },
  { role: "user" as const, expect: "I would like a coffee please" },
  { role: "ai" as const, text: "Sure. Anything else with that?" },
  { role: "user" as const, expect: "No thank you that is all" },
  { role: "ai" as const, text: "Perfect. Enjoy your drink!" },
];

export default function SpeakingPage() {
  const { addXp } = useApp();
  const [mode, setMode] = useState<"practice" | "chat">("practice");
  const [target, setTarget] = useState(() => pickRandom(phrases));
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [turn, setTurn] = useState(0);
  const [chatHeard, setChatHeard] = useState("");

  const supported = typeof window !== "undefined" && isSpeechRecognitionSupported();

  const listen = (onDone: (transcript: string, score: number) => void, phrase: string) => {
    setError("");
    setListening(true);
    const handle = startRecognition({
      lang: "en-US",
      onResult: ({ transcript }) => {
        const s = scorePronunciation(phrase, transcript);
        onDone(transcript, s);
      },
      onError: (err) => {
        setError(
          err === "unsupported"
            ? "Speech recognition is not supported in this browser."
            : `Recognition error: ${err}`,
        );
        setListening(false);
      },
      onEnd: () => setListening(false),
    });
    if (!handle) setListening(false);
  };

  const practiceListen = () => {
    listen((transcript, s) => {
      setHeard(transcript);
      setScore(s);
      addXp(Math.max(2, Math.floor(s / 20)));
      if (s >= 80) celebrate({ particleCount: 70 });
    }, target);
  };

  const chatStep = conversation[turn];

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl px-0 py-4 sm:px-2 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold tracking-widest text-spring uppercase">
          Speaking
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
          Find your voice
        </h1>
      </header>

      <div className="mb-6 flex gap-2">
        {(
          [
            ["practice", "Pronunciation"],
            ["chat", "Conversation"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-semibold",
              mode === id
                ? "bg-ink text-white dark:bg-spring dark:text-[#052e16]"
                : "bg-ink/5 dark:bg-white/10",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!supported && (
        <p className="mb-4 rounded-2xl bg-amber-500/15 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          Speech recognition needs Chrome/Edge (or Safari with permission). You
          can still hear the prompts.
        </p>
      )}

      {mode === "practice" ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:rounded-3xl sm:p-6">
          <p className="text-xs text-[var(--muted-foreground)] uppercase">Say this</p>
          <p className="font-display mt-3 text-pretty break-words text-xl font-semibold text-[var(--foreground)] sm:text-2xl">
            {target}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => speak(target, { rate: 0.9 })}
              className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2.5 text-sm dark:border-white/15"
            >
              <Volume2 className="h-4 w-4" /> Hear
            </button>
            <button
              type="button"
              onClick={practiceListen}
              disabled={listening}
              className="inline-flex items-center gap-2 rounded-full bg-spring px-4 py-2.5 text-sm font-semibold text-[#052e16] disabled:opacity-50"
            >
              {listening ? (
                <MicOff className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {listening ? "Listening…" : "Speak"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTarget(pickRandom(phrases));
                setHeard("");
                setScore(null);
              }}
              className="rounded-full border border-ink/10 px-4 py-2.5 text-sm dark:border-white/15"
            >
              New phrase
            </button>
          </div>

          {heard && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-ink/5 p-4 dark:bg-white/5"
            >
              <p className="text-xs text-ink/40 uppercase">You said</p>
              <p className="mt-1 text-ink dark:text-white">{heard}</p>
              {score != null && (
                <p className="font-display mt-3 text-3xl font-semibold text-spring">
                  {score}
                  <span className="text-base font-normal text-ink/40"> / 100</span>
                </p>
              )}
            </motion.div>
          )}
          {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
        </div>
      ) : (
        <div className="rounded-3xl border border-ink/8 bg-ink p-6 text-white dark:border-white/10">
          <div className="mb-4 flex items-center gap-2 text-spring">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">Cafe simulator</span>
          </div>

          <div className="space-y-3">
            {conversation.slice(0, turn + 1).map((line, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  line.role === "ai"
                    ? "bg-white/10"
                    : "ml-auto bg-spring/25 text-spring",
                )}
              >
                {line.role === "ai" ? line.text : line.expect}
              </div>
            ))}
          </div>

          {chatStep?.role === "ai" && turn < conversation.length - 1 && (
            <button
              type="button"
              className="mt-5 text-sm text-spring"
              onClick={() => {
                speak(chatStep.text);
                setTurn((t) => t + 1);
              }}
            >
              Continue →
            </button>
          )}

          {chatStep?.role === "user" && (
            <div className="mt-5">
              <p className="text-xs text-white/40">Try saying:</p>
              <p className="mt-1 text-sm text-spring">{chatStep.expect}</p>
              <button
                type="button"
                disabled={listening}
                onClick={() =>
                  listen((transcript, s) => {
                    setChatHeard(transcript);
                    addXp(Math.max(3, Math.floor(s / 15)));
                    if (s >= 55) {
                      setTurn((t) => t + 1);
                      if (s >= 80) celebrate({ particleCount: 50 });
                    }
                  }, chatStep.expect)
                }
                className="mt-3 inline-flex items-center gap-2 rounded-full bg-spring px-4 py-2.5 text-sm font-semibold text-[#052e16]"
              >
                <Mic className="h-4 w-4" />
                {listening ? "Listening…" : "Reply"}
              </button>
              {chatHeard && (
                <p className="mt-3 text-xs text-white/50">Heard: {chatHeard}</p>
              )}
            </div>
          )}

          {turn >= conversation.length - 1 && chatStep?.role === "ai" && (
            <button
              type="button"
              onClick={() => {
                setTurn(0);
                setChatHeard("");
                speak(conversation[0]?.text ?? "Hi! Welcome to the cafe.");
              }}
              className="mt-6 text-sm text-white/60"
            >
              Restart conversation
            </button>
          )}
        </div>
      )}
    </div>
  );
}

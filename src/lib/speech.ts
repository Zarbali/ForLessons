export type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  voicePrefer?: "british" | "american" | "any";
};

function getVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function pickVoice(
  lang: string,
  prefer: SpeakOptions["voicePrefer"] = "any",
): SpeechSynthesisVoice | null {
  const voices = getVoices();
  if (!voices.length) return null;

  const langBase = lang.slice(0, 2).toLowerCase();
  const matches = voices.filter((v) => v.lang.toLowerCase().startsWith(langBase));
  const pool = matches.length ? matches : voices;

  if (prefer === "british") {
    return (
      pool.find((v) => /en-GB|British|UK/i.test(`${v.lang} ${v.name}`)) ??
      pool[0] ??
      null
    );
  }
  if (prefer === "american") {
    return (
      pool.find((v) => /en-US|American|US/i.test(`${v.lang} ${v.name}`)) ??
      pool[0] ??
      null
    );
  }
  return pool[0] ?? null;
}

/** Speak text via the Web Speech API. Cancels any ongoing utterance. */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const { lang = "en-US", rate = 1, pitch = 1, voicePrefer = "any" } = options;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = Math.min(2, Math.max(0.5, rate));
  utter.pitch = pitch;

  const applyVoice = () => {
    const voice = pickVoice(lang, voicePrefer);
    if (voice) {
      utter.voice = voice;
      utter.lang = voice.lang;
    }
  };

  applyVoice();
  // Chrome often loads voices asynchronously
  if (!getVoices().length) {
    window.speechSynthesis.onvoiceschanged = () => {
      applyVoice();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }

  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export type RecognitionResult = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionEventLike = {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string; confidence: number };
      length: number;
    };
  };
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

/** Start one-shot speech recognition. Returns a stop/abort handle. */
export function startRecognition(options: {
  lang?: string;
  onResult: (result: RecognitionResult) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}): { stop: () => void; abort: () => void } | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    options.onError?.("unsupported");
    return null;
  }

  const recognition = new Ctor();
  recognition.lang = options.lang ?? "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const result = event.results[0]?.[0];
    if (result) {
      options.onResult({
        transcript: result.transcript.trim(),
        confidence: result.confidence ?? 0.5,
      });
    }
  };
  recognition.onerror = (event) => options.onError?.(event.error);
  recognition.onend = () => options.onEnd?.();

  try {
    recognition.start();
  } catch {
    options.onError?.("start-failed");
    return null;
  }

  return {
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  };
}

/** Rough pronunciation similarity 0–100. */
export function scorePronunciation(target: string, heard: string): number {
  const a = normalizePhrase(target);
  const b = normalizePhrase(heard);
  if (!a || !b) return 0;
  if (a === b) return 100;

  const aWords = a.split(" ");
  const bWords = b.split(" ");
  let matched = 0;
  for (const w of aWords) {
    if (bWords.includes(w)) matched += 1;
  }
  const wordScore = (matched / aWords.length) * 70;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  const charScore = (1 - dist / maxLen) * 30;
  return Math.round(Math.max(0, Math.min(100, wordScore + charScore)));
}

function normalizePhrase(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i]![0] = i;
  for (let j = 0; j <= n; j++) dp[0]![j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(
        dp[i - 1]![j]! + 1,
        dp[i]![j - 1]! + 1,
        dp[i - 1]![j - 1]! + cost,
      );
    }
  }
  return dp[m]![n]!;
}

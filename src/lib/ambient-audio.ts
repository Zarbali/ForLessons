/**
 * Procedural study ambience via Web Audio API.
 * Distinct layers per track — not plain white noise.
 */

export type AmbientTrackId =
  | "rain"
  | "cafe"
  | "forest"
  | "ocean"
  | "lofi"
  | "whitenoise";

export type AmbientHandle = {
  master: GainNode;
  setVolume: (v: number) => void;
  stop: () => void;
};

type NoiseColor = "white" | "pink" | "brown";

function createNoiseBuffer(
  ctx: AudioContext,
  seconds: number,
  color: NoiseColor = "white",
): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);

  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    let b0 = 0;
    let b1 = 0;
    let b2 = 0;
    let last = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      let sample = white;

      if (color === "pink") {
        // Paul Kellet pink noise approximation
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        sample = b0 + b1 + b2 + white * 0.1848;
        sample *= 0.11;
      } else if (color === "brown") {
        last = (last + 0.02 * white) / 1.02;
        sample = last * 3.5;
      }

      // Light stereo decorrelation
      if (ch === 1) sample *= 0.92 + Math.random() * 0.16;
      data[i] = Math.max(-1, Math.min(1, sample));
    }
  }

  return buffer;
}

function loopNoise(
  ctx: AudioContext,
  dest: AudioNode,
  opts: {
    color?: NoiseColor;
    seconds?: number;
    volume?: number;
    filterType?: BiquadFilterType;
    frequency?: number;
    q?: number;
    playbackRate?: number;
  } = {},
) {
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, opts.seconds ?? 3.5, opts.color ?? "pink");
  source.loop = true;
  source.playbackRate.value = opts.playbackRate ?? 1;

  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType ?? "lowpass";
  filter.frequency.value = opts.frequency ?? 1200;
  filter.Q.value = opts.q ?? 0.7;

  const gain = ctx.createGain();
  gain.gain.value = opts.volume ?? 0.2;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start();

  return { source, filter, gain };
}

function softImpulse(
  ctx: AudioContext,
  dest: AudioNode,
  opts: {
    freq: number;
    volume: number;
    duration?: number;
    type?: OscillatorType;
    attack?: number;
  },
) {
  const now = ctx.currentTime;
  const dur = opts.duration ?? 0.2;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = opts.type ?? "sine";
  o.frequency.setValueAtTime(opts.freq, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(opts.volume, now + (opts.attack ?? 0.008));
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.connect(g);
  g.connect(dest);
  o.start(now);
  o.stop(now + dur + 0.02);
}

function noiseBurst(
  ctx: AudioContext,
  dest: AudioNode,
  opts: {
    color?: NoiseColor;
    volume: number;
    duration: number;
    filterType?: BiquadFilterType;
    frequency?: number;
    q?: number;
    freqEnd?: number;
  },
) {
  const now = ctx.currentTime;
  const source = ctx.createBufferSource();
  source.buffer = createNoiseBuffer(ctx, Math.max(0.08, opts.duration + 0.05), opts.color ?? "white");

  const filter = ctx.createBiquadFilter();
  filter.type = opts.filterType ?? "bandpass";
  filter.frequency.setValueAtTime(opts.frequency ?? 2000, now);
  if (opts.freqEnd != null) {
    filter.frequency.exponentialRampToValueAtTime(opts.freqEnd, now + opts.duration);
  }
  filter.Q.value = opts.q ?? 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(opts.volume, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + opts.duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(dest);
  source.start(now);
  source.stop(now + opts.duration + 0.03);
}

export function buildAmbient(
  ctx: AudioContext,
  trackId: AmbientTrackId,
  volume: number,
): AmbientHandle {
  const master = ctx.createGain();
  master.gain.value = Math.max(0, Math.min(1, volume)) * 0.55;
  master.connect(ctx.destination);

  // Light stereo widening via delay
  const merger = ctx.createChannelMerger(2);
  const delayL = ctx.createDelay(0.05);
  const delayR = ctx.createDelay(0.05);
  delayL.delayTime.value = 0.012;
  delayR.delayTime.value = 0.019;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  const dry = ctx.createGain();
  dry.gain.value = 0.85;

  const bus = ctx.createGain();
  bus.gain.value = 1;
  bus.connect(dry);
  dry.connect(master);
  bus.connect(delayL);
  bus.connect(delayR);
  delayL.connect(wet);
  delayR.connect(wet);
  wet.connect(master);

  const bufferSources: AudioBufferSourceNode[] = [];
  const oscillators: OscillatorNode[] = [];
  const timeouts: number[] = [];
  const intervals: number[] = [];
  let alive = true;

  const trackSource = (s: AudioBufferSourceNode) => {
    bufferSources.push(s);
    return s;
  };

  const schedule = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      if (!alive) return;
      fn();
    }, ms);
    timeouts.push(id);
    return id;
  };

  const every = (fn: () => void, ms: number) => {
    const id = window.setInterval(() => {
      if (!alive) return;
      fn();
    }, ms);
    intervals.push(id);
    return id;
  };

  // ——— RAIN ———
  if (trackId === "rain") {
    const bed = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.28,
      filterType: "bandpass",
      frequency: 1800,
      q: 0.55,
    });
    trackSource(bed.source);

    const hiss = loopNoise(ctx, bus, {
      color: "white",
      volume: 0.08,
      filterType: "highpass",
      frequency: 4200,
      q: 0.4,
    });
    trackSource(hiss.source);

    const rumble = loopNoise(ctx, bus, {
      color: "brown",
      volume: 0.12,
      filterType: "lowpass",
      frequency: 280,
    });
    trackSource(rumble.source);

    const dropLoop = () => {
      if (!alive) return;
      noiseBurst(ctx, bus, {
        color: "white",
        volume: 0.04 + Math.random() * 0.05,
        duration: 0.04 + Math.random() * 0.06,
        filterType: "bandpass",
        frequency: 2500 + Math.random() * 3500,
        q: 6,
      });
      schedule(dropLoop, 40 + Math.random() * 120);
    };
    schedule(dropLoop, 200);

    // Occasional denser sheet of rain
    every(() => {
      const g = bed.gain.gain;
      const now = ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.34, now + 1.2);
      g.linearRampToValueAtTime(0.26, now + 3.5);
    }, 9000);
  }

  // ——— CAFE ———
  if (trackId === "cafe") {
    const room = loopNoise(ctx, bus, {
      color: "brown",
      volume: 0.11,
      filterType: "lowpass",
      frequency: 380,
    });
    trackSource(room.source);

    // Soft “voices” — narrow band, gently gated so it isn’t flat hiss
    const chatter = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.045,
      filterType: "bandpass",
      frequency: 1100,
      q: 1.6,
    });
    trackSource(chatter.source);

    const gate = () => {
      if (!alive) return;
      const now = ctx.currentTime;
      const g = chatter.gain.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.055 + Math.random() * 0.02, now + 0.4);
      g.linearRampToValueAtTime(0.02, now + 1.6 + Math.random());
      schedule(gate, 1800 + Math.random() * 2200);
    };
    schedule(gate, 400);

    const espresso = loopNoise(ctx, bus, {
      color: "white",
      volume: 0.012,
      filterType: "bandpass",
      frequency: 2800,
      q: 4,
    });
    trackSource(espresso.source);

    const clink = () => {
      softImpulse(ctx, bus, {
        freq: 2200 + Math.random() * 900,
        volume: 0.035 + Math.random() * 0.02,
        duration: 0.18,
        type: "triangle",
      });
      softImpulse(ctx, bus, {
        freq: 3400 + Math.random() * 500,
        volume: 0.015,
        duration: 0.1,
      });
      schedule(clink, 2800 + Math.random() * 4500);
    };
    schedule(clink, 1800);

    // Soft chair / foot shuffle
    const shuffle = () => {
      noiseBurst(ctx, bus, {
        color: "brown",
        volume: 0.03,
        duration: 0.22,
        filterType: "lowpass",
        frequency: 500,
      });
      schedule(shuffle, 5000 + Math.random() * 7000);
    };
    schedule(shuffle, 3500);

    // Distant soft pad (warm cafe mood, not a melody)
    const padFreqs = [130.81, 196, 261.63];
    padFreqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const f2 = ctx.createBiquadFilter();
      o.type = "sine";
      o.frequency.value = f;
      f2.type = "lowpass";
      f2.frequency.value = 600;
      g.gain.value = 0.012 - i * 0.002;
      o.connect(f2);
      f2.connect(g);
      g.connect(bus);
      o.start();
      oscillators.push(o);
    });
  }

  // ——— FOREST ———
  if (trackId === "forest") {
    const wind = loopNoise(ctx, bus, {
      color: "brown",
      volume: 0.2,
      filterType: "lowpass",
      frequency: 520,
    });
    trackSource(wind.source);

    const leaves = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.06,
      filterType: "bandpass",
      frequency: 2400,
      q: 0.8,
    });
    trackSource(leaves.source);

    const windLfo = ctx.createOscillator();
    const windLfoGain = ctx.createGain();
    windLfo.frequency.value = 0.07;
    windLfoGain.gain.value = 0.08;
    windLfo.connect(windLfoGain);
    windLfoGain.connect(wind.gain.gain);
    windLfo.start();
    oscillators.push(windLfo);

    const bird = () => {
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const base = 1200 + Math.random() * 1600;
      o.frequency.setValueAtTime(base, now);
      o.frequency.linearRampToValueAtTime(base + 350 + Math.random() * 400, now + 0.08);
      o.frequency.linearRampToValueAtTime(base - 100, now + 0.18);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      o.connect(g);
      g.connect(bus);
      o.start(now);
      o.stop(now + 0.24);

      // Second chirp sometimes
      if (Math.random() > 0.45) {
        schedule(() => {
          softImpulse(ctx, bus, {
            freq: base + 200,
            volume: 0.028,
            duration: 0.12,
          });
        }, 120);
      }
      schedule(bird, 2200 + Math.random() * 4200);
    };
    schedule(bird, 900);

    const rustle = () => {
      noiseBurst(ctx, bus, {
        color: "pink",
        volume: 0.045,
        duration: 0.35,
        filterType: "bandpass",
        frequency: 1800,
        freqEnd: 900,
        q: 1.2,
      });
      schedule(rustle, 4000 + Math.random() * 6000);
    };
    schedule(rustle, 2500);
  }

  // ——— OCEAN ———
  if (trackId === "ocean") {
    const deep = loopNoise(ctx, bus, {
      color: "brown",
      volume: 0.32,
      filterType: "lowpass",
      frequency: 320,
    });
    trackSource(deep.source);

    const foam = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.1,
      filterType: "highpass",
      frequency: 900,
    });
    trackSource(foam.source);

    const breath = ctx.createOscillator();
    const breathGain = ctx.createGain();
    breath.frequency.value = 0.055;
    breathGain.gain.value = 0.14;
    breath.connect(breathGain);
    breathGain.connect(deep.gain.gain);
    breath.start();
    oscillators.push(breath);

    const wave = () => {
      noiseBurst(ctx, bus, {
        color: "pink",
        volume: 0.16 + Math.random() * 0.08,
        duration: 1.8 + Math.random() * 1.2,
        filterType: "lowpass",
        frequency: 1400,
        freqEnd: 220,
        q: 0.6,
      });
      schedule(wave, 3500 + Math.random() * 2800);
    };
    schedule(wave, 800);
  }

  // ——— LOFI ———
  if (trackId === "lofi") {
    const chords = [
      [130.81, 164.81, 196.0, 246.94],
      [146.83, 174.61, 220.0, 261.63],
      [110.0, 146.83, 174.61, 220.0],
    ];
    let chordIndex = 0;
    const padGains: GainNode[] = [];

    const startChord = (freqs: number[]) => {
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        o.type = i % 2 === 0 ? "sine" : "triangle";
        o.frequency.value = f;
        filter.type = "lowpass";
        filter.frequency.value = 900;
        g.gain.value = 0;
        o.connect(filter);
        filter.connect(g);
        g.connect(bus);
        o.start();
        oscillators.push(o);
        padGains.push(g);
        const now = ctx.currentTime;
        g.gain.linearRampToValueAtTime(0.035 - i * 0.005, now + 1.4);
      });
    };

    startChord(chords[0]!);

    every(() => {
      chordIndex = (chordIndex + 1) % chords.length;
      // Soft crossfade volume pulse instead of harsh restart
      const now = ctx.currentTime;
      padGains.forEach((g, i) => {
        g.gain.cancelScheduledValues(now);
        g.gain.setValueAtTime(g.gain.value, now);
        g.gain.linearRampToValueAtTime(0.01, now + 0.8);
        g.gain.linearRampToValueAtTime(0.032 - (i % 4) * 0.004, now + 2.2);
      });
      // Retune existing oscillators gently if possible — skip; pulse is enough mood
      void chordIndex;
    }, 10000);

    const vinyl = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.035,
      filterType: "highpass",
      frequency: 3500,
    });
    trackSource(vinyl.source);

    const crackle = () => {
      noiseBurst(ctx, bus, {
        color: "white",
        volume: 0.02 + Math.random() * 0.03,
        duration: 0.015 + Math.random() * 0.03,
        filterType: "highpass",
        frequency: 5000,
        q: 0.5,
      });
      schedule(crackle, 180 + Math.random() * 900);
    };
    schedule(crackle, 400);

    // Soft pulse / heartbeat for "lofi beat" feel without copyrighted drum samples
    every(() => {
      const now = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(60, now);
      o.frequency.exponentialRampToValueAtTime(40, now + 0.12);
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
      o.connect(g);
      g.connect(bus);
      o.start(now);
      o.stop(now + 0.2);
    }, 2000);
  }

  // ——— WHITE / PINK NOISE (intentional) ———
  if (trackId === "whitenoise") {
    const n = loopNoise(ctx, bus, {
      color: "pink",
      volume: 0.28,
      filterType: "lowpass",
      frequency: 6500,
      q: 0.3,
    });
    trackSource(n.source);
  }

  return {
    master,
    setVolume: (v: number) => {
      master.gain.setTargetAtTime(
        Math.max(0, Math.min(1, v)) * 0.55,
        ctx.currentTime,
        0.05,
      );
    },
    stop: () => {
      alive = false;
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
      oscillators.forEach((o) => {
        try {
          o.stop();
          o.disconnect();
        } catch {
          /* ignore */
        }
      });
      bufferSources.forEach((s) => {
        try {
          s.stop();
          s.disconnect();
        } catch {
          /* ignore */
        }
      });
      try {
        bus.disconnect();
        master.disconnect();
      } catch {
        /* ignore */
      }
    },
  };
}

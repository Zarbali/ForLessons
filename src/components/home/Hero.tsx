"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 pb-28 pt-24 text-center sm:px-8 sm:pb-32 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_18%,rgba(34,197,94,0.28),transparent_55%),radial-gradient(ellipse_at_82%_72%,rgba(34,211,238,0.14),transparent_48%),linear-gradient(165deg,#06140f_0%,#0a1c14_45%,#10281f_100%)]" />

        <motion.div
          className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-spring/35 blur-[100px] sm:h-96 sm:w-96"
          animate={{ x: [0, 36, 0], y: [0, 28, 0], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-cyan-400/20 blur-[110px]"
          animate={{ x: [0, -28, 0], y: [0, -36, 0], opacity: [0.22, 0.48, 0.22] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-1/2 top-[38%] h-56 w-56 -translate-x-1/2 rounded-full bg-spring/20 blur-[90px] sm:h-72 sm:w-72"
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {[...Array(6)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-white/30"
            style={{
              left: `${12 + i * 14}%`,
              top: `${22 + (i % 3) * 18}%`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.15, 0.55, 0.15] }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto flex max-w-3xl flex-col items-center"
      >
        <motion.p
          className="font-display mb-5 text-[clamp(2.75rem,11vw,6rem)] leading-none font-semibold tracking-tight text-white"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08, duration: 0.7 }}
        >
          Veronika
        </motion.p>

        <motion.h1
          className="max-w-xl text-balance text-[clamp(1.15rem,3.8vw,1.85rem)] font-medium leading-snug text-white/90"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.6 }}
        >
          English that feels effortless.
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md text-pretty text-sm text-white/55 sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.36, duration: 0.6 }}
        >
          Learn with games, stories, and speech — no account required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.55 }}
          className="mt-6 flex w-full max-w-md items-start gap-2 rounded-2xl border border-white/15 bg-white/8 px-3 py-3 text-left backdrop-blur-sm sm:px-4"
        >
          <Heart className="mt-0.5 h-4 w-4 shrink-0 fill-spring text-spring" aria-hidden />
          <p className="min-w-0 text-pretty break-words text-sm leading-relaxed text-white/80">
            Сайт специально для моей любимой, удачи с учёбой)
          </p>
        </motion.div>

        <motion.div
          className="mt-9 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.55 }}
        >
          <Link
            href="/learn"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-spring px-8 py-4 text-base font-semibold text-[#052e16] shadow-[0_0_40px_rgba(34,197,94,0.4)] transition hover:brightness-110 active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Start Learning
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
          <Link
            href="/games"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-medium text-white/85 backdrop-blur-sm transition hover:bg-white/10"
          >
            Play a game
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-white/35 uppercase"
        animate={{ opacity: [0.25, 0.7, 0.25], y: [0, 5, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        Scroll
      </motion.div>
    </section>
  );
}

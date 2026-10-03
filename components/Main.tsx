"use client";

import { motion, type Variants } from "motion/react";
import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";

import Typewriter from "@/components/ui/Typewriter";
import Spotlight from "@/components/ui/Spotlight";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease },
  }),
};

const roles = [
  "scalable web apps",
  "real-time systems",
  "polished interfaces",
  "reliable APIs",
];

/** Splits a word into letters that rise out of a mask one after another. */
function MaskedWord({ word, delay = 0 }: { word: string; delay?: number }) {
  return (
    <span className="inline-flex overflow-hidden" aria-label={word}>
      {[...word].map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: delay + i * 0.045, ease }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export default function Main() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden pt-32 pb-20">
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-20 mask-[radial-gradient(ellipse_at_50%_40%,black_10%,transparent_70%)]"
      />
      <div
        aria-hidden
        className="absolute -top-56 left-1/2 -z-10 size-[44rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[150px]"
      />
      <Spotlight />

      <div className="page">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.1}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white/3 px-4 py-1.5 text-xs text-muted backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Available for freelance &amp; full-time roles
        </motion.p>

        <h1 className="leading-[0.85] font-semibold tracking-[-0.05em]">
          <span className="block text-[clamp(4.5rem,17vw,13rem)]">
            <MaskedWord word={site.firstName} delay={0.2} />
          </span>
          <span className="mt-3 block font-mono text-[clamp(1.9rem,7.4vw,6.5rem)] font-medium tracking-[-0.04em] md:pl-[18%]">
            <span className="text-muted/50" aria-hidden>
              &lt;
            </span>
            <span className="text-gradient">
              <MaskedWord word={site.lastName} delay={0.55} />
            </span>
            <span className="ml-[0.35em] text-muted/50" aria-hidden>
              /&gt;
            </span>
          </span>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1.1fr_1fr] md:items-end">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-mono"
          >
            <span className="block text-sm text-muted md:text-base">
              {"// Full-stack developer crafting"}
            </span>
            <span className="mt-2 block text-2xl font-medium text-fg md:text-3xl">
              <span className="text-brand" aria-hidden>
                {"> "}
              </span>
              <Typewriter words={roles} />
            </span>
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1.15}
            className="space-y-6"
          >
            <p className="max-w-md leading-relaxed text-muted">
              I build high-performance products end to end — modern frontends
              with React &amp; Next.js and robust backends with Node.js and
              Laravel.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#work" className="btn-primary">
                See my work <FiArrowDown />
              </a>
              <a href="#contact" className="btn-ghost">
                Let&apos;s talk <FiArrowUpRight />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-muted uppercase md:flex"
      >
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-brand"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}

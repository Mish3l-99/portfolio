"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

/** A soft red glow that trails the pointer across its parent. */
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 120, damping: 22, mass: 0.6 };
  const x = useSpring(useMotionValue(-999), spring);
  const y = useSpring(useMotionValue(-999), spring);
  const background = useMotionTemplate`radial-gradient(520px circle at ${x}px ${y}px, rgb(255 22 22 / 0.14), transparent 70%)`;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ background }}
      className="pointer-events-none absolute inset-0 -z-10"
    />
  );
}

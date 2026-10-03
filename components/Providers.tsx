"use client";

import { MotionConfig } from "motion/react";

/** Respects the visitor's reduced-motion setting for every animation. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

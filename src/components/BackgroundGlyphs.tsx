"use client";

import { motion, useScroll, useTransform } from "motion/react";

export function BackgroundGlyphs() {
  const { scrollY } = useScroll();

  const rotate = useTransform(scrollY, [0, 1200], [0, 120]);
  const y = useTransform(scrollY, [0, 1200], [0, -180]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.18]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="grid-mask absolute inset-0 opacity-60" />

      <motion.div
        style={{ rotateZ: rotate, y, scale }}
        className="absolute left-1/2 top-[4vh] -translate-x-1/2"
      >
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="font-display text-[44vw] font-semibold leading-none tracking-[-0.18em] text-white/[0.035]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          V
        </motion.div>
      </motion.div>

      <div className="absolute right-[6vw] top-[22vh] rotate-90 text-[10px] uppercase tracking-[0.5em] text-white/[0.12]">
        Field Unit // VP-01
      </div>

      <div className="absolute bottom-[18vh] left-[7vw] text-[10px] uppercase tracking-[0.45em] text-white/[0.1]">
        Case 1998 // Active
      </div>

      <div className="absolute bottom-[8vh] right-[12vw] text-[10px] uppercase tracking-[0.45em] text-white/[0.08]">
        Observe / Reason / Build
      </div>
    </div>
  );
}
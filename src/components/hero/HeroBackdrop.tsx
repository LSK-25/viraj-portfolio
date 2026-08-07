"use client";

import { motion } from "motion/react";

export function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{
          x: ["-6%", "4%", "-6%"],
          y: ["-4%", "5%", "-4%"],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[-12vw] top-[10vh] h-[52vh] w-[52vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(122,25,25,0.28),transparent_66%)] blur-2xl"
      />

      <motion.div
        animate={{
          x: ["6%", "-5%", "6%"],
          y: ["4%", "-6%", "4%"],
          scale: [1.05, 1, 1.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[6vh] left-[-18vw] h-[58vh] w-[58vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(199,175,134,0.16),transparent_70%)] blur-2xl"
      />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#060605] to-transparent" />
    </div>
  );
}
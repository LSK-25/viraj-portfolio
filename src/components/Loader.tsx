"use client";

import { motion } from "motion/react";

const letters = "VIRAJ PATIL".split("");

export function Loader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060605]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0, pointerEvents: "none" }}
      transition={{ delay: 2.35, duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="flex overflow-hidden font-display text-4xl font-semibold uppercase tracking-[-0.08em] text-white md:text-7xl">
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              initial={{ y: 90, rotate: 8, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              transition={{
                delay: index * 0.045,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={letter === " " ? "w-4 md:w-7" : ""}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.6 }}
          className="text-[10px] uppercase tracking-[0.42em] text-white/42"
        >
          Case 1998 // Access Granted
        </motion.p>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 220 }}
          transition={{ delay: 1.35, duration: 0.7, ease: "easeInOut" }}
          className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
        />
      </div>
    </motion.div>
  );
}
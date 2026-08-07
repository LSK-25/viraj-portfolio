"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { AgentCard } from "./AgentCard";
import { identity } from "@/data/site";

export function Hero() {
  const { scrollYProgress } = useScroll();

  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.16]);

  const cardY = useTransform(scrollYProgress, [0, 0.22], [0, -130]);
  const cardScale = useTransform(scrollYProgress, [0, 0.22], [1, 0.9]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0.12]);

  return (
    <section className="relative z-10 min-h-screen overflow-hidden px-5 pb-10 pt-36 md:px-8 md:pt-36">
      <div className="mx-auto grid min-h-[72vh] max-w-[1500px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10"
        >
          <p className="mb-7 text-[10px] uppercase tracking-[0.46em] text-white/42">
            {identity.role}
          </p>

          <h1 className="font-display max-w-[820px] text-[clamp(3.7rem,7.7vw,8.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.095em]">
            I build
            <br />
            systems that
            <br />
            see, think
            <br />
            and interact.
          </h1>
        </motion.div>

        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="relative z-20 flex justify-center lg:justify-end"
        >
          <AgentCard />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.7 }}
        className="absolute bottom-8 left-5 right-5 z-20 mx-auto flex max-w-[1500px] justify-between text-[10px] uppercase tracking-[0.34em] text-white/32 md:left-8 md:right-8"
      >
        <span>Works below</span>
        <span>Scroll</span>
      </motion.div>
    </section>
  );
}
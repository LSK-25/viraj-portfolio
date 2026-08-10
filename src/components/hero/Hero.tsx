"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { AgentCard } from "./AgentCard";
import { ReactiveHeadline } from "./ReactiveHeadline";
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
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-60 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_74%)]" />

      <div className="pointer-events-none absolute left-[10vw] top-[16vh] h-[44vh] w-[42vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(150,24,42,0.24),rgba(118,58,190,0.13)_38%,transparent_72%)] blur-3xl" />

      <div className="mx-auto grid min-h-[72vh] max-w-[1500px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="relative z-10"
        >
          <p className="mb-7 text-[10px] uppercase tracking-[0.46em] text-white/42">
            {identity.role}
          </p>

          <ReactiveHeadline />
        </motion.div>

        <motion.div
          style={{ y: cardY, scale: cardScale, opacity: cardOpacity }}
          className="relative z-20 flex justify-center lg:justify-end"
        >
          <AgentCard />
        </motion.div>
      </div>

     
    </section>
  );
}
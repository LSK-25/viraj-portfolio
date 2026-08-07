"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { projects } from "@/data/site";

type Project = (typeof projects)[number];

function WorkCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 0.5, 1], [90, 0, -70]);
  const imageY = useTransform(scrollYProgress, [0, 1], [45, -45]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.85, 1], [0.35, 1, 1, 0.45]);

  return (
    <motion.article
      ref={ref}
      style={{ y: cardY, opacity }}
      className="group grid min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] transition duration-500 hover:border-white/20 hover:bg-white/[0.06] md:grid-cols-[0.32fr_1.05fr_0.9fr]"
    >
      <div className="border-b border-white/10 p-6 md:border-b-0 md:border-r">
        <p className="text-[10px] uppercase tracking-[0.42em] text-white/35">
          {project.number}
        </p>
      </div>

      <div className="flex flex-col justify-between border-b border-white/10 p-6 md:border-b-0 md:border-r md:p-8">
        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/35">
            {project.type}
          </p>

          <h3 className="font-display text-[clamp(3.2rem,7vw,7.5rem)] font-semibold uppercase leading-[0.76] tracking-[-0.09em]">
            {project.code}
          </h3>

          <p className="mt-6 text-xl text-white/55">{project.title}</p>
        </div>

        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-white/35">
          {project.stack}
        </p>
      </div>

      <div className="flex flex-col justify-between p-6 md:p-8">
        <div className="relative h-44 overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30">
          <motion.div
            style={{ y: imageY }}
            className="absolute inset-[-20%] bg-[radial-gradient(circle_at_70%_30%,rgba(122,25,25,0.32),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(199,175,134,0.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.02))]"
          />

          <div className="absolute inset-6 rounded-full border border-white/10 blur-sm" />

          <p className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.32em] text-white/35">
            Visual pending
          </p>
        </div>

        <p className="mt-8 max-w-md text-lg leading-relaxed text-white/55">
          {project.description}
        </p>
      </div>
    </motion.article>
  );
}

export function Works() {
  const headingRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: headingRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [120, -160]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.92, 1.12]);

  return (
    <section id="works" className="relative z-10 px-5 py-28 md:px-8 md:py-40">
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="pointer-events-none absolute left-1/2 top-10 -z-10 -translate-x-1/2 font-display text-[22vw] font-semibold uppercase leading-none tracking-[-0.12em] text-white/[0.03]"
      >
        Works
      </motion.div>

      <div className="mx-auto max-w-[1500px]">
        <div
          ref={headingRef}
          className="mb-16 flex items-end justify-between border-b border-white/12 pb-6"
        >
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.46em] text-white/38">
              Selected Work
            </p>
            <h2 className="font-display text-[clamp(3.5rem,8vw,8.5rem)] font-semibold uppercase leading-[0.78] tracking-[-0.09em]">
              Works
            </h2>
          </div>

          <p className="hidden max-w-sm text-right text-sm leading-relaxed text-white/45 md:block">
            Four serious builds, each proving a different layer: product,
            vision, agents, and personal AI systems.
          </p>
        </div>

        <div className="space-y-10 md:space-y-14">
          {projects.map((project) => (
            <WorkCard key={project.number} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
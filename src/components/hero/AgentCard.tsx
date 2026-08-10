"use client";

import { ScrambleText } from "@/components/ui/ScrambleText";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";

export function AgentCard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 140, damping: 18 });
  const springY = useSpring(y, { stiffness: 140, damping: 18 });

  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function resetCard() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetCard}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="glass relative mx-auto h-[520px] w-[350px] overflow-hidden rounded-[2rem] p-5"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.18),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/15 to-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="mb-5 flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-white/45">
            <span>
  <ScrambleText text="Field Access" playOnMount delay={200} />
</span>
<span>
  <ScrambleText text="VP-01" playOnMount delay={300} />
</span>
          </div>

          <div className="relative h-[245px] overflow-hidden rounded-[1.4rem] border border-white/12 bg-black/35">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.13),rgba(255,255,255,0.025))]" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 blur-sm" />

            <p className="absolute inset-0 flex items-center justify-center text-center text-[10px] uppercase tracking-[0.34em] text-white/38">
              <ScrambleText text="Portrait" playOnMount delay={420} />
<br />
<ScrambleText text="Pending" playOnMount delay={520} />
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-[9px] uppercase tracking-[0.34em] text-white/38">
            <ScrambleText text="Clearance // Active" playOnMount delay={620} />
          </p>

          <h2 className="font-display text-5xl font-semibold uppercase leading-[0.8] tracking-[-0.08em] md:text-6xl">
            <ScrambleText text="Viraj" playOnMount delay={720} />
<br />
<ScrambleText text="Patil" playOnMount delay={820} />
          </h2>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-5 border-t border-white/12 pt-4">
            <p className="text-[10px] uppercase tracking-[0.38em] text-white/45">
  <ScrambleText text="AI Systems" playOnMount delay={920} />
<br />
<ScrambleText text="Cybersecurity" playOnMount delay={1020} />
<br />
<ScrambleText text="Computer Vision" playOnMount delay={1120} />
</p>
            <div className="grid h-12 w-12 grid-cols-4 gap-1 opacity-50">
              {Array.from({ length: 16 }).map((_, index) => (
                <span key={index} className="bg-white/70" />
              ))}
            </div>
          </div>

          <p className="mt-5 text-[9px] uppercase tracking-[0.34em] text-white/35">
            <ScrambleText text="Case File 2004" playOnMount delay={1220} />
          </p>
        </div>
      </div>
    </motion.div>
  );
}
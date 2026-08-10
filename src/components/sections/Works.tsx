"use client";

import { ScrambleText } from "@/components/ui/ScrambleText";
import { EraseText } from "@/components/ui/EraseText";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const works = [
  {
    id: "01",
    codename: "Sentinel",
    title: "AI Surveillance System",
    stack: "Python / OpenCV / YOLO / Flask",
    type: "Computer Vision",
    description:
      "A real-time surveillance system that detects people, reads motion, stores intrusion evidence, and serves alerts through a local dashboard.",
    details: ["Person detection", "Motion analysis", "Intrusion logs", "Flask dashboard"],
  },
  {
    id: "02",
    codename: "BILLi&BoBA",
    title: "Nail Commerce Platform",
    stack: "Next.js / TypeScript / Vercel",
    type: "Full-stack Product",
    description:
      "A premium custom press-on nail storefront with product browsing, cart, checkout flow, order tracking, and admin-oriented structure.",
    details: ["Premium UI", "Checkout flow", "Order tracking", "Mobile-first shop"],
  },
  {
    id: "03",
    codename: "NOVA Dev Doctor",
    title: "Developer Repair Agent",
    stack: "LLM Agents / Git / Diagnostics",
    type: "AI Agent",
    description:
      "A coding repair assistant concept that diagnoses project errors, proposes safe fixes, verifies builds, and records what changed.",
    details: ["Repo diagnosis", "Safe diffs", "Build verification", "Learning memory"],
  },
  {
    id: "04",
    codename: "NOVA Core",
    title: "Personal AI Interface",
    stack: "Conversational AI / Memory / Tools",
    type: "AI System",
    description:
      "A personal AI companion concept with memory, voice, tools, local plus cloud intelligence, and future physical embodiment.",
    details: ["Memory", "Voice", "Tools", "Companion interface"],
  },
];

export function Works() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeWork = works[activeIndex];

  return (
    <section
      id="works"
      className="relative z-10 flex min-h-screen overflow-hidden px-5 pb-8 pt-28 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.10),transparent_34%),radial-gradient(circle_at_20%_80%,rgba(122,25,25,0.18),transparent_42%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35 [mask-image:radial-gradient(circle_at_50%_50%,black,transparent_75%)]" />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="lg:-translate-y-13">
          <p className="mb-8 text-[10px] uppercase tracking-[0.46em] text-white/38">
            Works
          </p>

          <h2 className="font-display max-w-[760px] cursor-default select-none text-[clamp(4rem,8vw,9.5rem)] font-semibold uppercase leading-[0.72] tracking-[-0.11em]">
  <EraseText lines={["Selected", "systems."]} />
</h2>

          <p className="mt-8 max-w-[520px] text-sm leading-7 text-white/45">
            Scroll-section portfolio built like a case archive. Each project is
            treated as a system, not just a card.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-3">
            {works.map((work, index) => (
              <button
                key={work.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`group grid grid-cols-[auto_1fr_auto] items-center gap-5 border px-5 py-4 text-left transition duration-300 ${
                  activeIndex === index
                    ? "border-white/25 bg-white/[0.075]"
                    : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                <span className="text-[10px] uppercase tracking-[0.34em] text-white/35">
                  {work.id}
                </span>

                <span className="font-display text-3xl uppercase leading-none tracking-[-0.06em] text-white/80">
                 <ScrambleText text={work.codename} />
                </span>

                <span className="hidden text-[9px] uppercase tracking-[0.32em] text-white/32 md:block">
                  {work.type}
                </span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[290px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.10),transparent_35%)]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.id}
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="mb-8 flex items-center justify-between text-[10px] uppercase tracking-[0.34em] text-white/35">
                  <span>Case File {activeWork.id}</span>
                  <span>{activeWork.type}</span>
                </div>

                <h3 className="font-display text-[clamp(2.6rem,4.8vw,5.8rem)] font-semibold uppercase leading-[0.78] tracking-[-0.09em] text-white/85">
                  {activeWork.title}
                </h3>

                <p className="mt-5 text-[10px] uppercase tracking-[0.32em] text-white/38">
                  {activeWork.stack}
                </p>

                <p className="mt-7 max-w-[720px] text-sm leading-7 text-white/50">
                  {activeWork.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {activeWork.details.map((detail) => (
                    <span
                      key={detail}
                      className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-[9px] uppercase tracking-[0.28em] text-white/45"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
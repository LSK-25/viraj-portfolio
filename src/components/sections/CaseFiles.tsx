"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EraseText } from "@/components/ui/EraseText";
import { ScrambleText } from "@/components/ui/ScrambleText";

type CaseFile = {
  id: string;
  title: string;
  label: string;
  copy: string;
  detail: string;
  tags: string[];
  locked: boolean;
  liveUrl?: string;
  liveLabel?: string;
};

const caseFiles: CaseFile[] = [
  {
    id: "01",
    title: "Sentinel",
    label: "Computer Vision",
    copy: "Real-time person detection, motion analysis, intrusion alerts, and a local Flask dashboard.",
    detail:
      "Sentinel is an AI surveillance system built around OpenCV, YOLO, motion detection, and a local Flask dashboard. The system detects people, tracks movement, stores alert screenshots, and gives a simple dashboard view for monitoring. It was built as a software-heavy final-year style project with minimal hardware dependency.",
    tags: ["YOLO", "OpenCV", "Flask"],
    locked: false,
  },
  {
    id: "02",
    title: "BILLi&BoBA",
    label: "Commerce Platform",
    copy: "Premium custom press-on nail storefront with checkout, order tracking, and mobile-first product UX.",
    detail:
      "BILLi&BoBA NAILS is a premium custom press-on nail e-commerce platform built with a mobile-first interface, product filters, checkout flow, order tracking, account pages, admin flow, and a clean pastel luxury design system. The products are still in production, so no live products have been added yet. The website structure is ready for product uploads once the actual sets are finalized.",
    tags: ["Next.js", "TypeScript", "Vercel"],
    locked: false,

    // Replace this with your real BILLi&BoBA deployed app link.
    // It MUST start with https://
    liveUrl: "https://billi-boba-nails.vercel.app/",
    liveLabel: "Open BILLi&BoBA App",
  },
  {
    id: "03",
    title: "Locked File",
    label: "Classified",
    copy: "Soon to be unlocked.",
    detail:
      "This case file is reserved for a future project. It will be unlocked after the project has enough substance, screenshots, and a clear build story.",
    tags: ["Pending"],
    locked: true,
  },
  {
    id: "04",
    title: "NOVA Core",
    label: "Personal AI Interface",
    copy: "Personal AI companion concept with memory, voice, tools, and future physical embodiment.",
    detail:
      "NOVA Core is a personal AI companion concept designed around memory, voice interaction, emotional support, productivity tools, and future hardware embodiment. The long-term vision is an AI that can understand personal context, assist with work, and eventually exist as a small desk companion with a face screen and camera-based awareness.",
    tags: ["Memory", "Voice", "Tools"],
    locked: false,
  },
  {
  id: "05",
  title: "NOVA Debugger",
  label: "AI Repair Agent",
    copy: "AI debugging assistant that diagnoses errors, suggests safe fixes, verifies builds, and records lessons.",
    detail:
      "NOVA Debugger is an AI repair-agent concept for developers. The idea is to diagnose project errors, understand terminal logs, suggest safe fixes, verify builds, and keep a record of what was changed and learned. It is planned as a practical developer assistant for fixing local projects faster.",
    tags: ["LLM", "Git", "Diagnostics"],
    locked: false,
  },
  {
    id: "06",
    title: "Locked File",
    label: "Classified",
    copy: "Soon to be unlocked.",
    detail:
      "This slot is kept open for a future major project. It is intentionally locked so the portfolio does not look overfilled with weak or unfinished work.",
    tags: ["Pending"],
    locked: true,
  },
];

export function CaseFiles() {
  const [selectedFile, setSelectedFile] = useState<CaseFile | null>(null);

  return (
    <section
      id="case-files"
      className="relative z-10 min-h-screen overflow-hidden px-5 pb-28 pt-36 md:px-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-45 [mask-image:radial-gradient(circle_at_50%_35%,black,transparent_72%)]" />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.38em] text-white/42">
              <ScrambleText text="Project Archive" />
            </p>

            <h2 className="font-display max-w-[760px] text-[clamp(3.5rem,7vw,8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.09em] text-white">
              <EraseText lines={["Case", "files."]} />
            </h2>
          </div>

          <p className="max-w-[420px] text-sm leading-relaxed text-white/42">
            Click a case file to open a detailed project note, current status,
            stack, and live link where available.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {caseFiles.map((file, index) => (
            <motion.button
              key={file.id}
              type="button"
              onClick={() => setSelectedFile(file)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`case-glass-card group relative min-h-[330px] overflow-hidden border border-white/12 p-6 text-left transition duration-500 ${
                file.locked ? "opacity-55" : "hover:bg-red-950/20"
              }`}
            >
              <div className="pointer-events-none absolute right-6 top-6 grid h-12 w-12 grid-cols-4 gap-1 opacity-30 transition duration-500 group-hover:opacity-60">
                {Array.from({ length: 16 }).map((_, dotIndex) => (
                  <span key={dotIndex} className="bg-white/70" />
                ))}
              </div>

              <div className="relative z-10 flex min-h-[282px] flex-col justify-between">
                <div>
                  <div className="mb-12 flex items-center justify-between text-[9px] uppercase tracking-[0.34em] text-white/38">
                    <span>
                      <ScrambleText text={`Case ${file.id}`} />
                    </span>
                    <span>
                      <ScrambleText
                        text={file.locked ? "Locked" : "Active"}
                      />
                    </span>
                  </div>

                  <p className="mb-4 text-[10px] uppercase tracking-[0.36em] text-red-200/42">
                    <ScrambleText text={file.label} />
                  </p>

                  <h3 className="font-display max-w-full text-[clamp(2rem,3vw,3.4rem)] font-semibold uppercase leading-[0.82] tracking-[-0.075em] text-white">
                    <ScrambleText text={file.title} />
                  </h3>
                </div>

                <div>
                  <p className="mb-5 max-w-[92%] text-sm leading-relaxed text-white/42">
                    {file.copy}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {file.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-white/10 px-3 py-2 text-[9px] uppercase tracking-[0.28em] text-white/42"
                      >
                        <ScrambleText text={tag} />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/72 px-5 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="case-glass-card relative w-full max-w-[760px] border border-white/12 p-7 md:p-9"
            >
              <div className="mb-10 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-4 text-[10px] uppercase tracking-[0.38em] text-red-200/45">
                    <ScrambleText text={`Case ${selectedFile.id}`} />
                  </p>

                  <h3 className="font-display text-[clamp(2.8rem,6vw,6.5rem)] font-semibold uppercase leading-[0.8] tracking-[-0.09em] text-white">
                    <ScrambleText text={selectedFile.title} />
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="shrink-0 border border-white/15 px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-white/55 transition hover:border-white/35 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mb-8 flex flex-wrap gap-2">
                {selectedFile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-white/10 px-3 py-2 text-[9px] uppercase tracking-[0.28em] text-white/45"
                  >
                    <ScrambleText text={tag} />
                  </span>
                ))}
              </div>

              <p className="max-w-[650px] text-base leading-8 text-white/58">
                {selectedFile.detail}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {selectedFile.liveUrl && (
                  <a
                    href={selectedFile.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-red-200/25 bg-red-950/25 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-red-100/75 transition hover:border-red-100/45 hover:text-white"
                  >
                    <ScrambleText
                      text={selectedFile.liveLabel ?? "Open Live Project"}
                    />
                  </a>
                )}

                <span className="border border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.3em] text-white/35">
                  <ScrambleText
                    text={selectedFile.locked ? "Status // Locked" : "Status // Active"}
                  />
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
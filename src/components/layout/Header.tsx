"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { navItems } from "@/data/site";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { ScrambleText } from "@/components/ui/ScrambleText";

export function Header() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-40 h-[102px] w-full bg-black/18 backdrop-blur-2xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed left-0 top-0 z-40 h-[102px] w-full bg-[linear-gradient(180deg,rgba(3,1,2,0.58),rgba(3,1,2,0.22),transparent)]"
        aria-hidden="true"
      />

      <header className="fixed left-0 top-0 z-50 w-full px-8 py-8">
        <nav className="mx-auto flex max-w-[1500px] items-center justify-between text-[10px] uppercase tracking-[0.38em] text-white/58">
          <MagneticLink
            href="#"
            className="font-semibold text-white/72 hover:text-white"
          >
            <ScrambleText text="Viraj Patil" playOnMount />
          </MagneticLink>

          <div className="hidden items-center gap-10 md:flex">
            {navItems.map((item, index) => (
              <div
                key={item.label}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                className="relative"
              >
                <MagneticLink href={item.href}>
                  <ScrambleText
                    text={item.label}
                    playOnMount
                    delay={120 + index * 90}
                  />
                </MagneticLink>

                {hovered === item.label && (
                  <motion.span
                    layoutId="nav-line"
                    className="absolute -bottom-2 left-0 h-px w-full bg-white/70"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 34,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <MagneticLink href="#contact">
            <ScrambleText text="Contact" playOnMount delay={520} />
          </MagneticLink>
        </nav>
      </header>
    </>
  );
}
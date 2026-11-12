"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AssistantTrigger } from "@/components/assistant/AssistantTrigger";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ArrowIcon, DownloadIcon, MicIcon } from "@/components/ui/Icons";
import { EraseText } from "@/components/ui/EraseText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -45]);

  return (
    <section id="home" ref={section} className="hero section-shell">
      <BackgroundVideo />
      <div className="hero-topline">
        <span><i />Open to meaningful collaborations</span>
        <span>Based in India &middot; Building for the web</span>
      </div>
      <div className="hero-grid">
        <motion.div className="hero-copy" style={{ y: reduced ? 0 : textY }}>
          <p className="eyebrow">
            <ScrambleText text="Viraj Patil / Developer & engineer" />
          </p>
          <h1>
            <EraseText lines={["Curiosity.", "Code."]} />
            <em><EraseText lines={["Real impact."]} /></em>
          </h1>
          <p className="hero-description">
            I turn complex ideas into thoughtful digital experiences. Exploring
            the intersection of AI, software, and the people who use it.
          </p>
          <div className="hero-actions">
            <MagneticLink className="button button-primary" href="#works">
              Explore my work<ArrowIcon />
            </MagneticLink>
            <AssistantTrigger><MicIcon />Talk to NOVA</AssistantTrigger>
          </div>
        </motion.div>
      </div>
      <div className="hero-bottom">
        <span>AI SYSTEMS &middot; FULL-STACK &middot; COMPUTER VISION</span>
        <MagneticLink href="/Viraj_Patil_Resume.pdf" download>
          Download CV<DownloadIcon />
        </MagneticLink>
        <a className="scroll-cue" href="#works">Scroll to explore<span>&darr;</span></a>
      </div>
    </section>
  );
}

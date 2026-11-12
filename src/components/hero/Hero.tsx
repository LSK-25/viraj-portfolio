"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AssistantTrigger } from "@/components/assistant/AssistantTrigger";
import { BackgroundVideo } from "@/components/BackgroundVideo";
import { ArrowIcon, MicIcon } from "@/components/ui/Icons";
import { MagneticLink } from "@/components/ui/MagneticLink";

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const textOpacity = useTransform(scrollYProgress, [0, .65, 1], [1, .8, 0]);

  return (
    <section id="home" ref={section} className="hero spatial-hero">
      <BackgroundVideo />
      <div className="hero-coordinate" aria-hidden="true"><span>PORTFOLIO / 2026</span><span>20.93° N — 77.75° E</span></div>
      <div className="hero-inner section-shell">
        <div className="hero-topline"><span><i />Open to meaningful collaborations</span><span>Amravati, India</span></div>
        <motion.div className="hero-copy" style={{ y: reduced ? 0 : textY, opacity: reduced ? 1 : textOpacity }}>
          <p className="eyebrow">Viraj Patil <span>/</span> Developer & engineer</p>
          <h1><span>Code with</span><em>character.</em><span className="hero-title-star" aria-hidden="true">✳</span></h1>
          <div className="hero-copy-bottom"><p className="hero-description">A curious mind. A hands-on builder.<br />I make systems that see, think,<br className="desktop-break" /> and feel a little more human.</p>
            <div className="hero-actions"><MagneticLink className="button button-primary" href="#works">Enter the work<ArrowIcon /></MagneticLink><AssistantTrigger className="button hero-voice"><MicIcon />Talk to NOVA</AssistantTrigger></div>
          </div>
        </motion.div>
        <div className="hero-bottom"><span>AI SYSTEMS / DIGITAL COMMERCE / COMPUTER VISION</span><a className="scroll-cue" href="#works"><span className="scroll-track" aria-hidden="true" />Scroll into the work<ArrowIcon width={14} /></a></div>
      </div>
      <span className="hero-side-note" aria-hidden="true">CURIOSITY IS THE STARTING POINT</span>
    </section>
  );
}

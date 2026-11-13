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
  const textY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  return <section id="home" ref={section} className="hero spatial-hero identity-hero">
    <BackgroundVideo />
    <div className="identity-aurora" aria-hidden="true" />
    <div className="hero-inner section-shell">
      <div className="hero-topline"><span><i />Available for technical opportunities</span><span>Based in India</span></div>
      <motion.div className="hero-copy identity-copy" style={{ y: reduced ? 0 : textY }}>
        <p className="eyebrow">Developer. Engineer. Endlessly curious.</p>
        <h1 className="identity-name"><span>VIRAJ</span><em>PATIL<span className="identity-period">.</span></em></h1>
        <div className="identity-caption"><span className="identity-spark" aria-hidden="true">&#10035;</span><p>A human behind the code.<br /><strong>A little character in everything I build.</strong></p></div>
      </motion.div>
      <div className="identity-footer glass-panel">
        <p>I turn ideas into systems<br />that <em>see, think &amp; connect.</em></p>
        <div className="identity-disciplines"><span>01 / Applied AI</span><span>02 / Digital products</span><span>03 / Computer vision</span></div>
        <div className="hero-actions"><MagneticLink className="button button-primary" href="#works">Explore my work<ArrowIcon /></MagneticLink><AssistantTrigger className="button hero-voice"><MicIcon />Talk to NOVA</AssistantTrigger></div>
      </div>
      <div className="hero-bottom"><span>VIRAJ PATIL / SELECTED WORK</span><a className="scroll-cue" href="#works"><span className="scroll-track" aria-hidden="true" />Scroll to explore<ArrowIcon width={14} /></a></div>
    </div>
  </section>;
}

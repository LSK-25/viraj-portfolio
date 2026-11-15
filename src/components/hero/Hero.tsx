"use client";
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AssistantTrigger } from '@/components/assistant/AssistantTrigger';
import { ArrowIcon, MicIcon } from '@/components/ui/Icons';

export function Hero() {
 const section = useRef<HTMLElement>(null);
 const reduced = useReducedMotion();
 const { scrollYProgress } = useScroll({ target: section, offset: ['start start','end start'] });
 const drift = useTransform(scrollYProgress,[0,1],[0,80]);
 return <section id="home" ref={section} className="dossier-hero section-shell">
  <div className="dossier-topline"><span>Independent portfolio / 2026</span><span>India <i /> Open to technical opportunities</span></div>
  <div className="dossier-hero-grid">
   <div className="dossier-identity"><p className="eyebrow">Engineering. Intelligence. Intent.</p><h1>VIRAJ<br/><span>PATIL</span></h1><p className="dossier-role">A curious mind.<br/><em>A considered approach.</em></p></div>
   <motion.div className="optical-study" style={{ y: reduced ? 0 : drift }} aria-hidden="true"><div className="optical-axis"/><div className="optical-shell"><div className="optical-ring ring-one"/><div className="optical-ring ring-two"/><div className="optical-ring ring-three"/><div className="optical-core"><span>VP</span></div></div><span className="optical-note note-top">STUDY 001 / PERSPECTIVE</span><span className="optical-note note-bottom">FOCUS ON WHAT MATTERS</span><i className="optical-cross cross-one"/><i className="optical-cross cross-two"/></motion.div>
  </div>
  <div className="dossier-hero-bottom"><p>I build software that <em>sees, thinks<br className="desktop-break"/> and connects.</em> Explore the work behind it.</p><div className="hero-actions"><a className="button button-primary" href="#works">Explore the work<ArrowIcon width={16}/></a><AssistantTrigger className="button"><MicIcon/>Meet NOVA</AssistantTrigger></div><a className="dossier-scroll" href="#case-files">05 PROJECT DOSSIERS<span>Scroll to discover ↓</span></a></div>
 </section>;
}

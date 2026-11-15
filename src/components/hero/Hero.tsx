"use client";
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { AssistantTrigger } from '@/components/assistant/AssistantTrigger';
import { ArrowIcon, MicIcon } from '@/components/ui/Icons';
import { EraseText } from '@/components/ui/EraseText';
import { ProjectLens } from './ProjectLens';
import { MagneticLink } from '@/components/ui/MagneticLink';

export function Hero() {
 const section = useRef<HTMLElement>(null);
 const reduced = useReducedMotion();
 const { scrollYProgress } = useScroll({ target: section, offset: ['start start','end start'] });
 const drift = useTransform(scrollYProgress,[0,1],[0,80]);
 return <section id="home" ref={section} className="dossier-hero section-shell">
  <div className="dossier-topline"><span>Independent portfolio / 2026</span><span>India <i /> Open to technical opportunities</span></div>
  <div className="dossier-hero-grid">
   <div className="dossier-identity"><p className="eyebrow">Engineering. Intelligence. Intent.</p><h1><EraseText lines={["VIRAJ"]}/><br/><span><EraseText lines={["PATIL"]}/></span></h1><p className="dossier-role">A curious mind.<br/><em>A considered approach.</em></p></div>
   <motion.div className="hero-project-lens" style={{ y: reduced ? 0 : drift }}><ProjectLens /></motion.div>
  </div>
  <div className="dossier-hero-bottom"><p>I build software that <em>sees, thinks<br className="desktop-break"/> and connects.</em> Explore the work behind it.</p><div className="hero-actions"><MagneticLink className="button button-primary" href="#works">Explore the work<ArrowIcon width={16}/></MagneticLink><AssistantTrigger className="button"><MicIcon/>Meet NOVA</AssistantTrigger></div><a className="dossier-scroll" href="#case-files">05 PROJECT DOSSIERS<span>Scroll to discover ↓</span></a></div>
 </section>;
}

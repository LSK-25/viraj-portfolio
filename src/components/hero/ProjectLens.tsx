'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { projects } from '@/data/site';
import { ProjectSculpture } from '@/components/spatial/ProjectSculpture';
import { ArrowIcon } from '@/components/ui/Icons';

const ROTATION_INTERVAL = 5000;
const names = ['NOVA', 'B&B', 'Sadafuli', 'Sentinel', 'Glasses'];

export function ProjectLens() {
  const [active, setActive] = useState(4);
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const inView = useInView(container, { amount: .25 });
  const [automatic, setAutomatic] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dialStep, setDialStep] = useState(4);
  const [selectionPass, setSelectionPass] = useState(0);
  const running = automatic && reduced === false && inView && visible && !hovered && !focused;

  useEffect(() => {
    const sync = () => setVisible(!document.hidden);
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setActive(index => (index + 1) % projects.length);
      setDialStep(step => step + 1);
    }, ROTATION_INTERVAL);
    return () => window.clearTimeout(timer);
  }, [running, active, selectionPass]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 130, damping: 24 });
  const rotateY = useSpring(tiltY, { stiffness: 130, damping: 24 });
  const project = projects[active];

  function select(index: number, focus = false) {
    const next = (index + projects.length) % projects.length;
    const forward = (next - active + projects.length) % projects.length;
    setDialStep(step => step + (forward > projects.length / 2 ? forward - projects.length : forward));
    setActive(next);
    setSelectionPass(pass => pass + 1);
    if (focus) tabs.current[next]?.focus();
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === 'ArrowRight') next = index + 1;
    if (event.key === 'ArrowLeft') next = index - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = projects.length - 1;
    if (next !== undefined) { event.preventDefault(); select(next, true); }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    tiltX.set((.5 - y) * 14);
    tiltY.set((x - .5) * 18);
    event.currentTarget.style.setProperty('--glint-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--glint-y', `${y * 100}%`);
  }
  function reset() { tiltX.set(0); tiltY.set(0); }

  return <div ref={container} className="lens-selector"
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
    onPointerLeave={() => setHovered(false)} onPointerCancel={() => setHovered(false)}
    onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="lens-overline"><span>Interactive archive</span><span>{project.number} / 05</span></div>
    <div className="lens-instrument" onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <div className="lens-coordinate" aria-hidden="true"><i /><i /><i /><i /></div>
      <motion.div className="lens-gimbal" style={{ rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 1000 }}>
        <div className="optical-shell" aria-hidden="true">
          <motion.div className="optical-ring ring-one" animate={{ rotate: dialStep * (360 / projects.length) }} transition={{ duration: reduced ? 0 : .85, ease: [.2, .75, .2, 1] }} />
          <div className="optical-ring ring-two" /><div className="optical-ring ring-three" />
        </div>
        <Link className="lens-aperture" href={`/projects/${project.id}`} aria-label={`Open ${project.title} project dossier`}>
          <motion.span key={project.id} className="lens-preview" initial={reduced ? false : { opacity: .4, scale: .91 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .45 }}><ProjectSculpture id={project.id} /></motion.span>
          <span className="lens-reflection" aria-hidden="true" />
          <span className="lens-open-mark" aria-hidden="true"><ArrowIcon width={18} /></span>
        </Link>
      </motion.div>
      <span className="lens-calibration lens-calibration-left" aria-hidden="true">VP / FIELD OF VIEW</span>
      <span className="lens-calibration lens-calibration-right" aria-hidden="true">SELECT / EXPLORE</span>
    </div>
    <div className="lens-project-tabs" role="tablist" aria-label="Preview a project">
      {projects.map((item, index) => <button key={item.id} ref={element => { tabs.current[index] = element; }} id={`lens-tab-${item.id}`} type="button" role="tab" tabIndex={active === index ? 0 : -1} aria-selected={active === index} aria-controls={`lens-panel-${item.id}`} onClick={() => select(index)} onKeyDown={event => keyboard(event, index)} aria-label={`Preview ${item.title}`}><span>{item.number}</span><b>{names[index]}</b></button>)}
    </div>
    {projects.map((item, index) => <div key={item.id} role="tabpanel" id={`lens-panel-${item.id}`} aria-labelledby={`lens-tab-${item.id}`} hidden={active !== index} className="lens-project-panel">
      <div className="lens-project-copy"><span>{item.status}</span><h2>{item.title}</h2><p>{item.subtitle}</p></div>
      <Link className="lens-project-link" href={`/projects/${item.id}`} aria-label={`Explore ${item.title}`}><ArrowIcon width={23} /></Link>
    </div>)}
    <span className="sr-only" role="status" aria-live={running ? "off" : "polite"}>Selected project: {project.title}. {project.status}.</span>
    <div className="lens-hint"><span>{reduced ? 'Manual / reduced motion' : !automatic ? 'Auto rotation paused' : hovered || focused ? 'Paused while exploring' : 'Auto rotation / every 5s'}</span><div>
      <button type="button" className="lens-auto-toggle" disabled={Boolean(reduced)} aria-pressed={automatic && !reduced} aria-label={automatic ? 'Pause automatic project rotation' : 'Resume automatic project rotation'} onClick={() => setAutomatic(value => !value)}>{automatic && !reduced ? 'Pause' : 'Resume'}</button><button type="button" onClick={() => select(active - 1)} aria-label="Previous project">&#8592;</button><button type="button" onClick={() => select(active + 1)} aria-label="Next project">&#8594;</button></div></div>
  </div>;
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type CSSProperties } from "react";
import { useMotionValue } from "motion/react";
import { projects } from "@/data/site";
import { ArrowIcon } from "@/components/ui/Icons";
import { AssistantTrigger } from "@/components/assistant/AssistantTrigger";
import { ProjectVisual } from "./ProjectVisual";
import type { GalleryInteraction } from "@/components/spatial/types";

const ProjectWorld = dynamic(() => import("@/components/spatial/ProjectWorld"), { ssr: false });
const accents = ["#c887a2", "#eda7bb", "#d6bd9a", "#a4c3bd"];
const chapterWords = ["A little more human.", "Details with personality.", "Tradition, reimagined.", "See the signal."];

export function Works() {
  const section = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const interaction = useRef<GalleryInteraction>({ x: 0, y: 0, rotation: 0, dragging: false });
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"spatial" | "index">("spatial");
  const [near, setNear] = useState(false);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleFailure = useCallback(() => { setFailed(true); setMode("index"); }, []);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-height: 630px), (max-width: 760px) and (max-height: 690px)");
    const updatePreference = () => { if (motionPreference.matches || compactViewport.matches) { setMode("index"); setPaused(true); } };
    updatePreference();
    motionPreference.addEventListener("change", updatePreference);
    compactViewport.addEventListener("change", updatePreference);
    const preload = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); }, { rootMargin: "600px" });
    let inView = false;
    const updateVisibility = () => setRunning(inView && !document.hidden);
    const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updateVisibility(); });
    preload.observe(element);
    visibility.observe(element);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => { preload.disconnect(); visibility.disconnect(); motionPreference.removeEventListener("change", updatePreference); compactViewport.removeEventListener("change", updatePreference); document.removeEventListener("visibilitychange", updateVisibility); };
  }, []);

  useEffect(() => {
    if (mode !== "spatial") return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = section.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const next = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      progress.set(next * (projects.length - 1));
      setActive(Math.round(next * (projects.length - 1)));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [mode, progress]);

  function goTo(index: number) {
    const element = section.current;
    if (!element) return;
    const top = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo({ top: top + ((element.offsetHeight - window.innerHeight) * index) / (projects.length - 1), behavior: paused ? "instant" : "smooth" });
  }

  function changeMode() {
    setMode(current => current === "spatial" ? "index" : "spatial");
    requestAnimationFrame(() => section.current?.scrollIntoView({ behavior: "instant", block: "start" }));
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const next = (event.clientX - rect.left) / rect.width * 2 - 1;
    if (interaction.current.dragging) interaction.current.rotation += (next - interaction.current.x) * 3;
    interaction.current.x = next;
    interaction.current.y = (event.clientY - rect.top) / rect.height * 2 - 1;
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !(event.target instanceof HTMLCanvasElement)) return;
    interaction.current.dragging = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  return (
    <>
      <div className="work-prologue section-shell" data-reveal><p className="eyebrow">01 / Selected work</p><h2>Different ideas.<br /><em>New dimensions.</em></h2><div className="prologue-note"><span className="orbit-symbol" aria-hidden="true">↗</span><p>Four projects. Each with a world of its own.<br />Scroll to travel. Stop to explore.</p></div></div>
      <section id="works" ref={section} className={`spatial-work ${mode === "index" ? "is-index" : "is-spatial"}`} aria-label="Selected projects" style={{ "--chapter-accent": accents[active] } as CSSProperties}>
        <div className="work-stage" onPointerMove={move} onPointerDown={startDrag} onPointerUp={() => { interaction.current.dragging = false; }} onPointerCancel={() => { interaction.current.dragging = false; }} onPointerLeave={() => { if (!interaction.current.dragging) { interaction.current.x = 0; interaction.current.y = 0; } }}>
          <div className="gallery-grid" aria-hidden="true" />
          <div className="gallery-horizon" aria-hidden="true" />
          <div className="gallery-toolbar"><span className="gallery-label"><i />Selected work <b>/ 2026</b></span><div>{mode === "spatial" && <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Resume motion" : "Pause motion"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}<button type="button" onClick={changeMode} disabled={failed} aria-label={mode === "spatial" ? "Switch to project index" : "Switch to 3D project gallery"}>{mode === "spatial" ? "Index view" : "3D view"}<span aria-hidden="true">{mode === "spatial" ? "☷" : "◇"}</span></button></div></div>
          {mode === "spatial" && <>
            <div className={`gallery-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true">
              {!ready && <div className="world-placeholder"><span>NOVA</span><div className="placeholder-orbit" /><small>Opening the gallery</small></div>}
              {near && <ProjectWorld progress={progress} interaction={interaction} running={running} paused={paused} onReady={handleReady} onFailure={handleFailure} />}
            </div>
            <span className="world-watermark" aria-hidden="true">{projects[active].number}</span>
            <div className="gallery-editorial" aria-live="polite" aria-atomic="true">{projects.map((project, index) => <article key={project.id} className={`project-chapter ${active === index ? "is-active" : ""}`} aria-hidden={active !== index} inert={active !== index}>
              <div className="chapter-meta"><span>{project.number} — {project.category}</span><span>{project.status}</span></div>
              <h3>{project.title}</h3><p className="chapter-tagline">{chapterWords[index]}</p><p className="chapter-description">{project.description}</p>
              <p className="chapter-stack">{project.stack.slice(0, 3).join(" / ")}</p>
              <div className="chapter-links"><a className="button button-primary" href={`#case-${project.id}`}>Explore project<ArrowIcon width={15} /></a>{project.href && <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">{project.id === "nova" ? "GitHub" : "Live website"}<ArrowIcon width={14} /></a>}</div>
            </article>)}</div>
            <div className="gallery-bottom"><nav className="chapter-navigation" aria-label="Project chapters">{projects.map((project, index) => <button key={project.id} type="button" onClick={() => goTo(index)} aria-label={`View ${project.title}`} aria-current={active === index ? "step" : undefined}><span>{project.number}</span><i /><b>{project.id === "billi-boba" ? "B&B" : project.id === "sadafuli" ? "Sadafuli" : project.id === "nova" ? "NOVA" : "Sentinel"}</b></button>)}</nav><p className="gallery-instruction"><span className="drag-hint">Move your cursor · Drag to turn</span><span>Scroll to discover <span aria-hidden="true">↓</span></span></p></div>
          </>}
          <div className="work-index section-shell">{projects.map(project => <article className="index-project" key={project.id}><ProjectVisual project={project} /><div><span className="eyebrow">{project.number} / {project.category}</span><h3>{project.title}</h3><p>{project.description}</p><div className="index-links"><a className="text-link" href={`#case-${project.id}`}>Explore project<ArrowIcon width={14} /></a>{project.href && <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">{project.id === "nova" ? "GitHub" : "Live website"}<ArrowIcon width={14} /></a>}</div></div></article>)}</div>
        </div>
        <noscript><style>{`.spatial-work{height:auto!important}.gallery-canvas,.gallery-editorial,.gallery-bottom,.gallery-toolbar,.world-watermark{display:none!important}.work-stage{height:auto!important;position:relative!important}.work-index{display:grid!important}`}</style></noscript>
      </section>
      <div className="gallery-outro section-shell"><span>End of selected work / More to build</span><AssistantTrigger className="text-link" prompt="Compare Viraj's four projects and explain what he built in each.">Let NOVA walk you through it<ArrowIcon width={15} /></AssistantTrigger></div>
    </>
  );
}

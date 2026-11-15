import { EraseText } from "@/components/ui/EraseText";
import Link from 'next/link';
import { TiltSurface } from '@/components/ui/TiltSurface';
import type { CSSProperties } from 'react';
import { projects } from '@/data/site';
import { caseStudyHref } from '@/data/case-studies';
import { ArrowIcon } from '@/components/ui/Icons';
import { ProjectSculpture } from '@/components/spatial/ProjectSculpture';

const themes = ['Conversation, with presence.', 'Small details. Big personality.', 'Craft meets considered code.', 'From pixels to perspective.', 'Intelligence, beyond the screen.'];
const flows = [['LISTEN', 'UNDERSTAND', 'RESPOND'], ['DISCOVER', 'PERSONALISE', 'ORDER'], ['EXPLORE', 'CURATE', 'CONNECT'], ['CAPTURE', 'DETECT', 'ALERT'], ['SEE', 'ASK', 'ASSIST']];

export function CaseFiles() {
  return <section id="case-files" className="section-shell section-space case-studio">
    <div className="section-heading" data-reveal><div><p className="eyebrow">03 / Inside the ideas</p><h2><EraseText lines={["Built with intention."]} /><br /><em><EraseText lines={["Made to be explored."]} /></em></h2></div><p>Enter a project briefing.<br />Explore its story, system and implementation.</p></div>
    <div className="case-studio-grid">{projects.map((project, index) => <article id={`case-${project.id}`} className={`case-file case-glass-card case-${project.id}`} key={project.id} data-reveal style={{ "--reveal-delay": `${(index % 2) * 85}ms` } as CSSProperties}>
      <TiltSurface className="case-card-interactive">
      <Link className="case-card-link" href={caseStudyHref(project.id)} aria-label={`Read the ${project.title} project report`}>
        <span className="case-card-top"><span>{project.number} / {project.category}</span><span className="case-card-status">{project.status}</span></span>
        <span className="case-card-art"><ProjectSculpture id={project.id} /></span>
        <span className="case-card-title"><span>{project.title}</span><span className="case-card-plus" aria-hidden="true"><ArrowIcon width={20} /></span></span>
        <span className="case-card-description">{themes[index]}</span>
        <span className="case-card-flow">{flows[index].map((word, wordIndex) => <span key={word}>{wordIndex > 0 && <i aria-hidden="true">&#8594;</i>}{word}</span>)}</span>
        <span className="case-card-open">Open project briefing<ArrowIcon width={14} /></span>
      </Link>
      <div className="case-card-report-footer"><span>Demo / How it works / Code</span>{project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">{project.id === 'nova' ? 'Repository' : 'Live website'}<ArrowIcon width={12} /></a>}</div>
    </TiltSurface></article>)}</div>
  </section>;
}

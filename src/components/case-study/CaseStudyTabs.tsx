'use client';

import { useEffect, useRef, useState } from 'react';
import type { CaseStudy } from '@/data/case-studies';
import type { Project } from '@/data/site';
import { MissionReport } from './MissionReport';
import { AssistantTrigger } from '@/components/assistant/AssistantTrigger';
import { ArrowIcon } from '@/components/ui/Icons';

const tabs = [{ id: 'demo', label: 'Demo' }, { id: 'build', label: 'How it works' }, { id: 'code', label: 'Code' }] as const;
type Tab = typeof tabs[number]['id'];

export function CaseStudyTabs({ project, study }: { project: Project; study: CaseStudy }) {
  const [active, setActive] = useState<Tab>('demo');
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const readHash = () => { const match = tabs.find(tab => `#${tab.id}` === window.location.hash); if (match) setActive(match.id); else if (window.location.hash === '#project-details') setActive('demo'); };
    readHash(); window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, []);
  function select(index: number, focus = false) {
    const tab = tabs[index];
    setActive(tab.id);
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${tab.id}`);
    if (focus) buttons.current[index]?.focus();
  }
  return <section id="project-details" className="case-details section-shell">
    <div className="case-tabbar"><div role="tablist" aria-label="Project details">{tabs.map((tab, index) => <button ref={element => { buttons.current[index] = element; }} key={tab.id} type="button" role="tab" id={`case-tab-${tab.id}`} aria-controls={`case-panel-${tab.id}`} aria-selected={active === tab.id} tabIndex={active === tab.id ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
      let next: number | undefined;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(next, true); }
    }}><span>0{index + 1}</span>{tab.label}</button>)}</div><span className="case-tab-note">A closer look at the build</span></div>

    <div role="tabpanel" id="case-panel-demo" aria-labelledby="case-tab-demo" hidden={active !== 'demo'} tabIndex={0} className="case-tab-panel">
      <div className="case-panel-intro"><div><p className="eyebrow">01 / Project briefing</p><h2>Enter the <em>story.</em></h2></div><p>An original narrated reconstruction of the project workflow. Explore the chapters, pause on a detail, or read the complete report.</p></div>
      {active === 'demo' && <MissionReport study={study} />}
      <div className="case-demo-links"><div><span className="eyebrow">Explore the actual project</span><p>{project.id === 'nova' ? 'The repository contains the desktop project.' : project.href ? 'Open the live storefront to explore its current experience.' : project.id === 'smart-glasses' ? 'This project is at the concept stage. The briefing presents the proposed experience.' : 'Sentinel is a local prototype; a public hosted demo is not linked.'}</p></div>{project.href && <a className="button button-primary" href={project.href} target="_blank" rel="noopener noreferrer">{project.id === 'nova' ? 'Open repository' : 'Visit live website'}<ArrowIcon width={15} /></a>}<AssistantTrigger className="button" prompt={`Walk me through ${project.title}, explain its current implementation, and distinguish working features from concepts.`}>Ask NOVA about this<ArrowIcon width={15} /></AssistantTrigger></div>
    </div>

    <div role="tabpanel" id="case-panel-build" aria-labelledby="case-tab-build" hidden={active !== 'build'} tabIndex={0} className="case-tab-panel">
      <div className="case-panel-intro"><div><p className="eyebrow">02 / System view</p><h2>Follow the <em>flow.</em></h2></div><p>{study.objective}</p></div>
      <ol className="case-pipeline">{study.pipeline.map((node, index) => <li key={node.name}><span>0{index + 1}</span><h3>{node.name}</h3><p>{node.detail}</p>{index < study.pipeline.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>
      <div className="case-decisions">{study.decisions.map((decision, index) => <article key={decision.title}><span className="eyebrow">Decision / 0{index + 1}</span><h3>{decision.title}</h3><p>{decision.detail}</p></article>)}</div>
      <div className="case-scope"><div><p className="eyebrow">Current state</p><h3>{project.status}</h3><p>{project.outcome}</p></div><div><p className="eyebrow">Scope &amp; limits</p><p>{project.boundary}</p></div></div>
    </div>

    <div role="tabpanel" id="case-panel-code" aria-labelledby="case-tab-code" hidden={active !== 'code'} tabIndex={0} className="case-tab-panel">
      <div className="case-panel-intro"><div><p className="eyebrow">03 / Implementation notes</p><h2>Inside the <em>build.</em></h2></div><p>{study.codeKind === 'source' ? 'A selected implementation excerpt, with the reasoning around it.' : 'A readable implementation walkthrough. This diagram is explanatory pseudocode, not an executable source excerpt.'}</p></div>
      <div className="case-code-layout"><div className="case-code-window"><div><span>{study.codeTitle}</span><b>{study.codeKind === 'source' ? 'TYPESCRIPT / SOURCE EXCERPT' : 'WORKFLOW / PSEUDOCODE'}</b></div><pre tabIndex={0} aria-label={study.codeTitle}><code>{study.code}</code></pre><p>{study.codeNote}</p></div><aside className="case-code-aside"><p className="eyebrow">Working with</p><div className="skill-tags">{project.stack.map(skill => <span key={skill}>{skill}</span>)}</div><h3>What this connects</h3><p>{project.implementation}</p>{study.sourceUrl ? <a className="button button-primary" href={study.sourceUrl} target="_blank" rel="noopener noreferrer">View source on GitHub<ArrowIcon width={15} /></a> : <p className="case-source-note">A public repository link is not published with this case study.</p>}<AssistantTrigger className="text-link" prompt={`Explain the technical approach and design tradeoffs in ${project.title}. Use verified facts and say when details are unknown.`}>Discuss the implementation<ArrowIcon width={14} /></AssistantTrigger></aside></div>
    </div>
  </section>;
}

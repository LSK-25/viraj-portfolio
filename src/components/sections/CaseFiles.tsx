import { EraseText } from "@/components/ui/EraseText";
import { projects } from '@/data/site';
import { AssistantTrigger } from '@/components/assistant/AssistantTrigger';
import { ArrowIcon } from '@/components/ui/Icons';
import { ProjectSculpture } from '@/components/spatial/ProjectSculpture';

const themes = ['Conversation, with presence.', 'Small details. Big personality.', 'Craft meets considered code.', 'From pixels to perspective.'];
const flows = [['LISTEN', 'UNDERSTAND', 'RESPOND'], ['DISCOVER', 'PERSONALISE', 'ORDER'], ['EXPLORE', 'CURATE', 'CONNECT'], ['CAPTURE', 'DETECT', 'ALERT']];

export function CaseFiles() {
  return <section id="case-files" className="section-shell section-space case-studio">
    <div className="section-heading" data-reveal><div><p className="eyebrow">03 / Inside the ideas</p><h2><EraseText lines={["Built with intention."]} /><br /><em><EraseText lines={["Made to be explored."]} /></em></h2></div><p>The problem, the decisions,<br />and the details that made it work.</p></div>
    <div className="case-studio-grid">{projects.map((project, index) => <details id={`case-${project.id}`} className={`case-file case-glass-card case-${project.id}`} key={project.id}>
      <summary>
        <span className="case-card-top"><span>{project.number} / {project.category}</span><span className="case-card-status">{project.status}</span></span>
        <span className="case-card-art"><span className="case-art-label">{project.id === 'nova' ? 'A LITTLE MORE HUMAN' : project.id === 'billi-boba' ? 'MADE FOR YOUR NEXT DETAIL' : project.id === 'sadafuli' ? 'A MODERN INDIAN STORY' : 'SEE THE SIGNAL'}</span><ProjectSculpture id={project.id} /><span className="case-art-number">{project.number}</span></span>
        <span className="case-card-title"><span>{project.title}</span><span className="case-card-plus" aria-hidden="true">+</span></span>
        <span className="case-card-description">{themes[index]}</span>
        <span className="case-card-flow">{flows[index].map((word, wordIndex) => <span key={word}>{wordIndex > 0 && <i aria-hidden="true">&#8594;</i>}{word}</span>)}</span>
        <span className="case-card-open">Explore the build<ArrowIcon width={14} /></span>
      </summary>
      <div className="case-body">
        <p className="case-subtitle">{project.subtitle}</p>
        <div className="case-columns">{[['The challenge', project.challenge], ['My approach', project.implementation], ['Where it stands', project.outcome]].map(([label, content]) => <div key={label}><h3>{label}</h3><p>{content}</p></div>)}</div>
        <div className="case-actions"><div className="skill-tags">{project.stack.map(skill => <span key={skill}>{skill}</span>)}</div><div>{project.href && <a className="text-link" href={project.href} target="_blank" rel="noopener noreferrer">{project.id === 'nova' ? 'View on GitHub' : 'Visit website'}<ArrowIcon width={14} /></a>}<AssistantTrigger className="text-link" prompt={`Explain ${project.title}, the technical approach, and its current status.`}>Talk through this build<ArrowIcon width={14} /></AssistantTrigger></div></div>
      </div>
    </details>)}</div>
  </section>;
}

import {EraseText} from '@/components/ui/EraseText';
import {ScrambleText} from '@/components/ui/ScrambleText';
import {TiltSurface} from '@/components/ui/TiltSurface';
import {projects} from '@/data/site';
import {ProjectVisual} from './ProjectVisual';
import {ArrowIcon} from '@/components/ui/Icons';
export function Works(){return <section id="works" className="section-shell section-space"><div className="section-heading" data-reveal><div><p className="eyebrow">01 / Selected work</p><h2><EraseText lines={["Built with intent."]}/></h2></div><p>Real problems. Considered decisions.<br/> A few things I’ve brought to life.</p></div><div className="work-grid">{projects.slice(0,4).map(p=><article className="work-card" data-reveal key={p.id}><TiltSurface className="project-tilt"><ProjectVisual project={p}/></TiltSurface><div className="work-meta"><span>{p.category}</span><span className="status-tag">{p.status}</span></div><h3><a href={`#case-${p.id}`}><ScrambleText text={p.title}/></a></h3><p>{p.description}</p><div className="work-footer"><span>{p.stack.slice(0,3).join(' / ')}</span><a href={p.href||`#case-${p.id}`} {...(p.href?{target:'_blank',rel:'noopener noreferrer'}:{})}>{p.href?(p.id==='nova'?'GitHub':'Visit website'):'Read case study'}<ArrowIcon width={14} height={14}/></a></div></article>)}</div></section>}

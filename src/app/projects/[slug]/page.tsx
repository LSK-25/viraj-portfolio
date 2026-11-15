import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, portfolio } from '@/data/site';
import { caseStudies, caseStudyFor, caseStudyHref } from '@/data/case-studies';
import { ProjectSculpture } from '@/components/spatial/ProjectSculpture';
import { CaseStudyTabs } from '@/components/case-study/CaseStudyTabs';
import { PortfolioAssistant } from '@/components/assistant/PortfolioAssistant';
import { ArrowIcon } from '@/components/ui/Icons';
import { EraseText } from '@/components/ui/EraseText';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return caseStudies.map(study => ({ slug: study.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(item => item.id === slug);
  if (!project) return { title: 'Project not found | Viraj Patil' };
  return { title: `${project.title} — Project report | Viraj Patil`, description: project.description, alternates: { canonical: caseStudyHref(slug) }, openGraph: { title: `${project.title} | Viraj Patil`, description: project.description } };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find(item => item.id === slug);
  const study = caseStudyFor(slug);
  if (!project || !study) notFound();
  const next = projects[(projects.findIndex(item => item.id === slug) + 1) % projects.length];
  return <div className={`case-page case-page-${slug}`}>
    <a className="skip-link" href="#project-details">Skip to project report</a>
    <header className="case-header section-shell"><Link className="wordmark" href="/">Viraj Patil</Link><Link className="case-back" href={`/#case-${slug}`}><span aria-hidden="true">←</span> Back to selected work</Link><a className="case-header-contact" href={`mailto:${portfolio.email}`}>Let&apos;s talk<ArrowIcon width={14} /></a></header>
    <main>
      <section className="case-hero section-shell"><div className="case-hero-copy"><p className="eyebrow">Project {project.number} / {project.category}</p><h1><EraseText lines={[project.title]} /></h1><p className="case-hero-subtitle">{project.subtitle}</p><p className="case-hero-description">{project.description}</p><a className="button button-primary" href="#project-details">Watch the briefing<span aria-hidden="true">▶</span></a><div className="case-hero-facts"><span><small>STATUS</small>{project.status}</span><span><small>REPORT</small>{study.codename}</span><span><small>FORMAT</small>Cinematic recreation</span></div></div><div className="case-hero-art"><ProjectSculpture id={slug} /></div></section>
      <CaseStudyTabs project={project} study={study} />
      <section className="case-next section-shell"><div><p className="eyebrow">Continue exploring</p><Link href={caseStudyHref(next.id)}>{next.title}<ArrowIcon width={30} height={30} /></Link></div><Link href="/#works" className="text-link">All selected work<ArrowIcon width={15} /></Link></section>
    </main>
    <footer className="case-footer section-shell"><Link href="/">Viraj Patil</Link><span>Built with curiosity.</span><a href="/Viraj_Patil_Resume.pdf" target="_blank" rel="noopener noreferrer">Download CV<ArrowIcon width={12} /></a></footer>
    <PortfolioAssistant />
  </div>;
}

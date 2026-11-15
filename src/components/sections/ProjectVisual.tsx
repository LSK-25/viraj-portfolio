import type { Project } from '@/data/site';
import { ArrowIcon } from '@/components/ui/Icons';
import { ProjectSculpture } from '@/components/spatial/ProjectSculpture';

export function ProjectVisual({ project }: { project: Project }) {
  return <a className={`project-visual visual-studio visual-${project.id}`} href={`/projects/${project.id}`} aria-label={`Read the ${project.title} case study`}>
    <ProjectSculpture id={project.id} />
    <span className="visual-arrow"><ArrowIcon /></span>
  </a>;
}

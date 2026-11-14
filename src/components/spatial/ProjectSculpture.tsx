import type { CSSProperties } from 'react';
import { projectArt, projectArtAtlas } from '@/data/project-art';

export function ProjectSculpture({ id, className = '' }: { id: string; className?: string }) {
  const artwork = projectArt.find(item => item.id === id) ?? projectArt[0];
  return <span className={`project-artwork artwork-${id} ${className}`} aria-hidden="true" style={{ '--art-accent': artwork.accent } as CSSProperties}>
    <span className="art-ambient" />
    <span className="art-plate">
      <span className="art-picture" style={{ backgroundImage: `url(${projectArtAtlas})`, backgroundPosition: artwork.position }} />
      <span className="art-reflection" />
      <span className="art-corner art-corner-top" /><span className="art-corner art-corner-bottom" />
    </span>
    <span className="art-caption"><span>{artwork.caption}</span><span>Visual study / {artwork.number}</span></span>
  </span>;
}

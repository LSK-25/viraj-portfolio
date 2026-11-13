import type { CSSProperties } from 'react';

export function ProjectSculpture({ id, className = '' }: { id: string; className?: string }) {
  return <span className={`project-sculpture sculpture-${id} ${className}`} aria-hidden="true">
    <span className="sculpture-orbit orbit-one" /><span className="sculpture-orbit orbit-two" />
    {id === 'nova' ? <span className="sculpture-cube"><span className="cube-face cube-front"><i /><i /><b /></span><span className="cube-face cube-right" /><span className="cube-face cube-top" /></span>
      : id === 'billi-boba' ? <span className="sculpture-nails">{['#a23b62', '#e5b4c9', '#754057', '#c59e88', '#d78faa'].map((color, index) => <i key={color} style={{ '--nail-color': color, '--nail-index': index } as CSSProperties} />)}</span>
      : id === 'sadafuli' ? <span className="sculpture-silk"><span className="silk-folds" /><span className="silk-flower">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ '--petal': index } as CSSProperties} />)}<b /></span></span>
      : <span className="sculpture-camera"><span className="camera-body"><i className="camera-lens"><b /></i><i className="camera-light" /></span><span className="camera-stand" /><span className="camera-target" /></span>}
    <span className="sculpture-floor" />
  </span>;
}

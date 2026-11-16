"use client";

import type { CaseStudy } from '@/data/case-studies';
import { NovaScene } from './NovaScene';
import { CommerceScene } from './CommerceScene';
import { SentinelScene } from './SentinelScene';
import { GlassesScene } from './GlassesScene';
import { SceneRail, sceneStyle } from './SceneElements';

export function BriefingVisual({ study, stage, progress, reduced }: { study: CaseStudy; stage: number; progress: number; reduced: boolean }) {
  const motion = reduced ? .56 : Math.max(0, Math.min(1, progress));
  return <div className={`briefing-visual scene-canvas scene-${study.id}`} style={sceneStyle(motion)} aria-hidden="true" data-reconstruction={study.id}>
    <div className="recon-shot" key={`${study.id}-${stage}`}>
      {study.id === 'nova' ? <NovaScene stage={stage} progress={motion}/> : study.id === 'sentinel' ? <SentinelScene stage={stage} progress={motion}/> : study.id === 'smart-glasses' ? <GlassesScene stage={stage} progress={motion}/> : <CommerceScene saree={study.id === 'sadafuli'} stage={stage} progress={motion}/>}
    </div>
    <SceneRail labels={study.scenes.map(scene => scene.label)} stage={stage}/>
    <div className="recon-sequence-line"><span>SEQUENCE / 0{stage + 1}</span><div><i style={{ width: `${progress * 100}%` }}/></div><span>{study.id === 'smart-glasses' ? 'PROPOSED EXPERIENCE' : 'ORIGINAL VISUAL STUDY'}</span></div>
  </div>;
}

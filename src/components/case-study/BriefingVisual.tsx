'use client';

import { useId } from 'react';
import { GlassesStudy } from '@/components/spatial/GlassesStudy';
import { projectArtAtlas } from '@/data/project-art';
import type { CaseStudy } from '@/data/case-studies';

function ArtworkTile({ index, x, y, size }: { index: number; x: number; y: number; size: number }) {
  return <svg x={x} y={y} width={size} height={size} viewBox="0 0 627 627" overflow="hidden"><image href={projectArtAtlas} x={index % 2 ? -627 : 0} y={index > 1 ? -627 : 0} width="1254" height="1254" /></svg>;
}

export function BriefingVisual({ study, stage, progress, reduced }: { study: CaseStudy; stage: number; progress: number; reduced: boolean }) {
  const prefix = useId().replace(/:/g, '');
  const motion = reduced ? .45 : progress;
  const sentinel = study.id === 'sentinel';
  const nova = study.id === 'nova';
  const personX = 280 + motion * 330;
  return <svg className="briefing-visual" viewBox="0 0 960 540" fill="none" aria-hidden="true">
    <defs>
      <pattern id={`${prefix}grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" stroke="currentColor" strokeOpacity=".075" /></pattern>
      <radialGradient id={`${prefix}light`}><stop stopColor={study.accent} stopOpacity=".13" /><stop offset="1" stopColor="#090c10" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${prefix}floor`} x1="480" y1="140" x2="480" y2="460" gradientUnits="userSpaceOnUse"><stop stopColor="#203031" /><stop offset="1" stopColor="#0b1116" /></linearGradient>
    </defs>
    <rect width="960" height="540" fill="#0a0d12" /><rect width="960" height="540" fill={`url(#${prefix}grid)`} /><ellipse cx="485" cy="280" rx="430" ry="260" fill={`url(#${prefix}light)`} />
    <g stroke="currentColor" strokeOpacity=".35"><path d="M25 75V25H75M885 25H935V75M25 465V515H75M885 515H935V465" /><path d="M460 25H500M480 15V35M460 515H500M480 505V525" /></g>
    <g className="report-vector-type" fill="currentColor" opacity=".5"><text x="45" y="53">PROJECT SYSTEM / {study.codename}</text><text x="700" y="53">VISUAL RECONSTRUCTION</text></g>
    {study.id === 'smart-glasses' ? <g>
      <svg x="65" y="70" width="505" height="375" viewBox="0 0 700 520"><GlassesStudy /></svg>
      {study.pipeline.map((node,index)=><g key={node.name} transform={`translate(610 ${120+index*73})`} opacity={stage === 0 || stage >= index+1 ? 1 : .3}><circle cx="0" cy="0" r="5" fill={study.accent}/><text x="20" y="6" className="report-vector-heading" fill={study.accent}>{node.name}</text>{index<3 && <path d="M0 14V57" stroke={study.accent} strokeDasharray="3 5"/>}</g>)}
      <text x="95" y="454" className="report-vector-type" fill={study.accent}>PROPOSED EXPERIENCE / HARDWARE NOT BUILT</text>
    </g> : sentinel ? <g>
      <path d="M70 445L410 120H550L890 445Z" fill={`url(#${prefix}floor)`} stroke="currentColor" strokeOpacity=".2" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <g key={i} stroke="currentColor" strokeOpacity=".14"><path d={`M${70 + i * 117} 445L${410 + i * 20} 120`} /><path d={`M${70 + i * 33} ${445 - i * 37}H${890 - i * 33}`} /><path d={`M${70 + i * 39} ${445 - i * 37}V${80 + i * 7}`} /></g>)}
      <path d="M60 445V85L410 120M900 445V85L550 120" stroke="currentColor" strokeOpacity=".3" />
      {stage >= 2 && <g><path d="M345 380L420 255H565L665 380Z" stroke={study.accent} strokeDasharray="7 5" fill={study.accent} fillOpacity=".055" /><text x="475" y="402" className="report-vector-type" fill={study.accent}>ZONE / ILLUSTRATION</text></g>}
      <g transform={`translate(${personX} 292)`} className="report-subject"><ellipse cy="100" rx="32" ry="7" fill="#0008" /><circle cy="-34" r="14" fill="#b0c2c399" /><path d="M-11-16Q-26-11-27 29L-18 31L-13 2L-10 42L-20 90H-8L3 49L13 90H24L15 40L13 1L23 30L32 25L22-12Z" fill="#8c9fa9aa" />
        {stage >= 1 && <g stroke={study.accent}><rect x="-39" y="-57" width="82" height="157" /><path d="M-45-62H-25M-44-62V-42M49 106H29M49 106V86" strokeWidth="2" /><text x="-38" y="-70" className="report-vector-type" fill={study.accent} stroke="none">PERSON / DEMO</text></g>}
      </g>
      {stage >= 3 && <g transform="translate(652 112)"><rect width="235" height="137" rx="5" fill="#111a22ed" stroke={study.accent} strokeOpacity=".45" /><text x="18" y="29" className="report-vector-type" fill={study.accent}>EVENT RECONSTRUCTION</text><path d="M18 44H215" stroke={study.accent} strokeOpacity=".2" /><text x="18" y="70" className="report-vector-copy" fill="#dbe6e6">Detection → hold → evidence</text><text x="18" y="94" className="report-vector-type" fill="#84969b">Illustrative event. No live feed.</text><path d="M18 115H132" stroke={study.accent} /></g>}
      {!reduced && <path d={`M70 ${130 + motion * 315}H890`} stroke={study.accent} strokeOpacity=".18" />}
    </g> : nova ? <g>
      <ArtworkTile index={0} x={94} y={83} size={350} />
      <path d="M474 134V408M454 270H514" stroke={study.accent} strokeOpacity=".35" />
      {['SPEECH', 'TRANSCRIPT', 'LOCAL MODEL', 'RESPONSE'].map((label, index) => <g key={label} transform={`translate(530 ${112 + index * 75})`} opacity={stage === index + 1 || stage === 4 ? 1 : .34}><rect width="309" height="52" rx="5" stroke={study.accent} fill={study.accent} fillOpacity=".04" /><circle cx="22" cy="26" r="4" fill={study.accent} /><text x="42" y="31" className="report-vector-type" fill={study.accent}>{label}</text><text x="270" y="31" className="report-vector-type" fill={study.accent}>0{index + 1}</text>{index < 3 && <path d="M150 52V73" stroke={study.accent} strokeDasharray="3 3" />}</g>)}
      {Array.from({ length: 48 }, (_, index) => <rect key={index} x={130 + index * 5.7} y={462 - (6 + Math.sin(index * .7 + motion * 14) ** 2 * 20)} width="2" height={12 + Math.sin(index * .7 + motion * 14) ** 2 * 40} rx="1" fill={study.accent} opacity=".75" />)}
      <text x="540" y="462" className="report-vector-type" fill={study.accent} opacity=".6">ILLUSTRATED SIGNAL / NO MICROPHONE ACCESS</text>
    </g> : <g>
      <g transform="translate(57 88)"><rect width="456" height="342" rx="9" fill="#111217" stroke={study.accent} strokeOpacity=".45" /><path d="M0 33H456" stroke={study.accent} strokeOpacity=".2" />{[18, 31, 44].map(x => <circle key={x} cx={x} cy="17" r="3" fill={study.accent} opacity=".5" />)}<text x="292" y="22" className="report-vector-type" fill={study.accent}>STOREFRONT STUDY</text>
        <ArtworkTile index={study.id === 'sadafuli' ? 2 : 1} x={16} y={49} size={275} />
        <text x="310" y="80" className="report-vector-type" fill={study.accent}>DISCOVER</text><path d="M310 96H422M310 105H397M310 114H410" stroke={study.accent} strokeOpacity=".25" />
        <rect x="310" y="140" width="124" height="75" rx="4" stroke={study.accent} strokeOpacity={stage >= 2 ? '.7' : '.2'} fill={study.accent} fillOpacity={stage >= 2 ? '.08' : '.01'} /><text x="323" y="169" className="report-vector-type" fill={study.accent}>SELECTION</text><path d="M323 184H411M323 194H388" stroke={study.accent} strokeOpacity=".4" />
        <rect x="310" y="245" width="124" height="33" rx="3" fill={study.accent} fillOpacity={stage >= 3 ? '.3' : '.06'} stroke={study.accent} strokeOpacity=".5" /><text x="325" y="266" className="report-vector-type" fill={study.accent}>{study.id === 'sadafuli' ? 'ENQUIRY' : 'ORDER FLOW'}</text>
      </g>
      {study.pipeline.map((node, index) => <g key={node.name} transform={`translate(584 ${104 + index * 80})`} opacity={stage === 0 || stage >= index + 1 ? 1 : .35}><circle cx="16" cy="22" r="16" stroke={study.accent} fill={study.accent} fillOpacity=".06" /><text x="9" y="26" className="report-vector-type" fill={study.accent}>0{index + 1}</text><text x="48" y="27" className="report-vector-heading" fill="#e6dfe6">{node.name}</text>{index < 3 && <path d="M16 39V64" stroke={study.accent} strokeDasharray="3 4" />}<path d="M48 42H290" stroke={study.accent} strokeOpacity=".18" /></g>)}
      <text x="76" y="468" className="report-vector-type" fill={study.accent} opacity=".65">CONCEPT PANELS / ACTUAL CATALOG MAY DIFFER</text>
    </g>}
    <g className="report-vector-type" fill="currentColor" opacity=".45"><text x="45" y="505">SEQUENCE / 0{stage + 1}</text><text x="733" y="505">VIRAJ PATIL / FIELD NOTES</text></g>
  </svg>;
}

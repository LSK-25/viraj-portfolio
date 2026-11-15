"use client";

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import { Group, Shape, ExtrudeGeometry, SRGBColorSpace, ClampToEdgeWrapping } from 'three';
import { projectArt, projectArtAtlas } from '@/data/project-art';

type AnimatedProps = { paused: boolean };

function StudioModel({ index, paused }: AnimatedProps & { index: number }) {
  const original = useTexture(projectArtAtlas);
  const texture = useMemo(() => {
    const tile = original.clone();
    tile.colorSpace = SRGBColorSpace;
    tile.wrapS = tile.wrapT = ClampToEdgeWrapping;
    tile.repeat.set(.5, .5);
    tile.offset.set(index % 2 ? .5 : 0, index < 2 ? .5 : 0);
    tile.anisotropy = 4;
    tile.needsUpdate = true;
    return tile;
  }, [original, index]);
  useEffect(() => () => texture.dispose(), [texture]);
  const mount = useRef<Group>(null);
  const clock = useRef(0);
  useFrame((_, delta) => {
    if (!paused) clock.current += Math.min(delta, .05);
    if (mount.current) mount.current.rotation.z = Math.sin(clock.current * .28 + index) * .012;
  });
  const accent = projectArt[index].accent;

  return <group ref={mount} rotation={[.015, -.1, 0]}>
    <RoundedBox args={[5.85, 5.85, .16]} radius={.16} smoothness={4} position={[.14, .1, -.24]}>
      <meshPhysicalMaterial color={accent} metalness={.85} roughness={.3} clearcoat={.5} />
    </RoundedBox>
    <RoundedBox args={[5.8, 5.8, .2]} radius={.12} smoothness={4}>
      <meshPhysicalMaterial color="#211b24" metalness={.8} roughness={.25} clearcoat={.7} />
    </RoundedBox>
    <mesh position={[0, 0, .105]}>
      <planeGeometry args={[5.56, 5.56]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
    {/* Metallic inlays give the display depth without hiding the artwork. */}
    {[-1, 1].map(direction => <group key={direction} position={[direction * 2.78, direction * 2.78, .12]}>
      <mesh position={[-direction * .17, 0, 0]}><boxGeometry args={[.35, .018, .025]} /><meshStandardMaterial color={accent} metalness={1} roughness={.2} /></mesh>
      <mesh position={[0, -direction * .17, 0]}><boxGeometry args={[.018, .35, .025]} /><meshStandardMaterial color={accent} metalness={1} roughness={.2} /></mesh>
    </group>)}
  </group>;
}

export function NovaModel(props: AnimatedProps) { return <StudioModel index={0} {...props} />; }
export function BilliModel(props: AnimatedProps) { return <StudioModel index={1} {...props} />; }
export function SadafuliModel(props: AnimatedProps) { return <StudioModel index={2} {...props} />; }
export function SentinelModel(props: AnimatedProps) { return <StudioModel index={3} {...props} />; }

export function GlassesModel({ paused }: AnimatedProps) {
 const ref=useRef<Group>(null);
 const clock=useRef(0);
 const lens = useMemo(() => { const s=new Shape(); s.moveTo(-1,-.45); s.quadraticCurveTo(-1.1,-.8,-.65,-.8); s.lineTo(.65,-.8); s.quadraticCurveTo(1,-.75,1,.05); s.lineTo(1,.55); s.quadraticCurveTo(.9,.75,0,.75); s.quadraticCurveTo(-.9,.75,-1,.55); s.closePath(); return new ExtrudeGeometry(s,{depth:.07,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.06,bevelThickness:.04}); },[]);
 useEffect(()=>()=>lens.dispose(),[lens]);
 useFrame((_,delta)=>{ if(!paused) clock.current+=Math.min(delta,.05); if(ref.current) ref.current.rotation.y=-.25+Math.sin(clock.current*.3)*.1; });
 return <group ref={ref} rotation={[.14,-.25,-.12]}>
 {[-1,1].map(side=><group key={side} position={[side*1.22,0,0]}><mesh geometry={lens}><meshPhysicalMaterial color="#181e1d" metalness={.8} roughness={.24}/></mesh><mesh geometry={lens} scale={[.87,.78,1]} position={[0,0,.14]}><meshPhysicalMaterial color="#557a76" metalness={.5} roughness={.12} transparent opacity={.72} clearcoat={1}/></mesh><RoundedBox args={[.18,.2,2.6]} radius={.08} position={[side*.98,.5,-1.2]}><meshStandardMaterial color="#454641" metalness={.85} roughness={.2}/></RoundedBox></group>)}
 <mesh position={[0,.18,0]}><torusGeometry args={[.3,.075,12,32,Math.PI]}/><meshStandardMaterial color="#b6ad96" metalness={1} roughness={.25}/></mesh><mesh position={[-2.25,.5,.2]} rotation={[Math.PI/2,0,0]}><cylinderGeometry args={[.085,.085,.07,24]}/><meshStandardMaterial color="#07090a" metalness={.4} roughness={.1}/></mesh>
 </group>;
}

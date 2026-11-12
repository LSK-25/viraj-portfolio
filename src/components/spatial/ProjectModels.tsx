"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CanvasTexture, DoubleSide, Group, Mesh, PlaneGeometry, RepeatWrapping, SRGBColorSpace, type Texture } from "three";

type AnimatedProps = { paused: boolean };

function useArtwork(kind: "billi" | "sadafuli" | "sentinel") {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200; canvas.height = 840;
    const ctx = canvas.getContext("2d")!;
    const palette = kind === "billi" ? ["#f0ced7", "#67253f"] : kind === "sadafuli" ? ["#eee3d2", "#51452f"] : ["#14201f", "#afc9bf"];
    ctx.fillStyle = palette[0]; ctx.fillRect(0, 0, 1200, 840);
    ctx.strokeStyle = palette[1] + "22"; ctx.strokeRect(26, 26, 1148, 788);
    ctx.fillStyle = palette[1]; ctx.font = "18px monospace";
    ctx.fillText(kind === "billi" ? "MADE FOR YOUR NEXT DETAIL" : kind === "sadafuli" ? "A MODERN INDIAN SAREE STORY" : "COMPUTER VISION / CONCEPT VIEW", 60, 76);
    ctx.fillText(kind === "billi" ? "02 / BILLi&BoBA" : kind === "sadafuli" ? "03 / BY ISHA" : "04 / SENTINEL", 60, 788);
    if (kind === "billi") {
      ctx.font = "96px Georgia"; ctx.fillText("BILLi&BoBA", 60, 245);
      ctx.font = "italic 42px Georgia"; ctx.fillText("A little extra. All you.", 65, 315);
      ["#922c51", "#edacbd", "#b88079", "#dfd0b9", "#633049"].forEach((color, index) => {
        ctx.save(); ctx.translate(180 + index * 200, 520 + Math.sin(index) * 50); ctx.rotate((index - 2) * .13);
        const gradient = ctx.createLinearGradient(-70, 0, 70, 0); gradient.addColorStop(0, color); gradient.addColorStop(.45, "#fff4e488"); gradient.addColorStop(.6, color); gradient.addColorStop(1, color);
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.roundRect(-60, -110, 120, 210, [65, 65, 22, 22]); ctx.fill();
        ctx.strokeStyle = "#fff6"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
      });
    } else if (kind === "sadafuli") {
      ctx.font = "122px Georgia"; ctx.fillText("sadafuli", 65, 260);
      ctx.font = "22px sans-serif"; ctx.fillText("B Y   I S H A", 75, 310);
      ctx.font = "italic 45px Georgia"; ctx.fillText("Tradition, thoughtfully reimagined.", 65, 640);
      ctx.strokeStyle = "#a18a58"; ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.ellipse(930, 350, 58, 170, i * Math.PI / 4, 0, Math.PI * 2); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(930, 350, 36, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.strokeStyle = "#8ba99a18"; ctx.lineWidth = 1;
      for (let x = 60; x < 1140; x += 45) { ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x, 710); ctx.stroke(); }
      for (let y = 130; y < 720; y += 45) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(1140, y); ctx.stroke(); }
      ctx.font = "95px sans-serif"; ctx.fillText("SENTINEL", 60, 260);
      ctx.font = "19px monospace"; ctx.fillText("FRAME  →  DETECT  →  ALERT", 64, 310);
      ctx.strokeStyle = "#a8c7b8"; ctx.lineWidth = 3; ctx.strokeRect(740, 350, 190, 300);
      ctx.fillStyle = "#94b4a433"; ctx.beginPath(); ctx.ellipse(835, 425, 33, 42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.roundRect(785, 475, 100, 150, [35, 35, 5, 5]); ctx.fill();
      ctx.fillStyle = "#bad2c7"; ctx.font = "17px monospace"; ctx.fillText("PERSON / DETECTION STUDY", 710, 690);
    }
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; result.anisotropy = 4; return result;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

function Artwork({ texture, position, rotation = [0, 0, 0], scale = 1 }: { texture: Texture; position: [number, number, number]; rotation?: [number, number, number]; scale?: number }) {
  return <group position={position} rotation={rotation} scale={scale}><RoundedBox args={[5.9, 4.16, .13]} radius={.08} smoothness={3}><meshStandardMaterial color="#3b3239" metalness={.8} roughness={.25} /></RoundedBox><mesh position={[0, 0, .075]}><planeGeometry args={[5.72, 4]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh></group>;
}

export function Halo({ color = "#a34c70" }: { color?: string }) {
  return <group rotation={[.3, -.3, .25]}><mesh><torusGeometry args={[3.8, .028, 8, 128]} /><meshStandardMaterial color={color} metalness={.8} roughness={.3} emissive={color} emissiveIntensity={.1} /></mesh><mesh rotation={[.85, .25, -.2]}><torusGeometry args={[3.92, .009, 6, 128]} /><meshBasicMaterial color={color} transparent opacity={.4} /></mesh></group>;
}

export function NovaModel({ paused }: AnimatedProps) {
  const eyes = useRef<Group>(null);
  const rings = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (paused) return;
    time.current += Math.min(delta, .05);
    if (eyes.current) { const blink = time.current % 5.8; eyes.current.scale.y = blink > 5.55 ? .15 + Math.abs(Math.cos((blink - 5.55) * 12)) * .85 : 1; }
    if (rings.current) rings.current.rotation.z = time.current * .075;
  });
  return <>
    <group ref={rings} position={[0, .1, -.8]}><Halo /><mesh rotation={[.8, -.4, .6]}><torusGeometry args={[2.8, .045, 12, 100]} /><meshStandardMaterial color="#cb8caa" metalness={.94} roughness={.18} /></mesh></group>
    <group rotation={[.14, -.35, -.09]}>
      <RoundedBox args={[2.95, 2.65, 2.2]} radius={.3} smoothness={5}><meshPhysicalMaterial color="#3b363c" metalness={.92} roughness={.23} clearcoat={.8} clearcoatRoughness={.25} /></RoundedBox>
      <RoundedBox args={[2.68, 2.35, .12]} radius={.24} smoothness={5} position={[0, 0, 1.11]}><meshPhysicalMaterial color="#07080b" metalness={.35} roughness={.16} clearcoat={1} /></RoundedBox>
      <group position={[0, .16, 1.2]} ref={eyes}>{[-.62, .62].map(x => <RoundedBox key={x} args={[.24, .7, .045]} radius={.12} smoothness={4} position={[x, 0, 0]} rotation={[0, 0, x > 0 ? -.06 : .06]}><meshBasicMaterial color="#f6d6e5" toneMapped={false} /></RoundedBox>)}</group>
      <mesh position={[0, -.66, 1.19]}><sphereGeometry args={[.045, 16, 12]} /><meshBasicMaterial color="#b14d72" /></mesh>
      {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[1.484, -.63 + index * .18, .03]}><boxGeometry args={[.018, .025, 1.28]} /><meshStandardMaterial color="#111014" roughness={.75} /></mesh>)}
      <mesh position={[0, 1.35, -.15]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.4, .035, 8, 48]} /><meshStandardMaterial color="#8d657c" metalness={.8} roughness={.3} /></mesh>
    </group>
    {[-1, 1].map((direction, index) => <mesh key={direction} position={[direction * 3.1, direction * 1.3, index ? .6 : -1.3]} rotation={[.3, .4, .7]}><octahedronGeometry args={[.25]} /><meshPhysicalMaterial color="#ad718c" metalness={1} roughness={.14} /></mesh>)}
  </>;
}

export function BilliModel({ paused }: AnimatedProps) {
  const artwork = useArtwork("billi");
  const fan = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => { if (!paused) time.current += Math.min(delta, .05); if (fan.current) fan.current.rotation.z = -.12 + Math.sin(time.current * .5) * .045; });
  return <>
    <Artwork texture={artwork} position={[.4, .3, -1.5]} rotation={[.02, -.2, .03]} scale={1.05} />
    <group ref={fan} position={[-.1, -.1, 1.2]} rotation={[.15, -.14, -.12]}>
      {["#a72f5b", "#f4c8d6", "#82455c", "#e5c2b0", "#e29bb8"].map((color, index) => <group key={color} position={[(index - 2) * .8, -.25 + Math.cos((index - 2) * .6) * .8, Math.cos(index) * .18]} rotation={[.08, (index - 2) * -.12, (2 - index) * .23]}>
        <mesh scale={[.43, 1.2 + (index === 2 ? .15 : 0), .19]}><capsuleGeometry args={[.72, .85, 8, 24]} /><meshPhysicalMaterial color={color} metalness={.15} roughness={.18} clearcoat={1} clearcoatRoughness={.08} /></mesh>
        {(index === 0 || index === 3) && <mesh position={[0, .55, .14]} rotation={[.4, 0, .3]}><torusGeometry args={[.23, .018, 8, 32]} /><meshStandardMaterial color="#e3c6a0" metalness={1} roughness={.15} /></mesh>}
        {index === 2 && <mesh position={[0, .42, .15]} rotation={[0, .3, .4]}><octahedronGeometry args={[.12]} /><meshPhysicalMaterial color="#f7eff5" metalness={.9} roughness={.05} /></mesh>}
      </group>)}
    </group>
    <mesh position={[0, -2.65, .5]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[2.8, .07, 12, 100]} /><meshPhysicalMaterial color="#efc6d1" metalness={.8} roughness={.2} /></mesh>
  </>;
}

export function SadafuliModel({ paused }: AnimatedProps) {
  const artwork = useArtwork("sadafuli");
  const cloth = useRef<Mesh>(null);
  const time = useRef(0);
  const geometry = useMemo(() => {
    const plane = new PlaneGeometry(4.7, 5.4, 64, 64);
    const position = plane.attributes.position;
    for (let index = 0; index < position.count; index++) {
      const x = position.getX(index), y = position.getY(index);
      position.setZ(index, Math.sin(x * 4.3 + y * .6) * .23 + Math.sin(y * .9) * .65);
      position.setX(index, x + Math.sin(y * .8) * .28);
    }
    plane.computeVertexNormals(); return plane;
  }, []);
  const weave = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!; ctx.fillStyle = "#d4b39e"; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 256; i += 4) { ctx.strokeStyle = i % 8 ? "#ecd1b822" : "#644b321a"; ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke(); }
    const map = new CanvasTexture(canvas); map.colorSpace = SRGBColorSpace; map.wrapS = map.wrapT = RepeatWrapping; map.repeat.set(3, 4); return map;
  }, []);
  useEffect(() => () => { geometry.dispose(); weave.dispose(); }, [geometry, weave]);
  useFrame((_, delta) => { if (!paused) time.current += Math.min(delta, .05); if (cloth.current) { cloth.current.rotation.y = -.35 + Math.sin(time.current * .45) * .13; cloth.current.position.y = Math.sin(time.current * .6) * .1; } });
  return <>
    <Artwork texture={artwork} position={[-.3, .25, -2]} rotation={[0, .15, -.04]} />
    <mesh geometry={geometry} ref={cloth} position={[1.3, 0, .35]} rotation={[.12, -.35, -.32]}><meshPhysicalMaterial map={weave} side={DoubleSide} metalness={.16} roughness={.54} sheen={1} sheenColor="#e8c5a4" sheenRoughness={.65} /></mesh>
    <group position={[-1.65, -.6, 1.8]} rotation={[.2, -.3, .1]}>{Array.from({ length: 8 }, (_, index) => <mesh key={index} rotation={[0, 0, index * Math.PI / 4]} position={[Math.sin(index * Math.PI / 4) * .52, Math.cos(index * Math.PI / 4) * .52, Math.sin(index) * .06]} scale={[.29, .67, .1]}><sphereGeometry args={[1, 20, 12]} /><meshPhysicalMaterial color="#b99b65" metalness={1} roughness={.23} clearcoat={.5} /></mesh>)}<mesh><sphereGeometry args={[.27, 20, 14]} /><meshStandardMaterial color="#c4a776" metalness={1} roughness={.18} /></mesh></group>
    <mesh position={[.4, 0, -.4]} rotation={[.2, -.2, .18]}><torusGeometry args={[3.55, .025, 8, 120]} /><meshStandardMaterial color="#bda36e" metalness={.9} roughness={.25} /></mesh>
  </>;
}

export function SentinelModel({ paused }: AnimatedProps) {
  const artwork = useArtwork("sentinel");
  const scanner = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => { if (!paused) time.current += Math.min(delta, .05); if (scanner.current) scanner.current.rotation.y = Math.sin(time.current * .5) * .18; });
  return <>
    <Artwork texture={artwork} position={[.3, .35, -2]} rotation={[.04, -.15, .03]} />
    <group ref={scanner} position={[-.1, 0, .7]}>
      <group rotation={[.18, -.28, -.09]}>
        <RoundedBox args={[3.4, 2.15, 1.75]} radius={.25} smoothness={4}><meshPhysicalMaterial color="#434d4d" metalness={.93} roughness={.25} clearcoat={.7} /></RoundedBox>
        <RoundedBox args={[3.1, 1.85, .15]} radius={.18} smoothness={3} position={[0, 0, .9]}><meshStandardMaterial color="#101517" roughness={.24} metalness={.6} /></RoundedBox>
        <group position={[-.38, .04, 1]}>{[1, .78, .58, .31].map((radius, index) => <mesh key={radius} position={[0, 0, index * .13]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[radius, radius, .24, 48]} /><meshPhysicalMaterial color={index % 2 ? "#121c25" : "#586769"} metalness={index % 2 ? .5 : 1} roughness={.16} clearcoat={1} /></mesh>)}<mesh position={[0, 0, .5]}><torusGeometry args={[.48, .018, 10, 64]} /><meshBasicMaterial color="#a1ccbb" /></mesh><mesh position={[-.09, .12, .55]} scale={[.5, 1, 1]}><sphereGeometry args={[.08, 16, 12]} /><meshBasicMaterial color="#d9eee7" /></mesh></group>
        <mesh position={[1.1, .47, 1]}><sphereGeometry args={[.055, 16, 12]} /><meshBasicMaterial color="#e888a1" /></mesh>
        <mesh position={[.4, -1.35, -.1]} rotation={[0, 0, -.13]}><boxGeometry args={[.35, .7, .6]} /><meshStandardMaterial color="#40494a" metalness={1} roughness={.22} /></mesh>
        <RoundedBox args={[1.9, .18, 1.2]} radius={.07} smoothness={2} position={[.4, -1.75, -.1]}><meshStandardMaterial color="#586264" metalness={.9} roughness={.28} /></RoundedBox>
      </group>
    </group>
    <group position={[.3, .2, -1]} rotation={[.15, -.2, .16]}>{[2.9, 3.4].map(radius => <mesh key={radius}><torusGeometry args={[radius, .012, 6, 100]} /><meshBasicMaterial color="#96b8ab" transparent opacity={.6} /></mesh>)}</group>
    {[-1, 1].map(direction => <group key={direction} position={[direction * 3, direction * 1.65, .5]}><mesh><boxGeometry args={[.65, .025, .025]} /><meshBasicMaterial color="#a5c3b9" /></mesh><mesh position={[-direction * .3, -direction * .3, 0]}><boxGeometry args={[.025, .65, .025]} /><meshBasicMaterial color="#a5c3b9" /></mesh></group>)}
  </>;
}

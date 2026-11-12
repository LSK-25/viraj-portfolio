"use client";

import { Component, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type MotionValue } from "motion/react";
import { Group, MathUtils, PMREMGenerator } from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { BilliModel, NovaModel, SadafuliModel, SentinelModel } from "./ProjectModels";
import type { GalleryInteraction } from "./types";

type Props = {
  progress: MotionValue<number>;
  interaction: RefObject<GalleryInteraction>;
  running: boolean;
  paused: boolean;
  onReady: () => void;
  onFailure: () => void;
};

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Unavailable({ onFailure }: { onFailure: () => void }) {
  useEffect(onFailure, [onFailure]);
  return null;
}

function Lighting({ onFailure }: { onFailure: () => void }) {
  const getState = useThree(state => state.get);
  useEffect(() => {
    // Three.js scene objects are mutable renderer resources, outside React state.
    const { gl, scene } = getState();
    const room = new RoomEnvironment();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(room, .06);
    const previous = scene.environment;
    scene.environment = target.texture;
    scene.environmentIntensity = 1.35;
    room.dispose();
    generator.dispose();
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => { gl.domElement.removeEventListener("webglcontextlost", lost); scene.environment = previous; target.dispose(); };
  }, [getState, onFailure]);
  return <><ambientLight intensity={.6} /><directionalLight position={[3, 6, 5]} intensity={3} color="#fff0e2" /><directionalLight position={[-5, 1, 3]} intensity={2.5} color="#b77595" /><directionalLight position={[1, -4, 2]} intensity={.8} color="#b0c9d1" /></>;
}

function CameraTravel({ progress, interaction, paused }: Pick<Props, "progress" | "interaction" | "paused">) {
  const settled = useRef(false);
  useFrame(({ camera, size }, delta) => {
    const p = progress.get();
    const mobile = size.width < 620;
    const targetZ = (mobile ? 13 : 11) - p * 20;
    const input = interaction.current;
    const x = paused ? 0 : input.x * .35 + Math.sin(p * Math.PI * 2) * .7;
    const y = paused ? 0 : -input.y * .25 + Math.sin(p * Math.PI) * .3;
    if (!settled.current) { camera.position.set(x, y, targetZ); settled.current = true; }
    camera.position.x = MathUtils.damp(camera.position.x, x, 5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, y, 5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 8, delta);
    camera.lookAt(0, 0, camera.position.z - 15);
  });
  return null;
}

function ChapterWorld({ index, progress, interaction, paused }: { index: number } & Pick<Props, "progress" | "interaction" | "paused">) {
  const world = useRef<Group>(null);
  const object = useRef<Group>(null);
  const time = useRef(0);
  const Model = [NovaModel, BilliModel, SadafuliModel, SentinelModel][index];
  useFrame((_, delta) => {
    if (!paused) time.current += Math.min(delta, .05);
    if (world.current) {
      const distance = progress.get() - index;
      world.current.visible = Math.abs(distance) < 1.05;
      // Exit to the side before the camera reaches the object, avoiding a
      // full-screen collision while travelling to the next chapter.
      world.current.position.x = Math.max(0, distance) ** 2 * 24;
      world.current.position.y = Math.sin(Math.min(1, Math.max(0, distance)) * Math.PI) * .75;
    }
    if (object.current) {
      object.current.position.y = Math.sin(time.current * .55 + index) * .12;
      const rotation = interaction.current.rotation + (paused ? 0 : Math.sin(time.current * .28 + index) * .055);
      object.current.rotation.y = MathUtils.damp(object.current.rotation.y, rotation, 6, delta);
      object.current.rotation.x = MathUtils.damp(object.current.rotation.x, paused ? 0 : -interaction.current.y * .045, 5, delta);
    }
  });
  return <group ref={world} position={[0, 0, -index * 20]}><group ref={object}><Model paused={paused} /></group></group>;
}

export default function ProjectWorld(props: Props) {
  return <SceneBoundary onFailure={props.onFailure}><Canvas
    camera={{ position: [0, 0, 11], fov: 44, near: .1, far: 85 }}
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    frameloop={props.running ? "always" : "demand"}
    fallback={<Unavailable onFailure={props.onFailure} />}
    onCreated={({ gl }) => { gl.setClearColor("#0b0b0c", 0); props.onReady(); }}
    style={{ touchAction: "pan-y" }}
  >
    <fog attach="fog" args={["#0b0b0c", 15, 35]} />
    <Lighting onFailure={props.onFailure} />
    <CameraTravel {...props} />
    {[0, 1, 2, 3].map(index => <ChapterWorld key={index} index={index} {...props} />)}
  </Canvas></SceneBoundary>;
}

'use client';

import {motion, useMotionValue, useReducedMotion, useSpring, useTransform} from 'motion/react';
import type {ReactNode, PointerEvent} from 'react';

export function TiltSurface({children, className = '', label}: {children: ReactNode; className?: string; label?: string}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, {stiffness: 150, damping: 23});
  const springY = useSpring(y, {stiffness: 150, damping: 23});
  const rotateY = useTransform(springX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }
  function reset() {x.set(0); y.set(0);}
  return <motion.div className={className} aria-label={label} role={label ? 'img' : undefined}
    onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}
    style={{rotateX: reduced ? 0 : rotateX, rotateY: reduced ? 0 : rotateY, transformPerspective: 1000}}>
    {children}
  </motion.div>;
}

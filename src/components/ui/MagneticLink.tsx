'use client';

import {motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps} from 'motion/react';
import type {PointerEvent} from 'react';

type MagneticLinkProps = Omit<HTMLMotionProps<'a'>, 'style' | 'onPointerMove' | 'onPointerLeave'>;

export function MagneticLink({children, className = '', ...props}: MagneticLinkProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, {stiffness: 240, damping: 20});
  const springY = useSpring(y, {stiffness: 240, damping: 20});
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (reduced || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.2);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.24);
  }
  function reset() {x.set(0); y.set(0);}
  return <motion.a {...props} className={'magnetic-link ' + className} onPointerMove={move} onPointerLeave={reset}
    style={{x: reduced ? 0 : springX, y: reduced ? 0 : springY}}>{children}</motion.a>;
}

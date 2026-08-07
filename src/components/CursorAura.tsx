"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";

export function CursorAura() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 28 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 28 });

  const background = useMotionTemplate`
    radial-gradient(
      620px circle at ${smoothX}px ${smoothY}px,
      rgba(199, 175, 134, 0.13),
      rgba(122, 25, 25, 0.08) 32%,
      transparent 62%
    )
  `;

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[5]"
      style={{ background }}
      aria-hidden="true"
    />
  );
}
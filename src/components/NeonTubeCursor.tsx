"use client";

import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  age: number;
};

export function NeonTubeCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointsRef = useRef<Point[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const targetCanvas = canvasRef.current;
    if (!targetCanvas) return;

    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;

    const canvas = targetCanvas;
    const context = ctx;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onPointerMove(event: PointerEvent) {
      pointsRef.current.push({
        x: event.clientX,
        y: event.clientY,
        age: 0,
      });

      if (pointsRef.current.length > 42) {
        pointsRef.current.shift();
      }
    }

    function drawTube(
      points: Point[],
      color: string,
      lineWidth: number,
      blur: number,
      offsetX = 0,
      offsetY = 0,
      alpha = 1,
    ) {
      if (points.length < 3) return;

      context.save();
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.shadowColor = color;
      context.shadowBlur = blur;

      context.beginPath();
      context.moveTo(points[0].x + offsetX, points[0].y + offsetY);

      for (let i = 1; i < points.length - 2; i++) {
        const current = points[i];
        const next = points[i + 1];

        const midX = (current.x + next.x) / 2 + offsetX;
        const midY = (current.y + next.y) / 2 + offsetY;

        context.quadraticCurveTo(
          current.x + offsetX,
          current.y + offsetY,
          midX,
          midY,
        );
      }

      context.stroke();
      context.restore();
    }

    function animate() {
      context.clearRect(0, 0, width, height);

      pointsRef.current = pointsRef.current
        .map((point) => ({
          ...point,
          age: point.age + 0.018,
        }))
        .filter((point) => point.age < 1);

      const points = pointsRef.current;

      if (points.length > 2) {
        context.globalCompositeOperation = "lighter";

        drawTube(points, "rgba(126, 72, 255, 0.24)", 34, 42, 0, 0, 0.7);
        drawTube(points, "rgba(75, 112, 255, 0.55)", 9, 26, 0, -3, 0.85);
        drawTube(points, "rgba(255, 38, 116, 0.55)", 8, 24, 0, 4, 0.85);
        drawTube(points, "rgba(238, 214, 255, 0.88)", 2, 12, 0, 0, 0.75);

        const head = points[points.length - 1];

        const gradient = context.createRadialGradient(
          head.x,
          head.y,
          0,
          head.x,
          head.y,
          70,
        );

        gradient.addColorStop(0, "rgba(255,255,255,0.42)");
        gradient.addColorStop(0.24, "rgba(152,78,255,0.30)");
        gradient.addColorStop(0.48, "rgba(255,38,116,0.20)");
        gradient.addColorStop(1, "rgba(255,38,116,0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(head.x, head.y, 70, 0, Math.PI * 2);
        context.fill();

        context.globalCompositeOperation = "source-over";
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60] hidden mix-blend-screen md:block"
      aria-hidden="true"
    />
  );
}
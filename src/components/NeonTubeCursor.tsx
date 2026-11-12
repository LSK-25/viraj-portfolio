'use client';

import {useEffect, useRef} from 'react';

type Point = {x: number; y: number; born: number};

export function NeonTubeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let points: Point[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;

    function clear() {
      cancelAnimationFrame(frame);
      frame = 0;
      points = [];
      context!.clearRect(0, 0, width, height);
    }
    function resize() {
      clear();
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function tube(color: string, lineWidth: number, blur: number, offset = 0) {
      if (points.length < 3) return;
      context!.strokeStyle = color;
      context!.shadowColor = color;
      context!.shadowBlur = blur;
      context!.lineWidth = lineWidth;
      context!.lineCap = 'round';
      context!.lineJoin = 'round';
      context!.beginPath();
      context!.moveTo(points[0].x, points[0].y + offset);
      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        context!.quadraticCurveTo(current.x, current.y + offset, (current.x + next.x) / 2, (current.y + next.y) / 2 + offset);
      }
      context!.stroke();
    }
    function draw(now: number) {
      frame = 0;
      context!.clearRect(0, 0, width, height);
      points = points.filter(point => now - point.born < 650);
      if (!points.length) return;
      context!.save();
      context!.globalCompositeOperation = 'lighter';
      context!.globalAlpha = Math.min(1, (650 - (now - points[points.length - 1].born)) / 240);
      tube('rgba(142,41,67,.24)', 25, 28);
      tube('rgba(170,66,100,.65)', 6, 18, 2);
      tube('rgba(220,163,185,.72)', 3, 12, -2);
      tube('rgba(250,230,238,.9)', 1, 6);
      context!.restore();
      frame = requestAnimationFrame(draw);
    }
    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || motion.matches || !fine.matches || document.hidden) return;
      points.push({x: event.clientX, y: event.clientY, born: performance.now()});
      if (points.length > 42) points.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('pointermove', move, {passive: true});
    window.addEventListener('resize', resize);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', clear);
    motion.addEventListener('change', clear);
    fine.addEventListener('change', clear);
    return () => {
      clear();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
      window.removeEventListener('blur', clear);
      document.removeEventListener('visibilitychange', clear);
      motion.removeEventListener('change', clear);
      fine.removeEventListener('change', clear);
    };
  }, []);
  return <canvas ref={canvasRef} className="neon-cursor" aria-hidden="true" />;
}

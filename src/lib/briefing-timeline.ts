import type { BriefingScene } from '../data/case-studies';

export function briefingDuration(scenes: BriefingScene[]) {
  return scenes.reduce((total, scene) => total + scene.duration, 0);
}
export function briefingPosition(scenes: BriefingScene[], seconds: number) {
  const total = briefingDuration(scenes);
  const elapsed = Math.max(0, Math.min(Number.isFinite(seconds) ? seconds : 0, total));
  let start = 0;
  for (let index = 0; index < scenes.length; index++) {
    const end = start + scenes[index].duration;
    if (elapsed < end || index === scenes.length - 1) return { index, start, end, progress: Math.min(1, (elapsed - start) / scenes[index].duration) };
    start = end;
  }
  return { index: 0, start: 0, end: 0, progress: 0 };
}
export function briefingChapterStart(scenes: BriefingScene[], index: number) {
  return scenes.slice(0, Math.max(0, Math.min(index, scenes.length))).reduce((sum, scene) => sum + scene.duration, 0);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { briefingDuration, briefingPosition, briefingChapterStart } from '../src/lib/briefing-timeline';
import { caseStudies } from '../src/data/case-studies';
import { lookupPortfolio, contextualInstructions } from '../src/lib/portfolio-knowledge';

const scenes = caseStudies.find(study => study.id === 'sentinel')!.scenes;
test('briefing seeks into a chapter and enters the next chapter at the boundary', () => {
 assert.equal(briefingDuration(scenes),60);
 assert.deepEqual(briefingPosition(scenes,18),{index:1,start:12,end:24,progress:.5});
 assert.deepEqual(briefingPosition(scenes,24),{index:2,start:24,end:36,progress:0});
});
test('end-of-report and out-of-range seeks produce stable frames', () => {
 assert.deepEqual(briefingPosition(scenes,99),{index:4,start:48,end:60,progress:1});
 assert.equal(briefingPosition(scenes,-2).progress,0);
 assert.equal(briefingPosition(scenes,NaN).index,0);
 assert.equal(briefingPosition(scenes,0).index,0);
});
test('chapter controls seek to the selected briefing segment', () => {
 for(let index=0;index<scenes.length;index++) assert.equal(briefingPosition(scenes,briefingChapterStart(scenes,index)).index,index);
});
test('every project has a complete playable report and a unique route', () => {
 assert.equal(new Set(caseStudies.map(study=>study.id)).size,5);
 for(const study of caseStudies){assert.equal(study.scenes.length,5);assert.ok(study.scenes.every(scene=>scene.duration>0 && scene.narration.length>0));assert.equal(briefingDuration(study.scenes),60);}
});
test('wearable lookup only returns the concept and never a completed hardware claim', () => {
 const record=lookupPortfolio('Tell me about your smart glasses');
 assert.deepEqual(record.projects.map(project=>project.id),['smart-glasses']);
 assert.match(record.projects[0].status,/Concept/);
 assert.match(record.projects[0].boundary,/no working glasses hardware/);
});
test('wearable follow-up keeps its concept facts in the assistant context', () => {
 const result=contextualInstructions([{role:'user',content:'Tell me about smart glasses'},{role:'user',content:'How does it work?'}]);
 const record=JSON.parse(result.split('VERIFIED PORTFOLIO RECORD:\n')[1]);
 assert.deepEqual(record.projects.map((project:{id:string})=>project.id),['smart-glasses']);
});

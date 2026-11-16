import test from 'node:test';
import assert from 'node:assert/strict';
import { HeartVoice } from '../src/lib/heart-voice';
import { speechText } from '../src/lib/speech-text';

type Message = { type: string; id?: number; text?: string };
class WorkerMock {
  static latest: WorkerMock;
  static count = 0;
  onmessage: ((event: { data: unknown }) => void) | null = null;
  onerror: (() => void) | null = null;
  messages: Message[] = [];
  terminated = false;
  constructor() { WorkerMock.latest = this; WorkerMock.count++; }
  postMessage(message: Message) { this.messages.push(message); if (message.type === 'prepare') queueMicrotask(() => this.emit({ type: 'ready' })); }
  emit(data: unknown) { this.onmessage?.({ data }); }
  terminate() { this.terminated = true; }
}
class SourceMock {
  static all: SourceMock[] = [];
  onended: (() => void) | null = null;
  buffer: unknown;
  stopped = false;
  constructor() { SourceMock.all.push(this); }
  connect() {}
  disconnect() {}
  start() {}
  stop() { this.stopped = true; }
}
class AudioMock {
  currentTime = 0;
  state = 'running';
  destination = {};
  async resume() {}
  createBuffer(_channels: number, length: number, rate: number) { return { duration: length / rate, getChannelData: () => new Float32Array(length) }; }
  createBufferSource() { return new SourceMock(); }
}
Object.assign(globalThis, { Worker: WorkerMock, AudioContext: AudioMock });

test('speech formatting removes code and URLs without losing link labels', () => {
  assert.equal(speechText('**See** [NOVA](https://example.com)\n```js\nsecret()\n```'), 'See NOVA\nThe code is available in the conversation.');
  assert.equal(speechText('x'.repeat(2000)).length, 1600);
});

test('Heart prepares once and reuses the loaded model across sessions', async () => {
  const engine = new HeartVoice();
  const count = WorkerMock.count;
  await engine.unlock();
  await Promise.all([engine.prepare(() => {}), engine.prepare(() => {})]);
  await engine.prepare(() => {});
  assert.equal(WorkerMock.count, count + 1);
});

test('speech completes only after generation AND queued audio finish', async () => {
  const engine = new HeartVoice(); await engine.unlock(); await engine.prepare(() => {});
  let starts = 0, completed = false;
  const result = engine.speak('Hello.', () => starts++).then(() => { completed = true; });
  const worker = WorkerMock.latest, id = worker.messages.at(-1)!.id;
  worker.emit({ type: 'audio', id, samples: new Float32Array(2400), sampleRate: 24000 });
  worker.emit({ type: 'done', id });
  await Promise.resolve(); assert.equal(completed, false); assert.equal(starts, 1);
  SourceMock.all.at(-1)!.onended?.(); await result; assert.equal(completed, true);
});

test('interrupt stops scheduled audio and ignores late worker chunks', async () => {
  const engine = new HeartVoice(); await engine.unlock(); await engine.prepare(() => {});
  const result = engine.speak('First reply.', () => {});
  const worker = WorkerMock.latest, id = worker.messages.at(-1)!.id;
  worker.emit({ type: 'audio', id, samples: new Float32Array(2400), sampleRate: 24000 });
  const source = SourceMock.all.at(-1)!;
  engine.cancel(); await assert.rejects(result, { name: 'AbortError' });
  assert.equal(source.stopped, true);
  const count = SourceMock.all.length;
  worker.emit({ type: 'audio', id, samples: new Float32Array(2400), sampleRate: 24000 });
  assert.equal(SourceMock.all.length, count);
});

test('worker failure rejects playback and allows a fresh model load', async () => {
  const engine = new HeartVoice(); await engine.unlock(); await engine.prepare(() => {});
  const result = engine.speak('Hello.', () => {});
  const worker = WorkerMock.latest;
  worker.onerror?.(); await assert.rejects(result, /could not load/);
  assert.equal(worker.terminated, true);
  await engine.prepare(() => {}); assert.notEqual(WorkerMock.latest, worker);
});

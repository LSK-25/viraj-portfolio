// Only the speech renderer changes. Chat requests remain on their existing path.
export type HeartStatus = (message: string) => void;
type Playback = { id: number; started: boolean; done: boolean; sources: Set<AudioBufferSourceNode>; endAt: number; start: () => void; resolve: () => void; reject: (error: Error) => void; timer: ReturnType<typeof setTimeout> };

export class HeartVoice {
  private worker: Worker | null = null;
  private context: AudioContext | null = null;
  private loading: Promise<void> | null = null;
  private ready = false;
  private sequence = 0;
  private playback: Playback | null = null;
  private prepared: (() => void) | null = null;
  private failed: ((error: Error) => void) | null = null;
  private status: HeartStatus = () => {};

  // Call synchronously from Start voice / Read reply to unlock browser audio.
  unlock() {
    this.context ??= new AudioContext();
    return this.context.resume();
  }

  prepare(status: HeartStatus) {
    this.status = status;
    if (this.ready) { status('Heart is ready'); return Promise.resolve(); }
    status('Loading Heart for this browser…');
    if (this.loading) return this.loading;
    this.loading = new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => this.fail(new Error('Heart took too long to load. Retry or choose Browser voice in Sound & voice options.')), 180_000);
      this.prepared = () => { clearTimeout(timer); this.ready = true; this.loading = null; this.prepared = this.failed = null; this.status('Heart is ready'); resolve(); };
      this.failed = error => { clearTimeout(timer); this.loading = null; this.prepared = this.failed = null; reject(error); };
      try {
        this.worker = new Worker('/voice/heart-worker.mjs', { type: 'module', name: 'NOVA Heart' });
        this.worker.onmessage = event => this.receive(event.data);
        this.worker.onerror = () => this.fail(new Error('Heart could not load here. Check your connection, retry, or choose Browser voice.'));
        this.worker.postMessage({ type: 'prepare' });
      } catch { this.fail(new Error('Heart is unavailable in this browser. Choose Browser voice or use text chat.')); }
    });
    // A synchronous Worker construction failure must not leave a rejected cache.
    const loading = this.loading;
    void loading.catch(() => { if (this.loading === loading) this.loading = null; });
    return loading;
  }

  private receive(data: { type: string; id?: number; progress?: number; file?: string; samples?: Float32Array; sampleRate?: number }) {
    if (data.type === 'ready') { this.prepared?.(); return; }
    if (data.type === 'progress') { this.status(`Loading Heart · ${data.file?.endsWith('.onnx') ? 'model' : 'voice files'} ${data.progress ?? 0}%`); return; }
    if (data.type === 'error' && !data.id) { this.fail(new Error('Heart could not finish loading. Retry or choose Browser voice.')); return; }
    const active = this.playback;
    if (!active || data.id !== active.id) return;
    if (data.type === 'error') { this.finish(new Error('Heart could not read this reply. The text is available; try Read reply or Browser voice.')); return; }
    if (data.type === 'done') { active.done = true; if (!active.sources.size) this.finish(); return; }
    if (data.type !== 'audio' || !this.context || !data.samples?.length) return;
    if (this.context.state !== 'running') { this.finish(new DOMException('Tap Read reply to allow playback.', 'NotAllowedError')); return; }
    try {
      const buffer = this.context.createBuffer(1, data.samples.length, data.sampleRate || 24000);
      buffer.getChannelData(0).set(data.samples);
      const source = this.context.createBufferSource();
      source.buffer = buffer; source.connect(this.context.destination);
      active.sources.add(source);
      const at = Math.max(this.context.currentTime + .02, active.endAt);
      active.endAt = at + buffer.duration;
      source.onended = () => { source.disconnect(); active.sources.delete(source); if (this.playback === active && active.done && !active.sources.size) this.finish(); };
      source.start(at);
      if (!active.started) { active.started = true; active.start(); }
    } catch { this.finish(new Error('Heart playback failed. The reply is available in the conversation.')); }
  }

  speak(text: string, onStart: () => void) {
    this.cancel();
    if (!this.ready || !this.worker) return Promise.reject(new Error('Heart is not ready. End voice and start it again.'));
    const id = ++this.sequence;
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => { if (this.playback?.id === id) this.finish(new Error('Heart playback timed out. The full reply is in the conversation.')); }, 90_000);
      this.playback = { id, started: false, done: false, sources: new Set(), endAt: 0, start: onStart, resolve, reject, timer };
      this.worker!.postMessage({ type: 'speak', id, text });
    });
  }

  private finish(error?: Error) {
    const active = this.playback;
    this.playback = null;
    if (!active) return;
    clearTimeout(active.timer);
    if (error) this.worker?.postMessage({ type: 'cancel', id: ++this.sequence });
    for (const source of active.sources) { source.onended = null; try { source.stop(); } catch { /* Already ended. */ } source.disconnect(); }
    if (error) active.reject(error);
    else active.resolve();
  }

  cancel() {
    this.worker?.postMessage({ type: 'cancel', id: ++this.sequence });
    this.finish(new DOMException('Speech interrupted.', 'AbortError'));
  }

  private fail(error: Error) {
    this.ready = false; this.worker?.terminate(); this.worker = null;
    this.failed?.(error); this.finish(error);
  }
}

export const heartVoice = new HeartVoice();

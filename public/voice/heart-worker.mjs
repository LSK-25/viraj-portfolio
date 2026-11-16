import { KokoroTTS } from './kokoro-1.2.1.mjs';

let engine;
let loading;
let latest = 0;
let queue = Promise.resolve();
async function prepare() {
  if (engine) return engine;
  if (!loading) loading = (async () => {
    const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
      dtype: 'q8', device: 'wasm',
      progress_callback: event => {
        if (event.status === 'progress') self.postMessage({ type: 'progress', progress: Math.round(event.progress), file: event.file });
      },
    });
    // Warm inference and download Heart's voice embedding before opening the mic.
    await tts.generate('Ready.', { voice: 'af_heart', speed: 1 });
    engine = tts;
    return tts;
  })().catch(error => { loading = null; throw error; });
  return loading;
}

self.onmessage = ({ data }) => {
  if (data.type === 'cancel') { latest = data.id; return; }
  if (data.type === 'prepare') {
    void prepare().then(() => self.postMessage({ type: 'ready' })).catch(() => self.postMessage({ type: 'error', id: 0 }));
    return;
  }
  if (data.type !== 'speak' || typeof data.text !== 'string' || data.text.length > 1600) return;
  latest = data.id;
  queue = queue.catch(() => {}).then(async () => {
    if (latest !== data.id) return;
    try {
      const tts = await prepare();
      if (latest !== data.id) return;
      for await (const { audio } of tts.stream(data.text, { voice: 'af_heart', speed: 1 })) {
        if (latest !== data.id) return;
        const samples = new Float32Array(audio.audio);
        self.postMessage({ type: 'audio', id: data.id, samples, sampleRate: audio.sampling_rate }, [samples.buffer]);
      }
      if (latest === data.id) self.postMessage({ type: 'done', id: data.id });
    } catch { if (latest === data.id) self.postMessage({ type: 'error', id: data.id }); }
  });
};

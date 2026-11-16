"""Render portfolio narration using an existing ADA Kokoro installation, offline.

Run with ADA's .venv-tts Python, passing --ada-root and --scenes (JSON exported
from src/data/case-studies.ts). No microphone, speaker, server or downloads.
"""
import argparse
import hashlib
import json
from pathlib import Path
import time
import wave

import numpy as np
import onnxruntime as ort
from kokoro_onnx import Kokoro

parser = argparse.ArgumentParser()
parser.add_argument('--ada-root', type=Path, required=True)
parser.add_argument('--scenes', type=Path, required=True)
args = parser.parse_args()
model_dir = args.ada_root / 'models' / 'kokoro-onnx'
output = Path(__file__).resolve().parents[1] / 'public' / 'audio' / 'heart'
output.mkdir(parents=True, exist_ok=True)
ort.disable_telemetry_events()
options = ort.SessionOptions()
options.intra_op_num_threads = 4
options.inter_op_num_threads = 1
options.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
session = ort.InferenceSession(str(model_dir / 'kokoro-v1.0.onnx'), sess_options=options, providers=['CPUExecutionProvider'])
engine = Kokoro.from_session(session, str(model_dir / 'voices-v1.0.bin'))
manifest = {'model': 'Kokoro v1.0', 'voice': 'af_heart', 'sampleRate': 24000, 'tracks': {}}

def save(path, samples):
    with wave.open(str(path), 'wb') as target:
        target.setnchannels(1)
        target.setsampwidth(2)
        target.setframerate(24000)
        target.writeframes((np.clip(samples, -1, 1) * 32767).astype('<i2').tobytes())

def render(text, speed=1.0):
    samples, rate = engine.create(text, voice='af_heart', lang='en-us', speed=speed, trim=True)
    samples = np.asarray(samples, dtype=np.float32)
    if rate != 24000 or not samples.size or not np.isfinite(samples).all():
        raise RuntimeError('Invalid Heart audio')
    return samples * (.8 / max(1., float(np.max(np.abs(samples)))))

for study in json.loads(args.scenes.read_text(encoding='utf-8')):
    began = time.perf_counter()
    pieces, entries = [], []
    for scene in study['scenes']:
        samples = render(scene['narration'])
        limit = scene['duration'] - .35
        speed = 1.0
        if len(samples) / 24000 > limit:
            speed = len(samples) / (24000 * limit) + .03
            samples = render(scene['narration'], speed)
        if len(samples) > round(limit * 24000):
            raise RuntimeError('Narration exceeds chapter; shorten script, never truncate audio')
        entries.append({'text': scene['narration'], 'speechSeconds': round(len(samples) / 24000, 3), 'chapterSeconds': scene['duration'], 'speed': round(speed, 3)})
        pieces.append(np.pad(samples, (0, scene['duration'] * 24000 - len(samples))))
    filename = study['id'] + '.wav'
    save(output / filename, np.concatenate(pieces))
    manifest['tracks'][study['id']] = {'file': filename, 'sha256': hashlib.sha256((output / filename).read_bytes()).hexdigest(), 'chapters': entries}
    print(f"Rendered {study['id']}: {len(entries)} chapters, {time.perf_counter()-began:.1f}s", flush=True)
save(output / 'preview.wav', render("Hi, I'm Nova. This is Heart, the voice from ADA. Let's talk about what you're building."))
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('Heart narration complete.', flush=True)

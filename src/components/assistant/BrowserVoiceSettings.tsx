'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { englishVoices, pickBrowserVoice } from '@/lib/browser-voice-options';

const preferenceKey = 'nova.browser-voice';

export function BrowserVoiceSettings({ selected, onSelect, active, cancelPreviewRef }: { selected: string; onSelect: (voiceURI: string) => void; active: boolean; cancelPreviewRef: RefObject<(() => void) | null> }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [previewing, setPreviewing] = useState(false);
  const [notice, setNotice] = useState('');
  const preview = useRef<SpeechSynthesisUtterance | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    const refresh = () => setVoices(englishVoices(synth.getVoices()));
    const initial = setTimeout(() => {
      refresh();
      try { onSelect(localStorage.getItem(preferenceKey) || ''); } catch { /* Voice still works with storage disabled. */ }
    }, 0);
    synth.addEventListener('voiceschanged', refresh);
    return () => {
      clearTimeout(initial);
      if (timer.current) clearTimeout(timer.current);
      synth.removeEventListener('voiceschanged', refresh);
      if (preview.current) { preview.current.onend = preview.current.onerror = preview.current.onstart = null; preview.current = null; synth.cancel(); }
    };
  }, [onSelect]);

  const stopPreview = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (preview.current) {
      preview.current.onend = preview.current.onerror = preview.current.onstart = null;
      preview.current = null;
      window.speechSynthesis.cancel();
    }
    setPreviewing(false);
  }, []);

  useEffect(() => { cancelPreviewRef.current = stopPreview; return () => { cancelPreviewRef.current = null; }; }, [cancelPreviewRef, stopPreview]);

  function choose(value: string) {
    stopPreview(); setNotice(''); onSelect(value);
    try { localStorage.setItem(preferenceKey, value); } catch { /* Selection remains for this page. */ }
  }

  function hearVoice() {
    if (active) return;
    if (previewing) { stopPreview(); return; }
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') { setNotice('Voice preview is unavailable in this browser.'); return; }
    setNotice('');
    const line = preview.current = new SpeechSynthesisUtterance("Hi, I'm Nova. Let's talk about your ideas and explore Viraj's projects.");
    const voice = pickBrowserVoice(window.speechSynthesis.getVoices(), selected);
    if (voice) { line.voice = voice; line.lang = voice.lang; } else line.lang = 'en-US';
    line.rate = 1; line.pitch = 1;
    setPreviewing(true);
    const current = () => preview.current === line;
    line.onstart = () => { if (current()) { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(stopPreview, 20_000); } };
    line.onend = () => { if (current()) { preview.current = null; if (timer.current) clearTimeout(timer.current); setPreviewing(false); } };
    line.onerror = event => { if (current()) { preview.current = null; if (timer.current) clearTimeout(timer.current); setPreviewing(false); if (!['interrupted', 'canceled'].includes(event.error)) setNotice('This voice could not play. Try another available voice.'); } };
    timer.current = setTimeout(() => { if (current()) { stopPreview(); setNotice('Preview did not start. Try another voice or allow audio playback.'); } }, 6000);
    try { window.speechSynthesis.speak(line); } catch { stopPreview(); setNotice('Voice preview could not start.'); }
  }

  const automatic = pickBrowserVoice(voices);
  const shown = voices.some(voice => voice.voiceURI === selected) ? selected : '';
  return <div className="browser-voice-settings">
    <label className="voice-choice">Reply voice<select value={shown} disabled={active} onChange={event => choose(event.target.value)}>
      <option value="">Automatic{automatic ? ` · ${automatic.name}` : ' · prefer a local female voice'}</option>
      {voices.map(voice => <option key={voice.voiceURI} value={voice.voiceURI}>{voice.name} · {voice.localService ? 'on device' : 'online'}</option>)}
    </select></label>
    <button type="button" className="button button-small" disabled={active} onClick={hearVoice}>{previewing ? 'Stop preview' : 'Preview voice'}</button>
    <small>Live replies use your browser&apos;s voices, with no Heart model to load. Automatic prefers an installed female voice. Choose and preview another voice here; your choice is remembered on this browser.</small>
    <small>Heart stays on the project briefings. Online voices may take longer to start.</small>
    {notice && <small role="status">{notice}</small>}
  </div>;
}

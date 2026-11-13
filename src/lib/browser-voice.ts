import { AssistantRequestError, conversationWindow, requestAnswer, type ChatMessage } from './assistant-client';
import type { LinkCard } from './portfolio-knowledge';
import type { WebLookup } from './web-access';

export type VoicePhase = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';

interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
}
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
}
type RecognitionWindow = Window & {
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};
type Callbacks = {
  phase(value: VoicePhase): void;
  message(id: string, role: 'user' | 'assistant', text: string, append: boolean): void;
  links(cards: LinkCard[]): void;
  error(message: string, retryAfterSeconds?: number): void;
  level(value: number): void;
  playbackBlocked(value: boolean): void;
  web?(id: string, lookup: WebLookup): void;
};

export function browserVoiceSupported() {
  if (typeof window === 'undefined') return false;
  const browser = window as RecognitionWindow;
  return Boolean((browser.SpeechRecognition || browser.webkitSpeechRecognition)
    && window.speechSynthesis && typeof SpeechSynthesisUtterance !== 'undefined'
    && window.isSecureContext !== false);
}

export class BrowserVoice {
  private stopped = false;
  private muted = false;
  private phase: VoicePhase = 'idle';
  private recognition: Recognition | null = null;
  private request: AbortController | null = null;
  private generation = 0;
  private history: ChatMessage[];
  private restart: ReturnType<typeof setTimeout> | null = null;
  private deadline: ReturnType<typeof setTimeout> | null = null;
  private speechTimer: ReturnType<typeof setTimeout> | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private pendingSpeech = '';

  constructor(private callbacks: Callbacks, history: ChatMessage[] = [], private forceSearch = false) {
    this.history = conversationWindow(history);
  }

  start() {
    if (this.stopped || this.phase !== 'idle') return;
    if (!browserVoiceSupported()) {
      this.callbacks.error('Browser voice is unavailable here. Try a supported Chrome or Edge browser on HTTPS, or use text chat.');
      this.stop();
      return;
    }
    this.deadline = setTimeout(() => {
      this.callbacks.error('This five-minute voice session has ended. You can start another.');
      this.stop();
    }, 5 * 60_000);
    this.listen();
  }

  private setPhase(phase: VoicePhase) {
    this.phase = phase;
    this.callbacks.phase(phase);
  }

  private discardRecognition() {
    if (this.restart) clearTimeout(this.restart);
    this.restart = null;
    const recognition = this.recognition;
    this.recognition = null;
    if (!recognition) return;
    recognition.onstart = recognition.onresult = recognition.onerror = recognition.onend = null;
    try { recognition.abort(); } catch { /* Already ended. */ }
    this.callbacks.level(0);
  }

  private listen() {
    if (this.stopped || this.muted) return;
    if (this.restart) clearTimeout(this.restart);
    this.discardRecognition();
    const browser = window as RecognitionWindow;
    const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Constructor) return;
    const recognition = this.recognition = new Constructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    this.setPhase('connecting');
    recognition.onstart = () => {
      if (!this.stopped && this.recognition === recognition) this.setPhase('listening');
    };
    recognition.onresult = event => {
      if (this.stopped || this.muted || this.recognition !== recognition || this.phase !== 'listening') return;
      let finalText = '';
      for (let index = event.resultIndex; index < event.results.length; index++) {
        const result = event.results[index];
        if (result.isFinal) finalText += result[0].transcript + ' ';
      }
      this.callbacks.level(0.35); // Recognition activity, not an audio amplitude meter.
      if (finalText.trim()) void this.answer(finalText.trim().slice(0, 2400));
    };
    recognition.onerror = event => {
      if (this.stopped || this.recognition !== recognition) return;
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      this.callbacks.error(event.error === 'not-allowed' || event.error === 'service-not-allowed'
        ? 'Microphone or browser speech access was not allowed. Enable it in the browser, or use text chat.'
        : 'Browser speech could not hear you. Check your microphone and connection, or use text chat.');
      this.stop();
    };
    recognition.onend = () => {
      if (this.stopped || this.recognition !== recognition) return;
      this.recognition = null;
      if (this.phase === 'listening' || this.phase === 'connecting') this.resumeListening();
    };
    try {
      recognition.start();
    } catch {
      this.callbacks.error('Voice could not start. Please use text chat or try another supported browser.');
      this.stop();
    }
  }

  private resumeListening() {
    if (this.stopped) return;
    this.setPhase('listening');
    this.callbacks.level(0);
    if (this.restart) clearTimeout(this.restart);
    if (!this.muted) this.restart = setTimeout(() => this.listen(), 250);
  }

  private async answer(text: string) {
    const turn = ++this.generation;
    this.discardRecognition(); // Avoid recognizing the assistant's own spoken reply.
    this.cancelSpeech();
    this.setPhase('thinking');
    this.history = conversationWindow([...this.history, { role: 'user', content: text }]);
    this.callbacks.message(crypto.randomUUID(), 'user', text, false);
    const controller = this.request = new AbortController();
    try {
      const result = await requestAnswer(this.history, controller.signal, true, this.forceSearch);
      if (this.stopped || turn !== this.generation) return;
      this.history = conversationWindow([...this.history, { role: 'assistant', content: result.text }]);
      const replyId = crypto.randomUUID();
      this.callbacks.message(replyId, 'assistant', result.text, false);
      if (result.web) this.callbacks.web?.(replyId, result.web);
      this.callbacks.links(result.links);
      this.pendingSpeech = result.text;
      this.speak(result.text, turn);
    } catch (error) {
      if (this.stopped || turn !== this.generation || controller.signal.aborted) return;
      this.callbacks.error(error instanceof Error ? error.message : 'The assistant could not answer. Please try again.', error instanceof AssistantRequestError ? error.retryAfterSeconds : undefined);
      if (error instanceof AssistantRequestError && (error.code === 'provider_rate_limit' || error.code === 'local_rate_limit')) this.stop();
      else this.resumeListening();
    } finally {
      if (this.request === controller) this.request = null;
    }
  }

  private cancelSpeech() {
    if (this.speechTimer) clearTimeout(this.speechTimer);
    this.speechTimer = null;
    if (this.utterance) {
      this.utterance.onstart = this.utterance.onend = this.utterance.onerror = null;
      this.utterance = null;
      window.speechSynthesis.cancel();
    }
    this.callbacks.playbackBlocked(false);
  }

  private speak(text: string, turn: number) {
    if (this.stopped || turn !== this.generation) return;
    this.cancelSpeech();
    const plain = text
      .replace(/[\x60]{3}[\s\S]*?[\x60]{3}/g, 'The code is available in the conversation.')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, 'the linked page')
      .replace(/[*#_\x60]/g, '').slice(0, 1600);
    const utterance = this.utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices().filter(voice => voice.lang.startsWith('en'));
    const selectedVoice = voices.find(voice => voice.localService) || voices[0];
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1;
    const current = () => !this.stopped && turn === this.generation && this.utterance === utterance;
    utterance.onstart = () => {
      if (!current()) return;
      if (this.speechTimer) clearTimeout(this.speechTimer);
      this.setPhase('speaking');
      this.speechTimer = setTimeout(() => this.interrupt(), 90_000);
    };
    utterance.onend = () => {
      if (!current()) return;
      this.pendingSpeech = '';
      this.cancelSpeech();
      this.resumeListening();
    };
    utterance.onerror = event => {
      if (!current()) return;
      this.cancelSpeech();
      if (event.error === 'not-allowed') this.callbacks.playbackBlocked(true);
      else this.callbacks.error('Your browser could not read the reply aloud. The full reply is in the conversation.');
      this.resumeListening();
    };
    // Some browsers silently block playback; always offer a recoverable state.
    this.speechTimer = setTimeout(() => {
      if (!current()) return;
      this.cancelSpeech();
      this.callbacks.playbackBlocked(true);
      this.resumeListening();
    }, 6000);
    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.cancelSpeech();
      this.callbacks.error('Speech playback is unavailable. The reply is in the conversation.');
      this.resumeListening();
    }
  }

  mute(muted: boolean) {
    this.muted = muted;
    if (muted) {
      if (this.restart) clearTimeout(this.restart);
      this.discardRecognition();
      if (this.phase === 'connecting') this.setPhase('listening');
    } else if (this.phase === 'listening' || this.phase === 'connecting') {
      this.listen();
    }
  }

  interrupt() {
    if (this.stopped) return;
    ++this.generation;
    this.request?.abort();
    this.request = null;
    this.pendingSpeech = '';
    this.cancelSpeech();
    this.discardRecognition();
    this.resumeListening();
  }

  playAudio() {
    if (this.stopped || !this.pendingSpeech) return;
    this.discardRecognition();
    this.setPhase('thinking');
    this.speak(this.pendingSpeech, this.generation);
  }

  stop() {
    if (this.stopped) return;
    this.stopped = true;
    ++this.generation;
    this.request?.abort();
    this.request = null;
    if (this.restart) clearTimeout(this.restart);
    if (this.deadline) clearTimeout(this.deadline);
    this.discardRecognition();
    this.cancelSpeech();
    this.pendingSpeech = '';
    this.callbacks.level(0);
    this.setPhase('idle');
  }
}

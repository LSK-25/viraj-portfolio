'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resources } from '@/data/site';
import { HeartbeatSound } from './HeartbeatSound';
import { approvedLinks, type LinkCard } from '@/lib/portfolio-knowledge';
import { BrowserVoice, browserVoiceSupported, type VoicePhase } from '@/lib/browser-voice';
import { requestAnswer } from '@/lib/assistant-client';
import { needsWebSearch, publicSourceUrl, type WebLookup } from '@/lib/web-access';
import { ArrowIcon, MicIcon } from '@/components/ui/Icons';

type Message = { id: string; role: 'user' | 'assistant'; text: string; links?: LinkCard[]; web?: WebLookup };
const phaseLabels = { idle: 'Ready when you are', connecting: 'Connecting voice.', listening: 'Listening', thinking: 'Thinking.', speaking: 'Speaking' };

function AnswerText({ text, web }: { text: string; web?: WebLookup }) {
  return <>{text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    const source = match && web?.sources.some(item => item.href === publicSourceUrl(match[2]));
    if (match && (approvedLinks.has(match[2]) || source)) return <a href={match[2]} key={index} target="_blank" rel="noopener noreferrer">{match[1]} <ArrowIcon width={12} height={12} style={{ display: 'inline' }} /></a>;
    return <span key={index}>{part}</span>;
  })}</>;
}

function LinkCards({ links }: { links: LinkCard[] }) {
  return <div className="assistant-link-cards">{links.map(link => <a href={link.href} key={link.href} target="_blank" rel="noopener noreferrer">{link.label}<ArrowIcon width={14} height={14} /></a>)}</div>;
}

function WebSources({ lookup }: { lookup: WebLookup }) {
  return <div className="web-source-list"><span>Web sources · retrieved {new Date(lookup.checkedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>{lookup.sources.map(source => <a href={source.href} key={source.href} target="_blank" rel="noopener noreferrer">{source.label}<small>{source.host} ↗</small></a>)}</div>;
}

export function PortfolioAssistant() {
  const dialog = useRef<HTMLDialogElement>(null), scrollArea = useRef<HTMLDivElement>(null), input = useRef<HTMLTextAreaElement>(null);
  const voice = useRef<BrowserVoice | null>(null), chatAbort = useRef<AbortController | null>(null), statusAbort = useRef<AbortController | null>(null);
  const [open, setOpen] = useState(false), [available, setAvailable] = useState<boolean | null>(null), [messages, setMessages] = useState<Message[]>([]), [draft, setDraft] = useState('');
  const [phase, setPhase] = useState<VoicePhase>('idle'), [level, setLevel] = useState(0), [muted, setMuted] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const [soundBlocked, setSoundBlocked] = useState(false), [voiceLinks, setVoiceLinks] = useState<LinkCard[]>([]), [voiceSupported, setVoiceSupported] = useState<boolean | null>(null);
  const [forceSearch, setForceSearch] = useState(false);
  const connected = phase !== 'idle';
  const searching = (busy || phase === 'thinking') && needsWebSearch(messages.map(message => ({ role: message.role, content: message.text })), forceSearch);

  const close = useCallback(() => { voice.current?.stop(); voice.current = null; chatAbort.current?.abort(); statusAbort.current?.abort(); setBusy(false); setOpen(false); dialog.current?.close(); }, []);
  const show = useCallback((prompt?: string) => {
    if (!dialog.current?.open) dialog.current?.showModal();
    setOpen(true); setVoiceSupported(browserVoiceSupported()); setError(''); if (prompt) setDraft(prompt);
    statusAbort.current?.abort();
    const controller = statusAbort.current = new AbortController();
    void fetch('/api/assistant/status', { signal: controller.signal, cache: 'no-store' }).then(response => response.json()).then(data => { if (!controller.signal.aborted) setAvailable(Boolean(data.available)); }).catch(() => { if (!controller.signal.aborted) setAvailable(null); });
  }, []);

  useEffect(() => {
    const handler = (event: Event) => show((event as CustomEvent<{ prompt?: string }>).detail?.prompt);
    const openCase = () => { const id = window.location.hash.slice(1); if (id.startsWith('case-')) { const detail = document.getElementById(id); if (detail instanceof HTMLDetailsElement) detail.open = true; } };
    window.addEventListener('portfolio:assistant', handler); window.addEventListener('hashchange', openCase); openCase();
    return () => { window.removeEventListener('portfolio:assistant', handler); window.removeEventListener('hashchange', openCase); voice.current?.stop(); chatAbort.current?.abort(); statusAbort.current?.abort(); };
  }, [show]);
  useEffect(() => { if (scrollArea.current) scrollArea.current.scrollTop = scrollArea.current.scrollHeight; }, [messages, voiceLinks, busy]);
  useEffect(() => { if (!open) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [open]);

  async function sendText(value = draft) {
    const text = value.trim(); if (!text || busy || connected || available === false) return;
    const next: Message[] = [...messages, { id: crypto.randomUUID(), role: 'user', text }];
    setMessages(next); setDraft(''); setBusy(true); setError('');
    const controller = chatAbort.current = new AbortController();
    try {
      const result = await requestAnswer(next.map(message => ({ role: message.role, content: message.text })), controller.signal, false, forceSearch);
      if (!controller.signal.aborted) setMessages(current => [...current, { id: crypto.randomUUID(), role: 'assistant', text: result.text, links: result.links, web: result.web }]);
    } catch (problem) {
      if (!controller.signal.aborted) { setError(problem instanceof Error ? problem.message : 'Could not reach the assistant.'); setDraft(text); }
    } finally { if (chatAbort.current === controller) setBusy(false); }
  }

  function startVoice() {
    if (voice.current || connected || busy || available === false || voiceSupported !== true) return;
    setError(''); setMuted(false); setVoiceLinks([]); setSoundBlocked(false);
    const session = new BrowserVoice({
      phase: value => { setPhase(value); if (value === 'idle' && voice.current === session) voice.current = null; },
      level: setLevel, playbackBlocked: setSoundBlocked, error: setError,
      links: cards => { if (cards.length) setVoiceLinks(cards); },
      web: (id, lookup) => setMessages(current => current.map(message => message.id === id ? { ...message, web: lookup } : message)),
      message: (id, role, text, append) => setMessages(current => {
        const existing = current.find(message => message.id === id);
        return existing ? current.map(message => message.id === id ? { ...message, text: append ? message.text + text : text } : message) : [...current, { id, role, text }];
      }),
    }, messages.map(message => ({ role: message.role, content: message.text })), forceSearch);
    voice.current = session; session.start();
  }

  return <>
    <button type="button" className="assistant-launcher" onClick={() => show()} aria-haspopup="dialog"><MicIcon /><span>Talk to NOVA</span><span className="launcher-plus" aria-hidden="true">+</span></button>
    <dialog ref={dialog} className="assistant-dialog" aria-labelledby="assistant-title" onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="assistant-panel">
        <header className="assistant-header"><div className="assistant-symbol" aria-hidden="true">vp</div><div><h2 id="assistant-title">NOVA / ADA</h2><p>Viraj’s portfolio assistant · English</p></div><button type="button" className="icon-button" onClick={close} aria-label="Close assistant">×</button></header>
        <div className="voice-stage">
          <div className={`voice-wave ${connected ? 'is-active' : ''}`} aria-hidden="true">{Array.from({ length: 30 }, (_, index) => <i key={index} style={{ height: connected ? 5 + level * (14 + Math.sin(index * 1.7) ** 2 * 40) : 5 + Math.sin(index * .7) ** 2 * 8 }} />)}</div>
          <p role="status">{muted && connected ? 'Microphone muted' : searching && connected ? 'Searching the web.' : phaseLabels[phase]}</p>
          <div className="voice-buttons">{!connected ? <button type="button" className="button button-primary" onClick={startVoice} disabled={busy || available === false || voiceSupported !== true}><MicIcon width={16} height={16} />Start voice</button> : <>
            <button type="button" className="button button-small" onClick={() => { voice.current?.mute(!muted); setMuted(!muted); }}>{muted ? 'Unmute' : 'Mute mic'}</button>
            {(phase === 'speaking' || phase === 'thinking') && <button type="button" className="button button-small" onClick={() => { voice.current?.mute(false); setMuted(false); voice.current?.interrupt(); }}>Interrupt &amp; speak</button>}
            <button type="button" className="button button-end" onClick={() => { voice.current?.stop(); voice.current = null; }}>End voice</button>
          </>}{soundBlocked && <button type="button" className="button button-small" onClick={() => void voice.current?.playAudio()}>Read reply</button>}</div>
          {open && <HeartbeatSound quiet={connected || busy} />}
          {voiceSupported === false && <small>Voice is unavailable in this browser. Text chat still works.</small>}
          <small>Browser voice may use an online recognition service. Transcripts go to Groq. Use Interrupt &amp; speak to take your turn.</small>
        </div>
        <div className="assistant-conversation" ref={scrollArea} role="log" aria-live="polite" aria-label="Conversation">
          {available === false && <p className="assistant-notice" role="status">The AI assistant is temporarily offline. CV and project links are still available.</p>}
          {!messages.length && <div className="assistant-welcome"><span className="eyebrow">Make yourself at home</span><h3>What are you<br /><em>curious about?</em></h3><p>Explore a project, ask a technical question, or catch up on current news.</p><div className="suggestions">{['Explain Sadafuli', 'What is the latest Nvidia news?', 'Show me your CV and LinkedIn'].map(prompt => <button type="button" key={prompt} onClick={() => { setDraft(prompt); input.current?.focus(); }}>{prompt}<ArrowIcon width={13} height={13} /></button>)}</div></div>}
          {messages.map(message => <div className={`message message-${message.role}`} key={message.id}><span>{message.role === 'user' ? 'You' : 'Portfolio AI'}</span><div><AnswerText text={message.text} web={message.web} /></div>{message.links && <LinkCards links={message.links} />}{message.web && <WebSources lookup={message.web} />}</div>)}
          {busy && <p className="thinking-message" role="status">{searching ? 'Searching current sources. This may take a little longer.' : 'Thinking through your question.'}</p>}
          {voiceLinks.length > 0 && <div className="voice-resources"><p>Links from our conversation</p><LinkCards links={voiceLinks} /></div>}
          {error && <p className="assistant-error" role="alert">{error}</p>}
        </div>
        <div className="assistant-resources">{resources.filter(resource => ['resume', 'portfolio', 'linkedin', 'github'].includes(resource.id)).map(resource => <a key={resource.id} href={resource.href} target="_blank" rel="noopener noreferrer">{resource.label}<ArrowIcon width={11} height={11} /></a>)}</div>
        <div className="assistant-search-row"><label className="assistant-search-toggle"><input type="checkbox" checked={forceSearch} onChange={event => setForceSearch(event.target.checked)} disabled={busy || connected} />Search web</label><span>Automatic for current questions</span></div>
        <form className="assistant-composer" onSubmit={event => { event.preventDefault(); void sendText(); }}><label className="sr-only" htmlFor="assistant-question">Ask a question in English</label><textarea ref={input} id="assistant-question" rows={1} maxLength={2400} placeholder={connected ? 'Voice is active. End voice to type.' : 'Ask anything in English.'} value={draft} disabled={connected} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void sendText(); } }} /><button type="submit" className="send-button" disabled={!draft.trim() || busy || connected || available === false} aria-label="Send question"><ArrowIcon width={18} height={18} /></button></form>
        <p className="assistant-disclosure">AI can make mistakes. Free usage limits apply. Web queries may go to search providers.</p>
      </div>
    </dialog>
  </>;
}

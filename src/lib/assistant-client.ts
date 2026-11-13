import { approvedLinks, type LinkCard } from './portfolio-knowledge';
import { needsWebSearch, validWebLookup } from './web-access';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export class AssistantRequestError extends Error {
  constructor(message: string, public code?: string, public retryAfterSeconds?: number) { super(message); }
}

// Keep recent turns while staying comfortably within the free API context budget.
export function conversationWindow(messages: ChatMessage[]): ChatMessage[] {
  const result: ChatMessage[] = [];
  let remaining = 9000;
  for (const message of messages.slice(-8).reverse()) {
    const content = message.content.trim().slice(0, 2400);
    if (!content) continue;
    if (content.length > remaining) break;
    result.unshift({ role: message.role, content });
    remaining -= content.length;
  }
  return result;
}

export async function requestAnswer(messages: ChatMessage[], signal: AbortSignal, voice = false, forceSearch = false) {
  const recent = conversationWindow(messages);
  const search = needsWebSearch(recent, forceSearch);
  const response = await fetch('/api/assistant/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: recent, voice, ...(forceSearch ? { search: true } : {}) }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(search ? 70_000 : 35_000)]),
  });
  const result = await response.json();
  if (!response.ok) throw new AssistantRequestError(
    typeof result.error === 'string' ? result.error : 'The assistant could not answer. Please try again.',
    typeof result.code === 'string' ? result.code : undefined,
    typeof result.retryAfterSeconds === 'number' && Number.isFinite(result.retryAfterSeconds) && result.retryAfterSeconds > 0
      ? Math.min(86400, Math.ceil(result.retryAfterSeconds)) : undefined,
  );
  if (typeof result.text !== 'string' || !result.text.trim()) {
    throw new Error('The assistant returned no answer. Please try again.');
  }
  const links: LinkCard[] = Array.isArray(result.links)
    ? result.links.filter((link: LinkCard) => link && typeof link.label === 'string' && approvedLinks.has(link.href))
    : [];
  return { text: result.text as string, links, web: validWebLookup(result.web) };
}

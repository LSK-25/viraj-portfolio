export type WebSource = { label: string; href: string; host: string };
export type WebLookup = { checkedAt: string; sources: WebSource[] };
type Turn = { role: string; content: string };

const freshness = /\b(latest|newest|recent(?:ly)?|news|today|tonight|yesterday|currently|current|right now|this (?:week|month|year)|up[- ]to[- ]date|real[- ]time|breaking|stock price|share price|weather|live score|who is (?:the )?(?:ceo|president|prime minister))\b/i;
const explicit = /\b(search (?:the )?(?:web|internet|online)|look (?:it |this |that )?up|browse (?:the )?(?:web|internet)|verify online|find sources)\b/i;

export function needsWebSearch(messages: Turn[], force = false): boolean {
  if (force) return true;
  const users = messages.filter(message => message.role === 'user');
  const query = users.at(-1)?.content || '';
  if (explicit.test(query)) return true;
  // Portfolio status comes from the owner's verified record, not a public search.
  if (/\b(?:viraj|your projects?|nova|ada|sadafuli|billi|sentinel|portfolio)\b/i.test(query) && !/\b(?:news|search|online|internet|external)\b/i.test(query)) return false;
  if (freshness.test(query)) return true;
  return query.length < 180 && /^(?:and |what about |how about |also |any more|tell me more|sources\b|links\b)/i.test(query.trim()) && freshness.test(users.at(-2)?.content || '');
}

export function publicSourceUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2000) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return null;
    if (!host.includes('.') || /(?:^|\.)(?:localhost|local|internal|lan|home|test|invalid)$/.test(host) || /^[\d.]+$/.test(host) || host.includes(':') || host.startsWith('[')) return null;
    return url.href;
  } catch { return null; }
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

// Only provider-returned browser/search records become citations. A URL in the
// model's prose alone is not evidence that the page was actually retrieved.
export function searchSources(messageValue: unknown): WebSource[] {
  const message = record(messageValue);
  const tools = message?.executed_tools;
  if (!Array.isArray(tools)) return [];
  const sources: WebSource[] = [];
  for (const value of tools.slice(0, 12)) {
    const tool = record(value);
    if (!tool) continue;
    const search = record(tool.search_results);
    const candidates = [...(Array.isArray(tool.browser_results) ? tool.browser_results : []), ...(Array.isArray(search?.results) ? search.results : [])];
    for (const candidate of candidates.slice(0, 20)) {
      const result = record(candidate);
      const href = publicSourceUrl(result?.url);
      if (!href || sources.some(source => source.href === href)) continue;
      const host = new URL(href).hostname.replace(/^www\./, '');
      sources.push({ href, host, label: typeof result?.title === 'string' && result.title.trim() ? result.title.trim().slice(0, 160) : host });
      if (sources.length === 6) return sources;
    }
  }
  return sources;
}

export function validWebLookup(value: unknown): WebLookup | undefined {
  const data = record(value);
  if (!data || typeof data.checkedAt !== 'string' || !Number.isFinite(Date.parse(data.checkedAt)) || !Array.isArray(data.sources)) return;
  const sources: WebSource[] = [];
  for (const entry of data.sources.slice(0, 6)) {
    const source = record(entry);
    const href = publicSourceUrl(source?.href);
    if (href && typeof source?.label === 'string') sources.push({ href, label: source.label.slice(0, 160), host: new URL(href).hostname.replace(/^www\./, '') });
  }
  if (sources.length) return { checkedAt: data.checkedAt, sources };
}

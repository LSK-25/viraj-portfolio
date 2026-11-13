import { createHash } from 'node:crypto';

type ErrorDetails = { code?: 'provider_rate_limit' | 'local_rate_limit'; retryAfterSeconds?: number };
export class RequestError extends Error {
  constructor(message: string, public status = 400, public details: ErrorDetails = {}) { super(message); }
}
export function noStoreJson(data: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } });
}
export function assertOrigin(request: Request) {
  const allowed = [new URL(request.url).origin, ...(process.env.ASSISTANT_ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)];
  const origin = request.headers.get('origin');
  if (!origin || !allowed.includes(origin)) throw new RequestError('This request is not allowed.', 403);
}
const counters = new Map<string, { count: number; until: number }>();
let lastPrune = 0;
export function takeRateLimit(request: Request, kind: string, limit: number) {
  const now = Date.now();
  if (now - lastPrune > 60_000 || counters.size > 3000) {
    for (const [key, value] of counters) if (value.until <= now) counters.delete(key);
    lastPrune = now;
  }
  if (counters.size > 3000) throw new RequestError('The assistant is busy. Please try again shortly.', 429, { code: 'local_rate_limit', retryAfterSeconds: 60 });
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const key = kind + createHash('sha256').update(ip).digest('hex');
  const old = counters.get(key);
  if (!old || old.until <= now) counters.set(key, { count: 1, until: now + 60_000 });
  else {
    if (old.count >= limit) throw new RequestError('Too many requests in a short time. Please wait a moment.', 429, { code: 'local_rate_limit', retryAfterSeconds: Math.max(1, Math.ceil((old.until - now) / 1000)) });
    old.count++;
  }
}
export async function readLimited(request: Request, maxBytes: number) {
  if (Number(request.headers.get('content-length')) > maxBytes) throw new RequestError('Request is too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError('Request body is required.');
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) { await reader.cancel(); throw new RequestError('Request is too large.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder().decode(bytes);
}
export function apiKey() {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new RequestError('The AI assistant is not connected yet. The CV and project links are still available.', 503);
  return key;
}
export function validateMessages(value: unknown): { role: 'user' | 'assistant'; content: string }[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 16) throw new RequestError('Send between 1 and 16 messages.');
  for (const message of value) if (!message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || !message.content.trim() || message.content.length > 2400) throw new RequestError('Messages must contain short user or assistant text.');
  if (value.at(-1).role !== 'user') throw new RequestError('The final message must be a user question.');
  return value.map(message => ({ role: message.role, content: message.content }));
}
export function failure(error: unknown) {
  if (error instanceof RequestError) return noStoreJson({ error: error.message, ...error.details }, error.status, error.details.retryAfterSeconds ? { 'Retry-After': String(error.details.retryAfterSeconds) } : {});
  if (error instanceof Error && ['TimeoutError', 'AbortError'].includes(error.name)) return noStoreJson({ error: 'The AI connection timed out. Please try again.' }, 504);
  return noStoreJson({ error: 'The assistant could not complete this request. Please try again.' }, 502);
}

function resetSeconds(value: string | null): number | undefined {
  if (!value) return;
  const parts = [...value.matchAll(/(\d+(?:\.\d+)?)(ms|s|m|h|d)/g)];
  if (!parts.length || parts.map(part => part[0]).join('') !== value) return;
  const units: Record<string, number> = { ms: .001, s: 1, m: 60, h: 3600, d: 86400 };
  const seconds = parts.reduce((sum, part) => sum + Number(part[1]) * units[part[2]], 0);
  return Math.min(86400, Math.max(1, Math.ceil(seconds)));
}
export function providerRetryAfter(headers?: Headers): number | undefined {
  if (!headers) return;
  const retry = headers.get('retry-after');
  if (retry) {
    const seconds = /^\d+(?:\.\d+)?$/.test(retry) ? Number(retry) : (Date.parse(retry) - Date.now()) / 1000;
    if (Number.isFinite(seconds) && seconds > 0) return Math.min(86400, Math.max(1, Math.ceil(seconds)));
  }
  const resets: number[] = [];
  if (headers.get('x-ratelimit-remaining-requests') === '0') {
    const reset = resetSeconds(headers.get('x-ratelimit-reset-requests'));
    if (reset) resets.push(reset);
  }
  if (headers.get('x-ratelimit-remaining-tokens') === '0') {
    const reset = resetSeconds(headers.get('x-ratelimit-reset-tokens'));
    if (reset) resets.push(reset);
  }
  return resets.length ? Math.max(...resets) : undefined;
}
export function providerError(status: number, headers?: Headers) {
  if (status === 429) {
    const retryAfterSeconds = providerRetryAfter(headers);
    return new RequestError("The AI provider's usage limit was reached. Your question is kept here. " + (retryAfterSeconds ? 'You can retry when the timer finishes.' : 'The provider did not supply a reset time; please try again later.'), 429, { code: 'provider_rate_limit', ...(retryAfterSeconds ? { retryAfterSeconds } : {}) });
  }
  return new RequestError(status === 401 || status === 403 ? 'The AI service is not configured correctly. Please contact Viraj.' : 'The AI service could not complete this request. Please try again.', 502);
}

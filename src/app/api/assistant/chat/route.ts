import {
  assertOrigin, takeRateLimit, readLimited, validateMessages, apiKey,
  failure, noStoreJson, providerError, RequestError,
} from '@/lib/assistant-server';
import { assistantInstructions, resourceCards } from '@/lib/portfolio-knowledge';

export const runtime = 'nodejs';
export const maxDuration = 40;

export async function POST(request: Request) {
  try {
    assertOrigin(request);
    takeRateLimit(request, 'chat', 10);
    let data;
    try {
      data = JSON.parse(await readLimited(request, 50_000));
    } catch (error) {
      if (error instanceof RequestError) throw error;
      throw new RequestError('Invalid request JSON.');
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new RequestError('Send a question in a JSON object.');
    }
    const messages = validateMessages(data.messages);
    if (messages.reduce((count, message) => count + message.content.length, 0) > 12_000) {
      throw new RequestError('This conversation is too long. Please send fewer recent messages.', 413);
    }
    const key = apiKey();
    const instructions = assistantInstructions + (data.voice === true
      ? '\nThis reply will be spoken aloud. Answer in two or three short sentences unless asked for more. Avoid code blocks and long URLs.'
      : '');
    // This is the only model endpoint. There is no paid-provider fallback.
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'system', content: instructions }, ...messages],
        reasoning_effort: 'low',
        include_reasoning: false,
        max_completion_tokens: 1200,
        temperature: 0.6,
        stream: false,
      }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(30_000)]),
    });
    if (!response.ok) throw providerError(response.status);
    const result = await response.json();
    const text = result.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) {
      throw new RequestError('The assistant returned no answer. Please try again.', 502);
    }
    return noStoreJson({ text: text.trim(), links: resourceCards(messages.at(-1)!.content + ' ' + text) });
  } catch (error) {
    return failure(error);
  }
}

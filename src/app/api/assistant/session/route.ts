import { assertOrigin, failure, noStoreJson } from '@/lib/assistant-server';

// Retired endpoint: stale clients must never create a paid Realtime session.
export async function POST(request: Request) {
  try {
    assertOrigin(request);
    return noStoreJson({ error: 'Voice now uses browser speech. Refresh the page and choose Start voice.' }, 410);
  } catch (error) {
    return failure(error);
  }
}

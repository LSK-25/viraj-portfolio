import test from 'node:test';
import assert from 'node:assert/strict';
import { pickBrowserVoice } from '../src/lib/browser-voice-options';
import { speechText } from '../src/lib/speech-text';

const voice = (name: string, localService: boolean, lang = 'en-US') => ({ name, localService, lang, voiceURI: name, default: false });

test('automatic voice prefers installed female speech over online voices', () => {
  const voices = [voice('Google UK English Female', false), voice('Microsoft David', true), voice('Microsoft Zira', true)];
  assert.equal(pickBrowserVoice(voices)?.name, 'Microsoft Zira');
  assert.equal(pickBrowserVoice(voices.slice(0, 2))?.name, 'Microsoft David');
});
test('explicit voice choice wins; unavailable choices fall back safely', () => {
  const voices = [voice('Microsoft Zira', true), voice('Google UK English Female', false)];
  assert.equal(pickBrowserVoice(voices, voices[1].voiceURI), voices[1]);
  assert.equal(pickBrowserVoice(voices, 'missing'), voices[0]);
  assert.equal(pickBrowserVoice([]), undefined);
  assert.equal(pickBrowserVoice([voice('French voice', true, 'fr-FR')]), undefined);
});
test('speech formatting removes code and URLs without losing link labels', () => {
  assert.equal(speechText('**See** [NOVA](https://example.com)\n```js\nsecret()\n```'), 'See NOVA\nThe code is available in the conversation.');
  assert.equal(speechText('x'.repeat(2000)).length, 1600);
});

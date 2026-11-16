type Voice = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'voiceURI' | 'localService' | 'default'>;

export function englishVoices<T extends Voice>(voices: T[]): T[] {
  return voices.filter(voice => /^en(?:[-_]|$)/i.test(voice.lang));
}

export function pickBrowserVoice<T extends Voice>(voices: T[], preferredURI = ''): T | undefined {
  const available = englishVoices(voices);
  const chosen = available.find(voice => voice.voiceURI === preferredURI);
  if (chosen) return chosen;
  const female = (voice: T) => /Samantha|Zira|Jenny|Aria|Susan|Hazel|Victoria|Karen|Moira|Tessa|Serena|female/i.test(voice.name);
  // Prefer installed voices so automatic mode does not add an online TTS hop.
  return available.find(voice => voice.localService && female(voice))
    ?? available.find(voice => voice.localService && voice.default)
    ?? available.find(voice => voice.localService)
    ?? available.find(female)
    ?? available.find(voice => voice.default)
    ?? available[0];
}

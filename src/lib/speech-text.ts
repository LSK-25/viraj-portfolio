export function speechText(text: string) {
  return text
    .replace(/[\x60]{3}[\s\S]*?[\x60]{3}/g, 'The code is available in the conversation.')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, 'the linked page')
    .replace(/[*#_\x60]/g, '').slice(0, 1600).trim();
}

# Viraj Patil — Dossier edition

Complete source update for https://viraj-portfolio-mu.vercel.app/.
This ZIP is not a deployment. Copy the changes into the existing connected
repository and push them to update the public website.

## This revision: fast live speech, continuous three-second lens and a new opening

- NOVA live conversation is back on browser speech synthesis. Start voice no
  longer downloads or initializes Kokoro, ONNX, WASM or a speech worker.
- Automatic selection prefers an installed English female voice, with natural
  pitch and the original speaking rate. The available voices depend on the OS
  and browser; no particular voice is guaranteed on every device.
- Sound & voice options now lists the browser's English voices. Preview a voice
  before starting a conversation. The selected voice is remembered in this
  browser. On-device and online voices are labeled; online voices may add delay.
- A new two-second charcoal-and-gold opening reveals VIRAJ PATIL through an
  original optical motif. Skip and Escape dismiss it immediately. It appears
  once per tab, skips reduced motion, has no autoplay sound and never waits for
  assets or AI loading. The first lens countdown restarts when the intro ends.
- The front-page project box now scales with desktop viewport height. The full
  card and project names fit at common laptop sizes; mobile puts the project
  name above the artwork. Your large name remains the hero's main identity.
- The hero lens now cycles every three seconds, including while hovered or
  keyboard focused. Clicking any project selects it immediately and restarts
  automatic cycling from there, even after pressing Pause. Reduced motion
  remains manual; hidden/offscreen animation is suspended.
- A new original graphite-and-titanium smart-glasses product render replaces
  the earlier vector illustration in the lens, cards and briefing concept views.
  It is labeled as a design concept, not built hardware.
- Heart narration remains on all five project briefings, using the exact same
  bundled audio files and timeline. The improved project scenes are preserved.
- AI model, prompts, request timeout, automatic search and response settings are
  unchanged. This restores the previous speech path, not a measured latency SLA.

## Dossier edition foundation

- A new charcoal, ivory and brushed-gold identity, with an original animated
  optical study, large VIRAJ PATIL typography and restrained glass surfaces.
- Leon's background video is removed, including the 40 MB video asset.
- The brief opening is skippable; no asset-loading gate is used. Touch and reduced-motion layouts are retained.
- Five projects in the interactive gallery, index and project dossiers.
  AI Smart Glasses is explicitly concept/research work, separate from NOVA and
  Sentinel. Its illustrated frame and 3D model are concept studies, not hardware.
- Dedicated /projects/nova, /projects/billi-boba, /projects/sadafuli,
  /projects/sentinel and /projects/smart-glasses pages.
- Each page has Demo, How it works and Code tabs, keyboard tab navigation,
  project metadata, next-project navigation and links to the actual project
  wherever a public website or repository is known.
- Original 60-second briefings: five chapters, animated visual reconstructions,
  captions, playback controls, seeking, fullscreen and a complete transcript.
  Sentinel illustrates camera detection; NOVA the conversation loop; the stores
  their customer journey; smart glasses a proposed vision-and-voice architecture.
- Briefings do not open a camera or microphone and do not call the AI API.
  They are interactive scripted scenes, not recorded application footage or MP4s.
  No Call of Duty, James Bond or Leon footage, branding or audio is included.
- Optional narration uses bundled Heart tracks. Sound starts only after pressing
  Play. Pause, resume and seek use the same audio timeline as the visual scenes.
- Narration stops on pause, leaving the viewport, hiding the tab, switching away
  from Demo, leaving the page, or opening NOVA. Captions work without speech.
- Sadafuli's Code tab includes a selected cart-validation source excerpt reviewed
  in the local client project. Other Code tabs are labeled workflow pseudocode.
- The portfolio PDF now contains all five projects; the original CV is preserved.

The direction references the supplied Dribbble examples and https://alche.studio/.
Their code, images, identities and recorded media were not copied.

## Apply the update

1. Extract this ZIP and open its viraj-portfolio folder.
2. Copy src, public, scripts, tests, README.md, package.json and package-lock.json
   into the existing project, replacing matching files. Keep your .git, .vercel
   and .env.local untouched. Include the new public/audio and public/voice folders.
3. Delete public/videos/leon-loop.mp4 from the destination if it is left over
   from the earlier version. The new code never loads it, even if it remains.
4. If present from a much older version, remove src/lib/realtime-voice.ts,
   the retired paid voice integration. It is not in this package.
5. Remove these retired files if copying left them behind:
   src/lib/heart-voice.ts, tests/heart-voice.test.ts,
   public/voice/heart-worker.mjs, public/voice/kokoro-1.2.1.mjs and
   scripts/prepare-heart.mjs. Keep public/audio/heart and the voice license.
   Then run npm ci, npm run typecheck, npm test and npm run build.
   The live Kokoro dependency is removed; no new provider key is required.
6. Run npm run dev to preview. Then commit and push from the existing repository:

```powershell
Set-Location "C:\Projects\viraj-portfolio"
git status
git add src public scripts tests README.md package.json package-lock.json
git commit -m "Add gold opening, compact project lens and fast live voice options"
git push
```

Use your existing deployment branch. Wait for Vercel to show Ready for this commit,
then refresh the website. Extracting/copying alone does not deploy it. The version
check is the gold opening, three-second lens label, compact project card and
Reply voice / Preview voice in NOVA's sound options.

Use Node.js 22 or 24. API routes require server hosting; do not use static export.
The normal npm run build uses Next.js Turbopack.

## NOVA and speed

Ordinary chat still uses Groq-hosted openai/gpt-oss-20b with its existing request
settings: low reasoning effort, temperature 0.6, 1200-token completion limit,
non-streaming output and the same timeout and conversation window. Search,
recognition and manual interruptions are retained. Text inference is unchanged.
Live speech uses the previous browser renderer without a neural-model warmup.
Audio startup still depends on the selected browser voice and device. The smart-glasses concept facts are added to context
only for relevant portfolio questions.

Keep the existing GROQ_API_KEY in the server environment. No paid provider,
OpenAI API key, custom speech service or model hosting has been introduced.
Groq account quotas still apply. Local Ollama/Qwen is not connected to the site.
A new API key does not remove account limits. Quota errors keep the question,
show an available reset time, and allow a manual retry.

Freshness-sensitive questions automatically request web search. There is no
Search web button. Source cards come from retrieved source records, not invented
URLs. Retrieval can take longer than ordinary chat; it is not a live news feed.
The app cannot inspect the account's billing plan. Existing provider terms apply.

## Voice

NOVA uses browser speech recognition and SpeechSynthesis for live conversations.
The default prefers an available local English female voice (for example Zira
or Samantha), then another local English voice, then browser-provided English
voices. Explicit visitor selection wins. Automatic mode never waits for the
voice list to populate; it can use the browser default and refresh later.

Sound & voice options provides an actual voice preview, stops it before starting
microphone recognition, and stores only the chosen voice URI under
nova.browser-voice in localStorage. No conversations are stored there. If storage
is blocked, the current-page selection still works. Missing saved voices fall
back to automatic selection. Available voice lists update on voiceschanged.

Recognition pauses during replies. Interrupt & speak cancels pending inference
or speech and resumes listening. Mute controls the mic; End voice and closing
the panel end the session. Sessions end after five minutes. Automatic spoken
barge-in is not implemented. Use HTTPS or localhost and a supported browser.

Project briefings keep Kokoro v1.0 / af_heart, the English voice used in ADA.
They play public/audio/heart/*.wav: five 60-second, 24 kHz mono tracks.
All 25 spoken segments fit their chapters without cutting words. The manifest
records narration text, timings and hashes. Pause/resume/seek stays synchronized;
muting continues the visuals. Playback stops when hidden/offscreen or when NOVA
opens. Captions and full transcripts remain available. No model is downloaded
or run for these prerecorded tracks. No Leon Kennedy voice clone is included.

scripts/render-heart-briefings.py can regenerate tracks with an existing ADA
Kokoro installation and exported case-study JSON, using only the local model.
Kokoro source: https://github.com/hexgrad/kokoro
License: public/voice/KOKORO-LICENSE.txt.

Heartbeat is a separate optional ambient sound, off by default. It gets quieter
in conversation and stops when the panel closes or the tab hides.

## Facts, media and privacy

Project facts: src/data/portfolio.json. Briefing scripts: src/data/case-studies.ts.
The assistant must distinguish concepts from working implementations and avoid
inventing metrics, commercial results or project availability. Sadafuli checkout
uses WhatsApp; smart glasses hardware and AR remain research directions.

Four original concept artworks share public/images/project-studies.png.
The fifth project has an original generated product render and a procedural Three.js model.
They are not product inventory photos, app screenshots or shipped hardware.

The website's assistant is distinct from the offline desktop NOVA/ADA project.
Chat and voice transcripts go to Groq. Browser recognition may send audio to the
browser vendor. Speech playback depends on the selected voice. Conversations
remain in page memory; this app does not store them in a database/localStorage.
The cinematic briefings use scripted text and never access a camera/microphone.

The original CV remains public/Viraj_Patil_Resume.pdf. Rebuild the three-page
portfolio PDF with python scripts/build_portfolio_pdf.py (requires reportlab).
The script uses the same project facts as the website and checks for overflow.

## Verification

Production build, TypeScript and 45 regression tests pass. Coverage includes
unchanged chat/provider/search behavior, quotas, microphone permissions,
interruption and replay, briefing timelines, speech formatting, preference
selection and fallback when a saved browser voice is unavailable.

Browser checks use mocked microphone, speech and AI responses to verify that
Start voice immediately opens recognition without constructing a Heart worker
or fetching model assets. They cover voice preview, selection, persistence,
reply rendering, interrupt and closing. Bundled Heart narration is unchanged from the preceding release. The glasses study uses the new render. Actual voice quality and speech
service latency depend on the user's browser/device; no latency guarantee is made.
No real Groq request or production credential is used in tests.

The ZIP excludes node_modules, .next, .git, .vercel, local environment files,
credentials and caches. This source update is not an already deployed website.

Lens browser checks cover the real three-second interval while hovered and focused,
click-to-resume, resetting the timer on repeated selection, last-to-first wrapping,
explicit Pause, reduced motion, image loading and desktop/mobile layout.

Opening/layout checks cover skip, automatic dismissal, once-per-tab behavior,
reduced motion, all project titles without scrolling at 1366x650, 1366x768,
1536x864 and 1920x1080, and title-first mobile layout at 390x844.

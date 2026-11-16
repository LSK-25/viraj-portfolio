# Viraj Patil — Dossier edition

Complete source update for https://viraj-portfolio-mu.vercel.app/.
This ZIP is not a deployment. Copy the changes into the existing connected
repository and push them to update the public website.

## This revision: reconstructed scenes + Heart

- Five distinct scene treatments: NOVA's desktop conversation, BILLi&BoBA's
  product/sizing/order journey, Sadafuli's editorial storefront and WhatsApp
  enquiry, Sentinel's camera/evidence study, and Smart Glasses' proposed
  vision-to-voice flow. All are scripted reconstructions, not app recordings.
- Detailed interface panels, context readouts, original camera/desk illustrations,
  chapter progress, and motion tied to the seekable 60-second timeline.
- Chapter titles sit above the scene instead of covering the artwork. Responsive
  scenes stack on phones, retain captions and honor reduced motion.
- Heart (Kokoro af_heart, the English voice used by ADA) replaces the previous
  male browser voice. All 25 briefing narrations are generated and bundled.
- Live NOVA speech uses Heart in a dedicated browser worker. No voice API key,
  paid speech service, or exposed laptop server is needed. First use downloads
  the model/runtime; speed and caching depend on the device and browser.
- A voice preview and an explicitly named Browser voice fallback are available
  under Sound & voice options. Heart failure never silently changes the voice.
- Existing text-model requests/settings, automatic news search, gold cursor,
  disappearing letters, five-second lens rotation and gallery caption dock stay.

## Dossier edition foundation

- A new charcoal, ivory and brushed-gold identity, with an original animated
  optical study, large VIRAJ PATIL typography and restrained glass surfaces.
- Leon's background video is removed, including the 40 MB video asset.
- The loading gate remains removed. Touch and reduced-motion layouts are retained.
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
5. Run npm ci, npm run typecheck, npm test and npm run build.
   kokoro-js 1.2.1 is the new dependency; no new provider key is required.
   The official browser bundle is included; npm run prepare:heart can recreate it.
6. Run npm run dev to preview. Then commit and push from the existing repository:

```powershell
Set-Location "C:\Projects\viraj-portfolio"
git status
git add src public scripts tests README.md package.json package-lock.json
git commit -m "Rebuild project briefings and add ADA Heart voice"
git push
```

Use your existing deployment branch. Wait for Vercel to show Ready for this commit,
then refresh the website. Extracting/copying alone does not deploy it. The version
check is the Heart on/off control in briefings and Heart / ADA in NOVA's voice options.

Use Node.js 22 or 24. API routes require server hosting; do not use static export.
The normal npm run build uses Next.js Turbopack.

## NOVA and speed

Ordinary chat still uses Groq-hosted openai/gpt-oss-20b with its existing request
settings: low reasoning effort, temperature 0.6, 1200-token completion limit,
non-streaming output and the same timeout and conversation window. Search,
recognition and manual interruptions are retained. Text inference is unchanged.
Heart speech generation has its own device-dependent latency; it is not promised
as fast as the previous installed browser voice. A fallback remains selectable. The smart-glasses concept facts are added to context
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

Default: Kokoro v1.0 / af_heart, American English, natural pitch and speed 1.0.
This is ADA's Heart voice, not a Leon Kennedy clone.

Live conversation:
- Start voice unlocks audio, loads Heart on demand, and warms it before opening
  the microphone. Loading is visible and cancellable by End voice. The worker
  can finish warming in the background for the next session.
- The official kokoro-js 1.2.1 browser bundle is served locally. It loads the q8
  onnx-community/Kokoro-82M-v1.0-ONNX model/voice from Hugging Face and the pinned
  compatible ONNX WASM runtime from jsDelivr. These hosts must be reachable.
- Model files may be cached by the browser. Incognito/cache clearing/storage
  eviction can require another download. No model is loaded by opening a page
  or using text chat. Slow/low-memory devices can use Browser voice instead.
- Heart synthesizes reply sentences inside a worker, and playback begins as
  audio arrives. It doesn't send reply text to a speech API. The fixed preview
  doesn't require a model download. Browser voice uses the device's voices.
- Recognition pauses during playback. Interrupt & speak immediately stops
  queued audio, cancels the pending answer and ignores late speech chunks.
  Mute controls the mic; End voice/closing the panel ends the session.
- Sessions end after five minutes. Automatic spoken barge-in isn't implemented.
  HTTPS or localhost and supported browser speech recognition are required.
- Heart is English-only here. ADA's separate Hindi/Marathi routing is not part
  of this website update. Existing Groq chat limits still apply.

Briefings use public/audio/heart/*.wav: five 60-second, 24 kHz mono tracks.
The 25 spoken segments fit their chapters without cutting words. The manifest
records narration text, timings and hashes. Pause/resume/seek stays synchronized;
muting continues the visual timeline. Playback stops when hidden/offscreen or
when NOVA opens. Captions and full transcripts are always available.

scripts/render-heart-briefings.py can regenerate these tracks with an existing
ADA Kokoro installation and exported case-study JSON. It uses only the local
model; it does not record sound, play audio, or download assets.
Runtime source: https://github.com/hexgrad/kokoro/tree/main/kokoro.js
Apache-2.0 license: public/voice/KOKORO-LICENSE.txt.

Heartbeat is a separate optional ambient sound, off by default. It gets quieter
in conversation and stops when the panel closes or the tab hides.

## Facts, media and privacy

Project facts: src/data/portfolio.json. Briefing scripts: src/data/case-studies.ts.
The assistant must distinguish concepts from working implementations and avoid
inventing metrics, commercial results or project availability. Sadafuli checkout
uses WhatsApp; smart glasses hardware and AR remain research directions.

Four original concept artworks share public/images/project-studies.png.
The fifth project has a vector study and a procedural Three.js model.
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

Production build, TypeScript and 47 regression tests pass. Tests cover unchanged
chat/provider/search behavior, quotas, microphone permissions, interruptions,
Heart model reuse, cancellation, queued audio completion, retry after worker
failure, briefing timelines and accurate concept knowledge. Run npm test.

The included voice manifest checks every narration fits its chapter. Production
HTTP checks cover all five project routes, static assets, PDFs, video removal,
unknown-route handling, assistant status and cross-origin rejection. The chat
request, API handler and web-access code match the previous ZIP byte for byte.

Headless Chrome checks pass on desktop and 390 px mobile layouts: all five
briefings render without page errors or horizontal overflow, play bundled Heart
audio, pause and navigate chapters. Screenshots were reviewed. Mocked browser
checks cover live voice loading, microphone turns, reply rendering, interruption,
model reuse, closing, download failure and the explicit browser fallback.

Actual live-model synthesis could not be verified here: this workspace blocked
Hugging Face downloads with ERR_NETWORK_ACCESS_DENIED. The live worker follows
the official Kokoro API but requires a deployed-browser check with those hosts
reachable. Bundled briefing narration does not have that dependency.

No real Groq requests or production credentials are used in verification.
The ZIP excludes node_modules, .next, .git, .vercel, local environment files,
credentials and caches. This source update is not an already deployed website.

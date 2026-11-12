# Viraj Patil - spatial portfolio

Updated source for the existing portfolio at https://viraj-portfolio-mu.vercel.app/.
This package has not been pushed or deployed. The running website changes only
after this source is deployed to its existing Vercel project.

## This revision

- Leon's looping video fills the hero. The still-image layer and image poster
  are removed. The video has Play/Pause controls and pauses offscreen or in a
  hidden tab. Reduced-motion preferences disable automatic playback.
- A scroll-driven Three.js gallery presents four original scenes: the NOVA desk
  companion concept, BILLi&BoBA's nail collection, Sadafuli's folded textile and
  flower, and Sentinel's camera concept. These are illustrative models, not
  photographs or claims that the concept hardware has shipped.
- Scroll between chapters, use the numbered chapter buttons, and drag the scene
  with a mouse to rotate it. Pause motion stops idle animation. Index view gives
  direct access to every project without travelling through the 3D scene.
- The gallery loads near the viewport and stops rendering when offscreen or in
  a hidden tab. Reduced motion, compact viewports and graphics failures use the
  project index. A no-JavaScript index is also included.
- News and other freshness-sensitive questions can search the web. Ordinary chat
  retains its existing model, inference settings, browser voice and turn timing.
- Heartbeat now has a clearer double pulse, an animated indicator, volume control
  and a Preview button. It is optional ambient sound, not an AI health indicator.

The black, graphite and wine palette, verified project order, project links,
original CV and two-page portfolio PDF are preserved. The spatial direction was
informed by https://alche.studio/; its assets and code were not copied.

## Apply to the existing project

1. Extract the ZIP and open the enclosed project folder.
2. Copy its source into the repository already connected to your portfolio.
   Preserve that repository's .git directory, Vercel connection and .env.local.
3. If merging into an older version, delete src/lib/realtime-voice.ts if present;
   it is the retired paid voice integration and is absent from this package.
4. Run npm ci, then npm run typecheck and npm run build.
5. Test locally with npm run dev, then commit and push the source through your
   existing deployment workflow. No new Vercel project is necessary.

Use Node.js 22 or 24. The default Next.js production build uses Turbopack.
API routes need server hosting; do not use a static export. No credentials or
generated build folders are included in this ZIP.

## Existing free AI setup

The model remains openai/gpt-oss-20b hosted by Groq. Keep your Groq account on its
Free plan to avoid model usage charges; free usage has quotas. This is an online
service, not unlimited or offline inference.

Your existing GROQ_API_KEY is sufficient for the built-in browser-search route;
no separate search-provider key was added. Leave the key in the existing Vercel
project's server environment variables. For local testing, copy .env.example to
.env.local and set GROQ_API_KEY there. Never put it in a NEXT_PUBLIC_ variable.

There is no OpenAI API key or paid-provider fallback. The model name contains
"openai" because OpenAI released the model, but requests go to Groq. An old
OPENAI_API_KEY does not enable this assistant. The retired session endpoint
returns 410 without contacting a provider. The app cannot inspect your billing
plan: upgrading the provider account can enable billed usage.

Ordinary chat keeps low reasoning effort, temperature 0.6, a 1200-token completion
limit, non-streaming output and the existing timeout. Speech rate, pitch and
recognition/interruption timing have not been changed. No latency improvement is
claimed or attempted in this revision.

## Current information and sources

- Questions containing freshness cues such as latest news, today or current
  weather automatically request Groq's browser_search tool.
- The Search the web switch lets you request a lookup for other questions.
- Search runs only when needed or explicitly requested. Its extra retrieval work
  can take longer than ordinary replies; it is not a continuous live news feed.
- Answers include source cards and the retrieval time. Cards are derived from
  provider-returned browser/search records, not URLs invented in answer text.
- If the account cannot use search, a quota is exhausted, or the response lacks
  usable source records, the application reports the problem. It does not silently
  substitute an unverified current-news answer or switch to another provider.
- Verify important claims against the linked sources. A retrieval timestamp is
  not an article publication timestamp or a guarantee of exhaustive coverage.

Only browser search is enabled. Code execution, email sending and desktop control
are not connected. Basic limits allow ten chat requests and three web lookups per
minute per caller, per server instance; provider account limits also apply.

Live retrieval has not been tested with your Groq account in this revision. The
integration follows Groq's current documented browser-search request and source
metadata schema. Its success and failure paths have mocked regression coverage.

## Voice and heartbeat

Voice uses browser speech recognition and speech synthesis plus the same Groq
text endpoint. No paid audio API is connected. Recognition pauses during replies
so it does not hear its own output. Interrupt & speak cancels the pending answer
or playback and resumes listening. Mute, End voice and closing the panel stop
recognition appropriately. A five-minute timer ends an unattended voice session.
Read reply retries speech when playback is blocked. Automatic spoken barge-in is
not implemented. Voice requires HTTPS or localhost and a supported browser.

The heartbeat is off by default. Open Talk to NOVA, click Preview to hear the
sample, then turn Heartbeat sound on. Adjust Volume as needed. It becomes quieter
during conversation, pauses in hidden tabs and stops when the panel closes. If
Preview is silent, check tab mute, the selected audio output and device volume.
It does not measure a pulse, indicate server health, keep the model awake or
change NOVA's reply speed. The voice waveform is a decorative activity indicator,
not a calibrated sound-level meter.

A custom Leon-style voice is not connected yet. A clean voice recording and a
separate reference-conditioned speech service are needed; browser voice selection
cannot turn an uploaded audio file into a cloned voice. No new speech service,
model download or hosting charge has been introduced.

## Data and content

Text questions, recent conversation context and voice transcripts go to Groq.
Search requests also involve its search service. Speech recognition may send
microphone audio to the browser vendor's online service. Speech playback depends
on the browser/device. Do not describe this website assistant as fully offline.

Transcripts remain in page memory; this application does not save them to a
database or localStorage. Provider policies still apply. The website assistant
is distinct from the local NOVA/ADA project and remains English-only.

Verified portfolio facts and resource links live in src/data/portfolio.json.
The assistant must not invent experience, results, project availability or links.
The original documents and project links are included:

- Sadafuli: https://sadafuli.vercel.app/
- BILLi&BoBA: https://billi-boba-nails.vercel.app/
- Original CV: public/Viraj_Patil_Resume.pdf
- Portfolio PDF: public/Viraj_Patil_Portfolio.pdf

The video is public/videos/leon-loop.mp4. Its supplied reference is
https://www.youtube.com/watch?v=gTPsGjDC-gU. No portrait fallback is rendered.
Inter and Inter Tight load locally from src/app/fonts. Generated project artwork
is illustrative, not a screenshot of the live client websites.

To rebuild the portfolio PDF after changing facts, install reportlab and run
`python scripts/build_portfolio_pdf.py`. Embedded fonts and licenses are in
scripts/fonts. Inspect both pages after rebuilding.

## Verification

Commands for a normal installation:

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The 28 mocked regression tests pass. They cover verified links, origin and payload
validation, provider selection, absent credentials, quota handling, conversation
bounds, unchanged ordinary-chat settings, voice interruption, mute, permission
failure, closing during startup, late replies, blocked playback, search routing,
explicit search, source validation and search failures. Tests were run using Node's
test runner through a temporary TypeScript compilation harness because the local
tsx runner was unavailable. No production credentials are used in these tests.

TypeScript, lint of the changed components/API/tests and the default Next.js
production build (Turbopack) pass. The optional webpack build hit a Windows EPERM
error while creating an output directory; the default build completed successfully.
Production HTTP checks also pass for the hero HTML, video, both PDFs, assistant
provider status and rejection of requests from an unrelated origin.
A fresh interactive desktop/mobile
browser review and audible heartbeat check could not be completed in this session.
Earlier screenshots and browser checks belong to the previous version, not this
new 3D revision. Real voice quality, retrieval, latency and device GPU performance
are not established by the mocked tests.

After deployment, test the hero Play/Pause control; all four gallery chapters;
mouse rotation; Index view; small-screen and reduced-motion fallback; project/CV
links; a normal conversation; latest Nvidia news and its source links; microphone
permission; interruption; mute; Preview; volume; and closing the assistant.

## References checked on 12 November 2026

- Groq model: https://console.groq.com/docs/model/openai/gpt-oss-20b
- Browser search: https://console.groq.com/docs/tool-use/built-in-tools/browser-search
- Source metadata: https://github.com/groq/groq-typescript/blob/main/src/resources/chat/completions.ts
- Free-plan limits: https://console.groq.com/docs/rate-limits
- Billing: https://console.groq.com/docs/billing-faqs
- React Three Fiber: https://r3f.docs.pmnd.rs/api/canvas
- On-demand rendering: https://r3f.docs.pmnd.rs/advanced/scaling-performance

The source archive excludes node_modules, .next, .git, .vercel, local environment
files, credentials, caches and generated TypeScript build information.

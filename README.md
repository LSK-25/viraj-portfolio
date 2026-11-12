# Viraj Patil - portfolio

Updated Next.js source for the existing site at https://viraj-portfolio-mu.vercel.app/.

The black, graphite and wine palette, Leon looping background, portrait fallback,
playback controls, original interaction effects and optional heartbeat are retained.
The project order is NOVA / ADA, BILLi&BoBA, Sadafuli by Isha, then Sentinel.
The original CV and two-page portfolio PDF are included.

## Free AI setup

This revision uses GPT-OSS 20B hosted by Groq. Use a Groq account on its **Free**
plan to avoid model usage charges. Free usage has quotas and can become unavailable
when a limit is reached. This is an online service, not an unlimited or offline model.

1. Sign in at https://console.groq.com/ and keep the account on the Free plan.
2. Create a key at https://console.groq.com/keys, with a name such as Viraj Portfolio.
3. For local use, copy .env.example to .env.local and enter the key as GROQ_API_KEY.
   Keep the key private. .env.local is ignored by Git and excluded from this ZIP.
4. For the live website, add GROQ_API_KEY to the existing portfolio Vercel project's
   server environment variables for Production (and Preview if needed).
5. Deploy this source to that existing project, then test text and voice.

There is no OpenAI API key or OpenAI project to configure. The model name contains
"openai" because OpenAI released the open-weight model; requests go to Groq.
The code never calls api.openai.com and never switches to a paid provider when
the free quota is exhausted. An old OPENAI_API_KEY does not enable this assistant.
The retired /api/assistant/session endpoint returns 410 without contacting a provider.

Free pricing is an account-plan condition. If you upgrade the Groq account to a
paid plan, its usage can be billed. The app cannot inspect or enforce your account
billing plan. Keep the account on Free.

The model is pinned to openai/gpt-oss-20b in src/app/api/assistant/chat/route.ts.
Optional ASSISTANT_ALLOWED_ORIGINS adds explicit trusted origins; same-origin
requests are accepted by default. Never use NEXT_PUBLIC_ for API secrets.

## Run locally

Use Node.js 22 or 24 and npm:

```bash
npm ci
npm run dev
```

Open the URL printed by Next.js. The portfolio and document links work without a
key. Missing AI credentials show an unavailable message instead of a fabricated
model reply.

Copy the updated source into the repository already connected to the portfolio,
preserving that repository's .git directory and Vercel connection. If you merge
files into the old source, also delete src/lib/realtime-voice.ts: that module was
retired and is intentionally absent from this revision. Use npm ci and npm run
build, then commit and push the updated source to the connected repository.
The API routes require server hosting; do not use static export.
This package has not been pushed or deployed.

## Voice and interaction

Voice uses the browser's speech recognition and speech synthesis, plus the same
Groq text endpoint. No paid audio API is connected.

- Start voice begins English speech recognition after browser permission.
- Recognition pauses while the model answers and while the browser reads its
  reply, which prevents it from hearing its own output.
- Interrupt & speak cancels a pending answer or stops playback, then listens for
  your next turn. Automatic spoken barge-in is not implemented.
- Mute mic, End voice and closing the dialog stop recognition appropriately.
  A five-minute timer ends an unattended session.
- Read reply retries speech when a browser blocks playback.
- Unsupported browsers can still use text chat. Voice requires HTTPS or localhost
  and browser support for both speech recognition and synthesis.
- Heartbeat is optional. It becomes quieter while voice is active, pauses in a
  hidden tab, and stops when the panel closes.

Speech quality, available voices and recognition depend on the browser/device.
This does not clone Leon's voice. It does not promise zero latency or the same
continuous audio experience as a dedicated realtime voice service.

The waveform indicates voice activity; it is not a calibrated audio-level meter.

## Data and privacy

Text questions, conversation context and voice transcripts go to Groq. Speech
recognition may send microphone audio to the browser vendor's online service.
Speech playback can use a local or browser-provided voice. Do not describe this
setup as fully local or offline.

The app holds transcripts in page memory; it does not store them in a database or
localStorage. Provider policies still apply. No web search, email sending or
desktop control is connected. The website assistant is distinct from the local
NOVA / ADA prototype.

Verified portfolio facts and approved resource links are in src/data/portfolio.json.
The assistant can discuss general topics, but it must not invent Viraj's experience,
project results or links. Origin checks, request-size limits, bounded conversation
context, provider timeouts, sanitized errors and ten requests per minute per caller
provide basic protection. The in-memory limit is per server instance, not a global
quota or authentication system. Groq's account limits remain applicable.

## Content and downloads

- Sadafuli: https://sadafuli.vercel.app/
- BILLi&BoBA: https://billi-boba-nails.vercel.app/
- Original CV: public/Viraj_Patil_Resume.pdf
- Portfolio PDF: public/Viraj_Patil_Portfolio.pdf

Rebuild the PDF after changing portfolio facts:

```bash
python -m pip install reportlab
python scripts/build_portfolio_pdf.py
```

Embedded PDF fonts and their license are in scripts/fonts. Inspect both pages
after content changes; the generator checks vertical overflow. Project cover art
is a graphic treatment, not a live-site screenshot.

The hero uses public/videos/leon-loop.mp4 and the supplied portrait fallback.
The reference is https://www.youtube.com/watch?v=gTPsGjDC-gU.
Inter and Inter Tight load from src/app/fonts.

## Verification

```bash
npm run typecheck
npm test
npm run lint
npm run build
```

The regression suite covers verified links, origin and payload validation, provider
selection, disabling legacy paid requests, missing credentials, quota handling,
context bounds, voice interruption, mute, permission failure, closing during
startup, late responses and blocked-playback recovery. Model responses and browser
speech are mocked. These checks do not measure real latency or speech quality.

The production webpack build, TypeScript check, lint of the edited components,
and all 21 mocked regression tests passed. The tests were run through a temporary
TypeScript compilation harness using Node's test runner. Desktop and 390px browser
layouts, the assistant dialog, heartbeat toggle and missing-key state were checked.
The final browser check showed no horizontal overflow or console errors.

After configuring a Free-plan key, test a general question, project facts, CV
links, microphone permission, interruption, mute/unmute, Read reply, heartbeat,
closing a call and mobile layout. No live provider test has been run for this
revision because no Groq key is configured.

## Sources checked on 12 November 2026

- Model: https://console.groq.com/docs/model/openai/gpt-oss-20b
- Setup: https://console.groq.com/docs/quickstart
- Free-plan quotas: https://console.groq.com/docs/rate-limits
- Billing: https://console.groq.com/docs/billing-faqs
- Browser speech: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

## Sharing source

Include src, public, scripts, tests, package.json, package-lock.json, configuration
files, README.md and .env.example. Omit node_modules, .next, local .env files and
credentials. The included source ZIP intentionally excludes generated build files.

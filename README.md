# Viraj Patil - spatial portfolio

Updated source for the existing portfolio at https://viraj-portfolio-mu.vercel.app/.
This package has not been pushed or deployed. The running website changes only
after this source is deployed to its existing Vercel project.

## This revision: glass studio

- VIRAJ PATIL is the oversized hero headline, and the full name is also in the
  navigation and footer. The public location is India.
- Leon's looping background video is retained, with Play/Pause, hidden-tab
  pausing and reduced-motion support. There is no still-image hero overlay.
- Frosted panels, reflective surfaces and rose/mint lighting carry through the
  hero, gallery, about section and contact section.
- Four illustrated project cards replace the plain case-file rows. Each has
  original dimensional artwork and expands to reveal the actual challenge,
  approach, outcome, stack and links. Headings no longer erase their letters.
- The Three.js gallery has a recoverable loading/error state. A failed graphics
  context shows a CSS dimensional illustration, with Retry full 3D available.
  The 3D-view button is never permanently disabled after a graphics failure.
  Optional reflection-map failure keeps the scene's direct lights working.
- The camera stays in front of the artwork while chapters move between scenes.
  Chapter buttons, mouse drag, Pause motion and Index view remain available.
  Reduced motion starts in Index view; mobile users can choose either view.
- NOVA has a much larger conversation area, a full-window expand control and a
  compact voice toolbar. Optional heartbeat/sound controls are collapsed.
- Web search is automatic for news and other detected freshness-sensitive
  questions. The Search web switch has been removed. Broad monthly news requests
  ask for a dated digest and month-to-date coverage, rather than an entire archive.
- General questions send a small identity record instead of the full project
  catalogue. Project questions still use verified project facts.
- Quota errors preserve the question and show a retry countdown when the provider
  supplies a reset time. Retries are manual. Voice stops listening on a quota
  error rather than repeatedly submitting failed turns.

Groq's account quota has not been removed or increased. Ordinary chat retains
its existing model, generation settings, speech rate and turn timing. Search can
still take longer because it retrieves sources. No latency improvement is claimed.

The original CV, project order and project links are preserved. Project artwork
is illustrative, not a product photograph or a claim that concept hardware has
shipped. The spatial direction was informed by https://alche.studio/; its assets
and code were not copied.

## Apply to the existing project

1. Extract the ZIP and open the enclosed project folder.
2. Copy its source into the repository already connected to your portfolio.
   Preserve that repository's .git directory, Vercel connection and .env.local.
3. If merging into an older version, delete src/lib/realtime-voice.ts if present;
   it is the retired paid voice integration and is absent from this package.
4. Run npm ci, then npm run typecheck and npm run build.
5. Test locally with npm run dev. After copying the files into your existing
   connected repository, use PowerShell:

```powershell
Set-Location "C:\Projects\viraj-portfolio"
git status
git add src public tests scripts README.md package.json package-lock.json
git commit -m "Add glass portfolio, prominent identity and expanded NOVA"
git push origin main
```

Wait for that commit's Vercel deployment to show Ready, then refresh the public
site. Extracting a ZIP or copying files alone does not update the online version.
No new Vercel project is necessary. The obvious version check is the large
VIRAJ / PATIL headline and the illustrated project cards.

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
- No Search web switch is required. You can also ask for a lookup in plain text.
- Search runs only when needed or explicitly requested. Its extra retrieval work
  can take longer than ordinary replies; it is not a continuous live news feed.
- Answers include source cards and the retrieval time. Cards are derived from
  provider-returned browser/search records, not URLs invented in answer text.
- Broad requests use a brief global scope unless the user names a region; the
  prompt requests event dates, current-month coverage and no future events.
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

The heartbeat is off by default. Open Talk to NOVA, expand Sound & voice options,
click Preview to hear the sample, then turn Heartbeat sound on. Adjust Volume as needed. It becomes quieter
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

The 36 mocked regression tests pass. They cover verified links, origin and
payload validation, provider selection, absent credentials, conversation bounds,
unchanged ordinary-chat settings, voice interruption/mute/permissions, search
routing and source validation. New cases cover monthly-news prompt scope,
smaller context, real reset-header parsing, structured quota errors, client
single-attempt behavior and stopping voice on a quota error.

Tests ran through Node's test runner using a temporary TypeScript compilation
harness because the local tsx runner was unavailable. No production credentials
were used. TypeScript, lint of the changed code/tests and the default Next.js
production build (Turbopack) pass. Production HTTP checks verify the new identity,
India location, four illustrated cards, NOVA controls, video, both PDFs, assistant
status and cross-origin request rejection.

A fresh interactive browser review was unavailable in this session. Device GPU
behavior, responsive appearance, audible playback and live Groq/news answers
still need checking in the deployed browser. Mocked tests validate integration
behavior and prompt contents, not a guarantee of model output or actual latency.

After deployment, check the large name, glass cards and expansion, all four 3D
chapters, drag/Pause/Index/Retry controls, mobile and reduced motion, project/CV
links, NOVA expand, normal chat, November news and source links, voice interrupt,
heartbeat preview and closing the assistant.

## Why the online model has a limit

The website calls Groq-hosted openai/gpt-oss-20b. It does not call the laptop's
Ollama Qwen model. Provider request/token quotas are shared by visitors using the
same account. The application also has a modest per-instance burst limit.
A new API key does not remove the account's quota.

Offline Qwen uses your hardware, so it has no Groq API allowance. To use it from
an online portfolio, you would need a protected server gateway to the laptop (or
a dedicated GPU server) and the model would need to stay running. The machine
must be online and awake; speed and concurrent visitor capacity depend on that
hardware. Do not expose the raw, unauthenticated local Ollama port or connect
ADA's desktop-control tools to public visitors. No self-hosting connection or
model switch has been made in this revision.

A cloud free tier keeps shared-service quotas. A paid plan increases capacity but
still has usage costs and limits. A GPU server gives control over inference but
has hosting costs. None of these options is unlimited free cloud compute.

## References checked on 13 November 2026

- Groq model: https://console.groq.com/docs/model/openai/gpt-oss-20b
- Browser search: https://console.groq.com/docs/tool-use/built-in-tools/browser-search
- Source metadata: https://github.com/groq/groq-typescript/blob/main/src/resources/chat/completions.ts
- Free-plan limits: https://console.groq.com/docs/rate-limits
- Billing: https://console.groq.com/docs/billing-faqs
- Local Ollama hosting: https://docs.ollama.com/faq
- Ollama authentication: https://docs.ollama.com/api/authentication
- React Three Fiber: https://r3f.docs.pmnd.rs/api/canvas
- On-demand rendering: https://r3f.docs.pmnd.rs/advanced/scaling-performance

The source archive excludes node_modules, .next, .git, .vercel, local environment
files, credentials, caches and generated TypeScript build information.

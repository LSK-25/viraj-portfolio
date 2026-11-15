# Viraj Patil — Dossier edition

Complete source update for https://viraj-portfolio-mu.vercel.app/.
This ZIP is not a deployment. Copy the changes into the existing connected
repository and push them to update the public website.

## This revision: automatic lens and clear captions

- Restored the disappearing-letter effect on the large name, section headings,
  dossier titles and footer. Letters return after roughly 1.4 seconds. Mouse-only;
  screen readers keep the complete text, and touch/reduced-motion text stays visible.
- Restored the luminous cursor trail in restrained gold on the homepage and all
  dossier pages. It never captures clicks, fades when idle and stops in hidden tabs.
- The hero lens is now a project selector, starting with Smart Glasses. Its numbered
  controls select all five projects, rotate the outer dial and reveal the artwork,
  title, status and subtitle. Click the centre or arrow to open the selected dossier.
- The lens cycles through all five projects every five seconds, including the
  last-to-first transition without spinning backwards. Pause/Resume is available.
  Hover, keyboard focus, leaving the viewport and hiding the tab suspend cycling.
  Resuming or selecting a project starts a fresh five-second interval. Reduced
  motion keeps the lens manual. Automatic changes do not announce every slide.
- Arrow-key/Home/End navigation, previous/next buttons and touch-sized controls
  remain available. Manual selection is announced to screen readers.
- The desktop gallery reserves a bottom dock for navigation and ends the artwork
  canvas above it, preventing the navigation from covering artwork captions.
- The lens responds to mouse position with spring-driven tilt and glass highlights.
  Project cards have gentle tilt, staggered scroll reveals and hover details.
  The main work button has magnetic movement. Reduced motion removes these effects.
- The video stays removed; the five project facts, PDF, NOVA voice and chat settings
  are unchanged from the preceding dossier edition. No new dependencies or AI calls.

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
- Optional narration uses a device/browser voice. English male voices are
  preferred where available, with a slightly lower pitch. This does not clone
  Leon Kennedy's exact voice. Sound starts only after pressing Play.
- Narration stops on pause, leaving the viewport, hiding the tab, switching away
  from Demo, leaving the page, or opening NOVA. Captions work without speech.
- Sadafuli's Code tab includes a selected cart-validation source excerpt reviewed
  in the local client project. Other Code tabs are labeled workflow pseudocode.
- The portfolio PDF now contains all five projects; the original CV is preserved.

The direction references the supplied Dribbble examples and https://alche.studio/.
Their code, images, identities and recorded media were not copied.

## Apply the update

1. Extract this ZIP and open its viraj-portfolio folder.
2. Copy src, public, scripts, tests and README.md into the existing project,
   replacing matching files. Keep your .git, .vercel and .env.local untouched.
3. Delete public/videos/leon-loop.mp4 from the destination if it is left over
   from the earlier version. The new code never loads it, even if it remains.
4. If present from a much older version, remove src/lib/realtime-voice.ts,
   the retired paid voice integration. It is not in this package.
5. Run npm run typecheck and npm run build. Use npm ci first if dependencies
   are not already installed. No new dependency or provider key is required.
6. Run npm run dev to preview. Then commit and push from the existing repository:

```powershell
Set-Location "C:\Projects\viraj-portfolio"
git status
git add src public scripts tests README.md
git commit -m "Auto-rotate project lens and prevent gallery caption overlap"
git push
```

Use your existing deployment branch. Wait for Vercel to show Ready for this commit,
then refresh the website. Extracting/copying alone does not deploy it. The version
check is the Pause/Resume control under the lens and the separate gallery navigation dock.

Use Node.js 22 or 24. API routes require server hosting; do not use static export.
The normal npm run build uses Next.js Turbopack.

## NOVA and speed

Ordinary chat still uses Groq-hosted openai/gpt-oss-20b with its existing request
settings: low reasoning effort, temperature 0.6, 1200-token completion limit,
non-streaming output and the same timeout and conversation window. Search,
recognition, interruptions, speech rate and turn timing are retained.
This revision changes the preferred playback voice and pitch, not inference.
No latency gain is claimed. The smart-glasses concept facts are added to context
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

Browser speech recognition and synthesis use the same chat endpoint for answers.
Recognition pauses during playback. Interrupt & speak cancels pending speech or
an answer and resumes listening. Mute, End voice and closing the panel stop it.
An unattended voice session ends after five minutes. Automatic spoken barge-in
is not implemented. Voice requires HTTPS or localhost and a supported browser.

The chosen narration/assistant voice depends on voices installed on the device.
A custom Leon voice model is not connected. An audio reference alone is not a
browser TTS model. Unsupported or blocked narration leaves the written transcript
available. No voice samples were scraped or presented as a character's recording.

Heartbeat is optional and off by default. Under Sound & voice options, Preview
plays its sample. It gets quieter during conversation and stops when the panel
closes or the tab hides. It is an ambient sound, not a pulse/server-health meter.

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

Production build and TypeScript pass. Forty-two mocked regression tests
cover assistant request/provider settings, quota and search behavior, voice
interruption/permissions, timeline boundaries/seek controls and concept knowledge.
Tests ran with Node's runner and a temporary TypeScript compilation harness
because the local tsx runner was unavailable. Normal installs can use npm test.

Production HTTP checks cover the homepage, five lens controls/panels, accessible
selection markup, restored cursor/letter markup, all five project pages, unknown-route
404s, report markup, both PDFs, artwork, absent video, assistant status and
cross-origin rejection. All assistant source files and project facts match the
preceding dossier edition byte for byte.

A fresh interactive browser/audio/GPU review was unavailable. Browser narration,
fullscreen, visual layout across devices and actual Groq responses still need
checking in the deployed browser. No production credentials were used in tests.

The ZIP excludes node_modules, .next, .git, .vercel, local environment files,
credentials and caches. This is a source update, not an already deployed site.

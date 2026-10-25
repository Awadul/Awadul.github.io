---
target: TV channel project showcase concept
total_score: 15
max_score: 32
na_heuristics: 9,10
p0_count: 0
p1_count: 3
target_identity: "file:D:\\Awadul.github.io\\src\\components\\ProjectCarousel.tsx"
target_fingerprint: "sha256:0830ea659238e9b905270aa625fee593e0ee8798cf42eeaf9d9fb58561ed8290"
target_path: "D:\\Awadul.github.io\\src\\components\\ProjectCarousel.tsx"
timestamp: 2026-10-25T14-16-27Z
slug: src-components-projectcarousel-tsx
---
# Project TV showcase concept critique
Method: dual-agent (A: /root/tv_concept_review · B: /root/tv_concept_evidence). Concept-only review grounded in ProjectCarousel.tsx and projects.ts. No implementation or browser verification.

Recommendation: desktop CRT on right, project chapters in native page flow left. The sticky preview changes as chapters become current, with matching title and channel indicator. Preserve all project links and direct access. One optional, brief entrance can honor the requested full-viewport reveal before the settled layout; visitors can browse without completing it. A subdued static test card is preferable to bright flashing snow; no repeated blackout between projects. Keep real text outside CRT distortions.

Design specificity: channel metaphor gives a recognizable showcase identity. Keep charcoal/off-white cabinet and existing typography to connect it with portrait/cloud portfolio; the projects remain real assets rather than fake TV video. Existing source has6 projects and static image assets; do not promise video previews or classify all artwork as screenshots.

Provisional Nielsen scores for the unrefined proposed interaction, not current site measurements:
| Heuristic | Score | Concern |
|---|---|---|
|1 Status|2/4|Name/current channel/total unspecified|
|2 Match|3/4|Familiar channel metaphor; static may resemble error|
|3 Control|1/4|Skip/exit/direct access unspecified|
|4 Consistency|2/4|Wheel may unexpectedly become channel controller|
|5 Prevention|2/4|Fast scroll could skip/desynchronize content|
|6 Recognition|2/4|Only one visible project|
|7 Efficiency|1/4|Potential repeated journey|
|8 Minimalism|2/4|Multiple spectacle stages|
|9 Recovery|n/a|No relevant errorflow|
|10 Help|n/a|Unnecessary|
Total15/32. This is a proposal-risk baseline, not an assessment of a built TV interaction.

Priorities:
1. P1 proposed risk: sequential fullscreen entrance can delay real work. Keep project names/links available and an immediate Browse all exit. First entrance at most aboutone second as a design starting point, not a usability threshold; avoid rapid large rotation or perspective.
2. P1 proposed risk: captured or forced scrolling creates unpredictable navigation. Use native scrolling, sticky display, ordinary readable project chapters, no wheel interception, minimum gesture count, forced snap or scroll inside TV. Offer named direct-access channels.
3. P1 proposed risk: motion discomfort and obscure project evidence. Outer monitor holds still after arrival, interior screenshot switches use restrained150–200ms dissolve without repeated static. Use a still test card or low-contrast tuning texture once, no flashes/audio. Mobile and reducedmotion use ordinary cards, with optional modest CRT framing.

Repeat policy: entrance once per tab session; scrolling upward returns to settled view. Channel changes continue to reflect position normally. Never auto-collapse section height at completion. Reserve stable layout geometry whether intro plays or not; preserve selected project and browser scroll restoration. A user-invoked Grid view persists as their preference, switches at a stable project anchor, and never converts mid-scroll without an action. All projects named and reachable in both views. Storage failure must not block access.

Ideation: beige CRT computer monitor best connects nostalgia to software work. Black CRT television emphasizes entertainment/channel metaphor. First prototype can feature3 selected projects with all6 available in Browse all, or all6 as regular-flow chapters if user prefers breadth.

Strengths: recognizable metaphor, desktop text/preview pairing,6 existing projects with concise summaries and destinations. Cognitive load comes from multi-stage navigation, not option count. Nostalgia should peak at the first clear project, then yield to easy scanning. Persona risks: prospective client cannot compare hidden work; returning visitor repeats choreography; phone visitor loses space to cabinet. Minor: label current project as well as channel number; keep titles and links keyboard reachable; never apply CRT blur or distortion to descriptions.

Existing content evidence: All/Client work/Personal projects returns6/4/2. Preserve live destinations, optional source links and stable source order. No video assets established by source. Browser and overlay skipped due earlier security rejection; no live server started. No website edits.

Questions: choose hardware (beige CRT monitor / black CRT television); choose showcase breadth (3featured plus all6grid / all6chapters plus grid).
Sources: Nielsen Norman Group Scrolljacking101 https://www.nngroup.com/articles/scrolljacking-101/ ; W3C Animation from Interactions https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions . Support native-control and motion preferences, not the specific proposed timings.
Detector on the existing gallery: exit0, JSON[], zero findings. It does not evaluate the unbuilt TV proposal.

## LCD direction addendum — October 25
Method: two independent follow-up reviews, A /root/tv_concept_review and B /root/tv_concept_evidence. Narrow art-direction refinement; no new numerical rating or website changes. Existing source scan reused:0 findings. Browser not retried.

User's new reference is927×508 analog static inside a curved CRT crop, with dense noise and horizontal interference bands and visible stock watermark. Treat as visual reference, not a production asset; create original procedural texture and hardware geometry. A still reference does not require flashing or rolling animation.

Recommend a modern16:9 flat LCD monitor with slim charcoal bezel and simple stand, using analog static as a deliberately nostalgic signal effect. Remove CRT barrel distortion, curved glass and persistent scanlines. Project previews stay sharp with aspect-preserving contain behavior. Use a single200–300ms low-contrast static cue then a restrained500–700ms settling move as proposed starting timings, not tested thresholds. No recurring static on channel changes or section re-entry; a short image dissolve is enough. No sound.

Two priorities: (1) contain static inside display and isolate it from readable text/project evidence; (2) retain native-scroll settled layout, direct project access and Grid view. Firstpass/session policy and mobile/reducedmotion fallback from main concept remain. The proposed LCD is a modern frame playing an analog signal, not a claim that LCD hardware naturally produces analog snow.

Decision to confirm: desktop monitor with stand (recommended) or floating frameless display. No new critique trend: art-direction follow-up to existing concept baseline.

## Implemented LCD showcase review
Independent source reviews A /root/tv_concept_review and B /root/tv_concept_evidence identified focus overriding scroll, lost anchors on automatic layout changes, a missing sticky Grid exit, and short-viewport crowding. All four were addressed. The once-only large display entrance remains as the user's approved signature moment; it is .9 seconds total with Escape and a visible Skip display intro control. Static texture is original, deterministic and does not flicker. Grid view is used below1001px wide, below760px high, and with reduced motion. User-selected view persists per tab session, with an in-memory storage fallback. All6 project destinations/code links and6/4/2 filters passed static-render checks in both views; texture/session checks and active TypeScript check passed. Initial detector found0 issues. Live visual verification remains unavailable under the prior browser security restriction; no browser workaround was attempted. No new numerical design score is claimed without render evidence.

## Superseding user direction — through the monitor screen
User explicitly replaced the channel concept with a monitor-photo zoom and ordinary-flow project components, with linear motion. Updated ProjectCarousel uses the attached photo unchanged, measured screen bounds, ease:none and scrub:true, without a pin or scroll interception. Old sticky channel UI, generated monitor shell and static texture were removed. Six themed scenes retain real images/descriptions/links and6/4/2 filters; Grid view remains available. Source reviews A /root/tv_concept_review and B /root/tv_concept_evidence found monitor initial-height fitting, inherited transition timing, and first-preview link consistency; these were corrected. Keyboard focus and reference-image error bypass decoration. Target detector returned0 findings. Unit/static-render checks cover full/grid result counts, every link, original photo identity, screen-center/coverage geometry, linear timeline contract, session/storage fallback and cleanup. Source TypeScript check passed. Browser verification remains unavailable due the earlier security block; screen framing is not claimed visually verified. This replaces the earlier TV/CRT/side-by-side plan and its provisional concept score; no new numeric design score is assigned.

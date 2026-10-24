---
target: intro visual comfort with site-wide motion context
total_score: 15
max_score: 24
na_heuristics: 2,5,9,10
p0_count: 0
p1_count: 1
target_identity: "file:D:\\Awadul.github.io\\src\\components\\SiteIntro.tsx"
target_fingerprint: "sha256:8bc112e2f3ba443437bb703d63d3f1d9b7a741723746b1958127806c2ecd16c7"
target_path: "D:\\Awadul.github.io\\src\\components\\SiteIntro.tsx"
timestamp: 2026-10-24T18-11-22Z
slug: src-components-siteintro-tsx
---
# Motion comfort critique
Method: dual-agent (A: /root/intro_pacing_review · B: /root/intro_pacing_evidence). Source-only review of SiteIntro and site-wide supporting motion. Browser blocked previously; no retry or workaround. No website edits.

Recommendation: preserve the four questions and 6.4-second budget, reduce amplitude and simultaneity. Use one calm visual language with different behavior for reading, panels and disclosures. Exact durations are proposed starting values, not proven comfort thresholds.

Design specificity: portrait and real project imagery carry portfolio identity; repeated dramatic choreography competes with those assets. Intro typography can retain its scale without moving through large rotations or zooms.

| Nielsen heuristic | Score | Motion scope |
|---|---|---|
| 1 Status visibility | 3/4 | Progress and feedback present |
| 2 Real-world match | n/a | Outside narrow motion scope |
| 3 User control | 3/4 | Skip and reduced motion; autonomous replay persists in sections |
| 4 Consistency | 2/4 | Competing movement mechanisms |
| 5 Error prevention | n/a | No input-error assessment |
| 6 Recognition | 3/4 | Explicit labels temporarily masked |
| 7 Efficiency | 2/4 | Chat readiness delayed by effect |
| 8 Minimalism | 2/4 | Too many simultaneous motion channels |
| 9 Error recovery | n/a | Outside scope |
| 10 Help | n/a | Not applicable |
Total 15/24, Acceptable. This is a motion-only source assessment, not an overall site score.

Priority issues:
1. P1: User-reported discomfort with intro intensity. Earlier .65-second entrance became .3 seconds while preserving -18-degree rotation, 100% travel and 1.5 scale; exit moves -95%, rotates 13 degrees and scales to1.55 in .2 seconds. Large glyph rotates too. Remove rotation/zoom and stationary glyph or remove it; use opacity and at most6–8px travel. Keep about1.05 seconds settled per1.5-second beat and .4-second dissolve to website. A shorter animation is not automatically gentler.
2. P2: Multiple and repeated reading-surface movements. Hero entrance starts during intro departure. Clouds traverse32vh, hero text/portrait have independent parallax, viewport edges fade and move sections, rows reverse/replay in both directions. Let intro finish before one restrained hero entrance; use static background during reading, once-only content reveals, no exit fades on readable text.
3. P2: Utility chat receives repeated spectacle. Five-arm mask takes up to1 second on opening and closing, panel inert until entrance finishes. Prefer180–250ms fade with no more than8px anchored movement. Keep a vortex only as an optional decorative element separate from reading surface if the user wants to retain it. Disclosures should expand; filters should reposition without extra scale/reveal choreography.

Motion proposals:
A Quiet editorial (recommended): stationary intro phrases dissolve; static cloud and mesh during reading; once-only section opacity; short panel feedback. Identity comes from portrait, type and project assets.
B One signature moment: retain one small gentle intro rotation or decorative spiral, keep readable text stationary, make all other reading surfaces quiet.

Strengths: system reduced-motion guards, skip/Escape, focus visibility and real asset identity. Cognitive load is driven by concurrent movement rather than option count. Emotional journey starts expressive but repeatedly redirects attention away from reading. Persona risks: distracted mobile user follows competing layers; returning visitor sees scroll effects replay; motion-sensitive reader needs an easy opt-out beyond OS settings. No medical diagnosis or claim of eyesight damage.
Minor note: consider visible Motion: reduced/full preference alongside existing OS support; avoid changing full-screen backgrounds on every question.

Questions to resolve: scope (intro only / whole site); character (quiet editorial / one signature moment).
Source: W3C Understanding SC2.3.3, https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions . Supports reducing unnecessary spatial movement and respecting user preferences; does not validate proposed timings.

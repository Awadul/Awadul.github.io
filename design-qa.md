# Reference design QA — October 24, 2026

final result: passed

## Scope and visual truth
Reference-led redesign of the existing portfolio, using the supplied local 21.57-second, 1566×1080, 60fps video and five screenshots. The reference designer's identity, employers, experience duration and project examples are replaced with the user's factual portfolio content. No third-party video is embedded or presented as the user's project.

Source video: C:/Users/awais/Downloads/cffee89fe064aafdc89a239e3484a6cd.mp4.
Source screenshots: C:/Users/awais/AppData/Local/Temp/codex-clipboard-a8b2fd82-d6a3-4a0e-b6b1-5d6a7ce68d52.png; codex-clipboard-0abe03b3-4ea4-4db5-ab11-18c3d0e830e6.png; codex-clipboard-88b104b0-6f23-4794-9fce-39f543c742d8.png; codex-clipboard-b7bff2ff-0aa2-46d2-8224-c7b333407419.png; codex-clipboard-9c7e7c6d-f6b6-4ba3-84f2-ae7aec54d36d.png.

Browser implementation: http://127.0.0.1:3000/. Desktop viewport 1440×1000 CSS pixels, density 1. Mobile inspected at 390×844 and 320×900; tablet geometry checked at 768 and 1024. Browser-rendered full-page evidence: C:/Users/awais/Documents/Codex/2026-10-23/ins/work/reference-assets/final-full-page.png. Individual screenshots: hero-desktop.png, work-desktop.png, services-desktop.png, experience-desktop.png, contact-desktop.png and hero-mobile.png in the same directory. Bounds and viewport normalization: hero-bounds.json and final-section-bounds.json.

## Comparison method
Reference panels were cropped out of presentation chrome and both source and implementation were scaled without distortion to a common 720px content width. Full-view comparisons were opened together in the same inputs: hero-comparison.png, work-comparison.png, services-comparison.png, experience-comparison.png and contact-comparison.png. The hero source crop is 722×486 pixels; its implementation crop is approximately 1160×783 at density 1. Different visible names and images are deliberate adaptations. Gallery comparisons use the first viewport of the six-project section, not the entire three-row page. Experience and contact use full section crops.

Focused comparison: hero-navigation-focus.png enlarges the source and implementation navigation, status label and CTA together. Full-size desktop and phone images were also inspected for portrait alpha edges, content overlap and font legibility. A poster-sized reference at 849px wide is a scaled desktop composition; it was not incorrectly treated as a tablet breakpoint.

## Comparison history and fixes
1. [P1, resolved] Phone portrait centering: a CSS translate conflicted with GSAP's transform normalization. Replaced transform centering with percentage left/width geometry. Post-fix phone evidence shows the image inside the hero, with no page overflow. Stacked the name on phones so the oversized treatment remains legible.
2. [P2, resolved] Mobile line breaks collapsed without spaces. Added explicit whitespace and verified readable role/body copy. Enlarged phone social and contact targets to 44px and strengthened muted text contrast.
3. [P2, resolved] Supporting typography and portrait were too small after normalizing the desktop panels to the same width. Earlier evidence is archived as *-comparison-before-type.png. Increased the desktop name, portrait crop, role, project titles and experience row type; constrained the longer role to two lines. Final combined comparisons confirm the portrait/name relationship, legible supporting copy and expected panel hierarchy.
4. [P2, resolved] Long service labels could encroach on the floating preview. Reserved 35% of the desktop title row for the preview, allowing the actual service name to wrap cleanly. services-desktop.png shows clear title, action and image separation. Closed service panels now retain their controlled IDs with hidden content, preserving valid accordion relationships.
5. [P2, resolved] Project filtering changed page height without refreshing the reading tracker. Added a ResizeObserver for both project gallery and services. Safe refresh waits until active scrolling settles.

## Fidelity surfaces
- Typography: Inter loaded in the browser; outline/solid name, slash-prefixed titles, faint oversized background words and quiet supporting type match the reference language. Larger user name and longer engineering role need different wrapping. Mobile uses an intentional two-line name. No clipped headings at tested widths.
- Spacing/layout: framed white hero, centered cutout, lower-left introduction and right social stack; two-column work gallery; floating active-service image; dark ruled experience panel; centered cloud contact panel. Phone layout stacks and exposes a functional menu. Additional compact toolkit is retained from the actual product. Experience biography and enquiry guidance are intentional added product context.
- Colors/tokens: charcoal, white, pale gray, thin neutral separators and availability green. Removed heavy Swiss red/rule styling from the public layout; semantic error red remains in the unchanged chat flow. Cloud background is somewhat more detailed than the reference (P3, acceptable).
- Image quality: original generated cloud background and transparent extraction of the user's approved portrait. Alpha corners and hair edges inspected. The extracted face is slightly smoother than the original; provenance explicitly notes this. Existing real project screenshots and official technology marks retained, with no invented evidence or brand logos. Added image payload is 171,298 bytes combined in WebP.
- Content: actual name, full-stack/AI role, six real project records, contact details, freelance since 2025 and NUST studies. Reference employment at Microsoft/Facebook/Apple and its nine-year claim were not copied. All client/project experience rows are labeled as such.

## Functional and technical validation
- All/Client work/Personal projects filters return 6/4/2 cards and announce results.
- Service buttons expand, switch and collapse; aria-expanded and aria-controls target existing panels.
- Desktop and mobile navigation follow the intended anchor; menu closes after choosing a section.
- Project and code links use original destinations; email, phone, LinkedIn, GitHub and WhatsApp links retained.
- Chat opens in the new style. The pre-existing local backend is unavailable and shows its email/WhatsApp fallback; no backend or chat persistence/consent logic was changed. Sending a live enquiry was not tested.
- No horizontal overflow or heading clipping at 320, 390, 768, 1024 and 1440 widths.
- Browser console checked with no new warnings/errors before chat connection testing.
- Production Vite build passed; active application TypeScript check passed using the existing scoped check configuration (ES2022 library for the pre-existing chat). This does not claim the repository's unrelated legacy UI type errors were repaired.
- Reduced-motion media paths are present for entrances, parallax, filter/menu animation and hover previews. OS-level reduced-motion emulation was not available in the browser tool and was not claimed as a runtime test.

## Remaining P3 / test gaps
Clouds are an original interpretation and not the reference's exact photograph. The portrait and project imagery necessarily differ. Pointer-following previews are implemented with GSAP and gated to fine pointers, but native pointer-hover automation was not available for an end-to-end hover capture. Keyboard links and touch fallback remain usable. No deployment or external message was sent.

## Implementation checklist
Completed: visual asset preparation, responsive layouts, functional filters/accordion, factual content migration, live scroll motion, source/implementation comparisons, priority fixes, build/type validation and local preview. No unresolved P0/P1/P2 findings remain for the authorized reference-led redesign.

---
name: "Awais Abdullah — Newsprint"
description: "A software portfolio presented as an independent journal."
colors:
  paper: "#F9F9F7"
  ink: "#111111"
  editorial-red: "#CC0000"
  muted-paper: "#E5E5E0"
  caption: "#525252"
  inverse-copy: "#d2d2cc"
  inverse-rule: "#737373"
typography:
  display:
    fontFamily: "'Playfair Display', 'Times New Roman', serif"
    fontSize: "clamp(48px,5.7vw,82px)"
    fontWeight: 900
    lineHeight: 0.99
    letterSpacing: "-.04em"
  headline:
    fontFamily: "'Playfair Display', 'Times New Roman', serif"
    fontSize: "clamp(34px,3.4vw,48px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-.03em"
  body:
    fontFamily: "'Lora', Georgia, serif"
    lineHeight: 1.65
  label:
    fontFamily: "'Inter', 'Helvetica Neue', sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: ".08em"
  caption:
    fontFamily: "'JetBrains Mono', 'Courier New', monospace"
    fontSize: "10px"
    lineHeight: 1.6
    letterSpacing: ".03em"
rounded:
  square: "0"
spacing:
  compact: "8px"
  small: "12px"
  inset: "16px"
  medium: "24px"
  gutter: "32px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
  composer:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "10px"
  project-entry:
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "18px"
---

# Design System: Awais Abdullah — Newsprint

## Overview

**Creative North Star: "Newsprint"**

A working software portfolio reads as an independent journal: confident serif headlines, readable body copy, compact interface labels and figure captions. Rules and columns organize real work with deliberate density.

The explicit October 14, 2026 Newsprint brief supersedes the older blue palette in root `Agent.md`. That historical file remains intact. This document records the implemented system in the global, editorial, projects, services, technology and chat stylesheets; page composition remains in `.impeccable/surface-home.md`.

**Key Characteristics:**
- Paper, ink and restrained editorial red.
- Square geometry and visible column rules.
- Project and portrait imagery treated in grayscale; official technology logos retain their original colors.
- Real project evidence and concise client-facing language.

## Colors

The user-pinned palette uses a quiet paper ground, strong ink and selective red punctuation; the frontmatter contains normative values.

### Primary
- **Editorial Red:** small edition details, process numbers, link accents, caret and chat focus/error treatments.

### Neutral
- **Paper:** page, masthead, cards and chat surfaces; foreground on dark sections.
- **Ink:** text, rules, controls, services, contact/footer and chat header.
- **Muted Paper:** secondary fills, subdued dividers and disabled chat controls.
- **Caption:** secondary reading and figure metadata.
- **Inverse Copy / Inverse Rule:** supporting text and dividers on dark sections.

**The Red Punctuation Rule.** Keep red selective; large structural surfaces use paper or ink.

## Typography

**Display Font:** Playfair Display with Times New Roman and serif fallbacks.
**Body Font:** Lora with Georgia and serif fallbacks.
**UI Font:** Inter with Helvetica Neue and sans-serif fallbacks.
**Label/Mono Font:** JetBrains Mono with Courier New and monospace fallbacks.

The headline/body serif pairing creates the journal character. Sans-serif controls provide practical clarity; monospace captions distinguish metadata from prose.

### Hierarchy
- **Display:** heavy, tight hero headlines using the frontmatter display role; mobile uses `clamp(42px,10vw,64px)`.
- **Headline:** section titles use the frontmatter headline role; contact has a larger `clamp(42px,5vw,68px)` treatment.
- **Title:** project captions use bold serif (23px/1.2); service titles use bold serif (28px/1.2).
- **Body:** reading copy uses Lora, generally 13–16px with generous leading; hero deck is limited to 56ch.
- **Label:** uppercase UI labels with tracking, distinct from body prose.
- **Caption:** uppercase monospace figure, edition and colophon metadata.

**The Four Voices Rule.** Use display serif for headlines, reading serif for prose, sans-serif for controls and monospace for data captions.

## Layout

Containers cap at 1280px with 32px desktop side margins and 16px mobile side margins. One-pixel visible rules define columns and entries; four-pixel rules mark major editorial divisions. Section spacing commonly uses the frontmatter section step, reducing to 40px on mobile.

The current home begins with a sticky masthead and a 7/5 introduction/featured-work split. Selected work follows immediately. Below 768px, the introduction stacks above a compact featured preview: its image/text columns use 1fr/1.2fr, the image uses a 1.5 aspect ratio, and the byline and supplementary feature paragraph are hidden to keep the selected-work grid close to the first viewport. This is a home-surface choice, not a mandatory template for every future screen.

Project entries form three columns, with MyNext9to5 spanning two columns above 1000px. At 768–1000px they use two equal columns, then one below 768px. The About section uses a wider 3/6/3 portrait/copy/facts split, and the portrait can grow to 240px on small phones. The chat launcher reads Chat/Close below 600px, retains its full accessible name and a 44px touch target, and keeps the existing chat panel. Services become stacked ruled rows on mobile; technology categories move from a 280px label column to a single column. Navigation collapses below 768px; the chat panel adapts below 600px. Interactive controls commonly retain a 44px minimum target.

## Elevation & Depth

Most surfaces are flat, with no button or card shadows. Contrast, typography, rules and paper texture establish hierarchy. The floating chat panel is the deliberate exception: a hard ink offset shadow (`4px 4px 0 var(--ink)`) gives it a printed cutout edge.

Motion is restrained: controls transition over 0.2s, project imagery scales to 1.05 on hover, and a 36s linear ticker pauses on hover. Reduced-motion preferences disable smooth scrolling and effectively remove animation and transitions.

## Shapes

All surfaces and controls have square corners. Borders remain visible, straight and functional. Icons use thin strokes; imagery is rectangular, with crops selected for the source content. The paper texture is an existing code-defined SVG pattern rather than a new raster asset.

**The Square Edge Rule.** Preserve zero radius across controls, panels, fields and image frames.

## Components

### Buttons
Firm, compact printed labels. Primary buttons use ink with paper text, a one-pixel ink border and the documented padding. Hover reverses to paper/ink; ghost buttons are transparent and hover to muted paper. Disabled buttons reduce opacity. Global keyboard focus uses a two-pixel ink outline offset by four pixels; dark sections switch to paper, and chat uses editorial red.

### Cards / Containers
Project entries form a continuous ruled grid with square corners and no shadow. Every caption includes visible purpose and contribution text from the existing portfolio record. The lead card has a 3.2:1 preview above 1000px; the remaining previews retain 16:9 framing. Previews use existing screenshots with 16/9 framing; artwork can use containment. Desktop hover and keyboard focus expose the ink information overlay. On coarse pointers, that information appears in normal flow, with a 180px image and reduced metadata. Small outlined technology tags belong to the overlay rather than pill-shaped badges.

### Inputs / Fields
Chat fields use paper, ink, square borders and monospace text. The composer has a one-pixel rule and 10px padding, increasing its text to 16px below 600px. Brief fields and consent stay visible before enquiry submission. Focus is red within chat; errors gain a red border.

### Navigation
The paper masthead pairs a heavy serif name with uppercase sans-serif links and a monospace edition line. Links have 44px targets and red underlined hover states. Mobile exposes a square menu toggle and ruled vertical links.

### Inverse Sections and Chat
Services and the contact/footer use ink surfaces, paper headlines and subdued inverse copy, with visible rules separating content. Chat repeats this vocabulary in a paper panel with an ink header and square launcher; visitor messages use ink, assistant messages use paper.

### Evidence and Imagery
Preserve genuine source links and official technology marks. Existing project screenshots in `src/assets/Projects` and the portrait at `src/assets/awais-editorial-portrait.png` retain their original raster provenance; The portrait is an AI-edited editorial version of the user-supplied photo, approved on October 14, 2026. The original remains at `src/assets/awais-portrait.png`; generation provenance is recorded beside the editorial asset. Project and portrait images are grayscale, with a mild sepia treatment on linked-image hover. Technology logos are an approved exception: original colors, 40px on desktop and 36px on mobile, with larger labels and a two-column mobile tool grid. Credibility comes from actual deployed work and related-project examples.

## Do's and Don'ts

### Do:
- **Do** preserve the user-pinned paper, ink and editorial red palette.
- **Do** use visible rules, square corners and the four established type families.
- **Do** retain source-backed project links, existing asset provenance and readable keyboard focus.
- **Do** keep the home featured project compact on mobile so selected work remains easy to discover.

### Don't:
- **Don't** restore the superseded blue identity from `Agent.md`.
- **Don't** add rounded cards, pill controls, ambient card shadows or competing accent palettes.
- **Don't** invent metrics, testimonials, client attribution or project results.
- **Don't** replace real project screenshots with newly invented raster evidence.

### Selective editorial spacing refinement
The user supplied a Luxury/Editorial reference for useful spacing and information, not a palette replacement. Keep the Newsprint identity and compact project-led first viewport. Supporting sections use `--space-section: clamp(48px, 6vw, 80px)` with existing 40px mobile overrides where appropriate. Shared grouping/copy tokens are 32px/16px and reading measure is 65ch. About paragraphs are left-aligned at 16px with 1.7 line-height. Project purpose, service descriptions, and evidence copy use 15px reading text. Project padding is 24px desktop and 20px mobile. Process steps explain scope, review, and handover; contact explains voluntary chat-to-brief submission. No gold palette, fixed decorative grids, or cinematic motion was introduced.

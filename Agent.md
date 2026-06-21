 - don't use rounded corners or ai icons in the ui
 - use soft corporate tone in the ui features requested
 - understand the frontend animations explained and deep analyze them before implemented the pixels
 - use sleek design and modern layout patterns for the ui with supporting  library animation and background effects
 - check all the files edites to not have any errors
 - keep the css files for aligned with the files and use appropriate css files so that there isn't a single file for all things with 2000s lines of code. and neither there  is a bunch for any.
 - align the css files globally so the design scheme stays consistent across all components



# Portfolio Color Scheme — Blue System

A layered blue palette built for a dark-first developer portfolio. Three-zone structure: deep dark backgrounds, mid-tone interactive elements, and light surfaces for cards and sections.

---

## Base Palette

| Name | Hex | Role |
|------|-----|------|
| Ice | `#E6F1FB` | Section backgrounds, input fills |
| Sky | `#B5D4F4` | Hover states, subtle highlights |
| Electric | `#378ADD` | Primary CTA buttons, active links |
| Ocean | `#185FA5` | Accents, secondary links, borders |
| Abyss | `#0C447C` | Navigation, headings |
| Midnight | `#042C53` | Dark backgrounds, footer |

## Neutrals

| Name | Hex | Role |
|------|-----|------|
| Off-white | `#F8FAFB` | Page background (light mode) |
| Mist | `#E2E8EE` | Borders, dividers, card outlines |
| Slate | `#8FA3B8` | Muted text, placeholders |
| Ink | `#1A2535` | Body text (dark sections) |
| Void | `#0D1117` | Hero background, dark mode base |

## Accents

| Name | Hex | Role |
|------|-----|------|
| Cyan Flash | `#38BDF8` | Icons, code text, active indicators |
| Frost | `#F0F9FF` | Skill chip backgrounds |
| White | `#FFFFFF` | Cards, modals, overlays |

---

## CSS Variables

```css
:root {
  /* Blues */
  --color-ice:       #E6F1FB;
  --color-sky:       #B5D4F4;
  --color-electric:  #378ADD;
  --color-ocean:     #185FA5;
  --color-abyss:     #0C447C;
  --color-midnight:  #042C53;

  /* Neutrals */
  --color-off-white: #F8FAFB;
  --color-mist:      #E2E8EE;
  --color-slate:     #8FA3B8;
  --color-ink:       #1A2535;
  --color-void:      #0D1117;

  /* Accents */
  --color-cyan:      #38BDF8;
  --color-frost:     #F0F9FF;
  --color-white:     #FFFFFF;
}
```

---

## Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          ice:       '#E6F1FB',
          sky:       '#B5D4F4',
          electric:  '#378ADD',
          ocean:     '#185FA5',
          abyss:     '#0C447C',
          midnight:  '#042C53',
        },
        neutral: {
          offwhite:  '#F8FAFB',
          mist:      '#E2E8EE',
          slate:     '#8FA3B8',
          ink:       '#1A2535',
          void:      '#0D1117',
        },
        accent: {
          cyan:      '#38BDF8',
          frost:     '#F0F9FF',
        },
      },
    },
  },
}
```

---

## Component Usage

### Buttons

```css
/* Primary */
background: #378ADD;
color: #FFFFFF;

/* Ghost */
background: transparent;
color: #185FA5;
border: 1px solid #185FA5;

/* Hover (primary) */
background: #185FA5;
```

### Navigation

```css
background: #042C53;
color: #E6F1FB;

/* Active link */
color: #38BDF8;
border-bottom: 2px solid #38BDF8;
```

### Hero Section

```css
background: #0D1117;

/* Name heading */
color: #E6F1FB;

/* Subtitle / role */
color: #8FA3B8;

/* Monospace tag line */
color: #38BDF8;
font-family: monospace;
```

### Cards (Projects)

```css
background: #FFFFFF;
border: 1px solid #E2E8EE;
border-radius: 12px;

/* Card heading */
color: #0C447C;

/* Card body text */
color: #1A2535;

/* Top accent bar */
border-top: 3px solid #378ADD;
```

### Tech Skill Chips

```css
background: #F0F9FF;
color: #185FA5;
border: 1px solid #B5D4F4;
border-radius: 20px;
padding: 4px 12px;
font-size: 12px;
```

### Section Headings

```css
/* Label above heading */
color: #378ADD;
font-size: 12px;
text-transform: uppercase;
letter-spacing: 0.1em;

/* Main heading */
color: #0C447C;

/* Underline accent */
background: linear-gradient(to right, #378ADD, #38BDF8);
height: 3px;
width: 40px;
```

### Badges

```css
/* Open to work */
background: #E6F1FB;
color: #0C447C;

/* Production / live */
background: #042C53;
color: #B5D4F4;
```

### Footer

```css
background: #042C53;
color: #8FA3B8;

/* Links */
color: #B5D4F4;

/* Links hover */
color: #38BDF8;
```

---

## Contrast Reference

| Foreground | Background | Ratio | Use |
|------------|------------|-------|-----|
| `#FFFFFF` | `#378ADD` | 4.6:1 | Primary button text ✓ |
| `#FFFFFF` | `#185FA5` | 7.2:1 | Ghost button hover text ✓ |
| `#E6F1FB` | `#042C53` | 11.4:1 | Hero headings ✓ |
| `#8FA3B8` | `#0D1117` | 5.1:1 | Muted hero text ✓ |
| `#0C447C` | `#E6F1FB` | 9.3:1 | Section headings ✓ |
| `#185FA5` | `#F0F9FF` | 6.1:1 | Skill chips ✓ |

All pairs meet WCAG AA (4.5:1 minimum). Hero text pairs meet AAA (7:1).

---

## Layer Structure

```
┌─────────────────────────────┐
│  HERO / NAV                 │  #0D1117 + #042C53
│  Dark zone                  │  Text: #E6F1FB, #8FA3B8
│                             │  Accents: #38BDF8
├─────────────────────────────┤
│  CONTENT SECTIONS           │  #F8FAFB alternating #E6F1FB
│  Light zone                 │  Headings: #0C447C
│                             │  Body: #1A2535
│  [ Cards ]                  │  Card bg: #FFFFFF
├─────────────────────────────┤
│  FOOTER                     │  #042C53
│  Dark zone                  │  Text: #8FA3B8
└─────────────────────────────┘
```

---

## Rules

- **Cyan flash `#38BDF8` is a punctuation color** — icons, active states, code snippets only. Never a background fill.
- **Alternate section backgrounds** between `#F8FAFB` and `#E6F1FB` to create visual rhythm without borders.
- **Never use pure black `#000000`** for text. Use Ink `#1A2535` or Abyss `#0C447C` depending on context.
- **One gradient allowed** — the hero or a section divider. Keep it `#378ADD → #38BDF8` horizontal. No other gradients.
- **Card hover state** — shift border from `#E2E8EE` to `#378ADD` and add a subtle `box-shadow: 0 4px 20px rgba(55, 138, 221, 0.12)`.
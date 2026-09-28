---
tags: [brand, identity]
status: v1
updated: 2026-09-28
---

# Brand Kit

Related: [[Design-System]] · [[Rules#Design and writing]] · tokens in `tokens.css`

## Positioning

ZehenSync is a calm clinical instrument. It should feel like a well-made piece of medical equipment on a quiet desk: precise, warm, unhurried. It should not feel like a wellness app, a chatbot toy, or a sci-fi AI.

*Zehen* (ذہن) means mind in Urdu. *Sync* is what the product does: it aligns what a person says, what they answer, and how they behave, into one record a psychologist can trust.

Three words: **steady, exact, humane.**

## Logo

### Mark: Sync Z

![[zehensync-mark.svg|96]]

Three strokes enter from the left (the answers, the voice, the face) and fuse at a single lapis node. From that node one line draws a Z down and across: the traceable record. The node is the product: the point where signals become evidence.

| File | Use |
|---|---|
| `logo/zehensync-mark.svg` | Default mark on light backgrounds |
| `logo/zehensync-mark-reversed.svg` | Mark on dark backgrounds |
| `logo/zehensync-lockup.svg` | Mark and wordmark, horizontal |
| `logo/zehensync-lockup-reversed.svg` | Lockup on dark |
| `logo/zehensync-app-icon.svg` | Favicon, app tile, social avatar |

Other concepts considered, kept for the record: `concept-a-confluence.svg` (three strands into a node; read as a fork or a "less than" sign at small sizes) and `concept-b-trace-pin.svg` (a pin on a timeline; read as a lollipop, so it became the `trace` UI icon).

### Rules

- Clear space: the node's diameter on every side.
- Minimum size: 20 px tall for the mark, 96 px wide for the lockup. Below 20 px use the app icon.
- The node stays lapis (or light lapis on dark). Never recolour it red, green, or a gradient.
- Never rotate, add shadows, outline, animate the strokes, or put the mark in a brain, a head silhouette, or a speech bubble.
- The wordmark is IBM Plex Sans SemiBold, tracking −0.6. **Before print or external use, convert the wordmark text to outlines in Figma**; SVG text falls back to a system font when the file loads as an image.

## Colour

A warm paper-and-ink base with one accent. Lapis refers to lapis lazuli from Badakhshan, the blue in Mughal tilework across Lahore. It reads trustworthy without the default-SaaS blue.

### Core

| Token | Hex | Role |
|---|---|---|
| `paper-50` | `#F7F6F3` | App background, light |
| `paper-100` | `#EEEDE8` | Sunken surfaces, sidebars |
| `paper-200` | `#E2E0D9` | Borders, dividers |
| `stone-300` | `#CBC8BF` | Strong borders, disabled fills |
| `stone-500` | `#7E776B` | Icons, placeholder. **Not for text** (4.2:1) |
| `stone-600` | `#5F594F` | Secondary text (6.4:1 on paper-50) |
| `ink-900` | `#1A1F26` | Primary text, mark strokes (15.3:1) |
| `lapis-600` | `#2E4A7D` | Accent: primary buttons, links, citations, focus ring (8.1:1) |
| `lapis-500` | `#3F5F9C` | Accent hover (5.8:1) |
| `lapis-100` | `#D9E1F0` | Selected rows, user chat block |
| `lapis-50` | `#EEF2F9` | Subtle accent fill |

### Severity (psychologist and admin areas only)

| Token | Text hex | Fill hex | Meaning |
|---|---|---|---|
| `sage` | `#40634A` | `#E6EEE7` | Steady, improving, resolved |
| `ochre` | `#855A12` | `#F5EBD6` | Watch |
| `clay` | `#9C4A22` | `#F6E4DA` | Urgent |
| `brick` | `#8E2F2A` | `#F4DEDC` | Crisis |

Every severity pairs colour with a text label and a shape (dot, ring, bar, filled square). Colour never carries meaning alone.

**Patients never see severity colours.** Their results use ink, lapis and paper only. The crisis screen uses the calm palette on purpose: red makes a frightened person more frightened.

### Dark theme

| Token | Hex |
|---|---|
| `bg` | `#111418` |
| `surface` | `#181C22` |
| `raised` | `#1F242B` |
| `text` | `#ECE8DF` (15.1:1) |
| `text-muted` | `#A39C8F` (6.8:1) |
| `accent` | `#8FA8D6` (7.7:1) |
| `sage / ochre / clay / brick` text | `#8FB897` / `#D9AE5F` / `#E08A5E` / `#E07A70` |

All ratios measured against the primary background of the theme. Every text pairing passes WCAG AA; body pairings pass AAA.

## Type

| Role | Family | Use |
|---|---|---|
| Interface | **IBM Plex Sans** 400, 500, 600 | All UI text, headings |
| Data | **IBM Plex Mono** 400, 500 | Scores, pseudonyms, timestamps, rule IDs, trace rows |
| Reading | **Source Serif 4** 400, 600 | Scholar answers, cited passages, patient result explanations |
| Urdu (post-FYP) | **Noto Nastaliq Urdu** | Urdu script UI |

Plex comes from IBM's engineering heritage: it reads as instrument lettering. The serif slows reading down where people need to read carefully.

Scale (rem, 16 px base): 0.75 · 0.875 · 1 · 1.125 · 1.25 · 1.5 · 2 · 2.5. Patient body text 1.125 rem minimum. Clinician tables 0.875 rem. Line height 1.55 for reading text, 1.3 for headings, 1.4 for UI. Numbers in tables use `font-variant-numeric: tabular-nums`.

## Iconography

- Base set: **Lucide**, 1.5 px stroke, 20 px in UI, 24 px in empty states.
- Custom set in `icons/`, drawn on the same 24 px grid and stroke: `trace`, `blink`, `gaze`, `speech-pause`, `check-in`, `counselor`, `citation`, `help-now`, `fusion`.
- Icons sit next to a text label except in dense clinician tables, where a tooltip carries the label.
- No brains, no lightbulbs, no robots, no sparkles, no hearts-with-heartbeats.

## Imagery

No stock photos of sad people holding their heads. No AI-generated faces. When a screen needs visual weight, use:

- Data drawn from the product itself (a real trace, a real timeline with demo data).
- Flat paper textures and fine-line diagrams in ink and lapis.
- Photography of Lahore light and architecture for marketing only, credited.

## Motion

- Durations: 120 ms for hover and press, 200 ms for panels, 320 ms for page transitions.
- Easing: `cubic-bezier(0.2, 0, 0, 1)` for entering, `cubic-bezier(0.4, 0, 1, 1)` for leaving.
- One signature motion: when a check-in finishes, the three answer strands on the result card draw into the node (600 ms, once). Nowhere else animates the mark.
- `prefers-reduced-motion`: all motion becomes opacity fades of 120 ms or less.
- Nothing pulses, bounces, or loops on patient screens.

## Voice and tone

We speak like a thoughtful clinician writing a note to a patient they respect. Short sentences. Plain words. No exclamation marks.

| Context | Do | Don't |
|---|---|---|
| Result | "Your answers suggest a noticeable level of low mood." | "You have moderate depression." |
| Encouragement | "Thanks for sticking with it. That was 9 questions." | "Amazing job! You're a superstar!" |
| Uncertainty | "I can't find evidence for this in my sources." | "Great question! While I can't be certain..." |
| Invitation | "Would it help to take a short check-in about sleep?" | "Let's dive into your sleep journey!" |
| Error | "That didn't save. Your answer is still here; try again." | "Oops! Something went wrong." |
| Crisis | "You don't have to handle this alone." | "We're so worried about you!!" |

Banned words in product copy: journey, dive in, unlock, empower, seamless, revolutionary, cutting-edge, leverage, supercharge, magic, AI-powered (as a selling point), "we're here for you" (without a concrete action next to it).

Psychologist-facing copy is terse and exact: "PHQ-9 rose from 4.3 to 12 in 9 days." Scholar-facing copy is academic but plain.

## Anti-slop checklist

Every screen, deck, or page ships only if all are true:

- [ ] No purple-to-blue gradients, no glassmorphism, no glowing orbs, no neon.
- [ ] No three-card "features" row with icons in coloured circles.
- [ ] No emoji in UI.
- [ ] No generic hero claim ("Revolutionising mental health with AI").
- [ ] Every number shown is real or labelled "demo data".
- [ ] Every illustration explains something specific to ZehenSync.
- [ ] Typography uses Plex, Plex Mono and Source Serif only.
- [ ] Accent colour appears on under 10% of the screen.
- [ ] Copy passes the voice table above.

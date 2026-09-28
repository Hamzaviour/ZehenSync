---
tags: [brand, identity]
status: v2
updated: 2026-09-28
---

# Brand Kit

Related: [[Design-System]] · [[Rules#Design and writing]] · tokens in `tokens.css` · live deck: https://claude.ai/artifact/NvFw7sUPwHgv4QoLuQ24TU

v2 replaces the v1 "Sync Z" identity ([[Decisions#ADR-015]]). Direction: **light clinical editorial**. The product is light and calm; brand moments (decks, posters, social) go dark.

## The idea

In Urdu one nuqta turns د (dal) into ذ (zaal), the first letter of ذہن, mind. Calligraphers measure every letter in nuqtas. ZehenSync works the same way: every score, flag and citation sits on a point a psychologist can find and check.

- **Brand line:** Screening you can trace.
- **Urdu line:** ذہن کی بات، ثبوت کے ساتھ (matters of the mind, with evidence)
- **Platform:** Every conclusion has a point of origin.
- **Character:** steady, exact, humane. A modern clinical journal with a Lahore accent.
- **Never:** alarm, diagnosis talk, wellness fluff, glowing AI.

## Logo

### The Zaal mark

![[zehensync-mark.svg|120]]

A Kufic ذ: an upright stem and a base, drawn as one broad-nib stroke, with a saffron diamond nuqta above. It reads three ways: the first letter of ذہن, a corner framing a point of focus (behavioural imaging), and nuqta-e-nazar, a point of view.

### Construction

- The mark mirrors itself across the 45° diagonal (axis y = x in the 64-unit drawing). Stem and base are the same stroke, reflected.
- Both terminals are cut at 24°, as if one broad pen drew them.
- Stroke 11 units. Stem 44 units: four strokes tall.
- Nuqta: a 45° diamond, 13 units across, centred on the axis at (26, 26).
- Geometry: letter `M43 15 L54 10 L54 51 Q54 54 51 54 L10 54 L15 43 L43 43 Z`, nuqta `M26 19.5 L32.5 26 L26 32.5 L19.5 26 Z`.

### Files

| File | Use |
|---|---|
| `logo/zehensync-mark.svg` | Default: neel letter, saffron nuqta |
| `logo/zehensync-mark-ink.svg` | Ink letter for print on white |
| `logo/zehensync-mark-reversed.svg` | White letter for neel and night backgrounds |
| `logo/zehensync-mark-mono.svg` | Single colour (`currentColor`) for stamps, emboss, fax |
| `logo/zehensync-lockup.svg` | Mark and wordmark, horizontal. Primary. |
| `logo/zehensync-lockup-reversed.svg` | Horizontal lockup on dark |
| `logo/zehensync-lockup-stacked.svg` | Mark above wordmark |
| `logo/zehensync-app-icon.svg` | Favicon, app tile, social avatar |
| `logo/studies/` | Rejected concepts B (split lens), C (Z-trace), D (two minds), kept for the record |

The wordmark is **Newsreader Medium at the 72 pt optical size, outlined to vector paths** with the font's own kerning and −0.018 em tracking. The files need no font installed and render the same everywhere. In the horizontal lockup the mark is 1.2× the cap height, sits on the baseline, and leaves a gap of 0.26 em.

### Rules

- Clear space: half a nuqta around the mark, one nuqta around lockups.
- Minimum size: mark 16 px, lockup 96 px wide. Below 16 px use the app icon.
- The nuqta stays saffron in every colour version. Only the mono file makes it one colour.
- Don't recolour the nuqta, move it (a dot below the letter makes a different letter), rotate, outline, stretch, or add gradients or glow.
- Don't place the mark inside a brain, a head, or a speech bubble.

## Colour

Clinical white and cool greys, deep ink, **neel** as the brand colour, and **saffron** as a single point of attention. Neel is the indigo of Sindh's ajrak cloth. Saffron marks one point per screen, the way the nuqta marks one letter.

Proportion on a typical screen: paper 60%, mist 18%, ink 12%, neel 8%, saffron 2%.

### Core

| Token | Hex | Role | Contrast on white |
|---|---|---|---|
| `neel-700` | `#26318A` | Brand, primary actions, links, citations, focus | 11.1:1 |
| `neel-600` | `#3441A8` | Hover | 8.5:1 |
| `neel-300` | `#9AA6F2` | Accent on dark, current progress step | on night 8.3:1 |
| `neel-100` | `#E3E6F7` | Selected, highlight | |
| `neel-50` | `#F1F2FB` | Subtle fill, user chat block, selected answer | |
| `ink` | `#0E1233` | Text, wordmark | 18.2:1 |
| `graphite-700` | `#454A60` | Secondary text | 8.7:1 |
| `graphite-500` | `#62677D` | Labels, captions | 5.6:1 |
| `slate` | `#C5C9D6` | Strong borders, disabled | |
| `line` | `#E3E5EC` | Borders, dividers | |
| `mist` | `#F4F5F8` | Sunken surfaces, sidebars | |
| `paper` | `#FFFFFF` | Background | |
| `saffron-400` | `#E3A33B` | The nuqta. Fills only, never text | 2.2:1 |
| `saffron-700` | `#8A5A0E` | Text-safe saffron | 5.9:1 |

### Severity (psychologist and admin screens only)

| Token | Text | Fill | Shape |
|---|---|---|---|
| `steady` | `#2E6B52` | `#E4F0EA` | ring |
| `watch` | `#8A5A0E` | `#FBF0DC` | triangle |
| `urgent` | `#A1461F` | `#F8E6DC` | diamond |
| `crisis` | `#9A1B35` | `#F7E1E6` | dot |

Every state pairs colour with a shape and a word. **Patients never see severity colours**; their results use ink and neel, and the crisis screen stays calm white.

### Dark brand and dark theme

| Token | Hex |
|---|---|
| `night` | `#0B0E24` |
| `night-raised` | `#151A3A` |
| `night-border` | `#262C57` |
| `text` | `#EEF0F7` (16.7:1) |
| `text-muted` | `#A7ACC4` (8.5:1) |
| `accent` | `#9AA6F2` (8.3:1) |
| severity text | `#7CC3A0` / `#F0BD62` / `#EE9A74` / `#F28DA2` |

## Type

| Role | Family | Weights | Use |
|---|---|---|---|
| Display and reading | **Newsreader** | 400, 500, 600, italic | Wordmark, headings, patient questions and results, scholar answers, citations |
| Interface | **Schibsted Grotesk** | 400, 500, 600 | Buttons, labels, navigation, tables, forms |
| Data | **Geist Mono** | 400, 500 | Scores, pseudonyms, timestamps, rule IDs, trace rows |
| Urdu (post-FYP) | **Noto Nastaliq Urdu** | 500 | Urdu script UI and brand moments |

Scale (px): 13 · 15 · 18 · 24 · 32 · 44 · 64. Patient body text 18. Interface text 15. Clinician tables 14 with tabular figures. Line height 1.6 for reading text, 1.25 for headings, 1.45 for UI.

## Iconography

- Custom set in `icons/`: 24 px grid, 1.75 px stroke, square ends, mitred corners, matching the mark's cut terminals.
- Icons with a point of focus carry a small nuqta diamond (`trace`, `gaze`, `history`, `citation`, `voice`, `check-in`). In an active state the nuqta turns saffron.
- Set: `check-in`, `counselor`, `trace`, `flag`, `history`, `share`, `consent`, `blink`, `gaze`, `voice`, `citation`, `help-now` (phone), `alert`.
- Everything else from Lucide at 1.75 stroke. No brains, lightbulbs, robots or sparkles.

## Pattern and image

- **Nuqta jaali:** a lattice of diamonds (26 px cell, white at 13–16% on neel) with at most two saffron nuqtas. For covers, cards, decks, social, the login backdrop. Never behind patient questions, results or the crisis screen.
- **Image:** single-ink halftone in neel of Lahore architecture, arcades, jaali screens, horizons. The saffron sun is the only second colour.
- **Avoid:** stock photos of distress, AI-generated faces, brains and neurons, glowing networks, real patients.

## Motion

| Moment | Duration | Easing |
|---|---|---|
| Check-in complete: the nuqta lands on the mark, once | 560 ms | `cubic-bezier(0.2, 0, 0, 1)` |
| Hover and press | 120 ms | same |
| Panels, drawers, reference sidebar | 200 ms | same |
| Page change | 320 ms | in `0.2, 0, 0, 1`, out `0.4, 0, 1, 1` |
| Crisis screen | 150 ms | fade only |
| Reduced motion | ≤ 120 ms | opacity only |

## Voice and tone

We write like a thoughtful clinician writing to someone they respect. Short sentences. Plain words. No exclamation marks.

| Moment | We write | We never write |
|---|---|---|
| Result | "Your answers suggest a noticeable level of low mood." | "You have moderate depression." |
| Encouragement | "Thanks for sticking with it. That was 9 questions." | "Amazing job! You're a superstar!" |
| No evidence | "I can't find evidence for this in my sources." | "Great question! While I can't be certain..." |
| Invitation | "Would it help to take a short check-in about sleep?" | "Let's dive into your sleep journey!" |
| Error | "That didn't save. Your answer is still here; try again." | "Oops! Something went wrong." |
| Crisis | "You don't have to handle this alone." | "We're so worried about you!!" |
| Psychologist | "PHQ-9 rose from 4.3 to 12 in 9 days." | "Patient appears to be struggling significantly." |

Banned words: journey, dive in, unlock, empower, seamless, revolutionary, cutting-edge, leverage, supercharge, magic, AI-powered (as a selling point), "we're here for you" without a concrete action beside it.

## Anti-slop checklist

A screen, deck or page ships only when every box holds:

- [ ] No gradients, glassmorphism, glowing orbs, or neon.
- [ ] No row of three feature cards with icons in coloured circles.
- [ ] No emoji in the interface.
- [ ] One saffron point per screen, at most.
- [ ] Every number is real or labelled demo data.
- [ ] Every image explains something only ZehenSync does.
- [ ] Newsreader, Schibsted Grotesk and Geist Mono only.
- [ ] No stock photos of distress. No AI faces. No brains.
- [ ] The mark appears as drawn: no effects, no rotation.
- [ ] Copy passes the voice table.

## Notes

- `zehensync.app` in mockups is a placeholder. The domain is not registered.
- Names in mockups (Hira M., Dr. A. Khan, Sana) are fictional demo data.

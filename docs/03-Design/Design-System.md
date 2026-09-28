---
tags: [design, ux, ui]
status: draft-v1
updated: 2026-09-28
---

# Design System and UX

Related: [[Brand-Kit]] · [[App-Flow]] · [[Rules#Design and writing]]

## 1. UX principles

1. **One thing per screen for patients.** A check-in shows one question. The intake shows one question. Home shows one suggested step first.
2. **Density follows the role.** Patient screens breathe (large type, wide margins). Psychologist screens pack information (tables, 14 px text, split panes). Scholar screens favour long reading (serif, 70-character lines).
3. **Evidence one click away.** Any number, flag or claim links to where it came from.
4. **Say what the system is doing.** Camera on, mic on, AI rephrased this question, this answer came from DSM-5-TR page 183. No hidden processing.
5. **Recoverable everywhere.** Back works, answers autosave, revoke works, delete works.
6. **Calm under stress.** No timers on patients, no red, no urgency language, no streaks or gamification.

## 2. Layout

- Desktop only. Minimum supported width 1024 px; designed at 1280 and 1440.
- App shell: 240 px left sidebar (collapsible to 64 px), top bar 56 px with role label, "Get help now" (patient only), account menu.
- Content grids:
  - Patient: single column, max 680 px, centred.
  - Scholar: answer column max 720 px + 380 px reference sidebar.
  - Psychologist: fluid, 12-column, 24 px gutters; list/detail split at 40/60.
- Spacing on a 4 px grid; section gaps 32 or 48 px.

## 3. Components

Built on shadcn/ui and Radix, restyled with [[Brand-Kit]] tokens. Changes from shadcn defaults: cool clinical neutrals, 6 px radius (not 12), no drop shadows on cards (1 px border instead), focus ring in neel with 2 px offset, Newsreader for headings and questions.

| Component | Notes |
|---|---|
| Button | Primary (neel fill), secondary (border), quiet (text). Height 40 px; 48 px in patient area. One primary per view. |
| AnswerOption | Patient check-in answer. Full width, 56 px, left-aligned label, keyboard hint on right, selected state neel-50 fill, neel border and a 3 px neel left bar. |
| QuestionCard | Timeframe line, question (28 px Newsreader 400), "Show original wording" toggle, answers, note disclosure. |
| ResultBand | Horizontal segmented bar with band labels beneath; marker for the score. No colour gradient; segments in line grey with the active one in neel; the score marker is the saffron nuqta. |
| SeverityTag | Clinician only. Shape + colour + label: `● Crisis`, `◆ Urgent`, `▲ Watch`, `○ Info`. |
| DeltaChip | `↑ 7.7 vs baseline` in mono; clay text if ≥ 5 up, sage if ≥ 5 down, stone otherwise. |
| TraceRow | Timestamp (mono), source icon, summary, stored value, expand chevron. Expanded shows canonical vs displayed text side by side. |
| CitationMark | Superscript `[n]` in Geist Mono, neel, 44 px hit area, hover shows source title and page. |
| ReferencePanel | Sticky sidebar listing sources; active one highlighted; quote in serif with the cited sentence underlined. |
| ChatMessage | Assistant: plain text on page, no bubble. User: neel-50 block, right aligned, max 80%. Guard-replaced lines show a small "adjusted for safety" note to clinicians only. |
| CaptureIndicator | Small dot + label "Camera on" / "Mic on" in the context strip; click pauses capture. |
| ResourcesStrip | Persistent top strip after a safety pathway: helpline numbers inline, "Get help now" link. Paper-100 background, ink text. |
| CrisisScreen | Full viewport, paper background, ink text, neel `tel:` buttons 56 px tall. No saffron, no severity colours. |
| DataTable | TanStack Table, sticky header, 44 px rows, tabular numbers, column sort, keyboard row navigation. |
| Timeline | visx line chart, band backgrounds as faint horizontal stripes, points clickable to sessions. |
| MarkerPanel | Small multiples per marker with quality shading; unusable windows hatched and excluded. |
| EmptyState | One sentence, one action. No illustration of sad characters. |

## 4. Screen specs

### 4.1 Patient home

- Greeting line with name, no time-of-day cheerfulness ("Good morning!"). Just "Hi, Sana."
- Card 1 (primary): suggested next step with reason, e.g. "Sleep came up in your last two chats. A 7-question sleep check-in could help your psychologist." Buttons: Start, Not now.
- Card 2: last result summary with link to history.
- Row of quiet links: Talk, Check in, History, Sharing.
- Footer disclaimer line.

### 4.2 Check-in runner

See [[App-Flow#2.3 Guided Volition runner (state machine)]]. Keyboard: 1 to 5 select, Enter confirms, Backspace goes back. Focus lands on the question heading on each new item for screen readers.

### 4.3 Counselor chat

- Composer: textarea grows to 6 lines; hold-to-talk mic button to its left; Send on Enter, newline on Shift+Enter.
- Streaming text appears by sentence (buffered by the output guard), not token by token. It reads calmer and hides guard replacements.
- Suggestion card for instruments sits inline in the conversation.

### 4.4 Psychologist queue and patient view

- Queue: see [[App-Flow#4.1 Queue]]. Filters as a single row of segmented controls, not a sidebar.
- Patient view header: pseudonym or name, age band, linked since, scopes granted (as small tags), open flags count, Export button.
- Tabs keep state in the URL.

### 4.5 Flag trace

See wireframe in [[App-Flow#4.2 Flag trace (the core screen)]]. This screen is the product's proof. Give it the most design attention.

### 4.6 Scholar tutor

- Question input at top of thread when empty, at bottom once a thread exists.
- Answer in Newsreader, 18 px, 1.6 line height.
- "How I found this" disclosure beneath each answer.
- Level switch in the header (Intro, Intermediate, Advanced, Research) to override the profile for one answer.

### 4.7 Simulator

- Left: transcript. Right: timer, checklist of rubric areas that fill as the student covers them (hidden in "exam mode"), End interview.
- The simulated patient's messages use the same plain chat style as the counselor so students practise on a realistic surface.

## 5. Accessibility

- WCAG 2.2 AA. All text pairings pass contrast; see [[Brand-Kit#Colour]].
- Full keyboard paths for every flow; visible focus ring.
- Live regions: streamed answers announce per sentence; crisis screen announces assertively.
- Camera and mic never start without an explicit click in that session.
- Motion reduced under `prefers-reduced-motion`.
- Plain-language target: patient copy at or below grade 8 reading level (Flesch-Kincaid), checked in CI for strings in `apps/web/copy/patient/`.

## 6. Content design

- Sentence case for all headings and buttons.
- Buttons say the action: "Start check-in", "Share results", "End chat". Never "Submit" or "OK".
- Numbers: "Score 12 of 27", dates "20 Nov 2026", times 24-hour in clinician views, 12-hour in patient views.
- Voice and banned words: [[Brand-Kit#Voice and tone]].

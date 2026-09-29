# Hyperframes Composition Brief: ZehenSync AI

## Objective
A premium launch film for ZehenSync AI, embedded on the landing page (`apps/landing`) and used for the FYP defence.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`, copied to `apps/landing/assets/film/zehensync-film.mp4`
- Format: landscape, 1920x1080, 30 fps
- Duration: ~55.5 s. This exceeds the brag default of 15–25 s by user decision: a one-minute film with voiceover, approved in the landing-page spec.

## Source Material
- Project root: `E:\Work\Projects\ZehenSync AI`
- Primary files read: `apps/landing/index.html`, `apps/landing/styles.css`, `docs/04-Brand/Brand-Kit.md`, `docs/03-Design/App-Flow.md`
- Product name: ZehenSync AI
- Tagline: "Screening you can trace."
- Key UI to recreate: patient check-in (tap an answer, toggle "Show original wording"), psychologist triage row to flag trace to evidence row, scholar citation [1] to highlighted DSM-5-TR passage, calm crisis screen.
- Copy that must appear verbatim:
  - "How often have you felt low, down, or without hope?"
  - "Feeling down, depressed, or hopeless" (canonical PHQ-9 item 2)
  - "Rapid increase in depression score"
  - "You don't have to handle this alone."
  - "Screening you can trace"
  - ذہن کی بات، ثبوت کے ساتھ

## Creative Direction
- Tone preset: polished, with cinematic scale on the hook and outro
- Creative direction: quiet premium clinical film, a modern medical journal with a Lahore accent
- Interpretation: slow crossfades, long holds, one idea per scene, the voice leads, and the saffron dot is the only bright colour
- Angle: one dot turns د into ذ, and one point of origin sits under every score, flag and citation. The saffron nuqta travels through the film as the mark's dot, the tap, the blink marker, the trace, and the final full stop.
- Hook: the mark draws, the nuqta drops, and the voice says "In Urdu, a single dot changes a letter."
- Outro: the lockup, "Screening you can trace" with the nuqta as its full stop, and the Urdu line
- Avoid: generic SaaS language, abstract filler, alarm styling in the safety scene, red

## Visual Identity
- Background #0B0E24; raised #151A3A; rules #262C57
- Text #EEF0F7 on dark; ink #0E1233 on white product screens
- Accent: saffron #E3A33B (nuqta only), neel #26318A, neel 300 #9AA6F2
- Fonts, local in `assets/fonts`: Newsreader (display, reading), Schibsted Grotesk (UI), Geist Mono (data), Noto Nastaliq Urdu, Noto Kufi Arabic (the د and ذ glyphs)
- Logo: `assets/logo/*.svg` (outlined wordmark)

## Storyboard (timed to the voiceover)
| # | Scene | Start | Dur | VO clip at |
|---|---|---|---|---|
| 1 | The dot | 0.0 | 5.0 | vo1 @ 1.6 (2.54 s) |
| 2 | The empty box | 5.0 | 6.5 | vo2 @ 5.5 (5.72 s) |
| 3 | One question at a time | 11.5 | 9.0 | vo3 @ 12.2 (6.74 s) |
| 4 | Read like a scan | 20.5 | 7.0 | vo4 @ 21.1 (5.57 s) |
| 5 | Every flag has a source | 27.5 | 10.0 | vo5 @ 28.2 (5.85 s) |
| 6 | No source, no answer | 37.5 | 5.5 | vo6 @ 38.1 (3.80 s) |
| 7 | Safety first | 43.0 | 5.5 | vo7 @ 43.5 (4.71 s) |
| 8 | Screening you can trace | 48.5 | 7.0 | vo8 @ 49.8 (2.15 s) |

## Audio
- Role: calm bed under a British-English Kokoro voice (`bf_emma`, 0.95 speed)
- Music: `assets/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3`, fading in over 1.5 s. It ducks to ~0.13 under narration, dips to ~0.07 in the safety scene, lifts to ~0.3 for the outro, and fades out by 55.5 s.
- Cue guidance: preset `cues/…vol-10….music-cues.json`. Strong cues exist near 18.55 / 20.19 / 20.74. Lock at most one reveal to a strong cue, and only if it doesn't disturb narration.
- Audio-reactive: subtle presence on the nuqta, optional. Skip if the extraction helper is unavailable.
- SFX: `impactSoft_medium_001` for the nuqta landings (scenes 1 and 8), `click2` for taps and citation clicks, `click_003` for the triage row select. Sparse, and silent in the safety scene.

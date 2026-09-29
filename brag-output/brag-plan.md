# Brag Plan: ZehenSync AI

## What is this app?
A mental-health screening platform that asks one validated question at a time, reads blink, gaze and pauses from an ordinary webcam in the browser, and shows the psychologist the exact answer behind every flag. It serves patients, psychologists and psychology students, and never diagnoses.

## The angle
"In Urdu, a single dot changes a letter." The nuqta is ZehenSync's whole idea: one point turns د into ذ (the first letter of ذہن, mind), and one point of origin sits under every score, flag and citation. The film follows that dot. It lands on the mark, becomes the cursor that taps an answer, marks each blink on the signal line, and travels from a psychologist's flag back to the exact answer. At the end it lands on the full stop of "Screening you can trace."

## Hook (first 2-3 seconds)
Night-indigo frame, silence, then the Zaal mark's stroke draws itself and the saffron nuqta drops onto it with one soft hit. The voice opens on "In Urdu, a single dot changes a letter." Viewers who don't read Urdu still see a letter change meaning in front of them.

## Key moments (the middle)
- The empty chat box with a blinking caret that nobody types into, then "40%+ missed in primary care" (AMA, 2023).
- The patient check-in: the rephrased question writes itself, the saffron dot taps "Several days", the progress bar steps forward, and "Show original wording" flips to the validated item text.
- The live eye-aspect-ratio line scrolling, with a saffron diamond dropping on each blink and the chip "Computed in the browser".
- The psychologist queue: the "Hira M. · PHQ-9 12 · ↑7.7" row lights up, the flag trace opens, and the nuqta runs a line from the flag to the source row "20 Nov 14:05 · More than half the days".
- The scholar tutor: superscript [1] is clicked and the DSM-5-TR passage highlights in the reference panel.
- The crisis screen, calm and white: "You don't have to handle this alone." and Umang 0311 7786264.

## Outro / punchline
The mark and wordmark settle. "Screening you can trace" writes out and the nuqta lands as its full stop, followed by the Urdu line ذہن کی بات، ثبوت کے ساتھ. The voice says "ZehenSync. Screening you can trace." Then the music resolves.

## User flow worth showing
1. The patient answers a guided question with a tap (entry).
2. The system scores it with code and a flag appears for the psychologist (key action).
3. The psychologist traces the flag to the exact answer and timestamp (result).
Supporting beats: the webcam signal read in the browser, the student's cited answer, and the Hard Stop crisis screen.

## Tone
- Preset: polished (with cinematic scale for the hook and outro)
- Creative direction: quiet premium clinical film, a modern medical-journal feel with a Lahore accent
- Interpretation: slow crossfades and long holds, one idea per scene, no bullets on screen. The warmth comes from the voice and the saffron dot. Nothing flashes, nothing is loud, and there's no alarm styling even in the safety scene.

## Format: landscape — 1920x1080
## Duration: ~54 s
Longer than the usual 15-25 s on purpose. The user approved a roughly one-minute film with voiceover for the landing page, aimed at pilot partners and the FYP defence. The narration needs room to explain three roles and the safety model at a calm reading pace.

## Voiceover (Kokoro, calm, measured)
Target is about 2.3 words per second, with pauses between scenes. The lines add meaning instead of reading the on-screen text.

1. (hook) "In Urdu, a single dot changes a letter."
2. (problem) "But most distress is never typed into an empty box. Routine care misses four in ten cases."
3. (check-in) "ZehenSync asks one clear question at a time. Every answer is a tap, and every score is simple arithmetic."
4. (signals) "An ordinary webcam notices blinks, gaze and pauses, and the video never leaves the device."
5. (trace) "When something changes, the psychologist sees the flag, and the exact answer behind it, to the second."
6. (scholar) "Students get answers that cite their source, or an honest 'I don't know'."
7. (safety) "And when someone is in danger, the AI steps aside, and real help comes first."
8. (outro) "ZehenSync. Screening you can trace."

## Visual identity (from the project)
- Background: #0B0E24 (night), raised panels #151A3A, rules #262C57
- Accent: #E3A33B (saffron, only the nuqta) and #9AA6F2 (neel 300 on dark)
- Brand: #26318A (neel)
- Text: #EEF0F7 on dark, #0E1233 ink on white product screens
- Display font: Newsreader (300/400, italic accents)
- Body font: Schibsted Grotesk; data: Geist Mono; Urdu: Noto Nastaliq Urdu
- Strongest visual element: the white product screens inside a dark laptop, plus the saffron nuqta diamond
- Logo files: `apps/landing/assets/logo/*.svg` (outlined wordmark, no font needed)

## Share copy (draft)
One dot turns د into ذ. One point of origin under every score. ZehenSync: mental-health screening you can trace.

## Audio direction
- Role: calm bed under the voiceover, with restrained motion-matched accents
- Music: `happy-beats-business-moves-vol-10-by-ende-dot-app.mp3` (60 s, ~110 BPM). Its strong beats arrive after 15 s, so the opening stays quiet.
- Music treatment: fade in over the first 2 s, sit low (voice carve / duck under narration), let it lift slightly for the outro, then fade to silence on the last hold.
- Music cue guidance: preset read. Tempo ~110 BPM. Strong cues in the planning window: 18.55, 20.19, 20.74, 22.92, 24.01. Past 25 s, detect at composition time with `hyperframes beats`. Use one strong cue for the flag-trace line reaching the source row (~30 s) and one for the outro lockup if they fall naturally. Readability and narration come first.
- Audio-reactive treatment: subtle. The saffron nuqta and the scope's signal line may breathe with music energy; no waveform bars or pulsing.
- SFX posture: sparse, motion-matched, soft UI sounds: the nuqta landing (one soft low hit), the answer tap (a quiet click), and the flag row selection (one soft tick). No whooshes on every cut.
- Audio-coupled moments: nuqta lands on the mark (hook and outro), tap on "Several days", blink diamonds (at most one tiny tick, or silence), flag-to-source line arrival.
- Restraint rule: nothing alarming in the safety scene. No sirens, no stings, no dramatic drop. The music may dip there.

## Storyboard

### Scene 1 — The dot — 5s
Night background with a faint jaali lattice. The Zaal mark's stem and base draw on. The saffron diamond nuqta drops onto it with a soft settle. Then, at small size, the Kufic د gains its dot to become ذ.
Sequential/interaction: yes — stroke draw, then the nuqta drop.
Audio intent: silence opening into a soft hit.
Audio-coupled idea: nuqta landing hit.
Music: fade in.
Transition mood: soft → Scene 2

### Scene 2 — The empty box — 6s
A dark chat input "How are you feeling today?" with a blinking caret that nobody types into. Then a large serif "40%+" with the caption "of depression and anxiety cases missed in routine primary care" and "AMA, 2023" in mono.
Sequential/interaction: caret blinks, then the stat counts up 0 → 40.
Audio intent: quiet, a little heavy.
Audio-coupled idea: none (the count-up stays silent or has a very light tick).
Transition mood: soft crossfade → Scene 3

### Scene 3 — One question at a time — 9s
A laptop on night, showing the patient check-in (light UI). The question "How often have you felt low, down, or without hope?" writes in. The saffron dot moves and taps "Several days", which gets the selected neel state, and the progress bar advances from 2 of 9 to 3 of 9. "Show original wording" is clicked and flips to "Feeling down, depressed, or hopeless". Hold on the canonical text.
Sequential/interaction: yes — simulated tap, progress advance, wording toggle.
Audio intent: warm, reassuring.
Audio-coupled idea: tap click.
Transition mood: clean slide → Scene 4

### Scene 4 — Read like a scan — 7s
The scope panel: the eye-aspect-ratio line scrolls, dips below the dashed blink threshold, and a saffron diamond drops at each dip. Three readouts arrive one by one: "17 blinks / min", "Gaze stable", "Computed in the browser". Each holds ≥ 0.8 s once all are shown.
Sequential/interaction: yes — readouts one by one.
Audio intent: gentle rhythmic life.
Audio-coupled idea: blink diamonds may align with beats (accent only, no text on beats).
Transition mood: soft crossfade → Scene 5

### Scene 5 — Every flag has a source — 10s
The laptop shows the psychologist triage queue. The "Hira M. · PHQ-9 12 · ↑ 7.7" row highlights and the flag trace opens: "Rapid increase in depression score", baseline 4.3 → 12. The nuqta draws a thin line from the flag header to the evidence row "20 Nov 14:05 · Item 2 · More than half the days", which expands to show "Shown as" and "Answer". Hold ≥ 2.5 s on the expanded evidence.
Sequential/interaction: yes — row click, panel open, trace line travel, row expand.
Audio intent: precise, confident.
Audio-coupled idea: soft tick on row select; the trace line's arrival can sit on a strong cue.
Transition mood: clean → Scene 6

### Scene 6 — No source, no answer — 6s
The scholar tutor answer in the serif font. The cursor clicks superscript [1] and the reference card highlights the DSM-5-TR passage ("… same 2-week period …", p. 183).
Sequential/interaction: yes — click on the citation, highlight sweep.
Audio intent: studious, light.
Audio-coupled idea: soft click.
Transition mood: soft crossfade → Scene 7

### Scene 7 — Safety first — 5s
A calm white crisis card on night: "You don't have to handle this alone." with the Umang Pakistan, Rozan and 1122 tiles. Nothing moves except a slow fade-in. The music dips.
Sequential/interaction: tiles fade in one by one, slowly.
Audio intent: hush.
Audio-coupled idea: none (intentional quiet).
Transition mood: slow crossfade → Scene 8

### Scene 8 — Screening you can trace — 6s
The Zaal mark and the ZehenSync wordmark settle centre. "Screening you can trace" writes out in Newsreader, and the saffron nuqta lands as its full stop. The Urdu line ذہن کی بات، ثبوت کے ساتھ appears beneath in neel 300. Hold 2 s. Fade out.
Sequential/interaction: yes — line write, nuqta drop.
Audio intent: resolved, warm.
Audio-coupled idea: nuqta landing hit on a strong cue if one falls near.
Transition mood: fade to night

Scene durations: 5 + 6 + 9 + 7 + 10 + 6 + 5 + 6 = 54 s

**Music mood for this video:** calm, warm, quietly confident
**Audio summary:** silence opens into a soft bed, the voice leads throughout, sparse tactile UI sounds mark the product moments, a hush holds on safety, and it resolves on the lockup.

## Privacy note
All names and data on screen are fictional demo data (Hira M., ZS-7F3K-2Q, Dr. A. Khan). No real people, emails or credentials appear. The crisis numbers are real public helplines.

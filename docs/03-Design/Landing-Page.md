---
tags: [design, marketing, landing]
status: approved 2026-09-29
updated: 2026-09-29
---

# Landing Page

Related: [[Brand-Kit]] · [[Design-System]] · [[PRD]] · code in `apps/landing/`

## Purpose

Win pilot partners (clinics, university counselling centres, psychology departments) and support the FYP defence. Primary CTA **Request a pilot**, secondary **Watch the film**.

## Build

- Static site in `apps/landing/`: `index.html`, `styles.css`, `main.js`, `assets/`. No framework. Deploys to Vercel as-is.
- GSAP + ScrollTrigger for scroll choreography, Lenis for smooth scroll, both from jsDelivr with pinned versions.
- `prefers-reduced-motion`: no pinning, no smooth scroll, opacity-only reveals.
- The page is a brand moment: dark night canvas, light product screens inside laptop mockups. Product motion rules (quiet, no loops on patient screens) still apply inside the mockups.

## Sections

1. **Hero:** "Screening you can *trace*" with the saffron nuqta as the full stop, which lands on load. Tilted laptop with the patient check-in, overlapped by a psychologist flag card. Three proof figures: 1 source behind every flag, 0 webcam frames leave the browser, 100% of scores computed by code.
2. **Problem:** primary care misses over 40% of depression and anxiety cases (AMA, 2023, cited). The blank chat box problem.
3. **Pinned story:** laptop pinned while three scenes swap: guided check-in, flag trace, cited tutor. A saffron nuqta travels a progress rail.
4. **Behavioural signals:** animated eye-aspect-ratio trace with blink markers. Webcam metrics computed in the browser, never uploaded. Markers never flag alone.
5. **Safety:** Hard Stop, two responses, Pakistan crisis resources, never diagnoses.
6. **Three audiences:** editorial list for psychologists, students, people seeking support.
7. **Film:** the `/brag` film with voiceover, full-width player; muted loop as poster.
8. **Built for Pakistan:** Urdu line, Roman Urdu understood, local helplines, neel from ajrak.
9. **Research and team:** UCP BS AI, advisor, team, research question, March 2027 defence.
10. **Pilot CTA + footer:** disclaimer "Screening support, not a diagnosis. In an emergency call 1122."

## Film

Made with `/brag --voice` from the landing page source. About 60 s, music plus Kokoro voiceover, 16:9 MP4. Story: nuqta lands on the Zaal mark, the three app screens in motion, ends on "Screening you can trace."

## Open items

- Pilot request destination: placeholder `mailto:pilot@zehensync.app` until the team picks a real address or form service. The domain is not registered.
- Crisis numbers on the page follow [[Safety-Protocol]] and need the same pre-release phone verification.

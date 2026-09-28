---
tags: [clinical, instruments, scoring]
status: draft-v1
updated: 2026-09-28
---

# Instruments

Related: [[Safety-Protocol]] · [[Backend-Schema#Instrument definition]] · [[PRD#6.2 Patient module]]

Source of truth for items and scoring: `packages/instruments/definitions/*.json`. This page explains choices and licensing. Scoring code must match these bands exactly; the unit tests check every boundary.

## Instrument set

| Code | Name | Items | Scale | Range | Priority | Licence |
|---|---|---|---|---|---|---|
| PHQ9 | Patient Health Questionnaire-9 | 9 | 0 to 3 | 0 to 27 | P0 | Free, no permission needed (Pfizer) |
| GAD7 | Generalized Anxiety Disorder-7 | 7 | 0 to 3 | 0 to 21 | P0 | Free, no permission needed (Pfizer) |
| CSSRS_SCREEN | Columbia Suicide Severity Rating Scale, screener | 6 | yes / no | risk level | P0 | Free for clinical and research use; register with the Columbia Lighthouse Project |
| WHO5 | WHO-5 Well-Being Index | 5 | 0 to 5 | 0 to 100 (raw × 4) | P0 | Free (WHO) |
| ISI | Insomnia Severity Index | 7 | 0 to 4 | 0 to 28 | P1 | Copyright C. Morin; request permission before use |
| PSS10 | Perceived Stress Scale | 10 | 0 to 4 | 0 to 40 | P1 | Free for non-commercial research and education |
| AUDIT | Alcohol Use Disorders Identification Test | 10 | mixed | 0 to 40 | P2 | Free (WHO) |
| DAST10 | Drug Abuse Screening Test | 10 | yes / no | 0 to 10 | P2 | Free for non-commercial use |
| ASRS6 | Adult ADHD Self-Report Scale v1.1, Part A | 6 | 0 to 4 | positive screen count | P2 | Free (WHO) |

Excluded: BDI-II and BAI (commercial, Pearson), PDQ-4+ (licensed), BPRS (clinician-rated, not self-report).

Validated Urdu versions exist for PHQ-9 and GAD-7. We plan to use them when the Urdu UI ships; until then Roman Urdu speakers get the English canonical text with a plain-English rephrase.

## Scoring bands

### PHQ-9

| Score | Band key | Patient wording (summary card) |
|---|---|---|
| 0 to 4 | minimal | "Your answers suggest few signs of low mood right now." |
| 5 to 9 | mild | "Your answers suggest some low mood. Keep an eye on it and check in again in two weeks." |
| 10 to 14 | moderate | "Your answers suggest a noticeable level of low mood. Talking to a counsellor or psychologist could help." |
| 15 to 19 | moderately_severe | "Your answers suggest a high level of low mood. We recommend speaking with a psychologist soon." |
| 20 to 27 | severe | "Your answers suggest a very high level of low mood. Please speak with a psychologist as soon as you can." |

Item 9 has its own rules regardless of total: see [[Safety-Protocol#1. Two responses]].

### GAD-7

| Score | Band key |
|---|---|
| 0 to 4 | minimal |
| 5 to 9 | mild |
| 10 to 14 | moderate |
| 15 to 21 | severe |

A score of 10 or more is the commonly used cut-off for further evaluation.

### WHO-5

Raw sum 0 to 25, multiply by 4 for a 0 to 100 percentage. A percentage of 50 or below suggests poor well-being and prompts a PHQ-9 suggestion. A percentage of 28 or below prompts a PHQ-9 suggestion with stronger wording. A drop of 10 points or more between sessions counts as a meaningful change.

### ISI

| Score | Band key |
|---|---|
| 0 to 7 | no_clinical_insomnia |
| 8 to 14 | subthreshold |
| 15 to 21 | moderate |
| 22 to 28 | severe |

### PSS-10

Items 4, 5, 7 and 8 are reverse-scored (4 minus value). Bands: 0 to 13 low, 14 to 26 moderate, 27 to 40 high.

### C-SSRS screener

| Question | Yes means |
|---|---|
| Q1 Wish to be dead | Safety pathway |
| Q2 Non-specific active suicidal thoughts | Safety pathway |
| Q3 Thoughts with method | Hard Stop |
| Q4 Intent | Hard Stop |
| Q5 Plan | Hard Stop |
| Q6 Suicidal behaviour (lifetime; hard stop if in past 3 months) | Hard Stop if recent, urgent flag if lifetime only |

Q3 to Q5 are asked only if Q2 is yes, per the published screener.

## Rephrasing rules

1. The model receives item text, item intent, timeframe, reading-level target and SDOH summary. It returns one sentence.
2. It must keep timeframe, frequency sense and the symptom. It may not add examples that suggest an answer.
3. An equivalence check below 0.85 falls back to canonical text.
4. Items with `"rephrase": false` always show canonical text.
5. A clinician reviews a sample of 50 rephrasings per instrument before launch (T-2.09).

## Deltas and baselines

- Baseline: rolling mean of the last three completed sessions of the same instrument.
- Rapid-change flag: score rises 5 or more above baseline within 14 days (PHQ-9, GAD-7, PSS-10), or WHO-5 drops 10 or more percentage points.
- A band change upward by two bands in one step raises an `urgent` flag.

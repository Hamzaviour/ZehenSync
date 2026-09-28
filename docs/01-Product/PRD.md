---
tags: [product, prd]
status: draft-v1
updated: 2026-09-28
owners: team
---

# Product Requirements Document

Related: [[App-Flow]] · [[TRD]] · [[RTM]] · [[Phases]]

## 1. Summary

ZehenSync AI is a web platform for mental-health screening support in Pakistan. A patient answers validated questionnaires through clickable options while the AI rephrases each question in plain language. The backend scores the answers with fixed arithmetic. A webcam and microphone add behavioural signals (blink rate, gaze stability, speech pauses). A psychologist sees the results in a triage queue, and every flag links back to the exact answer, message, or signal window that raised it. Psychology students get a separate tutor grounded in the DSM-5-TR and peer-reviewed papers, plus a simulator for practising clinical interviews.

We build this as a Final Year Project at UCP, due for defence in March 2027.

## 2. Problem

1. **The blank-slate problem.** A person with depression or severe anxiety rarely types their symptoms into an empty chat box. Open chat produces noisy data, invites hallucination, and gives a clinician nothing verifiable.
2. **Missed cases.** Routine primary-care visits miss over 40% of depression and anxiety cases (AMA, 2023). Screening depends on the patient bringing it up.
3. **Fragmented tools.** Eye-tracking, voice biomarkers and CBT chatbots exist as separate products. None ties behavioural signals to a clinical instrument a psychologist already trusts.
4. **Black-box AI.** A clinician cannot act on "the model thinks this person is at risk". They need the source.
5. **Student tutors hallucinate.** General LLMs invent citations. In psychology education a wrong fact is a failure, not a quirk.

## 3. Goals and non-goals

### Goals (FYP scope)

| ID | Goal | Measure |
|---|---|---|
| G1 | Structured, traceable patient screening | Every score reproducible from stored answers; 100% scoring unit-test pass |
| G2 | Safe patient interaction | Hard Stop fires on 100% of the golden crisis set; zero LLM text reaches the patient after a trigger |
| G3 | Clinician trust through traceability | Every flag shows at least one source event with timestamp |
| G4 | Grounded scholar answers | Every factual sentence carries a citation or the tutor refuses; citation precision at least 90% on the eval set |
| G5 | Behavioural signal extraction on a normal webcam | Blink detection F1 at least 0.85 against hand-labelled clips under good lighting |
| G6 | Research contribution | Correlation analysis of vision and speech markers against PHQ-9 and GAD-7 on a consented sample |
| G7 | Lower documentation load | Clinical export generated in under 5 seconds from a completed session |

### Non-goals

- Diagnosis, diagnostic labels shown to patients, prescriptions, medication advice, or treatment.
- Emergency care. The Hard Stop hands off to humans; it does not manage the crisis.
- Marketplace features: booking, payments, escrow wallets, telehealth video rooms. Planned after the FYP ([[Phases#Post-FYP]]).
- Native mobile apps. The FYP ships desktop web only.
- Urdu script UI. The FYP ships English UI; the counselor and the crisis lexicon understand Roman Urdu. Urdu script comes after the FYP.
- Insurance, EHR, or government health portal integration.

## 4. Users

| Role | Who | What they need from us |
|---|---|---|
| Patient | Adults (18+) seeking support: university students, clinic walk-ins, people in routine check-ups | A calm, guided way to describe how they feel without facing an empty box. Plain-language results. Immediate help in a crisis. |
| Psychologist | Licensed clinical psychologists, university counsellors, diagnostic-centre staff | A queue sorted by urgency, evidence behind every flag, change over time, exports that replace manual notes. |
| Scholar | Psychology undergraduates, postgraduates, researchers, faculty | Answers they can cite, a tutor that adapts to their level, safe interview practice. |
| Admin | The team, later a clinic or department administrator | Verify psychologists, manage the corpus, read audit logs, check system health. |

Minors: the FYP excludes users under 18. Signup asks for birth year and blocks under-18 with a referral message. Adolescent instruments and guardian consent come after the FYP.

## 5. Product principles

1. **Guided volition.** The system leads with a structured question and finite choices. Free text supplements; it never replaces.
2. **Deterministic scoring.** The LLM may reword a question. It never computes, guesses, or adjusts a score.
3. **Every conclusion has a source.** Flags, report lines and tutor claims all carry source IDs.
4. **Context before scores.** Social determinants (money, housing, workload, family) frame every interpretation so environmental stress does not read as disorder.
5. **Safety overrides everything.** A crisis signal stops generation and hands the person to humans.
6. **Separate worlds.** Patient data never reaches the scholar side. Simulated patients come from textbook material only.
7. **Consent per capability.** Webcam metrics, voice processing, research recording and clinician sharing each need their own opt-in, and each can be revoked.

## 6. Features

Priority: **P0** must ship for defence, **P1** should ship, **P2** stretch.

### 6.1 Platform

| ID | Feature | Pri |
|---|---|---|
| F-PL-01 | Email and password signup with role fork: "I'm looking for support" (patient) or "I'm a student or researcher" (scholar) | P0 |
| F-PL-02 | Psychologist signup with licence or institutional ID; admin verifies before access | P0 |
| F-PL-03 | Role-based access control enforced in API and database | P0 |
| F-PL-04 | Consent centre: grant and revoke each consent type, see version and date | P0 |
| F-PL-05 | Append-only audit log for data access and changes | P0 |
| F-PL-06 | TOTP two-factor auth, required for psychologists and admins | P1 |
| F-PL-07 | Account deletion with data export (patient right to leave) | P1 |

### 6.2 Patient module

| ID | Feature | Pri |
|---|---|---|
| F-PT-01 | First-run consent and disclaimer: "screening tool, not a diagnosis, not a replacement for a professional" | P0 |
| F-PT-02 | SDOH intake, one time, conversational pacing, clickable answers: finances, living situation, family, academic or work load, sleep schedule, support network | P0 |
| F-PT-03 | Screening hub with instruments: PHQ-9, GAD-7, C-SSRS screener, WHO-5 (P0); ISI, PSS-10 (P1); AUDIT, DAST-10, ASRS (P2) | P0 |
| F-PT-04 | AI rephrasing of each item for reading level and context; canonical text always one tap away ("show original wording") | P0 |
| F-PT-05 | Fixed answer buttons per instrument scale; optional short free-text note per item | P0 |
| F-PT-06 | Counselor chat, text: CBT techniques, reflective listening, motivational interviewing; no advice on medication or diagnosis | P0 |
| F-PT-07 | Counselor trigger routing: suggests a relevant instrument when conversation signals it; patient accepts or declines | P0 |
| F-PT-08 | Counselor chat, voice input (push to talk), transcript shown before sending | P1 |
| F-PT-09 | Live webcam behavioural metrics during screening and chat (browser-side, opt-in) | P1 |
| F-PT-10 | Plain-language result after each instrument, with next-step suggestion | P0 |
| F-PT-11 | Personal timeline: scores over time, sessions, notes | P0 |
| F-PT-12 | Share with a psychologist via invite code, choose scopes, revoke any time | P0 |
| F-PT-13 | Guided CBT exercises: thought record, behavioural activation planner, PMR audio | P2 |

### 6.3 Safety

| ID | Feature | Pri |
|---|---|---|
| F-SF-01 | Crisis detectors on every patient input: lexicon (English and Roman Urdu), risk classifier, instrument item rules | P0 |
| F-SF-02 | Hard Stop: abort generation, lock UI into crisis screen with Pakistan resources, call links, exit button | P0 |
| F-SF-03 | Linked psychologist alert within 60 seconds of a crisis event | P0 |
| F-SF-04 | Psychosis-aware responses: empathetic neutrality, never confirm or argue with delusional content, recommend professional contact | P0 |
| F-SF-05 | Output guard on every LLM response: blocks diagnostic labels, medication advice, deterministic predictions | P0 |

Full specification: [[Safety-Protocol]].

### 6.4 Psychologist module

| ID | Feature | Pri |
|---|---|---|
| F-CL-01 | Invite code and link management | P0 |
| F-CL-02 | Triage queue sorted by crisis, urgent, rapid change, watch | P0 |
| F-CL-03 | Patient overview: SDOH context, instrument history with baselines and deltas, open flags | P0 |
| F-CL-04 | Flag trace view: click a flag, see each source event with timestamp, raw value, displayed wording | P0 |
| F-CL-05 | Clinical export: PDF and JSON, hard data only | P0 |
| F-CL-06 | Flag review actions: acknowledge, resolve, add note | P0 |
| F-CL-07 | Behavioural marker panel with quality indicators per window | P1 |
| F-CL-08 | AI clinical assistant: cited answers about DSM criteria and the patient's own data; never outputs a diagnosis | P1 |
| F-CL-09 | Anonymised cohort view (aggregate trends, pseudonymous IDs) for department use | P2 |

### 6.5 Scholar module

| ID | Feature | Pri |
|---|---|---|
| F-SC-01 | Tier 1 RAG over the local corpus (DSM-5-TR, textbooks, guidelines) with inline citations | P0 |
| F-SC-02 | Reference sidebar: click `[n]` to see the exact passage, page and source | P0 |
| F-SC-03 | Refusal when retrieval finds no supporting evidence | P0 |
| F-SC-04 | Tier 2 academic search: arXiv, PubMed, Semantic Scholar | P1 |
| F-SC-05 | Tier 3 web search limited to .edu, .gov, WHO, and named professional bodies | P2 |
| F-SC-06 | Learner profile: level, focus areas, weak spots, preferred style; adapts tutor persona | P1 |
| F-SC-07 | Simulator lab: interview a synthetic patient built from a textbook vignette, then get a debrief against criteria | P1 |
| F-SC-08 | Paper upload and summary (methodology, sample, findings, limits) | P2 |

### 6.6 Behavioural engines

| ID | Feature | Pri |
|---|---|---|
| F-BE-01 | Browser vision metrics: blink rate, eye aspect ratio, gaze stability, fixation count, head pose, face-present ratio, lighting score | P1 |
| F-BE-02 | Quality gate: windows with poor light, no face or heavy motion get marked unusable and never feed a flag | P0 (with F-BE-01) |
| F-BE-03 | Speech features: speech rate, pause count and length, filler rate, pitch mean and variance | P1 |
| F-BE-04 | Research recording (separate consent): server-side YOLO v12 face tracking and ViT gaze for model comparison | P1 |
| F-BE-05 | Fusion summary in clinical export: markers shown next to instrument scores, with population ranges and quality | P1 |

Behavioural markers never raise a clinical flag alone in the FYP. They appear as context next to instrument scores. [[Decisions#ADR-007]] explains why.

### 6.7 Profiling engine

| ID | Feature | Pri |
|---|---|---|
| F-PR-01 | After each session a background profiler writes a JSON patch to the user's profile | P0 |
| F-PR-02 | Patient profile tracks recurring themes, instrument baselines, rolling averages, suggested next instrument | P0 |
| F-PR-03 | Scholar profile tracks topics, gaps, clarification rate, level | P1 |
| F-PR-04 | Every patch is stored, reversible and shown to the psychologist as "what changed" | P1 |

### 6.8 Reports

| ID | Feature | Pri |
|---|---|---|
| F-RP-01 | Patient summary: compassionate plain language, no raw severity labels, next steps | P0 |
| F-RP-02 | Clinical export PDF and JSON: scores, item answers, trace chain, SDOH risk factors, flagged transcript lines, marker summary | P0 |
| F-RP-03 | Each report stores a content hash and the IDs of every source session | P0 |

## 7. User stories

Format: As a (role), I want (capability), so that (outcome). Points on the Fibonacci scale. Acceptance criteria live in [[RTM]].

| ID | Story | Pts |
|---|---|---|
| US-01 | As a patient, I want to choose "I'm looking for support" at signup, so that I land in a space built for me. | 2 |
| US-02 | As a patient, I want the intake to ask me one thing at a time with buttons, so that I don't have to write about my life from scratch. | 5 |
| US-03 | As a patient, I want questions worded simply, so that I understand what they ask. | 5 |
| US-04 | As a patient, I want to see the original question wording, so that I know the rewording didn't change the meaning. | 2 |
| US-05 | As a patient, I want a plain explanation after a questionnaire, so that I know what my answers suggest and what to do next. | 3 |
| US-06 | As a patient, I want to talk or type to a counselor, so that I can explore how I feel between questionnaires. | 8 |
| US-07 | As a patient in crisis, I want immediate phone numbers and a way to reach someone, so that I get real help now. | 5 |
| US-08 | As a patient, I want to share my results with my psychologist and stop sharing whenever I choose, so that I stay in control. | 5 |
| US-09 | As a patient, I want to see my scores over weeks, so that I notice change. | 3 |
| US-10 | As a patient, I want to turn the camera and microphone on or off per session, so that I decide what the system observes. | 3 |
| US-11 | As a psychologist, I want a queue ordered by urgency, so that I see the person who needs me first. | 5 |
| US-12 | As a psychologist, I want to click a flag and see the exact answers and messages behind it, so that I can verify before acting. | 8 |
| US-13 | As a psychologist, I want change from baseline highlighted, so that a jump from 4 to 12 stands out even when 12 alone looks moderate. | 3 |
| US-14 | As a psychologist, I want a PDF export of hard data, so that I stop writing session notes by hand. | 5 |
| US-15 | As a psychologist, I want an alert when a linked patient hits a crisis, so that I can follow up the same day. | 3 |
| US-16 | As a psychologist, I want behavioural markers shown with their quality, so that I don't over-read a dark, blurry session. | 5 |
| US-17 | As a student, I want answers cited to the DSM-5-TR page, so that I can quote them in my work. | 8 |
| US-18 | As a student, I want the tutor to say when it doesn't know, so that I never study an invented fact. | 3 |
| US-19 | As a student, I want the tutor to match my level, so that first-year basics and research depth both work. | 5 |
| US-20 | As a student, I want to interview a simulated patient and get feedback, so that I practise without risk to a real person. | 8 |
| US-21 | As a researcher, I want recent papers pulled into answers, so that I'm not limited to the textbook. | 5 |
| US-22 | As a researcher, I want to upload a paper and get its methodology summarised, so that I review literature faster. | 5 |
| US-23 | As an admin, I want to verify psychologist accounts, so that only licensed people see patient data. | 3 |
| US-24 | As an admin, I want to add and re-index corpus documents, so that the tutor stays current. | 5 |
| US-25 | As an admin, I want an audit log of who viewed what, so that we can prove privacy compliance. | 3 |

## 8. Success metrics

| Metric | Target | How we measure |
|---|---|---|
| Scoring correctness | 100% unit and property tests pass | pytest plus Hypothesis on every instrument |
| Crisis recall | 100% on golden set (at least 300 phrases, English and Roman Urdu) | Safety eval suite in CI |
| Crisis false-positive rate | Under 5% on a benign set of at least 500 phrases | Same suite |
| Questionnaire scoring latency | p95 under 2 s under 50 concurrent users | k6 load test |
| Counselor time to first token | p95 under 1.5 s | API timing logs |
| Tutor citation precision | At least 90% of citations support their claim (human-rated sample of 100) | Scholar eval |
| Tutor refusal correctness | At least 95% refusal on out-of-corpus questions set | Scholar eval |
| Blink detection | F1 at least 0.85 on labelled clips, good lighting | Vision eval |
| Export time | Under 5 s | API timing logs |
| Traceability | 100% requirements mapped in RTM, zero orphans | RTM review each phase |

## 9. Constraints and assumptions

- **Hardware:** patients use a laptop or desktop with a 720p webcam and a microphone. Metrics degrade in dim light; the quality gate handles that.
- **Connectivity:** 2 Mbps or better for voice clips. Vision metrics run in the browser, so video never needs upload.
- **Compute:** development on Windows 11 with WSL2. GPU work (fine-tuning, research video pipeline) on a rented GPU VM or Colab. The live product needs no GPU at FYP scale.
- **LLM:** hosted API first, behind a provider interface; fine-tuned Gemma 3 or Qwen 3 swaps in later ([[Decisions#ADR-003]]).
- **Corpus licensing:** the DSM-5-TR is copyrighted. We ingest a legitimately owned copy for closed, educational use inside the team's deployment, show short passages as citations, and never expose bulk text. Faculty must confirm this before the corpus goes live.
- **Instrument licensing:** PHQ-9, GAD-7, WHO-5, PSS-10, AUDIT, DAST-10 and ASRS allow free use. ISI and C-SSRS need permission or registration. BDI-II and BAI are commercial and excluded. See [[Instruments]].
- **Ethics:** the research study (G6) needs approval from the UCP ethics committee before we record any participant.
- **Team:** three students over roughly 23 weeks alongside coursework.

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Hard Stop misses a crisis phrased indirectly | Severe | Three independent detectors, golden set grows every sprint, clinician alert, patient can always open the crisis screen from the header |
| Rephrased question changes meaning | High | Rephrase prompt pinned per item, semantic-equivalence check against canonical text, canonical wording one tap away, rephrasing cached and reviewed |
| Ethics approval late | High | Submit in October; product features do not depend on the study |
| Poor webcam data | Medium | Quality gate, markers never flag alone |
| LLM cost overrun | Medium | Small model for rephrase and profiler, caching, per-user rate limits |
| DSM licensing objection | Medium | Fall back to open sources (ICD-11 CDDR, NICE guidelines, open textbooks) with the same pipeline |
| Scope creep toward marketplace | Medium | Marketplace stays in the post-FYP list |

## 11. Open questions

1. Which clinic or department will pilot the psychologist module? (Needed by Phase 6.)
2. Will Ma'am Sana Zaheer or another clinician review the rephrase prompts and crisis lexicon? (Needed by Phase 3.)
3. University evaluation dates for FYP-1 and FYP-2 midterms. (Adjust [[Phases]] once known.)

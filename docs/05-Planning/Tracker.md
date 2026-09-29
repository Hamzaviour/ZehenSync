---
tags: [planning, tracker]
updated: 2026-09-28
---

# Tracker

Related: [[Phases]] · [[RTM]] · [[Rules#Engineering]]

Source of truth for task status. Format per line: `- [x] T-phase.nn Title · reqs · points`. Branch name: `feat/T-2.04-short-name`. Status markers: `[ ]` todo, `[/]` in progress, `[x]` done, `[-]` dropped (say why).

Points use the Fibonacci scale (1, 2, 3, 5, 8). One point is roughly half a day for one person.

## P0 · Docs, brand, repo

- [x] T-0.01 Read and reconcile all source documents · — · 3
- [x] T-0.02 PRD, TRD, App Flow, Backend Schema, API, Design System · — · 8
- [x] T-0.03 Rules, Phases, Tracker, RTM, Memory, Decisions · — · 5
- [x] T-0.04 Brand kit, logo concepts, final mark, tokens, custom icons · — · 5
- [ ] T-0.05 Team and advisor review of PRD, App Flow, Rules · — · 2
- [ ] T-0.06 Monorepo skeleton (apps/web, apps/api, packages/*), README, .editorconfig · — · 2
- [ ] T-0.07 GitHub repo, branch protection, PR template with RTM checkbox · — · 1
- [x] T-0.08 Brand v2: Zaal mark, outlined wordmark, tokens, icons, brand deck with laptop mockups · — · 5
- [ ] T-0.09 Export PNG set and favicon.ico from the v2 SVGs · — · 1
- [x] T-0.10 Landing page (apps/landing) and 55 s voiced launch film (brag-output) · — · 8
- [ ] T-0.11 Real pilot contact address or form for the landing page · — · 1

## P1 · Foundation

- [ ] T-1.01 docker-compose: Postgres 16 + pgvector, Redis 7, MinIO · — · 2
- [ ] T-1.02 FastAPI skeleton with module layout, settings, structlog, error shape · — · 3
- [ ] T-1.03 Alembic baseline: five schemas, enums, core tables · F-PL-03 · 3
- [ ] T-1.04 DB login roles per pool and RLS policies with tests · F-PL-03 · 5
- [ ] T-1.05 Auth: signup fork, login, Argon2id, JWT + rotating refresh · F-PL-01, US-01 · 5
- [ ] T-1.06 Clinician signup with proof upload and admin verification · F-PL-02, US-23 · 3
- [ ] T-1.07 TOTP 2FA for clinician and admin · F-PL-06 · 3
- [ ] T-1.08 Consent centre API + UI · F-PL-04, F-PT-01 · 3
- [ ] T-1.09 Audit log with hash chain and verifier · F-PL-05, US-25 · 3
- [ ] T-1.10 packages/tokens from Brand-Kit; Tailwind 4 theme · — · 2
- [ ] T-1.11 Restyled component base (Button, Input, Dialog, Table, Tabs, Toast) · — · 5
- [ ] T-1.12 App shell per role with sidebar and top bar · — · 3
- [ ] T-1.13 OpenAPI to TS client and zod generation · — · 2
- [ ] T-1.14 CI: ruff, mypy, pytest, eslint, tsc, vitest, build · — · 2
- [ ] T-1.15 Under-18 block and referral page · PRD §4 · 1

## P2 · Screening engine

- [ ] T-2.01 Instrument JSON schema and loader with checksum · F-PT-03 · 3
- [ ] T-2.02 PHQ-9, GAD-7, WHO-5, C-SSRS screener definitions · F-PT-03 · 3
- [ ] T-2.03 Scoring functions + Hypothesis boundary tests (100%) · G1 · 5
- [ ] T-2.04 SDOH intake form definition, API, one-question UI, risk factor rules · F-PT-02, US-02 · 5
- [ ] T-2.05 Screening session API: start, next, answer, complete, abandon · F-PT-05 · 5
- [ ] T-2.06 Rephrase + equivalence pipeline with cache and fallback · F-PT-04, US-03 · 5
- [ ] T-2.07 Check-in runner UI with keyboard support and "show original wording" · F-PT-04, F-PT-05, US-04 · 5
- [ ] T-2.08 Trace events on every answer; flag engine with sources · G3 · 5
- [ ] T-2.09 Clinician review of 50 rephrasings per instrument · F-PT-04 · 2
- [ ] T-2.10 Result view with band bar and next steps · F-PT-10, US-05 · 3
- [ ] T-2.11 Timeline view (visx) · F-PT-11, US-09 · 3
- [ ] T-2.12 Risk rules hook to safety stub · F-SF-01 · 2
- [ ] T-2.13 k6 load test for check-in flow · NFR latency · 2
- [ ] T-2.14 Request ISI and C-SSRS permissions / registration · Instruments · 1

## P3 · Safety Hard Stop

- [ ] T-3.01 Lexicon v1 (en + roman-ur) with normaliser and negation window · F-SF-01 · 5
- [ ] T-3.02 Golden crisis set (≥300) and benign set (≥500) · G2 · 5
- [ ] T-3.03 Risk classifier fine-tune, ONNX export, thresholds · F-SF-01 · 8
- [ ] T-3.04 Safety service: pathway vs hard stop decision, crisis events · F-SF-02 · 3
- [ ] T-3.05 Crisis screen, global lock, "Get help now" in header · F-SF-02, US-07 · 5
- [ ] T-3.06 Psychologist alert job (in-app + email) · F-SF-03, US-15 · 3
- [ ] T-3.07 Output guard library (diagnosis, medication, certainty) · F-SF-05 · 3
- [ ] T-3.08 Safety eval in CI, blocks merge · G2 · 2
- [ ] T-3.09 Admin safety dashboard · F-SF-03 · 2
- [ ] T-3.10 Clinician sign-off on lexicon, crisis screen, psychosis responses · F-SF-04 · 1
- [ ] T-3.11 Call and verify every helpline number; record date · Safety-Protocol · 1

## P4 · Counselor and profiler

- [ ] T-4.01 LLM gateway: provider interface, Anthropic + OpenRouter, cost limits, PII scrub · TRD §8 · 5
- [ ] T-4.02 Counselor prompt v1 (CBT, MI, reflective listening, psychosis neutrality) · F-PT-06, F-SF-04 · 3
- [ ] T-4.03 SSE streaming by sentence through output guard · F-PT-06 · 5
- [ ] T-4.04 Chat UI with composer, context strip, end-chat note · F-PT-06, US-06 · 5
- [ ] T-4.05 suggest_instrument tool and inline card · F-PT-07 · 3
- [ ] T-4.06 Voice input: record, upload, transcribe, confirm · F-PT-08 · 5
- [ ] T-4.07 Profiler worker with schema-validated patches · F-PR-01, F-PR-02 · 5
- [ ] T-4.08 Rapid-delta and band-jump rules · US-13 · 2
- [ ] T-4.09 Home suggestions from profile · F-PT-03 · 2
- [ ] T-4.10 Counselor behaviour eval (40 cases) · F-SF-05 · 3
- [ ] T-4.11 Research capture kit v0: consent flow, recorder, resumable upload · F-BE-04 · 5

## P5 · Scholar

- [ ] T-5.01 Corpus ingestion: PDF parse, heading-aware chunking, page mapping · F-SC-01, US-24 · 5
- [ ] T-5.02 bge-m3 embeddings worker, HNSW index · F-SC-01 · 3
- [ ] T-5.03 Hybrid search (vector + FTS, RRF) and reranker · F-SC-01 · 5
- [ ] T-5.04 Cited generation and citation verifier · F-SC-01, US-17 · 5
- [ ] T-5.05 Refusal logic and copy · F-SC-03, US-18 · 2
- [ ] T-5.06 Tutor UI with reference sidebar and "How I found this" · F-SC-02 · 5
- [ ] T-5.07 Tier 2: arXiv, PubMed, Semantic Scholar clients with cache · F-SC-04, US-21 · 5
- [ ] T-5.08 Learner profile and persona levels · F-SC-06, F-PR-03, US-19 · 3
- [ ] T-5.09 Simulator: case schema, 5 cases, in-character model · F-SC-07, US-20 · 5
- [ ] T-5.10 Simulator debrief rubric with citations · F-SC-07 · 3
- [ ] T-5.11 Scholar eval set (citation precision, refusal) · G4 · 3
- [ ] T-5.12 Admin corpus manager UI · US-24 · 2

## P6 · Psychologist module

- [ ] T-6.01 Invite codes and link API with scopes and revoke · F-CL-01, F-PT-12, US-08 · 3
- [ ] T-6.02 Patient sharing UI · F-PT-12 · 3
- [ ] T-6.03 Triage queue · F-CL-02, US-11 · 5
- [ ] T-6.04 Patient overview tabs · F-CL-03 · 5
- [ ] T-6.05 Flag trace view · F-CL-04, US-12 · 8
- [ ] T-6.06 Flag reviews and notes · F-CL-06 · 3
- [ ] T-6.07 Clinical export PDF + JSON (WeasyPrint) · F-CL-05, F-RP-02, US-14 · 5
- [ ] T-6.08 Patient summary report · F-RP-01 · 3
- [ ] T-6.09 Alerts inbox · F-SF-03 · 2
- [ ] T-6.10 Clinician assistant (cited, no diagnosis) · F-CL-08 · 5

## P7 · Speech engine

- [ ] T-7.01 faster-whisper worker with word timestamps · F-BE-03 · 3
- [ ] T-7.02 Pause, rate, filler features (en + roman-ur fillers) · F-BE-03 · 3
- [ ] T-7.03 Pitch, jitter, shimmer via parselmouth · F-BE-03 · 2
- [ ] T-7.04 Audio quality checks and deletion job · Rules privacy 5 · 2
- [ ] T-7.05 Speech marker panel for psychologists · F-CL-07, US-16 · 3
- [ ] T-7.06 Manual annotation of 30 clips and accuracy check · F-BE-03 · 3
- [ ] T-7.07 Whisper code-switching benchmark · TRD §12 · 2

## P8 · Vision engine

- [ ] T-8.01 MediaPipe Face Landmarker in Web Worker · F-BE-01 · 5
- [ ] T-8.02 Calibration step UI · F-BE-01 · 2
- [ ] T-8.03 EAR blink detection, iris gaze, fixations, head pose · F-BE-01 · 5
- [ ] T-8.04 Quality gate and window batching · F-BE-02 · 3
- [ ] T-8.05 Camera consent and capture indicator · US-10 · 2
- [ ] T-8.06 Vision marker panel for psychologists · F-CL-07, US-16 · 3
- [ ] T-8.07 Labelled blink and gaze clip set · G5 · 3
- [ ] T-8.08 Research pipeline: YOLO v12 face, ViT gaze · F-BE-04 · 8
- [ ] T-8.09 CNN vs ViT blink comparison · G6 · 5

## P9 · Fusion, reports, fine-tune

- [ ] T-9.01 Fusion section in clinical export · F-BE-05, F-RP-02 · 3
- [ ] T-9.02 Psyche-Corpus build (instruction pairs from corpus, cleaned) · G4 · 5
- [ ] T-9.03 QLoRA fine-tune Gemma 3 or Qwen 3 · — · 8
- [ ] T-9.04 vLLM provider and per-task routing config · TRD §8 · 3
- [ ] T-9.05 Benchmark fine-tuned vs API on scholar and counselor evals · — · 3

## P10 · Validation, deploy, defence

- [ ] T-10.01 Correlation analysis markers vs PHQ-9 / GAD-7 · G6 · 5
- [ ] T-10.02 Security pass: ZAP, pip-audit, pnpm audit, ASVS checklist · NFR security · 3
- [ ] T-10.03 Production deploy and backups · — · 3
- [ ] T-10.04 Demo seed data (synthetic) · Rules clinical 10 · 2
- [ ] T-10.05 RTM final review, zero orphans · G1 to G7 · 2
- [ ] T-10.06 Thesis chapters · — · 8
- [ ] T-10.07 Defence deck on brand kit, two rehearsals · — · 3

## Research track

- [ ] R-01 Ethics committee application submitted · G6 · 3
- [ ] R-02 Ethics approval received · G6 · —
- [ ] R-03 Participant consent form and information sheet · G6 · 2
- [ ] R-04 Recruit participants via UCP Clinical Psychology Department · G6 · 3
- [ ] R-05 Data collection sessions complete · G6 · 8

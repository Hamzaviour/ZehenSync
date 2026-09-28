---
tags: [planning, traceability, rtm]
updated: 2026-09-28
---

# Requirements Traceability Matrix

Related: [[PRD]] · [[Tracker]] · [[TRD#10. Testing strategy]]

Forward: requirement to story, task, and test. Backward: every test ID and defect names a requirement ID. Pass threshold: 100% of P0 requirements mapped, zero orphans.

Test ID prefixes: `TC-U` unit, `TC-I` integration, `TC-E` end-to-end, `TC-S` safety eval, `TC-L` load, `TC-V` model evaluation.

| Req | Story | Tasks | Acceptance criteria | Tests | Status |
|---|---|---|---|---|---|
| F-PL-01 | US-01 | T-1.05 | Choosing "looking for support" creates role `patient` and routes to consent; "student or researcher" creates `scholar` | TC-E-001 | todo |
| F-PL-02 | US-23 | T-1.06 | Clinician cannot load any `/clinician/*` route until admin approves; approval generates invite code | TC-I-002, TC-E-002 | todo |
| F-PL-03 | — | T-1.03, T-1.04 | `zs_scholar_app` SELECT on any `patient.*` table raises permission error; patient A cannot read patient B rows | TC-I-003, TC-I-004 | todo |
| F-PL-04 | — | T-1.08 | Granting and revoking each consent type updates `/me`; revoking `webcam_metrics` stops capture next session | TC-I-005 | todo |
| F-PL-05 | US-25 | T-1.09 | Every clinician read writes an event; UPDATE on `audit.events` fails; chain verifier detects a tampered row | TC-I-006, TC-U-007 | todo |
| F-PL-06 | — | T-1.07 | Clinician without 2FA cannot fetch patient data | TC-I-008 | todo |
| F-PT-01 | — | T-1.08 | Disclaimer shows before first check-in and must be accepted | TC-E-009 | todo |
| F-PT-02 | US-02 | T-2.04 | One question per view; "Prefer not to say" on each; resume after reload; risk factors derived | TC-E-010, TC-U-011 | todo |
| F-PT-03 | — | T-2.01, T-2.02 | Loader rejects a definition whose checksum differs from the DB row | TC-U-012 | todo |
| F-PT-04 | US-03, US-04 | T-2.06, T-2.07, T-2.09 | Equivalence < 0.85 shows canonical; `rephrase:false` items always canonical; original wording toggle works | TC-U-013, TC-E-014, TC-V-015 | todo |
| F-PT-05 | — | T-2.05, T-2.07 | Only scale values accepted; answer stored with both texts and timestamps | TC-I-016 | todo |
| F-PT-06 | US-06 | T-4.02 to T-4.04 | Streaming by sentence; TTFT p95 < 1.5 s | TC-E-017, TC-L-018 | todo |
| F-PT-07 | — | T-4.05 | Suggestion card appears; declining continues chat; accepting starts instrument with `trigger_source=counselor_suggest` | TC-E-019 | todo |
| F-PT-08 | — | T-4.06 | Transcript shown before send; audio deleted after features without research consent | TC-I-020 | todo |
| F-PT-09 | US-10 | T-8.01 to T-8.05 | No capture without click; indicator visible; no frames uploaded | TC-E-021 | todo |
| F-PT-10 | US-05 | T-2.10 | Result wording matches band table in Instruments | TC-U-022 | todo |
| F-PT-11 | US-09 | T-2.11 | Timeline plots each completed session; click opens it | TC-E-023 | todo |
| F-PT-12 | US-08 | T-6.01, T-6.02 | Revoke removes clinician access on next request | TC-I-024 | todo |
| F-SF-01 | — | T-3.01, T-3.03, T-2.12 | Recall 100% golden set; FP < 5% benign set | TC-S-025, TC-S-026 | todo |
| F-SF-02 | US-07 | T-3.04, T-3.05 | Crisis mid-stream: zero AI tokens rendered; crisis screen within 500 ms; lock survives reload | TC-E-027 | todo |
| F-SF-03 | US-15 | T-3.06, T-6.09 | Linked clinician alert within 60 s | TC-I-028 | todo |
| F-SF-04 | — | T-4.02, T-3.10 | Psychosis eval cases: no confirmation, no argument, professional referral present | TC-V-029 | todo |
| F-SF-05 | — | T-3.07, T-4.10 | Guard blocks diagnosis labels, medication dosing, certainty claims in 40-case eval | TC-V-030 | todo |
| F-CL-01 | — | T-6.01 | Rotating invite code invalidates old code for new links | TC-I-031 | todo |
| F-CL-02 | US-11 | T-6.03 | Queue order: crisis, urgent, rapid change, watch, then oldest unreviewed | TC-I-032 | todo |
| F-CL-03 | US-13 | T-6.04, T-4.08 | Delta vs rolling baseline shown; ≥5 rise raises flag | TC-U-033 | todo |
| F-CL-04 | US-12 | T-6.05, T-2.08 | Every flag lists ≥1 source; each source shows timestamp, value, both texts | TC-I-034, TC-E-035 | todo |
| F-CL-05 | US-14 | T-6.07 | PDF + JSON under 5 s; content hash stored; no conversational AI text in export | TC-L-036, TC-U-037 | todo |
| F-CL-06 | — | T-6.06 | Acknowledge, resolve, reopen, comment all audited | TC-I-038 | todo |
| F-CL-07 | US-16 | T-7.05, T-8.06 | Unusable windows hatched and excluded from summaries | TC-E-039 | todo |
| F-SC-01 | US-17 | T-5.01 to T-5.04 | Citation precision ≥ 90% | TC-V-040 | todo |
| F-SC-02 | — | T-5.06 | Clicking [n] shows passage, page, source | TC-E-041 | todo |
| F-SC-03 | US-18 | T-5.05 | Refusal correctness ≥ 95% on out-of-corpus set | TC-V-042 | todo |
| F-SC-04 | US-21 | T-5.07 | Tier 2 used only when Tier 1 below threshold; abstracts cited with URL | TC-I-043 | todo |
| F-SC-06 | US-19 | T-5.08 | Level changes vocabulary, not facts (same citations across levels) | TC-V-044 | todo |
| F-SC-07 | US-20 | T-5.09, T-5.10 | Debrief agrees with human rater on ≥4 of 5 areas | TC-V-045 | todo |
| F-BE-01 | — | T-8.01, T-8.03 | Blink F1 ≥ 0.85; 15 fps mid-range laptop | TC-V-046, TC-L-047 | todo |
| F-BE-02 | — | T-8.04 | Window with face present < 80% gets `quality_ok=false` | TC-U-048 | todo |
| F-BE-03 | — | T-7.01 to T-7.03 | Pause count and rate within 10% of manual | TC-V-049 | todo |
| F-BE-04 | — | T-4.11, T-8.08 | Upload blocked without research consent; recordings expire | TC-I-050 | todo |
| F-PR-01 | — | T-4.07 | Invalid patch rejected, state unchanged, error logged | TC-U-051 | todo |
| F-RP-03 | — | T-6.07 | Report lists every source session ID; hash matches file | TC-U-052 | todo |
| G1 | — | T-2.03 | 100% scoring tests pass | TC-U-053 | todo |

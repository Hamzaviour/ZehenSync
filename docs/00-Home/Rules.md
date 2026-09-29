---
tags: [rules, binding]
updated: 2026-09-28
---

# Rules

These rules bind every contributor, human or AI. A pull request that breaks one gets rejected. Change a rule by editing this page in its own pull request with a reason, and record the change in [[Decisions]].

## Clinical safety

1. The system never diagnoses. No UI string, report, or LLM output tells a patient they have a disorder.
2. Scores come from code in `packages/instruments`, never from an LLM. No LLM output may write to `total_score`, `severity_band`, or `flags`.
3. Items that touch self-harm or suicide (`"rephrase": false`) always show canonical text.
4. Every flag has at least one row in `flag_sources`. A flag without a source is a bug.
5. The crisis check runs before any LLM call on patient input. No exceptions for "short" or "obviously fine" messages.
6. After a Hard Stop, no AI-generated text renders to the patient in that session.
7. Crisis phone numbers change only through a pull request that updates [[Safety-Protocol]] and the resources unit test together.
8. Behavioural markers never raise a flag on their own ([[Decisions#ADR-007]]).
9. The crisis lexicon, rephrase prompts, and counselor system prompt need clinician review before each release.
10. No real patient data in development, tests, prompts, screenshots, or demos. Use the synthetic seed set.

## Privacy and data

1. Scholar code never imports from `modules/patient`, `modules/screening`, `modules/counselor` or `modules/clinician`, and runs on the `zs_scholar_app` DB role.
2. Every clinician read of patient data writes an audit event.
3. Encrypt chat content, notes, transcripts and free-text answers at the application layer (`_enc` columns).
4. Scrub names, phone numbers and CNIC numbers before any text goes to a third-party LLM API.
5. Voice audio gets deleted after feature extraction unless research consent exists.
6. Raw webcam video never leaves the browser without `research_recording` consent.
7. Logs carry IDs, never content. No message text, answers, or transcripts in logs or Sentry.
8. Secrets live in environment variables or the secret manager, never in the repo.

## Engineering

1. Modules talk through `service.py` interfaces. No cross-module model imports.
2. Every endpoint has a Pydantic request and response schema. No untyped dicts across the API boundary.
3. Every prompt lives in `llm/prompts/` with an ID and version; outputs store both.
4. Scoring functions stay pure (no I/O) and ship with boundary tests for every band.
5. Tests first for scoring, safety, permissions and trace logic.
6. The safety eval and scoring tests block merge on failure.
7. Migrations only through Alembic. No manual schema edits on staging or prod.
8. One branch per phase (`phase/p1-foundation`, `phase/p2-screening`, ...), one commit per tracker task on it; commit messages start with the task ID (`T-1.05 auth: ...`). A phase merges into `main` only after its exit check passes, then gets a tag (`v0.2.0` for P1).
13. Every commit is authored and committed by Hamza Younas <hamzavelous@gmail.com>. No AI co-author trailers or attribution lines in commits, PRs or code.
9. Every pull request updates [[Tracker]] and, when a requirement changes, [[RTM]].
10. Keep files under roughly 400 lines. A larger file means the module needs splitting.
11. Pin dependency versions. Run `pip-audit` and `pnpm audit` before each release.
12. Match surrounding code: naming, comment density, idioms. No speculative abstractions.

## Design and writing

1. Use tokens from `packages/tokens` (source: [[Brand-Kit]]). No raw hex values in components.
2. Patients never see severity colours, raw band labels like "severe depression", or scores without an explanation.
3. Colour never carries meaning alone. Pair it with a label or shape.
4. Follow the voice table and banned-word list in [[Brand-Kit#Voice and tone]].
5. Pass the [[Brand-Kit#Anti-slop checklist]] before a screen ships.
6. Sentence case everywhere. Buttons name the action.
7. Docs and UI copy: no em dashes, no filler adverbs, active voice, specific nouns.

## Working with AI assistants

1. Read [[Memory]] and this page before starting work.
2. Do not invent requirements. If a doc doesn't answer the question, ask the team or add it to the open questions in [[PRD#11. Open questions]].
3. Update [[Memory]] when a decision, blocker or status changes.
4. Never mark a tracker task done without its acceptance check passing.

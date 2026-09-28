---
tags: [memory, status]
updated: 2026-09-28
---

# Memory

The current state of the project on one page. Update it when a decision, blocker or phase status changes. Keep it short; history lives in [[Decisions]] and git.

## Now

- **Phase:** P0 Docs, brand, repo (28 Sep to 4 Oct 2026).
- **Done:** vault written, brand kit and logo drafted, source documents reconciled.
- **Next:** team and advisor review (T-0.05), monorepo skeleton (T-0.06), GitHub setup (T-0.07).
- **Blockers:** none.
- **Live tracker:** https://claude.ai/artifact/HQtuNNJS27Q1DwxLvzSdVs (status in its db collection `status`, keyed by task ID). Keep in sync with [[Tracker]].

## Key facts

- Product: ZehenSync AI, screening support for patients, psychologists, psychology students. Never diagnoses.
- FYP at UCP Lahore, BS AI. Team: Ch Hamza Younas, Syed Raza Abbas Zaidi, Sher Ali Saleem. Advisor: Iqra Tariq. Clinical reference: Ma'am Sana Zaheer.
- Defence: March 2027.
- Stack: Next.js 15 + FastAPI + Postgres 16/pgvector + Redis + arq; Claude API first, fine-tuned Gemma 3 / Qwen 3 later.
- Desktop web only. English UI, Roman Urdu understood.
- Vision in browser (MediaPipe); server YOLO v12 / ViT only for consented research recordings.
- Markers never flag alone. Scores never come from an LLM.
- Brand: calm clinical instrument, lapis `#2E4A7D`, IBM Plex + Source Serif, Sync Z mark.

## Divergences from source documents

| Source said | We decided | Record |
|---|---|---|
| NeuroLens AI | ZehenSync AI | [[Decisions#ADR-011]] |
| ChromaDB | pgvector | [[Decisions#ADR-004]] |
| Clinician sees anonymised data only | Consent-based linking with scopes | [[Decisions#ADR-005]] |
| Marketplace, wallets, telehealth | Post-FYP | [[Decisions#ADR-010]] |
| Single Hard Stop | Safety pathway + Hard Stop | [[Decisions#ADR-012]] |
| Clinician uploads interview video | Live browser capture; research upload with consent | [[Decisions#ADR-006]] |
| ReportLab | WeasyPrint | [[Decisions#ADR-014]] |
| Google Scholar API | Semantic Scholar + PubMed (Google Scholar has no public API) | [[TRD#6. Scholar pipeline]] |

## Open questions

See [[PRD#11. Open questions]].

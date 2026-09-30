---
tags: [memory, status]
updated: 2026-09-30
---

# Memory

The current state of the project on one page. Update it when a decision, blocker or phase status changes. Keep it short; history lives in [[Decisions]] and git.

## Now

- **Phase:** P1 Foundation, on branch `phase/p1-foundation`.
- **Done:** vault, brand v2, landing page and film. P1 plans written (`docs/05-Planning/plans/`).
- **Done (30 Sep):** static, non-operational frontend of every App Flow screen in `apps/web` with synthetic demo data ([[Decisions#ADR-018]]): 50 routes, T-1.10, T-1.12, T-1.16 to T-1.19. Run `pnpm web`, start at `/`.
- **Now:** review the screens with the team (T-0.05). Dialog and Toast components (T-1.11) are open.
- **Crisis numbers:** in `apps/web/lib/crisis/resources.ts`, matched by a test to Safety-Protocol. Still need a call-and-verify pass (T-3.11).
- **Deferred:** P1-A backend plan and the API wiring in P1-B. Picked up after the screens are reviewed.
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
- Brand v2: light clinical editorial. Zaal mark (Kufic ذ with a saffron nuqta), neel `#26318A`, saffron `#E3A33B` only as the nuqta, Newsreader + Schibsted Grotesk + Geist Mono. Light product, dark brand moments. Live deck: https://claude.ai/artifact/NvFw7sUPwHgv4QoLuQ24TU

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

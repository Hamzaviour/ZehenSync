---
tags: [memory, adr, decisions]
updated: 2026-09-28
---

# Decisions

Architecture decision records. Newest at the bottom. Never delete a record; supersede it.

## ADR-001
**Modular monolith with a worker**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** three students, 25 weeks, one deploy target.
**Decision:** one FastAPI service with strict module boundaries, one arq worker, one Postgres, one Redis.
**Consequences:** simple ops. Heavy AI jobs never block requests. Splitting a module out later stays possible because modules talk through service interfaces.

## ADR-002
**Start clean, drop the Customer Insight Portal scaffold**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** the folder held a scaffold and PRD for an unrelated product (customer feedback analytics with Qdrant and MinIO).
**Decision:** team deleted it; the vault replaces it. Source documents moved to `source-docs/`.

## ADR-003
**Hosted LLM API first, fine-tuned model later**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** proposal targets fine-tuned Gemma 3 or Qwen 3. Fine-tuning before the product exists blocks every other feature.
**Decision:** a provider interface from day one. Claude models via API during build; fine-tune in Phase 9 and benchmark. The better model per task wins by config.
**Consequences:** early cost per call; PII scrub needed before API calls; the thesis still gets its fine-tuning contribution.

## ADR-004
**pgvector in Postgres, schema-level separation**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** docs mention ChromaDB; old scaffold used Qdrant. Patient and scholar data must never mix.
**Decision:** one Postgres with pgvector; five schemas; per-module DB login roles; RLS on patient tables.
**Consequences:** separation enforced by the database, not by convention. One fewer service to run.

## ADR-005
**Consent-based patient to psychologist linking**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** the spec says clinicians see anonymised data; the proposal says clinicians forward and prioritise patients, which needs identity.
**Decision:** a patient links to a psychologist by invite code and chooses scopes, including `identity`. Unlinked data stays pseudonymous.

## ADR-006
**Vision runs in the browser by default**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** uploading webcam video of distressed people creates a large privacy and cost burden.
**Decision:** MediaPipe Face Landmarker computes metrics locally; only numbers upload. Research recordings (separate consent) go to a GPU pipeline with YOLO v12 and ViT for the model comparison.
**Consequences:** privacy by default, no GPU in the live product; the research contribution keeps its server pipeline.

## ADR-007
**Behavioural markers never flag alone**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** webcam and voice markers vary with lighting, hardware, culture and neurodiversity. Their link to clinical states is what our study tests; it is not established.
**Decision:** markers appear as context beside instrument scores with quality indicators. No flag uses a marker as its only source during the FYP.
**Consequences:** less "wow" in the demo, far more defensible in front of clinicians and the ethics committee.

## ADR-008
**Desktop web only for the FYP**
**Date:** 2026-09-28 · **Status:** accepted
**Decision:** minimum width 1024 px. Mobile and PWA after the FYP.

## ADR-009
**English UI, Roman Urdu understood**
**Date:** 2026-09-28 · **Status:** accepted
**Decision:** English interface and instruments. The counselor, crisis lexicon and filler detection handle Roman Urdu. Urdu script UI with validated Urdu instruments comes after the FYP.

## ADR-010
**Marketplace deferred**
**Date:** 2026-09-28 · **Status:** accepted
**Context:** the defence deck mentions booking, digital wallets, escrow and telehealth rooms.
**Decision:** out of FYP scope; listed under Post-FYP in [[Phases]].

## ADR-011
**Name is ZehenSync AI**
**Date:** 2026-09-28 · **Status:** accepted
**Decision:** "NeuroLens" in older documents refers to the same project; the name is retired.

## ADR-012
**Two crisis responses, not one**
**Date:** 2026-09-28 · **Status:** accepted, pending clinician review
**Context:** the spec describes a single Hard Stop. Treating every PHQ-9 item 9 answer above zero as an emergency would lock out many people who need a gentler follow-up, and teaches them to under-report.
**Decision:** a safety pathway (pause, C-SSRS screener, resources strip, urgent flag) for moderate signals; Hard Stop for high signals. See [[Safety-Protocol]].

## ADR-013
**Brand: calm clinical instrument, lapis accent, Sync Z mark**
**Date:** 2026-09-28 · **Status:** superseded by ADR-015
**Decision:** paper and ink neutrals, lapis `#2E4A7D` accent, IBM Plex + Source Serif, Sync Z mark (three strands fusing at a node). The maroon from the university decks is not part of the brand. See [[Brand-Kit]].

## ADR-014
**WeasyPrint for PDF instead of ReportLab**
**Date:** 2026-09-28 · **Status:** accepted
**Decision:** render exports from HTML templates so web and PDF share layout and styles.

## ADR-015
**Brand v2: light clinical editorial, Zaal mark**
**Date:** 2026-09-28 · **Status:** accepted, supersedes ADR-013
**Context:** the team rejected v1: the Sync Z mark read as a menu icon, beige paper felt dull, and the kit looked like a document.
**Decision:** a Kufic ذ (first letter of ذہن) with a saffron diamond nuqta, symmetric about its diagonal with 24° nib cuts. Neel `#26318A` brand colour, saffron `#E3A33B` only as the nuqta, clinical white and cool greys. Newsreader (outlined wordmark), Schibsted Grotesk, Geist Mono. Light product, dark brand moments. Concepts B, C and D are kept in `docs/04-Brand/logo/studies/`.
**Consequences:** new tokens, icons and logo files; Design System copy updated; the tracker page restyled. See [[Brand-Kit]].

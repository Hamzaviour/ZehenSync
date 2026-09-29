---
type: community
cohesion: 0.11
members: 20
---

# Instruments, DB Roles and Screening Endpoints

**Cohesion:** 0.11 - loosely connected
**Members:** 20 nodes

## Members
- [[C-SSRS Screener]] - concept - docs/01-Product/PRD.md
- [[Counselor Chat Pipeline]] - concept - docs/02-Engineering/TRD.md
- [[Counselor Endpoints]] - concept - docs/02-Engineering/API.md
- [[DB login roles (zs_patient_app, zs_scholar_app, zs_clinician_app, zs_admin_app)]] - concept - docs/02-Engineering/Backend-Schema.md
- [[GAD-7 Instrument]] - concept - docs/01-Product/PRD.md
- [[Guided Volition_2]] - rationale - docs/01-Product/PRD.md
- [[LLM Gateway]] - concept - docs/02-Engineering/TRD.md
- [[Modular Monolith Architecture]] - rationale - docs/02-Engineering/TRD.md
- [[PHQ-9 Instrument]] - concept - docs/01-Product/PRD.md
- [[Row-Level Security Policy]] - concept - docs/02-Engineering/Backend-Schema.md
- [[Safety Detectors (Lexicon, Classifier, Item Rules)]] - concept - docs/02-Engineering/TRD.md
- [[Scholar Endpoints]] - concept - docs/02-Engineering/API.md
- [[Scholar RAG Pipeline]] - concept - docs/02-Engineering/TRD.md
- [[Screening (Guided Volition) Pipeline]] - concept - docs/02-Engineering/TRD.md
- [[Screening Endpoints]] - concept - docs/02-Engineering/API.md
- [[WHO-5 Instrument]] - concept - docs/01-Product/PRD.md
- [[core.instruments table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[patient.screening_responses table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[patient.screening_sessions table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[scholar.corpus_chunks table]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Instruments_DB_Roles_and_Screening_Endpoints
SORT file.name ASC
```

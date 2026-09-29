---
type: community
cohesion: 0.08
members: 42
---

# Architecture Decision Log

**Cohesion:** 0.08 - loosely connected
**Members:** 42 nodes

## Members
- [[ADR-001 Modular monolith with a worker]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-002 Start clean, drop the Customer Insight Portal scaffold]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-003 Hosted LLM API first, fine-tuned model later]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-004 pgvector in Postgres, schema-level separation]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-008 Desktop web only for the FYP]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-010 Marketplace deferred]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-011 Name is ZehenSync AI]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-013 Brand v1 lapis accent, Sync Z mark (superseded)]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-014 WeasyPrint for PDF instead of ReportLab]] - rationale - docs/06-Memory/Decisions.md
- [[ADR-015 Brand v2 (Zaal mark)]] - document - docs/04-Brand/Brand-Kit.md
- [[Ch Hamza Younas (team)]] - concept - docs/06-Memory/Memory.md
- [[ChromaDB (rejected)]] - concept - docs/06-Memory/Decisions.md
- [[Claude API (hosted LLM)]] - concept - docs/06-Memory/Decisions.md
- [[Customer Insight Portal scaffold (removed)]] - concept - docs/06-Memory/Decisions.md
- [[Decisions (ADR log)]] - document - docs/06-Memory/Decisions.md
- [[FastAPI service]] - concept - docs/06-Memory/Decisions.md
- [[Gemma 3 (fine-tune target)]] - concept - docs/06-Memory/Decisions.md
- [[Iqra Tariq (advisor)]] - concept - docs/06-Memory/Memory.md
- [[LLM provider interface]] - rationale - docs/06-Memory/Decisions.md
- [[Live tracker artifact (status db collection)]] - concept - docs/06-Memory/Memory.md
- [[Marketplace (booking, wallets, escrow, telehealth)]] - concept - docs/06-Memory/Decisions.md
- [[Memory (current project state)]] - document - docs/06-Memory/Memory.md
- [[NeuroLens (retired project name)]] - concept - docs/06-Memory/Decisions.md
- [[Next.js 15]] - concept - docs/06-Memory/Memory.md
- [[PII scrub before LLM API calls]] - rationale - docs/06-Memory/Decisions.md
- [[Phase P0 Docs, brand, repo]] - concept - docs/06-Memory/Memory.md
- [[Postgres 16]] - concept - docs/06-Memory/Decisions.md
- [[Qdrant (rejected)]] - concept - docs/06-Memory/Decisions.md
- [[Qwen 3 (fine-tune target)]] - concept - docs/06-Memory/Decisions.md
- [[Redis]] - concept - docs/06-Memory/Decisions.md
- [[ReportLab (rejected)]] - concept - docs/06-Memory/Decisions.md
- [[Row-Level Security on patient tables (five schemas, per-module roles)]] - concept - docs/06-Memory/Decisions.md
- [[Sher Ali Saleem (team)]] - concept - docs/06-Memory/Memory.md
- [[Syed Raza Abbas Zaidi (team)]] - concept - docs/06-Memory/Memory.md
- [[Sync Z identity (v1, superseded)]] - concept - docs/04-Brand/Brand-Kit.md
- [[Sync Z mark (retired logo)]] - concept - docs/06-Memory/Decisions.md
- [[UCP Lahore_1]] - concept - docs/06-Memory/Memory.md
- [[WeasyPrint]] - concept - docs/06-Memory/Decisions.md
- [[Zaal mark (Kufic ذ with saffron nuqta)]] - concept - docs/06-Memory/Decisions.md
- [[ZehenSync AI]] - concept - docs/06-Memory/Memory.md
- [[arq worker]] - concept - docs/06-Memory/Decisions.md
- [[pgvector]] - concept - docs/06-Memory/Decisions.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Architecture_Decision_Log
SORT file.name ASC
```

## Connections to other communities
- 21 edges to [[_COMMUNITY_Behavioural Signals and Baselines]]
- 3 edges to [[_COMMUNITY_Brand v2 Applications (Zaal in Print and UI)]]
- 3 edges to [[_COMMUNITY_Traceability Matrix and Tracker Governance]]
- 2 edges to [[_COMMUNITY_Speech Engine and Fine-Tune Phases]]
- 2 edges to [[_COMMUNITY_Core Product Docs]]
- 1 edge to [[_COMMUNITY_Patient App Flow and Screens]]

## Top bridge nodes
- [[Memory (current project state)]] - degree 17, connects to 3 communities
- [[ADR-015 Brand v2 (Zaal mark)]] - degree 8, connects to 2 communities
- [[Phase P0 Docs, brand, repo]] - degree 3, connects to 2 communities
- [[ZehenSync AI]] - degree 24, connects to 1 community
- [[Decisions (ADR log)]] - degree 16, connects to 1 community
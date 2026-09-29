---
type: community
cohesion: 0.18
members: 17
---

# Foundation Phase (Auth, RBAC, Monorepo)

**Cohesion:** 0.18 - loosely connected
**Members:** 17 nodes

## Members
- [[Admin Area]] - concept - docs/03-Design/App-Flow.md
- [[Auth (signup fork, login, refresh rotation, 2FA)]] - concept - docs/05-Planning/Phases.md
- [[Clinician Verification and 2FA Setup]] - concept - docs/03-Design/App-Flow.md
- [[Consent Centre]] - concept - docs/05-Planning/Phases.md
- [[DB Roles and Row-Level Security]] - concept - docs/05-Planning/Phases.md
- [[F-PL-01 Signup Fork Role Routing]] - concept - docs/05-Planning/RTM.md
- [[F-PL-02 Clinician Admin Approval Gate]] - concept - docs/05-Planning/RTM.md
- [[F-PL-03 Schema Isolation via DB Roles and RLS]] - concept - docs/05-Planning/RTM.md
- [[F-PL-04 Consent Grant and Revoke]] - concept - docs/05-Planning/RTM.md
- [[F-PL-06 Clinician 2FA Required]] - concept - docs/05-Planning/RTM.md
- [[F-PT-01 Screening Disclaimer Acceptance]] - concept - docs/05-Planning/RTM.md
- [[FastAPI Skeleton and Alembic Baseline (five schemas)]] - concept - docs/05-Planning/Phases.md
- [[P1 Foundation (5-18 Oct)]] - concept - docs/05-Planning/Phases.md
- [[Patient Consent (terms, screening disclaimer, AI processing)]] - concept - docs/03-Design/App-Flow.md
- [[Signup Role Fork (What brings you here)]] - concept - docs/03-Design/App-Flow.md
- [[docker-compose Stack (Postgres+pgvector, Redis, MinIO)]] - concept - docs/05-Planning/Phases.md
- [[pnpm + uv Monorepo]] - concept - docs/05-Planning/Phases.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Foundation_Phase_Auth_RBAC_Monorepo
SORT file.name ASC
```

## Connections to other communities
- 7 edges to [[_COMMUNITY_Patient App Flow and Screens]]
- 7 edges to [[_COMMUNITY_Traceability Matrix and Tracker Governance]]
- 2 edges to [[_COMMUNITY_Speech Engine and Fine-Tune Phases]]
- 2 edges to [[_COMMUNITY_Crisis Hard Stop and Safety Pathway]]
- 1 edge to [[_COMMUNITY_Brand v2 Applications (Zaal in Print and UI)]]
- 1 edge to [[_COMMUNITY_Core Product Docs]]
- 1 edge to [[_COMMUNITY_Vision Engine (Blink and Gaze)]]

## Top bridge nodes
- [[P1 Foundation (5-18 Oct)]] - degree 14, connects to 3 communities
- [[Signup Role Fork (What brings you here)]] - degree 8, connects to 3 communities
- [[Admin Area]] - degree 5, connects to 2 communities
- [[Patient Consent (terms, screening disclaimer, AI processing)]] - degree 4, connects to 1 community
- [[DB Roles and Row-Level Security]] - degree 4, connects to 1 community
---
type: community
cohesion: 0.24
members: 10
---

# Screening Engine Phase and Scoring Tests

**Cohesion:** 0.24 - loosely connected
**Members:** 10 nodes

## Members
- [[F-PR-01 Invalid Profiler Patch Rejected]] - concept - docs/05-Planning/RTM.md
- [[F-PT-03 Instrument Definition Checksum]] - concept - docs/05-Planning/RTM.md
- [[G1 Scoring Correctness (100% scoring tests)]] - concept - docs/05-Planning/RTM.md
- [[Hypothesis Boundary Tests for Scoring]] - concept - docs/05-Planning/Phases.md
- [[P2 Screening Engine (19 Oct-8 Nov)]] - concept - docs/05-Planning/Phases.md
- [[Profiler Worker (schema-validated JSON patches)]] - concept - docs/05-Planning/Phases.md
- [[T-2.13 k6 Load Test for Check-in Flow]] - concept - docs/05-Planning/Tracker.md
- [[T-2.14 Request ISI and C-SSRS Permissions]] - concept - docs/05-Planning/Tracker.md
- [[T-4.09 Home Suggestions from Profile]] - concept - docs/05-Planning/Tracker.md
- [[packagesinstruments (PHQ-9, GAD-7, WHO-5, C-SSRS)]] - concept - docs/05-Planning/Phases.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Screening_Engine_Phase_and_Scoring_Tests
SORT file.name ASC
```

## Connections to other communities
- 9 edges to [[_COMMUNITY_Patient App Flow and Screens]]
- 6 edges to [[_COMMUNITY_Traceability Matrix and Tracker Governance]]
- 2 edges to [[_COMMUNITY_Behavioural Signals and Baselines]]
- 2 edges to [[_COMMUNITY_Speech Engine and Fine-Tune Phases]]
- 2 edges to [[_COMMUNITY_Crisis Hard Stop and Safety Pathway]]
- 1 edge to [[_COMMUNITY_Research Track and Ethics]]
- 1 edge to [[_COMMUNITY_Scholar RAG Pipeline and UI]]

## Top bridge nodes
- [[P2 Screening Engine (19 Oct-8 Nov)]] - degree 14, connects to 3 communities
- [[packagesinstruments (PHQ-9, GAD-7, WHO-5, C-SSRS)]] - degree 6, connects to 2 communities
- [[Profiler Worker (schema-validated JSON patches)]] - degree 5, connects to 2 communities
- [[T-4.09 Home Suggestions from Profile]] - degree 4, connects to 2 communities
- [[T-2.14 Request ISI and C-SSRS Permissions]] - degree 3, connects to 2 communities
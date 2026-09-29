---
type: community
cohesion: 0.14
members: 26
---

# Crisis Hard Stop and Safety Pathway

**Cohesion:** 0.14 - loosely connected
**Members:** 26 nodes

## Members
- [[409 CRISIS_HARD_STOP Response]] - concept - docs/03-Design/App-Flow.md
- [[C-SSRS Escalation Step]] - concept - docs/03-Design/App-Flow.md
- [[Crisis + Rephrase Clinician Review]] - concept - docs/05-Planning/Phases.md
- [[Crisis Layer]] - concept - docs/03-Design/App-Flow.md
- [[Crisis Lexicon v1 (English + Roman Urdu, normaliser)]] - concept - docs/05-Planning/Phases.md
- [[Crisis Screen (help)]] - concept - docs/03-Design/App-Flow.md
- [[F-PT-04 Rephrasing with Equivalence Fallback]] - concept - docs/05-Planning/RTM.md
- [[F-SF-01 Crisis Detection Recall 100%  FP  5%]] - concept - docs/05-Planning/RTM.md
- [[F-SF-02 Crisis Hard Stop Mid-Stream]] - concept - docs/05-Planning/RTM.md
- [[F-SF-03 Linked Clinician Crisis Alert within 60 s]] - concept - docs/05-Planning/RTM.md
- [[F-SF-05 Guard Blocks Diagnosis, Dosing, Certainty]] - concept - docs/05-Planning/RTM.md
- [[Golden Crisis and Benign Eval Sets]] - concept - docs/05-Planning/Phases.md
- [[Hard Stop (high signal)]] - concept - docs/03-Design/App-Flow.md
- [[LLM Provider Down Fallback]] - concept - docs/03-Design/App-Flow.md
- [[Output Guard Library]] - concept - docs/05-Planning/Phases.md
- [[P3 Safety Hard Stop (9-19 Nov)]] - concept - docs/05-Planning/Phases.md
- [[Psychologist Alert Job]] - concept - docs/05-Planning/Phases.md
- [[QuestionCard component]] - concept - docs/03-Design/Design-System.md
- [[Rephrase + Equivalence Pipeline with Cache]] - concept - docs/05-Planning/Phases.md
- [[ResourcesStrip component]] - concept - docs/03-Design/Design-System.md
- [[Risk Classifier v1 (ONNX)]] - concept - docs/05-Planning/Phases.md
- [[Safety Pathway (moderate signal)]] - concept - docs/03-Design/App-Flow.md
- [[SafetyCheck State]] - concept - docs/03-Design/App-Flow.md
- [[T-2.09 Clinician Review of 50 Rephrasings per Instrument]] - concept - docs/05-Planning/Tracker.md
- [[T-3.08 Safety Eval in CI Blocks Merge]] - concept - docs/05-Planning/Tracker.md
- [[crisisStore Global Lock]] - concept - docs/03-Design/App-Flow.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Crisis_Hard_Stop_and_Safety_Pathway
SORT file.name ASC
```

## Connections to other communities
- 13 edges to [[_COMMUNITY_Patient App Flow and Screens]]
- 7 edges to [[_COMMUNITY_Traceability Matrix and Tracker Governance]]
- 5 edges to [[_COMMUNITY_Speech Engine and Fine-Tune Phases]]
- 2 edges to [[_COMMUNITY_Foundation Phase (Auth, RBAC, Monorepo)]]
- 2 edges to [[_COMMUNITY_Screening Engine Phase and Scoring Tests]]
- 1 edge to [[_COMMUNITY_Behavioural Signals and Baselines]]
- 1 edge to [[_COMMUNITY_Research Track and Ethics]]
- 1 edge to [[_COMMUNITY_Scholar RAG Pipeline and UI]]

## Top bridge nodes
- [[P3 Safety Hard Stop (9-19 Nov)]] - degree 13, connects to 4 communities
- [[Rephrase + Equivalence Pipeline with Cache]] - degree 8, connects to 2 communities
- [[Crisis Layer]] - degree 7, connects to 2 communities
- [[LLM Provider Down Fallback]] - degree 5, connects to 2 communities
- [[QuestionCard component]] - degree 5, connects to 2 communities
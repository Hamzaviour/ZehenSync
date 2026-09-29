---
type: community
cohesion: 0.25
members: 9
---

# Crisis Trace Data Model

**Cohesion:** 0.25 - loosely connected
**Members:** 9 nodes

## Members
- [[CRISIS_HARD_STOP error code]] - concept - docs/02-Engineering/API.md
- [[Clinician Endpoints]] - concept - docs/02-Engineering/API.md
- [[Crisis Check Before Any LLM Call Rule]] - rationale - docs/00-Home/Rules.md
- [[Every Conclusion Has A Source]] - rationale - docs/01-Product/PRD.md
- [[Hard Stop]] - rationale - docs/02-Engineering/TRD.md
- [[patient.crisis_events table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[patient.flag_sources table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[patient.flags table]] - concept - docs/02-Engineering/Backend-Schema.md
- [[patient.trace_events table]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Crisis_Trace_Data_Model
SORT file.name ASC
```

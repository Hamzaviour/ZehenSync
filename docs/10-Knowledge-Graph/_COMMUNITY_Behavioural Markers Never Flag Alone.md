---
type: community
cohesion: 0.67
members: 3
---

# Behavioural Markers Never Flag Alone

**Cohesion:** 0.67 - moderately connected
**Members:** 3 nodes

## Members
- [[Behavioural Capture (Browser)]] - concept - docs/02-Engineering/TRD.md
- [[Behavioural Markers Never Flag Alone Rule]] - rationale - docs/00-Home/Rules.md
- [[patient.biomarker_windows table]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Behavioural_Markers_Never_Flag_Alone
SORT file.name ASC
```

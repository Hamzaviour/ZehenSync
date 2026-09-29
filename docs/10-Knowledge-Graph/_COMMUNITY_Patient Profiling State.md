---
type: community
cohesion: 1.00
members: 2
---

# Patient Profiling State

**Cohesion:** 1.00 - tightly connected
**Members:** 2 nodes

## Members
- [[Profiling Engine]] - concept - docs/02-Engineering/TRD.md
- [[patient.profile_state (profile JSON)]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Patient_Profiling_State
SORT file.name ASC
```

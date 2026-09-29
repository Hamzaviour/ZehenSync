---
type: community
cohesion: 1.00
members: 2
---

# Speech Feature Extraction

**Cohesion:** 1.00 - tightly connected
**Members:** 2 nodes

## Members
- [[Speech Feature Extraction]] - concept - docs/02-Engineering/TRD.md
- [[patient.voice_clips table]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Speech_Feature_Extraction
SORT file.name ASC
```

---
type: community
cohesion: 1.00
members: 1
---

# Audit Log Table

**Cohesion:** 1.00 - tightly connected
**Members:** 1 nodes

## Members
- [[audit.events table]] - concept - docs/02-Engineering/Backend-Schema.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Audit_Log_Table
SORT file.name ASC
```

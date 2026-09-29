---
type: community
cohesion: 1.00
members: 2
---

# Scholar Data Isolation Rule

**Cohesion:** 1.00 - tightly connected
**Members:** 2 nodes

## Members
- [[Scholar Module Data Isolation Rule]] - rationale - docs/00-Home/Rules.md
- [[Separate Worlds Principle]] - rationale - docs/01-Product/PRD.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/Scholar_Data_Isolation_Rule
SORT file.name ASC
```

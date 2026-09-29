---
type: community
cohesion: 0.13
members: 17
---

# AI Assistant Rules and Repo Layout

**Cohesion:** 0.13 - loosely connected
**Members:** 17 nodes

## Members
- [[CLAUDE.md AI Assistant Instructions]] - document - CLAUDE.md
- [[Claude Artifact Link 1 (untitled)]] - document - Artifact Links.txt
- [[Claude Artifact Link 2 (untitled)]] - document - Artifact Links.txt
- [[Development Workflow (Tracker.md task - featT-x.yy branch - tests first - update TrackerRTMMemory)]] - concept - CLAUDE.md
- [[Rule Crisis Check Runs Before Every LLM Call on Patient Input]] - rationale - CLAUDE.md
- [[Rule No Real Patient Data in Dev, Tests, or Prompts]] - rationale - CLAUDE.md
- [[Rule Product Screens, Never DiagnosesPrescribesTreats]] - rationale - CLAUDE.md
- [[Rule Scholar Code Never Touches Patient Modules or patient Schema]] - rationale - CLAUDE.md
- [[Rule Scores Come Only From packagesinstruments, No LLM-Written Scores]] - rationale - CLAUDE.md
- [[Rule Use Design Tokens, No Raw Hex, Anti-Slop Checklist]] - rationale - CLAUDE.md
- [[Rule ZehenSync Screens and Never Diagnoses]] - rationale - README.md
- [[Tech Stack (Next.js, FastAPI, PostgreSQL, ChromaDB, PyTorch, TensorFlow, GCPAlibabaAWS)]] - concept - source-docs/Zehen Sync Idea Proposal.pdf
- [[ZehenSync AI (project README)]] - document - README.md
- [[appsapi (FastAPI backend and workers, Phase 1)]] - concept - README.md
- [[appsweb (Next.js frontend, Phase 1)]] - concept - README.md
- [[docs Obsidian Vault (PRD, TRD, flows, schema, design, brand, phases, tracker, memory)]] - concept - README.md
- [[packagesinstruments (versioned questionnaire definitions and scoring, Phase 2)]] - concept - README.md

## Live Query (requires Dataview plugin)

```dataview
TABLE source_file, type FROM #community/AI_Assistant_Rules_and_Repo_Layout
SORT file.name ASC
```

## Connections to other communities
- 2 edges to [[_COMMUNITY_Guided Volition and Ground Truth]]
- 1 edge to [[_COMMUNITY_Competitor Landscape and Citations]]
- 1 edge to [[_COMMUNITY_Clinical Instrument Catalog and Testing Rigor]]

## Top bridge nodes
- [[Rule Scores Come Only From packagesinstruments, No LLM-Written Scores]] - degree 3, connects to 1 community
- [[packagesinstruments (versioned questionnaire definitions and scoring, Phase 2)]] - degree 3, connects to 1 community
- [[Tech Stack (Next.js, FastAPI, PostgreSQL, ChromaDB, PyTorch, TensorFlow, GCPAlibabaAWS)]] - degree 3, connects to 1 community
- [[Rule Crisis Check Runs Before Every LLM Call on Patient Input]] - degree 2, connects to 1 community
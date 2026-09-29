---
source_file: "docs/02-Engineering/Backend-Schema.md"
type: "concept"
community: "Instruments, DB Roles and Screening Endpoints"
tags:
  - graphify/concept
  - graphify/EXTRACTED
  - community/Instruments_DB_Roles_and_Screening_Endpoints
---

# patient.screening_sessions table

## Connections
- [[Row-Level Security Policy]] - `references` [EXTRACTED]
- [[Screening Endpoints]] - `shares_data_with` [EXTRACTED]
- [[core.instruments table]] - `shares_data_with` [EXTRACTED]
- [[patient.screening_responses table]] - `shares_data_with` [EXTRACTED]

#graphify/concept #graphify/EXTRACTED #community/Instruments_DB_Roles_and_Screening_Endpoints
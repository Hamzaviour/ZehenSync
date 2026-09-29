# Graph Report - ZehenSync AI  (2026-09-29)

## Corpus Check
- Corpus is ~37,537 words - fits in a single context window. You may not need a graph.

## Summary
- 655 nodes · 1372 edges · 36 communities (28 shown, 8 thin omitted)
- Extraction: 65% EXTRACTED · 34% INFERRED · 1% AMBIGUOUS · INFERRED: 469 edges (avg confidence: 0.87)
- Token cost: 608,706 input · 48,000 output

## Community Hubs (Navigation)
- Behavioural Signals and Baselines
- Brand v2 Applications (Zaal in Print and UI)
- Patient App Flow and Screens
- Clinical Instrument Catalog and Testing Rigor
- Architecture Decision Log
- Crisis Hard Stop and Safety Pathway
- Zaal Logo System and Construction
- Scholar RAG Pipeline and UI
- Instruments, DB Roles and Screening Endpoints
- Custom Icon Set
- Competitor Landscape and Citations
- Speech Engine and Fine-Tune Phases
- AI Assistant Rules and Repo Layout
- Foundation Phase (Auth, RBAC, Monorepo)
- Traceability Matrix and Tracker Governance
- Early Architecture and Open Questions
- Vision Engine (Blink and Gaze)
- Team Roles and Tech Stacks
- Guided Volition and Ground Truth
- Patient Module (Proposal V1)
- Research Track and Ethics
- Screening Engine Phase and Scoring Tests
- Core Product Docs
- Crisis Trace Data Model
- RBAC Roles
- Scholar Mode Concepts (Proposal)
- Behavioural Markers Never Flag Alone
- Sprint 1 Retrospective
- Scholar Data Isolation Rule
- Deterministic Scoring Rule
- Patient Profiling State
- Patient Pseudonym Scheme
- Speech Feature Extraction
- Audit Log Table
- Care Links Table
- Consents Table

## God Nodes (most connected - your core abstractions)
1. `Requirements Traceability Matrix` - 52 edges
2. `Mental Health Questionnaire Dataset Validation Framework` - 35 edges
3. `Tracker (task status source of truth)` - 29 edges
4. `Safety Protocol` - 27 edges
5. `ZehenSync Brand Kit deck (brand-deck.html)` - 27 edges
6. `Brand Kit` - 26 edges
7. `ZehenSync AI Project Proposal` - 25 edges
8. `Instruments` - 24 edges
9. `ZehenSync AI` - 24 edges
10. `Component Library (shadcn/ui + Radix, restyled)` - 22 edges

## Surprising Connections (you probably didn't know these)
- `packages/instruments (versioned questionnaire definitions and scoring, Phase 2)` --conceptually_related_to--> `Mental Health Questionnaire Dataset Validation Framework`  [INFERRED]
  README.md → source-docs/DETAILED REPORT PDF(updated one).pdf
- `Traceability Chain Example (R-101 -> US-05 -> feat/pdf-parser -> TC-20)` --semantically_similar_to--> `Requirements Traceability Matrix (RTM)`  [INFERRED] [semantically similar]
  source-docs/Project Info.txt → source-docs/DETAILED REPORT PDF(updated one).pdf
- `RAG (Retrieval-Augmented Generation) Algorithm` --semantically_similar_to--> `Multi-Tier RAG Pipeline (Local Vector DB, Academic APIs, Live Search)`  [INFERRED] [semantically similar]
  source-docs/Project Info.txt → graphify-out/converted/ZehenSync_AI_ System Architecture and Product Flow Specification_427ef0ab.md
- `alert icon (bell)` --semantically_similar_to--> `flag icon`  [INFERRED] [semantically similar]
  docs/04-Brand/icons/alert.svg → docs/04-Brand/Brand-Kit.md
- `"NeuroLens Advantage" column referencing NeuroLens as project name` --conceptually_related_to--> `ZehenSync AI Project Proposal`  [INFERRED]
  graphify-out/converted/ZehenSync AI Proposal Defense Presentation_pptx.md → source-docs/Zehen Sync Idea Proposal.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **RBAC Three-Role Access Control Architecture (Patient/Practitioner/Scholar)** — source_docs_zehen_sync_idea_proposal_rbac, source_docs_zehen_sync_idea_proposal_patient_role, source_docs_zehen_sync_idea_proposal_practitioner_role, source_docs_zehen_sync_idea_proposal_student_role, graphify_out_converted_zehensync_ai_system_architecture_and_product_flow_specification_427ef0ab_rbac [INFERRED 0.85]
- **Multimodal Fusion Pipeline (Visual + Speech + Cognitive/RAG Engines)** — source_docs_zehen_sync_idea_proposal_visual_engine, source_docs_zehen_sync_idea_proposal_speech_engine, source_docs_zehen_sync_idea_proposal_cognitive_explanation_engine, graphify_out_converted_zehensync_ai_system_architecture_and_product_flow_specification_427ef0ab_multi_tier_rag_pipeline [INFERRED 0.85]
- **Crisis / Hard Stop Safety Protocol (Detection, Override, Local Helplines)** — source_docs_zehen_sync_idea_proposal_hard_stop_protocol, graphify_out_converted_zehensync_ai_system_architecture_and_product_flow_specification_427ef0ab_crisis_protocol_hard_stop, source_docs_detailed_report_pdf_updated_one_cssrs, source_docs_zehen_sync_idea_proposal_umang_pakistan, graphify_out_converted_zehensync_ai_system_architecture_and_product_flow_specification_427ef0ab_rozan_counseling [INFERRED 0.85]
- **Crisis Hard Stop Flow** — docs_02_engineering_trd_safety_detectors, docs_00_home_rules_crisis_check_rule, docs_02_engineering_api_crisis_hard_stop_code, docs_02_engineering_backend_schema_crisis_events [EXTRACTED 1.00]
- **Flag Traceability Chain** — docs_02_engineering_backend_schema_flags, docs_02_engineering_backend_schema_flag_sources, docs_02_engineering_backend_schema_trace_events, docs_01_product_prd_traceability_principle [EXTRACTED 1.00]
- **Patient/Scholar Data Isolation Pattern** — docs_02_engineering_backend_schema_db_roles, docs_02_engineering_backend_schema_row_level_security, docs_01_product_prd_separate_worlds, docs_00_home_rules_scholar_isolation_rule [EXTRACTED 1.00]
- **Crisis Hard Stop Flow** — docs_03_design_app_flow_hard_stop, docs_03_design_app_flow_crisis_hard_stop_409, docs_03_design_app_flow_crisis_store_lock, docs_03_design_app_flow_crisis_screen, docs_03_design_design_system_crisisscreen, docs_03_design_design_system_resourcesstrip, docs_05_planning_phases_crisis_lexicon, docs_05_planning_phases_risk_classifier, docs_05_planning_rtm_f_sf_02 [INFERRED 0.85]
- **Flag Evidence Traceability Chain** — docs_05_planning_phases_trace_events, docs_05_planning_phases_rule_based_flags, docs_03_design_app_flow_flag_trace, docs_03_design_design_system_tracerow, docs_03_design_design_system_evidence_one_click_away, docs_05_planning_phases_clinical_export, docs_05_planning_rtm_f_cl_04 [INFERRED 0.85]
- **Scholar Cited Retrieval Pipeline** — docs_05_planning_phases_corpus_ingestion, docs_05_planning_phases_bge_m3_hnsw, docs_05_planning_phases_hybrid_search_reranker, docs_05_planning_phases_citation_verifier, docs_05_planning_phases_tier2_sources, docs_03_design_design_system_citationmark, docs_03_design_design_system_referencepanel, docs_05_planning_rtm_f_sc_01 [INFERRED 0.85]
- **Three roles, one calm system (patient, psychologist, scholar web app)** — docs_04_brand_brand_deck_patient_checkin_mockup, docs_04_brand_brand_deck_psychologist_triage_mockup, docs_04_brand_brand_deck_scholar_tutor_mockup, docs_04_brand_brand_deck_three_audiences [EXTRACTED 1.00]
- **Point-of-origin traceability pattern (every conclusion traced to exact evidence)** — docs_04_brand_brand_kit_nuqta_idea, docs_04_brand_brand_kit_brand_platform, docs_04_brand_brand_kit_brand_line, docs_04_brand_brand_deck_flag_trace, docs_04_brand_brand_deck_tiered_retrieval, docs_04_brand_brand_deck_no_source_no_answer, docs_04_brand_brand_deck_original_wording_toggle, docs_04_brand_brand_deck_export_hash [INFERRED 0.85]
- **Nuqta motif system (mark, colour, pattern, icons, motion)** — docs_04_brand_brand_kit_nuqta_diamond, docs_04_brand_brand_kit_zaal_mark, docs_04_brand_brand_kit_saffron, docs_04_brand_brand_kit_nuqta_jaali, docs_04_brand_brand_kit_iconography, docs_04_brand_brand_kit_nuqta_lands_motion [INFERRED 0.85]
- **Icons carrying the nuqta diamond accent (nq class)** — docs_04_brand_icons_check_in, docs_04_brand_icons_citation, docs_04_brand_icons_gaze, docs_04_brand_icons_history, docs_04_brand_icons_trace, docs_04_brand_icons_voice, docs_04_brand_icons_check_in_nq_accent_class, docs_04_brand_logo_zehensync_mark_nuqta_diamond [EXTRACTED 1.00]
- **Zaal mark colourway family (shared glyph geometry)** — docs_04_brand_logo_zehensync_mark, docs_04_brand_logo_zehensync_mark_ink, docs_04_brand_logo_zehensync_mark_mono, docs_04_brand_logo_zehensync_mark_reversed, docs_04_brand_logo_zehensync_app_icon, docs_04_brand_logo_zehensync_mark_zaal_mark [INFERRED 0.95]
- **Rejected logo exploration: neel forms around a central saffron diamond** — docs_04_brand_logo_studies_concept_b_split_lens, docs_04_brand_logo_studies_concept_c_z_trace, docs_04_brand_logo_studies_concept_d_two_minds, docs_04_brand_logo_studies_concept_b_split_lens_rejected_logo_studies, docs_04_brand_logo_zehensync_mark_nuqta_diamond [INFERRED 0.85]
- **Crisis detection and two-tier escalation** — docs_07_clinical_safety_protocol_crisis_lexicon, docs_07_clinical_safety_protocol_distilroberta_classifier, docs_07_clinical_safety_protocol_instrument_risk_rules, docs_07_clinical_safety_protocol_get_help_now, docs_07_clinical_safety_protocol_higher_response_wins, docs_07_clinical_safety_protocol_safety_pathway, docs_07_clinical_safety_protocol_hard_stop [EXTRACTED 1.00]
- **Clinician review gates before real-patient use** — docs_07_clinical_safety_protocol_clinician_signoff, docs_07_clinical_instruments_clinician_rephrasing_review, docs_07_clinical_safety_protocol_crisis_lexicon, docs_06_memory_decisions_adr_012 [INFERRED 0.85]
- **Privacy-by-design data separation and consent** — docs_06_memory_decisions_adr_004, docs_06_memory_decisions_row_level_security, docs_06_memory_decisions_adr_005, docs_06_memory_glossary_scope, docs_06_memory_glossary_pseudonym, docs_06_memory_decisions_adr_006, docs_06_memory_decisions_pii_scrub [INFERRED 0.85]

## Communities (36 total, 8 thin omitted)

### Community 0 - "Behavioural Signals and Baselines"
Cohesion: 0.05
Nodes (87): ADR-005 Consent-based patient to psychologist linking, ADR-006 Vision runs in the browser by default, ADR-007 Behavioural markers never flag alone, ADR-009 English UI, Roman Urdu understood, ADR-012 Two crisis responses, not one, MediaPipe Face Landmarker (in-browser), Research recording GPU pipeline, Vision Transformer (ViT) (+79 more)

### Community 1 - "Brand v2 Applications (Zaal in Print and UI)"
Cohesion: 0.06
Nodes (73): ZehenSync Brand Kit deck (brand-deck.html), Answer levels (Intro, Intermediate, Advanced, Research), Business card (85 x 55 mm), C-SSRS, Ch Hamza Younas (AI and audio core), Clinical export (A4 PHQ-9 report), Components panel (severity chips, pseudonym, delta, citation, Start check-in / Not now), Zaal mark construction diagram (+65 more)

### Community 2 - "Patient App Flow and Screens"
Cohesion: 0.06
Nodes (66): App Flow, Counselor Chat, Empty, Loading and Error States, Rule PHQ9.delta.gte5 v1.0, Flag Trace (core screen), Guided Volition Runner (check-in state machine), Instrument Suggestion Card, Check-in Item View Layout (+58 more)

### Community 3 - "Clinical Instrument Catalog and Testing Rigor"
Cohesion: 0.05
Nodes (43): Continuous Profiling Engine (Cross-Platform), Patient Parameters (Behavioral Markers, Test History/Baselines, Tone/Vocabulary), Scholar Parameters (Academic Progress, Clinical Focus, Pedagogical Adaptation), Acceptance Testing, ADHD & Neurodevelopmental Screening Tools (ASRS-v1.1, Conners), Anxiety Disorder Screening Tools (BAI, SPIN, PDSS-SR), Backward Tracing, BDI-II (Beck Depression Inventory-II) (+35 more)

### Community 4 - "Architecture Decision Log"
Cohesion: 0.08
Nodes (42): Sync Z identity (v1, superseded), Decisions (ADR log), ADR-001 Modular monolith with a worker, ADR-002 Start clean, drop the Customer Insight Portal scaffold, ADR-003 Hosted LLM API first, fine-tuned model later, ADR-004 pgvector in Postgres, schema-level separation, ADR-008 Desktop web only for the FYP, ADR-010 Marketplace deferred (+34 more)

### Community 5 - "Crisis Hard Stop and Safety Pathway"
Cohesion: 0.14
Nodes (26): 409 CRISIS_HARD_STOP Response, Crisis Layer, Crisis Screen (/help), crisisStore Global Lock, C-SSRS Escalation Step, Hard Stop (high signal), LLM Provider Down Fallback, SafetyCheck State (+18 more)

### Community 6 - "Zaal Logo System and Construction"
Cohesion: 0.21
Nodes (26): App icon size ladder (96, 48, 32, 16 px), Logo usage rules (clear space, minimum size, don'ts), Mark construction (45° symmetry, 24° nib cuts, 11-unit stroke), Saffron diamond nuqta, Rejected logo concepts B (split lens), C (Z-trace), D (two minds), Wordmark (outlined Newsreader Medium, 72 pt optical size), Zaal mark (Kufic ذ with saffron nuqta), Rejected study B: Split Lens (+18 more)

### Community 7 - "Scholar RAG Pipeline and UI"
Cohesion: 0.15
Nodes (23): 'How I found this' Disclosure, Scholar Sitemap, Clinical Interview Simulator Flow, Scholar Tutor Layout, CitationMark component, Evidence One Click Away, ReferencePanel component, Say What the System Is Doing (+15 more)

### Community 8 - "Instruments, DB Roles and Screening Endpoints"
Cohesion: 0.11
Nodes (20): C-SSRS Screener, GAD-7 Instrument, Guided Volition, PHQ-9 Instrument, WHO-5 Instrument, Counselor Endpoints, Scholar Endpoints, Screening Endpoints (+12 more)

### Community 9 - "Custom Icon Set"
Cohesion: 0.27
Nodes (20): Camera on / Pause indicator, Hybrid multimodal behavioural screening system (FYP, BS Artificial Intelligence), ICONS path registry (inline script), Custom icon set (24 px grid, 1.75 stroke, nuqta detail), Lucide icons (fallback at 1.75 stroke), alert icon (bell), Icon grammar: 24px grid, 1.75 stroke, square caps, miter joins, currentColor, blink icon (+12 more)

### Community 10 - "Competitor Landscape and Citations"
Cohesion: 0.13
Nodes (20): Aiberry (closed multimodal screening competitor), Competitors Analysis Table (Voice, Vision, Chatbot, Multimodal categories), "NeuroLens Advantage" column referencing NeuroLens as project name, Open Questions: Domain & Stakeholder Impact, Open Questions: Scope & Constraints (exclusions, assumptions, system limits), Agile Sprint Plan (10 sprints, Apr 2026-Mar 2027), Behavioral Medical Imaging (concept), Ellipsis Health (voice biomarker competitor) (+12 more)

### Community 11 - "Speech Engine and Fine-Tune Phases"
Cohesion: 0.17
Nodes (19): Phases (build plan), Acoustic Features (pause, rate, filler, pitch, jitter, shimmer), Clinical Export (PDF + JSON via WeasyPrint), Counselor Prompt v1 (CBT, MI, psychosis neutrality), faster-whisper Transcription (word timestamps), Fusion Summary in Clinical Export, FYP-1 / FYP-2 Evaluation Dates (unconfirmed), LLM Gateway (provider interface) (+11 more)

### Community 12 - "AI Assistant Rules and Repo Layout"
Cohesion: 0.13
Nodes (17): Claude Artifact Link 1 (untitled), Claude Artifact Link 2 (untitled), CLAUDE.md AI Assistant Instructions, Rule: Crisis Check Runs Before Every LLM Call on Patient Input, Rule: Use Design Tokens, No Raw Hex, Anti-Slop Checklist, Rule: Product Screens, Never Diagnoses/Prescribes/Treats, Rule: No Real Patient Data in Dev, Tests, or Prompts, Rule: Scholar Code Never Touches Patient Modules or patient Schema (+9 more)

### Community 13 - "Foundation Phase (Auth, RBAC, Monorepo)"
Cohesion: 0.18
Nodes (17): Admin Area, Clinician Verification and 2FA Setup, Patient Consent (terms, screening disclaimer, AI processing), Signup Role Fork (What brings you here?), Auth (signup fork, login, refresh rotation, 2FA), Consent Centre, DB Roles and Row-Level Security, docker-compose Stack (Postgres+pgvector, Redis, MinIO) (+9 more)

### Community 14 - "Traceability Matrix and Tracker Governance"
Cohesion: 0.18
Nodes (17): Audit Log with Hash Chain, Requirements Traceability Matrix, Bidirectional Traceability (zero orphans), F-CL-06 Flag Review Actions Audited, F-PL-05 Tamper-Evident Audit Log, F-PT-08 Voice Transcript Confirm and Audio Deletion, F-RP-03 Report Lists Source Sessions and Hash, Test ID Prefix Scheme (TC-U/I/E/S/L/V) (+9 more)

### Community 15 - "Early Architecture and Open Questions"
Cohesion: 0.12
Nodes (16): C4 Architecture Model (System/Container/Component), Current Status: ~30% Complete, RAG functional, Vision/Speech in prototype, Database Entities (Users, Sessions, Documents, Reports), Definition of Done (DoD), Hume AI / Affectiva (Emotion AI competitor), Key Algorithms (RAG, Self-Attention Transformers, YOLO/CNN), NeuroLens AI (early project name/draft), RAG (Retrieval-Augmented Generation) Algorithm (+8 more)

### Community 16 - "Vision Engine (Blink and Gaze)"
Cohesion: 0.22
Nodes (15): Camera Calibration (20 s baseline), Accessibility (WCAG 2.2 AA), MarkerPanel component, Plain-Language Target (grade 8 Flesch-Kincaid, CI-checked), CNN vs ViT Blink Comparison, EAR Blink Detection, Iris Gaze, Fixations, Head Pose, Labelled Blink and Gaze Clips, MediaPipe Face Landmarker in Web Worker (+7 more)

### Community 17 - "Team Roles and Tech Stacks"
Cohesion: 0.16
Nodes (14): Functional Requirements (Real-Time Behavioral Imaging, Speech Module, Fine-Tuned Chatbot, Automated Report Generation, Secure Data Handling), Clinician Module, ZehenSync Complete (Slide Deck), Ch Hamza Younas - AI & Audio Core (team role), LLM & Reasoning Stack (Gemma 3, Qwen 3, LoRA/QLoRA), Sher Ali Saleem - Vision & Infrastructure (team role), Speech Stack (Whisper, Wav2Vec2, Librosa, BERT, RoBERTa), Syed Raza Abbas Zaidi - Frontend & UX (team role) (+6 more)

### Community 18 - "Guided Volition and Ground Truth"
Cohesion: 0.17
Nodes (13): Blank Slate Problem (chatbot flaw), Crisis Protocol and Hard Stop Safeguards, Ground Truth Requirement (Deterministic Scoring, Zero-Hallucination Threshold), Ground Truth Traceability (logging exact clicked responses), Guided Volition (structured clickable rubric UX), Rozan Counseling, ZehenSync AI System Architecture and Product Flow Specification (V2.0), Traceability Logs (Source_ID Data Lineage Schema) (+5 more)

### Community 19 - "Patient Module (Proposal V1)"
Cohesion: 0.20
Nodes (12): Cloud Platform (GCP Vertex AI + Alibaba Elastic GPU Service), ZehenSync AI Proposal Defense Presentation (Slide Deck), Investigation Question (eye/speech indicators vs expert assessment correlation), Validation Methodology (collect, extract, correlate against Ground Truth scores), Clinical Counselor Chatbot (CBT-trained persona), Patient Mode (Screening & Counseling), Patient Profile and Reporting Dashboard, Social Determinants of Health (SDOH) Intake Form (+4 more)

### Community 20 - "Research Track and Ethics"
Cohesion: 0.24
Nodes (11): Analysis and Thesis Chapters, Consented Data Collection, Correlation Analysis (markers vs PHQ-9/GAD-7), Ethics Committee Application, P10 Validation, Deploy, Defence (7-20 Mar), Research Capture Kit v0 (consent flow + recorder), Research Track, Security Pass (ZAP, audits, ASVS) (+3 more)

### Community 21 - "Screening Engine Phase and Scoring Tests"
Cohesion: 0.24
Nodes (10): Hypothesis Boundary Tests for Scoring, packages/instruments (PHQ-9, GAD-7, WHO-5, C-SSRS), P2 Screening Engine (19 Oct-8 Nov), Profiler Worker (schema-validated JSON patches), F-PR-01 Invalid Profiler Patch Rejected, F-PT-03 Instrument Definition Checksum, G1 Scoring Correctness (100% scoring tests), T-2.13 k6 Load Test for Check-in Flow (+2 more)

### Community 22 - "Core Product Docs"
Cohesion: 0.39
Nodes (9): Home, Rules, Product Requirements Document, API Contract, Backend Schema, Technical Requirements Document, Under-18 Referral Page, Post-FYP Roadmap (marketplace, Urdu UI, adolescent instruments, mobile) (+1 more)

### Community 23 - "Crisis Trace Data Model"
Cohesion: 0.25
Nodes (9): Crisis Check Before Any LLM Call Rule, Every Conclusion Has A Source, Clinician Endpoints, CRISIS_HARD_STOP error code, patient.crisis_events table, patient.flag_sources table, patient.flags table, patient.trace_events table (+1 more)

### Community 24 - "RBAC Roles"
Cohesion: 0.33
Nodes (6): Data Separation & Privacy Boundaries (Scholar/Patient isolation), Role-Based Access Control (Patient / Scholar / Clinician-Admin), Patient Role, Practitioner Role, Role-Based Access Control (RBAC), Student Role (Scholar Module)

### Community 25 - "Scholar Mode Concepts (Proposal)"
Cohesion: 0.50
Nodes (5): Citation Mechanics (inline markdown citations + References sidebar), Dynamic Learner Profiling System, Multi-Tier RAG Pipeline (Local Vector DB, Academic APIs, Live Search), Scholar Mode (Academic & Professional Hub), Scholar Module

### Community 26 - "Behavioural Markers Never Flag Alone"
Cohesion: 0.67
Nodes (3): Behavioural Markers Never Flag Alone Rule, patient.biomarker_windows table, Behavioural Capture (Browser)

### Community 27 - "Sprint 1 Retrospective"
Cohesion: 0.67
Nodes (3): Retro Finding: Dirty PDF Data Causes Hallucinations, Sprint 1 Statistics (Text-Expert Module, 35/40 story points), Open Questions: Sprint 1 Planning & Governance (Jira, Slack, GitHub, meeting minutes)

## Ambiguous Edges - Review These
- `Claude Artifact Link 1 (untitled)` → `ZehenSync AI (project README)`  [AMBIGUOUS]
  Artifact Links.txt · relation: references
- `Claude Artifact Link 2 (untitled)` → `ZehenSync AI (project README)`  [AMBIGUOUS]
  Artifact Links.txt · relation: references
- `F-PT-03 Instrument Definition Checksum` → `T-4.09 Home Suggestions from Profile`  [AMBIGUOUS]
  docs/05-Planning/Tracker.md · relation: references
- `trace icon` → `citation icon`  [AMBIGUOUS]
  docs/04-Brand/icons/trace.svg · relation: conceptually_related_to
- `trace icon` → `Rejected study C: Z-Trace`  [AMBIGUOUS]
  docs/04-Brand/logo/studies/concept-c-z-trace.svg · relation: conceptually_related_to
- `Nuqta jaali pattern` → `Defence poster (A2, UCP March 2027)`  [AMBIGUOUS]
  docs/04-Brand/brand-deck.html · relation: references
- `Anti-slop checklist` → `Noto Kufi Arabic (deck-only webfont)`  [AMBIGUOUS]
  docs/04-Brand/brand-deck.html · relation: conceptually_related_to
- `Sana Zaheer (clinical reference)` → `Clinician sign-off before real patients (T-3.10)`  [AMBIGUOUS]
  docs/06-Memory/Memory.md · relation: conceptually_related_to
- `packages/instruments/definitions/*.json` → `ISI (Insomnia Severity Index)`  [AMBIGUOUS]
  docs/07-Clinical/Instruments.md · relation: conceptually_related_to
- `3-token negation window` → `DistilRoBERTa risk classifier`  [AMBIGUOUS]
  docs/07-Clinical/Safety-Protocol.md · relation: conceptually_related_to

## Knowledge Gaps
- **108 isolated node(s):** `DAST-10 (Drug Abuse Screening Test)`, `BDI-II (Beck Depression Inventory-II)`, `Mood Disorder Screening Tools (BDI-II, MDQ)`, `Anxiety Disorder Screening Tools (BAI, SPIN, PDSS-SR)`, `Trauma & Stress-Related Screening Tools (PCL-5, PSS)` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 136 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Claude Artifact Link 1 (untitled)` and `ZehenSync AI (project README)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Claude Artifact Link 2 (untitled)` and `ZehenSync AI (project README)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `F-PT-03 Instrument Definition Checksum` and `T-4.09 Home Suggestions from Profile`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `trace icon` and `citation icon`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `trace icon` and `Rejected study C: Z-Trace`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Nuqta jaali pattern` and `Defence poster (A2, UCP March 2027)`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Anti-slop checklist` and `Noto Kufi Arabic (deck-only webfont)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
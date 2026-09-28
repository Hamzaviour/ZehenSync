---
tags: [memory, glossary]
updated: 2026-09-28
---

# Glossary

| Term | Meaning in this project |
|---|---|
| Guided Volition | Our screening style: the system leads with one structured question and finite answer buttons; the person chooses. Replaces the empty chat box. |
| Blank-slate problem | A distressed person struggles to describe symptoms from nothing in an open text box. |
| Behavioural Medical Imaging | Treating webcam and voice signals as measurable regions of interest, the way a radiologist reads a scan. |
| Canonical text | The validated wording of a questionnaire item. Stored with every answer. |
| Displayed text | The rephrased wording the patient saw. |
| Trace event | One stored fact (an answer, a message, a marker window) that can back a flag. |
| Flag | A rule-generated alert with a severity and at least one trace event as its source. |
| Safety pathway | Response to a moderate risk signal: pause, C-SSRS screener, resources strip, urgent flag. |
| Hard Stop | Response to a high risk signal: no AI output, crisis screen, clinician alert. |
| SDOH | Social determinants of health: money, housing, family, workload, sleep schedule, support. |
| Baseline | Rolling mean of the last three sessions of the same instrument. |
| Delta | Change of the latest score against baseline. |
| Scope | A category of data a patient chooses to share with a linked psychologist. |
| Pseudonym | Stable ID like `ZS-7F3K-2Q` shown instead of a name wherever identity isn't shared. |
| Profiler | Background model job that writes JSON patches to a user's profile after each session. |
| Psyche-Corpus | Our curated dataset (DSM-5-TR passages, textbooks, guidelines, papers, instruction pairs) for RAG and fine-tuning. |
| Tier 1 / 2 / 3 | Scholar retrieval order: local corpus, academic APIs, allowlisted web. |
| EAR | Eye aspect ratio, a landmark-based measure of eye openness used for blink detection. |
| Quality gate | Rule that marks a marker window unusable (poor light, face missing, head turned). |
| Scholar | A psychology student, researcher or faculty member using the scholar module. |
| Psychologist / clinician | A verified licensed practitioner. UI says "psychologist"; code says `clinician`. |

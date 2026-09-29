# ZehenSync Complete (slide deck, text extracted from source-docs/ZehenSync Complete.pptx)

--- slide 1
ZehenSync AIA Hybrid Multimodal System for Behavioral Medical Imaging and Psychological Interpretation
Sr. # | Registration# | Name in Full
(Use Block Letters)
1 | Ch Hamza Younas  | L1F23BSAI0089
2 | Syed Raza Abbas Zaidi | L1F23BSAI0011
3 | Sher Ali Saleem | L1F23BSAI0017
--- slide 2
Project Team Introduction
2
Ch Hamza Younas (AI & Audio Core)
Deploys Whisper/Librosa speech analytics and browser APIs for secure AV data collection.
Codes mathematical scoring (WHO-5/ISI) and establishes secure role-based user features.
Syed Raza Abbas Zaidi (Frontend & UX)
Fine-tunes Gemma 3/Qwen 3 and manages DSM/DSM-5 text data inside ChromaDB.
Develops responsive Next.js web dashboards, telehealth rooms, and interactive PHQ-9/GAD-7 forms.
Sher Ali Saleem (Vision & Infrastructure)
Tracks eye gaze and blink metrics utilizing YOLO v12 and Vision Transformers (ViT).
Integrates backend safety override scripts linked directly to the crisis triggering word library.
--- slide 3
Introduction of the Project
3
Domain: 
     Mental healthcare faces a dual challenge of lacking objective   
     behavioral measurement tools and a shortage of AI systems equipped 
     with deep psychological expertise. 
Context: 
     This project treats behavioral observation as "Behavioral Medical   
     Imaging," pairing Computer Vision and Speech Analysis with a   
     psychology-specialized AI. 
Motivation: 
     Standardized assessment scales exist, but there is no integrated 
     platform that combines visual behavioral imaging and vocal pattern 
     analysis with clinical interpretation. 
--- slide 4
Problem Statement & Gap Analysis
4
Problem Statement:
1. Fragmented Tools: Current tools are isolated. Eye-tracking and  
    voice analysis tools exist but lack clinical context or intelligent    
    interpretation.

2. General AI Limits: General-purpose AI models (like GPT or Llama)  
    lack specialized training on high-level psychological texts (DSM-5,   
    case studies) and cannot "see" patient behavior.
--- slide 5
Proposed Solution / Product Concept
5
Visual Behavioral Engine: 
     Treats video as medical data to extract eye biomarkers (blink rate,  
     gaze patterns).
Speech Analysis Engine: 
     Analyzes acoustic and linguistic patterns (speech rate, pauses, 
     fillers) to detect anxiety or distress markers.
Cognitive Explanation Engine: 
     A Fine-Tuned LLM that acts as the "Psychologist," synthesizing the 
     video and speech data using expert literature to provide reasoning.
--- slide 6
Project Objective
6
Audio-Visual Biometric Mapping: Correlates gaze, blink rates, and acoustic speech patterns with clinical evaluations. It proves the superiority of multimodal tracking. 

Specialized Clinical Intelligence: Compiles a custom "Psyche-Corpus" to fine-tune specialized LLMs. It captures SDOH, It uses a zero-hallucination RAG pipeline grounded in verified DSM-5 data. 

Scholar Mode Simulation: Lets students and researchers run case studies on simulated patients. The LLM responds with verified inline citations from DSM-5 and arXiv papers. 

Multi-Modal Web Application: Deploys a cloud platform using a Next.js frontend and FastAPI backend. It isolates secure user workflows and generates exportable clinical summaries. 

--- slide 7
Target Users/Beneficiaries of the Proposed System
1. Psychology Professionals: Reduces cognitive load by automating visual and vocal cue tracking, letting them focus on the patient. 
2. Patients: Access an empathetic screening tool and securely book verified local doctors via digital wallets. 
3. Psychology Students: Learn clinical analysis using a zero-hallucination textbook tutor and a safe patient simulator.
4. Diagnostic Centers: Standardize screening setups using objective, multi-modal video and audio data layers. 
5. Researchers: Utilize open-source tools to study statistical correlations between AI biometrics and expert assessments. 
6. University Administrators: Review campus mental health trends and system efficacy using secure, completely anonymized summary reports.  

--- slide 8
Tools and Technologies
8
1. Vision Stack:
YOLO v12, EfficientNet, ResNet, ViT, DeiT, MediaPipe   
2. Speech Stack:
OpenAI Whisper, Wav2Vec2, Librosa, BERT, RoBERTa 
3. LLM & Reasoning Stack:
Google Gemma 3, Qwen 3, Hugging Face, Transformers, LoRA/QLoRA, OpenAI /Openrouter
4. Database & Storage Stack: 
ChromaDB, PostgreSQL, Google Cloud Storage
5. App & Framework Stack:
Next.js, FastAPI, PyTorch, Docker, 
6. OS & Development Ecosystem:
Windows 11   WSL2 
--- slide 9
Expected results and product
9
Product:
A cohesive screening support platform demonstrating three pillars of innovation:
Visual Insight: Objectively measures gaze patterns, fixations, and blink rates.
Vocal Insight: Objectively measures speech rate, filler frequency, and pauses.
Clinical Insight: A Psychology-Expert LLM that contextualizes these metrics to provide evidence-based screening reports.

--- slide 10
The Patient Module
Contextual Baseline: 
Captures Social Determinants of Health (SDOH) to ensure environmental stress isn't misdiagnosed as a clinical disorder.

Deterministic Testing: 
Administers standardized rubrics (e.g., PHQ-9, GAD-7) using dynamic phrasing but strict, clickable scoring for absolute accuracy. 

CBT-Guided Interface: 
Engages users via an empathetic chatbot trained in Cognitive Behavioral Therapy techniques. 

Active Crisis Protocol: 
Enforces an immediate "Hard Stop" override to display local emergency resources if high risk is detected.


--- slide 11
Clinician Module
Absolute Traceability: 
Eliminates the AI "Black Box" by mapping every flagged risk directly back to a specific, timestamped user input.

Longitudinal Tracking: 
Calculates baseline changes and score deltas across multiple patient sessions.

Privacy Control: 
Anonymizes data by replacing direct identifiers with randomized session IDs for secure review.
 
Clinical Exports: 
Generates structured, data-driven PDF/JSON reports strictly for professional medical oversight.


--- slide 12
Scholar Module
Multi-Tier RAG Pipeline: 
Grounds all AI responses in verified databases (DSM-5) and academic APIs (arXiv) to completely prevent hallucinations.

Verifiable Citations: 
Generates inline citations linked to an interactive UI, allowing students to verify claims directly from source documents.

Adaptive Profiling: 
Asynchronously tracks student knowledge gaps to dynamically adjust the AI's teaching complexity.

Isolated Simulation: 
Provides a safe environment for diagnostic practice without cross-contaminating real patient data.

--- slide 13
Nature of the End Product
Multi-Modal Web Application:
Deployed as a secure, cloud-hosted web platform built with a Next.js frontend and a FastAPI backend architecture. 

Automated Screening Tool:
Serves patients as an objective mental health screening interface that extracts and fuses visual, acoustic, and text-based distress markers. 

Academic Research Tool & Simulator:
Functions for psychology students as a zero-hallucination textbook tutor and a synthetic patient lab to practice clinical interviewing safely. 

Telehealth Software Service (SaaS):
Operates as an open B2B2C clinical marketplace offering verified practitioners automated triage queues, digital escrow wallets, and encrypted video session rooms.

--- slide 14
Conclusion:
Why We Chose This Project
Objective & Personal Mission: Combines audio-visual AI biometrics with clinical reasoning to replace subjective screening and break Pakistan's mental health stigma to protect human lives. 

Target Market Benefits
Ecosystem Value: Eliminates administrative documentation burnout for practitioners while expanding safe, verified marketplace care for the public. 
--- slide 15
Competitors Analysis
--- slide 16
Thanks Slides
16
Q&A Session
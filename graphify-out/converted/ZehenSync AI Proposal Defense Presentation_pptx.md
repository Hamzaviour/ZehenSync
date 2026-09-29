# ZehenSync AI Proposal Defense Presentation (slide deck, text extracted from source-docs/ZehenSync AI Proposal Defense Presentation.pptx)

--- slide 1
ZehenSync AI

A Hybrid Multimodal System for Behavioral Medical Imaging and Psychological Interpretation

Ch Hamza Younas (L1F23BSAI0089) 
Syed Raza Abbas Zaidi(L1F23BSAI0011)
Sher Ali Saleem(L1F23BSAI0017)


Advisor: Iqra Tariq	
--- slide 2
Overview of topic/domain
The Domain:
Mental healthcare faces a dual challenge: a lack of objective behavioral measurement tools and a shortage of AI systems with deep psychological expertise.

The Gap:
While standardized assessment scales exist, there is no integrated platform that combines Visual behavioral imaging and Vocal pattern analysis with Clinical interpretation.

The Concept:
This project treats behavioral observation as "Behavioral Medical Imaging," pairing Computer Vision and Speech Analysis with a psychology-specialized AI trained on clinical literature.

--- slide 3
Project Description
Problem Statement:
Fragmented Tools: Current tools are isolated. Eye-tracking and voice analysis tools exist but lack clinical context or intelligent interpretation.

General AI Limits: General-purpose AI models (like GPT or Llama) lack specialized training on high-level psychological texts (DSM-5, case studies) and cannot "see" patient behavior.
--- slide 4
Proposed Solution (Three-Core System):
Visual Behavioral Engine: Treats video as medical data to extract eye biomarkers (blink rate, gaze patterns).
Speech Analysis Engine: Analyzes acoustic and linguistic patterns (speech rate, pauses, fillers) to detect anxiety or distress markers.
Cognitive Explanation Engine: A Fine-Tuned LLM that acts as the "Psychologist," synthesizing the video and speech data using expert literature to provide reasoning.
--- slide 5
Expected results and product
Product:
A cohesive screening support platform demonstrating three pillars of innovation:
Visual Insight: Objectively measures gaze patterns, fixations, and blink rates.
Vocal Insight: Objectively measures speech rate, filler frequency, and pauses.
Clinical Insight: A Psychology-Expert LLM that contextualizes these metrics to provide evidence-based screening reports.

--- slide 6
Functional Requirements
Real-Time Behavioral Imaging (Video): Video analysis module that overlays detection boxes (YOLO) on facial landmarks to compute behavioral metrics.
Speech Analysis Module (Audio): Transcript analysis and basic acoustic feature extraction from the user's voice.
Fine-Tuned Chatbot (LLM): A conversational interface capable of citing psychological sources and interpreting data.
Automated Report Generation: Compiles visual and speech data into a professional PDF report for doctors.
Secure Data Handling (Non-functional): End-to-end encryption for all video, audio, and text data to ensure patient privacy.

--- slide 7
Artificial intelligence related functionalities
This project integrates three distinct AI domains equally:
1. Deep Learning for Vision (Video Modality):
Target: Use YOLO 12 for ultra-fast face and eye tracking (Medical ROI detection).
Architecture: Compare CNNs (EfficientNet/ResNet) vs. Vision Transformers (ViT) to extract specific behavioral indicators like blink rate and gaze stability.
2. Deep Learning for Speech (Audio Modality):
Target: Use transformer-based models (e.g., Whisper or Wav2Vec2) for speech-to-text.
Analysis: Analyze acoustic patterns (speech rate, pauses) and linguistic patterns (filler words) as additional behavioral indicators.
3. Generative AI & Fusion (Reasoning Modality):
Fine-Tuning: Train Gemma 3 / Qwen 3 on the Psyche-Corpus (DSM-5, Case Studies) using PEFT/RLHF to perform clinical reasoning.
Multimodal Fusion (RAG): Feed structured outputs from the Vision and Speech engines into the LLM to generate context-aware clinical reports with citations.
--- slide 8
Research related Projects  Features/ Requirements/ Objectives (Tentative)
Investigation Question:
"Can eye-based AND speech-based behavioral indicators, extracted through deep learning, demonstrate statistically significant correlation with expert psychological assessments?"
Scientific Contributions:
Validation Study: Correlating AI-extracted gaze/blink metrics and speech patterns with expert human observations.
Multimodal Integration: Demonstrating the increased accuracy of combining Video + Audio versus using them individually.
Architecture Comparison: Comparing CNN vs. Vision Transformer performance for behavioral analysis.

Methodology:
Collect video/audio of clinical sessions (with consent).
Extract indicators using our YOLO/ViT (Vision) and Speech Transformers (Audio).
Correlate these against Ground Truth scores (PHQ-9, GAD-7) provided by psychologists.
--- slide 9
Target Users/Beneficiaries of the Proposed System
Psychology Professionals: Reduces cognitive load by automating the observation of visual and vocal cues, allowing them to focus on the patient.

Diagnostic Centers: Provides standardized screening support based on objective video and audio data.

Psychology Students: A specialized model serves as a tutor/research assistant for understanding clinical behavioral analysis.

Researchers: Offers open-source tools for multimodal behavioral validation studies.
--- slide 10
Technologies (Tentative Listing)
1. Vision Stack:
YOLO v12 (Tracking)
EfficientNet/ResNet (CNN) vs. ViT/DeiT (Transformers)
MediaPipe (Face Mesh)
2. Speech Stack:
OpenAI Whisper or Wav2Vec2 (ASR)
Librosa (Acoustic Features)
BERT/ROBERTa (Linguistic Analysis)
3. LLM Stack:
Google Gemma 3 or Alibaba Qwen 3 (Base Models)
Hugging Face Transformers, LoRA/QLORA (PEFT)
Vector DB (ChromaDB) for RAG
4. App Stack:
Next.js (Frontend), FastAPI (Backend), PostgreSQL
--- slide 11
Cloud Platform
Google Cloud Platform (GCP):
TPU/GPU Nodes: For the intensive process of fine-tuning the LLM.
Vertex AI: To deploy the model endpoints.
Cloud Storage: For secure, encrypted storage of video/audio datasets.
Alibaba Cloud:
Elastic GPU Service: To host the YOLO/CNN/ViT inference engines (requires low latency).
Object Storage Service (OSS): To store training datasets.
--- slide 12
Competitors Analysis
Category | Key Players | What They Do | Core Gap / Limitation | NeuroLens Advantage
1. Voice-Based (The “Ear”) | Ellipsis Health, Sonde Health, Winterlight Labs | Use voice biomarkers to assess anxiety, depression, or cognitive decline via speech patterns. | Audio-only; no visual behavior insights (e.g., eye contact, fidgeting, facial tension). | Multimodal analysis goes beyond audio, integrating visual behavioral signals.
2. Vision / Eye-Tracking (The “Eye”) | Tobii Pro | High-precision eye-tracking hardware for cognitive and UX research. | Requires specialized, expensive hardware; outputs raw data without psychological interpretation. | Uses standard cameras + provides clinical context and interpretability, not just raw metrics.
3. Chatbot-Based (The “Text”) | Wysa, Woebot | AI chatbots offering conversational mental-health support. | Depend entirely on user text input; no access to voice tone, facial cues, or behavior. | NeuroLens incorporates non-verbal cues, emotional expression, and cognitive markers.
4. Multimodal Platforms | Aiberry | Video + audio AI screening for mental health risk. | Primarily a closed, black-box screening score with limited transparency. | Open-source, research-oriented, with clinically interpretable explanations via fine-tuned RAG.
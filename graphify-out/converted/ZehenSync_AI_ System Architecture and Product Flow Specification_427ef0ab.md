<!-- converted from ZehenSync_AI_ System Architecture and Product Flow Specification.docx -->

ZehenSync AI (V2.0): System Architecture and Product Flow Specification
# 1. Project Overview and Strategic Pivot
### A. The Problem: The Flaw in Generic Chatbots for Mental Health
When we initially designed ZehenSync, we adopted a standard, open-ended chat interface similar to ChatGPT. While technologically impressive, we realized through advisor feedback that this approach is fundamentally flawed for clinical psychology.

The core issue is the "Blank Slate Problem." A user experiencing clinical depression or severe anxiety is highly unlikely to proactively articulate their symptoms in a blank text box. Relying on open-ended text creates infinite variables, leading to noisy data and AI hallucinations. More importantly, it destroys traceability. If a clinician asks, "Why did the AI diagnose major depression?", pointing to a rambling, unstructured paragraph of text is not a scientifically valid or medically acceptable answer.
### B. The Solution: Structured Traceability and Contextual Awareness
To make ZehenSync a defensible, evidence-based product, we are pivoting from a passive chatbot to an active, structured clinical tool.

We are implementing "Guided Volition." The system will lead the user through validated psychological rubrics using finite, clickable options, while still allowing for personalized text input where context is needed. This provides us with absolute "Ground Truth." When a user clicks a specific response mapping to a PHQ-9 score, we log that exact interaction. This creates a traceable logic chain that a human doctor can review, trust, and verify. Furthermore, we are introducing a contextual profiling layer to gather social determinants (financial status, living conditions) before screening, ensuring the AI does not mistake environmental stress for a chemical imbalance.
### C. The Goal: A Dual-Engine Platform for Education and Clinical Screening
ZehenSync is no longer just a screening application; it is a comprehensive ecosystem serving two distinct user bases.

The Patient Module: A safe, empathetic, and highly structured environment for individuals to undergo psychological screening, take standardized tests, and interact with a CBT-trained counselor.
The Scholar Module: An advanced, RAG-powered research assistant and patient simulator for psychology students and professionals to study, reference the DSM-5, and practice clinical interviews.
# 2. User Routing and Authentication (The Split Architecture)
Because we are serving two completely different demographics with completely different needs, the application architecture must enforce a strict division from the moment a user opens the platform.
### A. Role-Based Access Control (RBAC)
The foundation of the new system is a robust Role-Based Access Control layer. Every account created in the database will carry a strict role designation that dictates UI rendering, database access, and LLM prompt framing. The primary roles are:

Patient: Restricted to the screening hub, personal dashboard, and counselor chat. Cannot access research APIs or clinical override functions.
Scholar/Student: Has access to the educational RAG engine, academic API integrations (arXiv, Google Scholar), and the patient simulation lab.
Clinician/Admin: Has oversight access to view anonymized patient logs, traceability reports, and system diagnostics.
### B. Initial Login Fork: Patient vs. Scholar/Professional
The user experience must clearly diverge at the authentication stage.

When a user logs in or signs up, they will be presented with a clear, non-technical fork in the UI:

Path 1 ("I am looking for support/screening"): Routes the user to the Patient Module. For first-time users, this immediately triggers the one-time Social Determinants of Health (SDOH) intake form to establish their baseline context.
Path 2 ("I am a researcher/student"): Routes the user to the Scholar Module dashboard, bypassing clinical intake and opening the academic search and simulation interfaces.
### C. Data Separation and Privacy Boundaries
Given the highly sensitive nature of psychological data, strict boundaries must be maintained between the two modules.

No Cross-Contamination: The Scholar Module's RAG engine must never retrieve real user data from the Patient Module. Simulated patients used for student practice must be generated purely from textbook data and system prompts, never from real patient chat logs.
Anonymization for Clinicians: When a Clinician reviews a Patient's test results, the data must be stripped of direct identifiers (names, emails) and replaced with randomized session IDs, ensuring that university administration can review system efficacy without violating student privacy.
Continuous Profiling Isolation: The background profiling engines will run separately. The Scholar profile (tracking learning gaps and academic interests) runs on a completely different logic loop and database table than the Patient profile (tracking behavioral markers and test scores).

# 3. Mode 1: Scholar Mode (Academic & Professional Hub)
### A. Primary Objective and Target Audience
The Scholar Mode transforms ZehenSync from a simple screening tool into a high-value educational platform. The target audience includes university psychology students, academic researchers, and clinical professors.

The primary objective is to provide an environment where users can research complex psychological phenomena, reference standardized diagnostic criteria, and receive personalized tutoring without the risk of AI hallucinations. In the medical and psychological fields, generating an incorrect fact is not a bug; it is a critical failure. Therefore, this mode prioritizes absolute academic rigor, accurate citations, and adaptive learning.
### B. The RAG Integration Pipeline
To ensure the AI does not invent information, the Scholar Mode relies on a Multi-Tier Retrieval-Augmented Generation (RAG) architecture. When a student asks a question (e.g., "What are the differential diagnoses for Schizoaffective Disorder?"), the system does not immediately answer from the LLM's base memory. Instead, it triggers a specialized pipeline.

Tier 1: Local Vector Database (The Ground Truth): The system first searches our internal, verified database. This database will be populated by our Data Lead and will contain chunked, indexed text from the DSM-5 and standard university psychology textbooks. This is our highest-priority data source.
Tier 2: Academic APIs (The Latest Research): If the student asks about recent developments or specific studies, the system triggers tool-calling to query the arXiv API and Google Scholar. This pulls in abstracts and conclusions from peer-reviewed papers published recently, ensuring the platform is never outdated.
Tier 3: Live Google Search: For queries requiring real-time, generalized context that might not yet be in academic journals, the system can perform a live web search, though this is heavily weighted to prioritize .edu and .gov domains.
### C. Dynamic Learner Profiling System
A standard educational chatbot treats every interaction as a blank slate. ZehenSync Scholar Mode will employ a continuous, asynchronous profiling engine that learns how the student learns.

Background Extraction: As the student interacts with the system, a background LLM process analyzes the conversation to extract metadata. For example, if a student repeatedly asks for clarification on "Cluster B personality disorders," the background process notes this as a knowledge gap.
Profile Parameter Mapping: The system maintains a hidden "Learner Profile" JSON object for each student. It tracks metrics such as:
Current Focus Areas: (e.g., Cognitive Behavioral Therapy, Neurodevelopmental Disorders).
Identified Weaknesses: (e.g., Struggles with distinguishing between Bipolar I and Bipolar II).
Preferred Learning Style: (e.g., Prefers clinical case studies over abstract theoretical definitions).
Auto-Adjusting Teaching Personas: Before the main AI generates a response to the student, it reads the Learner Profile. If the profile indicates the user is a first-year student who struggles with clinical jargon, the AI persona shifts to be more foundational and explanatory. If the profile belongs to a senior researcher, the AI adopts a highly technical, peer-review style persona, skipping basic definitions and going straight to complex mechanisms.
### D. Personalized Output Generation and Citation Mechanics
The final step in the Scholar Mode workflow is constructing the response. The output must be a perfect synthesis of the retrieved data (The RAG Pipeline) and the student's specific needs (The Learner Profile).

Crucially, the Web Development and AI teams must collaborate to build a strict citation mechanism.

When the AI generates a claim, it must map that claim back to the exact source document retrieved in the RAG pipeline. The output sent to the frontend will include inline markdown citations (e.g., "Symptoms must be present for at least six months [1]").

The frontend UI will then parse these citations and render an interactive "References" sidebar. When the student clicks [1], the UI will display the exact paragraph from the DSM-5 or the abstract from the arXiv paper that validates the AI's statement. This enforces traceability and teaches students the importance of evidence-based research.
# 4. Mode 2: Patient Mode (Screening & Counseling)
This module represents the clinical core of ZehenSync. Unlike the open-ended exploration of Scholar Mode, Patient Mode is a highly controlled, structured, and empathetic environment. The primary directive here is patient safety combined with strict scientific traceability. The interface must feel conversational to the user, but operate as a rigid state machine under the hood.
### A. Phase 1: The Initial Contextual Intake Form (One-Time)
Before a patient interacts with any diagnostic tool or chatbot, they must complete an initial profiling phase. This solves the critical flaw of diagnosing mental health in a vacuum.

Capturing Social Determinants of Health (SDOH): The UI will present a one-time, conversational onboarding flow to capture the user's environmental reality. This includes financial status, living arrangements (e.g., crowded hostel vs. quiet home), family dynamics, and current academic load.
The Clinical Purpose: If a student reports severe sleep deprivation and low mood, but the SDOH profile indicates they are working two night-shift jobs to pay tuition, the AI must contextualize this. It prevents the system from automatically flagging a purely clinical disorder (like Major Depressive Disorder) when the root cause is environmental burnout. This data is saved to the patient's secure profile and injected into the LLM context window for all future interactions.
### B. Phase 2: The Standardized Testing Hub
This is where ZehenSync departs from standard digital health apps. Instead of forcing users to fill out static, sterile web forms, we are implementing Dynamic Real-Time Question Generation.

Supported Clinical Rubrics: The backend will hold strict, hardcoded scoring logic for standardized tests like the PHQ-9 (Depression), GAD-7 (Anxiety), and ISI (Insomnia).
Dynamic Real-Time Question Generation: The AI team will build a prompt pipeline that takes a static rubric question (e.g., "Trouble falling or staying asleep, or sleeping too much") and rephrases it naturally based on the user's profile, reading level, and cultural context.
Strict Adherence to Medical Scoring Rules: While the phrasing is dynamic, the data capture is rigid. The user must respond using finite, clickable UI buttons (e.g., [Not at all], [Several days]). This ensures that no matter how the AI phrases the question, the backend records a concrete, standardized integer score (0-3) that maps perfectly to the medical rubric.
### C. Phase 3: The Clinical Counselor Chatbot
When the user is not taking a specific test, they can interact with the Clinical Counselor Chatbot. This is not a general assistant; it is a highly specialized persona.

The CBT-Trained Empathetic Persona: The system prompt for this module will constrain the AI to use Cognitive Behavioral Therapy (CBT) techniques, reflective listening, and motivational interviewing. It will not offer medical advice or prescribe solutions; it will help the user explore their feelings safely.
Multimodal Interaction: This module is built to accept both text and voice inputs. The Web Dev team must implement the necessary audio recording interfaces, passing the audio to the backend for processing (which prepares us for the vocal biomarker extraction phase).
Smart Routing: The counselor does not just passively listen. The AI team must implement a "trigger listener" logic. If the user mentions persistent worry during casual chat, the AI will intelligently halt the conversation and recommend a transition: "It sounds like you've been carrying a lot of tension lately. Would it be okay if we took a quick 7-question assessment to understand that anxiety better?" If accepted, it routes them directly into the GAD-7 flow in the Testing Hub.
### D. Phase 4: Patient Profile and Reporting Dashboard
The final phase manages how the data is displayed. Because we serve both the patient and the overseeing clinicians, the output must be bifurcated.

Historical Test Logging: The Web team will build a secure Patient Dashboard that logs every session, creating a longitudinal timeline of the user's mental health scores.
Plain-Language Explanatory Reports: For the patient, raw medical scores can be confusing or alarming. The AI will generate a compassionate, plain-language summary of their test results. Instead of displaying "PHQ-9 Score: 22 - Severe," the UI will show the explanation: "Your responses indicate you are experiencing a high level of depressive symptoms. It is highly recommended that you speak with a campus counselor."
Exportable Clinical Data Summaries: For the doctor or university psychologist, the system will generate a professional, exportable report (PDF/JSON). This version strips away the conversational AI text and provides the hard data: exact scores, the traceable logic chain of user inputs, identified SDOH risk factors, and highlighted transcript segments.

# 5. The Continuous Profiling Engine (Cross-Platform Logic)
The core differentiator of ZehenSync is that it never stops learning about its users. However, it does not do this through massive, expensive model retraining. Instead, it uses a lightweight, asynchronous Continuous Profiling Engine that maintains a dynamic JSON state for every user.
### A. Real-Time Parameter Updating
The AI team must build this engine to run in the background. It should not interrupt the user's active chat experience.

Event-Driven Architecture: Whenever a session ends, or a significant milestone is reached (e.g., completing a test or finishing a study module), an event is triggered.
Background Extraction: A secondary, smaller LLM process (the "Profiler") analyzes the recent transcript. It looks for delta changes—what is new about this user compared to their last session?
State Mutation: The Profiler outputs a structured JSON update patch, which the backend uses to update the user's master profile in the database. When the user logs in the next day, the primary LLM is injected with this updated context window.
### B. Scholar Parameters
For users in the Scholar Mode (psychology students/researchers), the profiling engine acts as an academic mentor. It tracks parameters designed to optimize learning efficiency.

Academic Progress: It monitors which DSM-5 chapters or disorders the student frequently queries.
Clinical Focus: If a student is consistently running patient simulations for Neurodevelopmental Disorders, the system tags their profile with this specialty. Future RAG searches will automatically prioritize papers from that specific sub-field.
Pedagogical Adaptation: The engine tracks "clarification requests." If the student frequently asks, "Can you explain that in simpler terms?" the engine permanently lowers the baseline complexity of the AI's teaching persona for that specific user.
### C. Patient Parameters
For users in the Patient Mode, the profiling engine acts as a digital chart, tracking behavioral and clinical markers over time. This is strictly separated from the Scholar database.

Behavioral Markers: It extracts and updates recurring themes. If a patient mentions "trouble sleeping" across three different counseling sessions over a month, the engine updates the chronic_insomnia_risk flag to true, prompting the counselor AI to suggest the ISI (Insomnia Severity Index) test in the next session.
Test History & Baselines: It maintains a rolling average of standardized test scores (PHQ-9, GAD-7). This allows the system to calculate the "Delta" (the change from their baseline). A user scoring a 12 on the PHQ-9 is concerning, but a user jumping from a baseline of 4 to a 12 in one week triggers a rapid escalation protocol.
Tone and Vocabulary: The engine tracks the user's textual sentiment and vocabulary complexity over time, establishing the text-based baseline required before we introduce the Audio module in the next development phase.

# 6. Data Authenticity, Traceability, and Safety
If ZehenSync is to be deployed in a university psychology department, it must pass rigorous academic and ethical reviews. This section defines the strict guardrails the engineering team must build to ensure clinical validity and patient safety.
### A. The "Ground Truth" Requirement
In clinical psychology, an AI cannot simply "vibe check" a patient. It must rely on established medical standards.

Deterministic Scoring: While the AI is permitted to rephrase questions dynamically to suit the user's reading level, the underlying evaluation metric must remain deterministic. A response to a PHQ-9 question must map to an exact integer (0, 1, 2, or 3). The LLM is never allowed to "guess" the final score based on a general conversation; the score is strictly calculated by standard math on the backend based on the user's button clicks.
Zero-Hallucination Threshold: In Scholar Mode, the system is strictly instructed to refuse to answer if the RAG pipeline returns no relevant documents. It must output: "I cannot find peer-reviewed evidence for this in the current database," rather than inventing a plausible-sounding medical theory.
### B. Mapping AI Outputs to User Inputs (Traceability Logs)
This is the feature that will secure our approval from clinical advisors like Ma'am Sana Zaheer. We must solve the "Black Box" problem.

The Data Lineage Schema: The Web Dev and AI teams must collaborate on a logging structure where every system conclusion has a Source_ID.
Clinician Verification: When the Admin Portal displays a flag for "Severe Anxiety," it must not just be a text alert. The UI must allow the reviewing psychologist to click the flag and see the exact timestamped interaction that triggered it.

For example, the dashboard should explicitly state: Flag: High Suicide Risk. Source: User selected 'Nearly every day' on PHQ-9 Item 9 (Timestamp: 14:02) AND user inputted text 'I want it to stop' (Timestamp: 14:05). This gives the human doctor the exact context needed to take over.
### C. Crisis Protocol and Hard Stop Safeguards
We are dealing with human lives. The system must recognize when a situation exceeds its capabilities. The engineering team must implement a "Hard Stop" protocol that overrides all other AI functions.

Keyword and Sentiment Triggers: A lightweight, secondary filter runs on every user input, scanning for critical risk markers (e.g., words related to self-harm, suicide, or severe violence).
The Override: If a trigger is detected, the LLM generation is immediately aborted. The AI is not allowed to generate a conversational response or try to "talk them down."
The Emergency State: The Web UI must instantly lock into an emergency state. A modal takes over the screen displaying immediate, localized crisis resources. Because we are deploying in Pakistan, the Web Dev team must hardcode local, active resources such as the Umang Pakistan Helpline and Rozan Counseling, providing direct phone numbers and a button to exit the session immediately.


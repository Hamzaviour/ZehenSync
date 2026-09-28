---
tags: [clinical, safety, binding]
status: draft-v1, needs clinician sign-off
updated: 2026-09-28
---

# Safety Protocol

Related: [[PRD#6.3 Safety]] · [[TRD#5.3 Safety]] · [[Rules#Clinical safety]] · [[Instruments]]

This document binds every developer. If code and this page disagree, the code is wrong. A qualified clinician must sign off before any real patient uses the system (tracked as T-3.10 in [[Tracker]]).

## 1. Two responses

| Response | When | What the patient sees | What the system does |
|---|---|---|---|
| **Safety pathway** | Moderate signal: PHQ-9 item 9 answered 1 or 2; classifier class `distress` above 0.8; C-SSRS Q1 or Q2 yes only | Instrument pauses. A calm card: "Thank you for telling me that. I'd like to ask a few more questions about your safety." Resources strip stays visible at the top for the rest of the session. The C-SSRS screener runs next. | Urgent flag with sources. Linked psychologist alerted. Counselor switches to a safety-focused prompt with no exploratory CBT. |
| **Hard Stop** | High signal: lexicon match in the `imminent` or `self_harm` class; classifier `self_harm` or `harm_to_others` above 0.6; PHQ-9 item 9 = 3; C-SSRS Q3, Q4 or Q5 yes, or Q6 behaviour in the past 3 months | Full-screen crisis view. No AI text. | LLM call aborted or never made. `crisis_event` written. Crisis flag with sources. Linked psychologist alerted within 60 s. Session locked. |

When detectors disagree, the higher response wins. We accept false positives on purpose; a missed crisis costs far more than an interrupted chat.

## 2. Detectors

### 2.1 Lexicon

- Lives in `packages/crisis-lexicon/`, versioned, reviewed by a clinician each release.
- Classes: `imminent` (plan, means, timing), `self_harm`, `suicidal_ideation`, `harm_to_others`, `psychosis_distress` (command voices, fear of being harmed).
- Languages: English and Roman Urdu, including common spellings (`khudkushi`, `khud kushi`, `khudkashi`; `marna chahta`, `mar jana chahti`, `zindagi khatam`).
- Normalisation before matching: lowercase, strip diacritics, collapse repeated letters (`sooo` to `soo`), map digits used as letters, remove zero-width characters.
- Negation window of 3 tokens lowers `suicidal_ideation` to `distress` ("I would never kill myself") but never lowers `imminent`.

### 2.2 Classifier

- DistilRoBERTa fine-tuned on public suicide-risk and distress corpora plus our own labelled Roman Urdu set.
- Classes: `none`, `distress`, `self_harm`, `harm_to_others`.
- Thresholds live in config and change only with a passing eval run.
- Input: the current message plus the two previous user messages, so "I have the pills here" after "I can't do this anymore" still fires.

### 2.3 Instrument rules

- Defined inside each instrument JSON under `risk_rules`. The screening service evaluates them on every answer, before storing the next item.
- Items touching self-harm never go through rephrasing.

### 2.4 Manual

- The header shows "Get help now" on every patient page. Clicking it opens the crisis screen and logs a `manual_help` crisis event. This does not raise a flag by itself; it records that the person looked for help.

## 3. Crisis screen

Content, top to bottom:

1. Heading: "You don't have to handle this alone."
2. One sentence: "Please reach out to someone right now. These services are free and confidential."
3. Resource cards, each with a large `tel:` link and hours:
   - **Umang Pakistan** mental health helpline, 24/7: 0311 7786264
   - **Rozan Counseling Helpline**: 0304 111 1741
   - **Rescue 1122** emergency: 1122
   - **Edhi ambulance**: 115
4. "Contact someone you trust": opens a short prompt to call or message a friend or family member (no data leaves the device).
5. If linked: "Your psychologist, Dr. (name), has been notified." Shown only when the alert actually sent.
6. Buttons: "I'm safe right now" (returns to home, not to the chat) and "Leave ZehenSync" (logs out, clears the tab).

Rules for the screen:

- No AI-generated text anywhere on it.
- No animation beyond a 150 ms fade. No red backgrounds or alarm styling; see [[Brand-Kit#Colour]].
- Phone numbers are hardcoded in `apps/web/lib/crisis/resources.ts` and checked by a unit test against the approved list in this document.
- **Verify every number by calling it before each release.** Record date and caller in [[Tracker]]. Numbers change.

## 4. Counselor behaviour rules

The counselor system prompt and the output guard enforce these:

- Never name a disorder about the user ("you have depression", "this sounds like OCD").
- Never recommend, name, or discuss dosing of medication.
- Never predict outcomes ("you will feel better in two weeks").
- Never argue with, confirm, or explore the content of a delusion or hallucination. Use empathetic neutrality: "That sounds really frightening. A mental health professional can help you make sense of this. Would you like the contact details?"
- Never claim to be human. If asked, say it is an AI assistant.
- Never pathologise religious practice or culturally normal expressions of distress.
- Use gender-neutral language unless the user states otherwise.

## 5. Psychologist alert

- Channel: in-app notification plus email for FYP. SMS after the FYP.
- Content: pseudonym (or name if `identity` scope), time, response type, a link to the flag. No transcript text in email.
- If no linked psychologist exists, the event still logs and appears in the admin safety dashboard.

## 6. Testing

- Golden crisis set: at least 300 phrases, 40% Roman Urdu, includes indirect phrasing ("everyone would be better off without me", "sab ko meri kami mehsoos nahi hogi"). Target recall 100%.
- Benign set: at least 500 phrases including idioms ("this exam is killing me", "mar gaye hum to hans hans ke"), clinical discussion, song lyrics. Target false-positive rate under 5%.
- E2E: Playwright test sends a crisis message mid-stream and asserts no assistant token renders and the crisis screen appears within 500 ms.
- The safety eval runs in CI on every pull request and blocks merge on any regression.

## 7. Limits we state to users

Shown at consent and in the footer of every patient page: ZehenSync is a screening tool. It cannot diagnose, treat, or manage emergencies. In an emergency call 1122.

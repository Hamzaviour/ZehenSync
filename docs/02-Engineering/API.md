---
tags: [engineering, api]
status: draft-v1
updated: 2026-09-28
---

# API Contract

Related: [[TRD]] · [[Backend-Schema]] · [[App-Flow]]

Base path `/api/v1`. JSON everywhere except SSE streams and file uploads. FastAPI generates OpenAPI at `/api/v1/openapi.json`; the frontend client and zod schemas come from it, so this page lists intent, not every field.

## Conventions

- Auth: `Authorization: Bearer <access>`; refresh via httpOnly cookie on `/auth/refresh`.
- Errors: `{"error": {"code": "SNAKE_CASE", "message": "human text", "detail": {}}}`.
- Reserved code `CRISIS_HARD_STOP` with HTTP 409 and `detail.resources[]`. The web client handles it globally.
- Pagination: cursor based, `?cursor=&limit=` returns `{items, next_cursor}`.
- Idempotency: `Idempotency-Key` header on answer submit and message send.
- Every response carries `X-Request-Id`.

## Auth and account

| Method | Path | Role | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | public | `{email, password, display_name, birth_year, path: "support"|"scholar"}` |
| POST | `/auth/signup/clinician` | public | multipart with proof document; account starts `pending_verification` |
| POST | `/auth/login` | public | returns access token, sets refresh cookie; `mfa_required` when 2FA on |
| POST | `/auth/mfa/verify` | pending-mfa | TOTP code |
| POST | `/auth/refresh` | cookie | rotate refresh, new access |
| POST | `/auth/logout` | any | revoke family |
| GET | `/me` | any | user, role, consents, onboarding state |
| GET/POST/DELETE | `/me/consents[/{type}]` | any | list, grant, revoke |
| POST | `/me/mfa/setup`, `/me/mfa/enable` | any | TOTP enrol |
| POST | `/me/export` | patient, scholar | data export job |
| DELETE | `/me` | patient, scholar | schedule deletion |

## Patient

| Method | Path | Purpose |
|---|---|---|
| GET | `/patient/intake` | intake form definition + saved progress |
| PUT | `/patient/intake/answers` | save partial answers |
| POST | `/patient/intake/complete` | finalise; derives risk factors |
| GET | `/patient/home` | next suggested step, recent results, open safety state |
| GET | `/patient/timeline?instrument=` | score series with bands |
| GET | `/instruments` | available instruments for this user |
| POST | `/screenings` | `{instrument_code, trigger_source}` starts session |
| GET | `/screenings/{id}/next` | next item `{item_id, displayed_text, canonical_text, options, progress}` |
| POST | `/screenings/{id}/answers` | `{item_id, value, note?, shown_at}`; may return 409 crisis or `{pathway: "safety"}` |
| POST | `/screenings/{id}/complete` | returns score, band, plain-language summary |
| POST | `/screenings/{id}/abandon` | |
| POST | `/biomarkers/windows` | batch of browser windows `{context_type, context_id, windows[]}` |
| POST | `/counselor/threads` | new thread |
| GET | `/counselor/threads/{id}` | messages |
| POST | `/counselor/threads/{id}/messages` | SSE: `token`, `tool_suggest_instrument`, `guard_replaced`, `done`, or 409 crisis before stream |
| POST | `/counselor/voice` | multipart audio; returns `clip_id`, job status |
| GET | `/counselor/voice/{clip_id}` | transcript when ready |
| POST | `/counselor/threads/{id}/close` | ends thread, triggers profiler |
| POST | `/crisis/manual` | "Get help now" pressed |
| POST | `/crisis/{event_id}/ack` | "I'm safe right now" |
| GET | `/patient/links` | my psychologist links |
| POST | `/patient/links` | `{invite_code, scopes[]}` |
| PATCH | `/patient/links/{id}` | change scopes |
| DELETE | `/patient/links/{id}` | revoke |
| GET | `/patient/reports` | list |
| POST | `/patient/reports` | generate patient summary |
| POST | `/research/recordings` | resumable upload init (needs `research_recording` consent) |

## Clinician

All require verified clinician and 2FA. Every call writes an audit event.

| Method | Path | Purpose |
|---|---|---|
| GET | `/clinician/invite` | my invite code; `POST` to rotate |
| GET | `/clinician/queue?severity=&cursor=` | linked patients ordered by open flag severity, then delta, then last activity |
| GET | `/clinician/patients/{pid}` | overview filtered by granted scopes |
| GET | `/clinician/patients/{pid}/screenings` | sessions with scores and deltas |
| GET | `/clinician/patients/{pid}/screenings/{sid}` | item-level answers with canonical and displayed text |
| GET | `/clinician/patients/{pid}/flags` | flags |
| GET | `/clinician/flags/{fid}` | flag with ordered source events and their payloads |
| POST | `/clinician/flags/{fid}/reviews` | `{action, note?}` |
| GET | `/clinician/patients/{pid}/markers?context_id=` | biomarker windows with quality |
| GET | `/clinician/patients/{pid}/transcripts/{thread_id}` | needs `transcripts` scope |
| GET/POST | `/clinician/patients/{pid}/notes` | notes |
| POST | `/clinician/patients/{pid}/exports` | `{format: pdf|json, session_ids[]}` returns job |
| GET | `/clinician/exports/{id}` | download link (short-lived) |
| POST | `/clinician/assistant` | SSE, cited answers about criteria or this patient's shared data |
| GET | `/clinician/alerts` | unread crisis and urgent alerts |

## Scholar

| Method | Path | Purpose |
|---|---|---|
| GET/PATCH | `/scholar/profile` | level, institution, visible parts of learner profile |
| POST | `/scholar/threads` | new thread |
| GET | `/scholar/threads` | list |
| POST | `/scholar/threads/{id}/messages` | SSE: `retrieval` (tiers, sources), `token`, `citations`, `refused`, `done` |
| GET | `/scholar/citations/{kind}/{id}` | full passage or abstract for sidebar |
| POST | `/scholar/papers` | upload PDF for summary (P2) |
| GET | `/scholar/sim/cases` | list cases by focus and difficulty |
| POST | `/scholar/sim/sessions` | start |
| POST | `/scholar/sim/sessions/{id}/messages` | SSE simulated patient reply |
| POST | `/scholar/sim/sessions/{id}/end` | returns debrief job |
| GET | `/scholar/sim/sessions/{id}` | transcript + debrief |

## Admin

| Method | Path | Purpose |
|---|---|---|
| GET | `/admin/clinicians?status=pending` | verification queue |
| POST | `/admin/clinicians/{uid}/decision` | `{approve: bool, reason}` |
| GET/POST | `/admin/corpus/sources` | list, add |
| POST | `/admin/corpus/sources/{id}/reindex` | re-chunk and embed |
| GET | `/admin/audit?actor=&subject=&action=` | audit search |
| GET | `/admin/safety/events` | crisis events without a linked clinician |
| GET | `/admin/health` | component health |

## System

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | liveness |
| GET | `/health/ready` | DB, Redis, worker heartbeat |

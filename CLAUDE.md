# ZehenSync AI: instructions for AI assistants

Read before any work:

1. `docs/06-Memory/Memory.md`: current status and key facts.
2. `docs/00-Home/Rules.md`: binding rules. Clinical-safety rules override everything else.
3. The doc for the area you're touching: `docs/01-Product/PRD.md`, `docs/02-Engineering/TRD.md`, `docs/02-Engineering/Backend-Schema.md`, `docs/02-Engineering/API.md`, `docs/03-Design/App-Flow.md`, `docs/03-Design/Design-System.md`, `docs/04-Brand/Brand-Kit.md`, `docs/07-Clinical/Safety-Protocol.md`, `docs/07-Clinical/Instruments.md`.

Hard rules (full list in Rules.md):

- The product screens; it never diagnoses, prescribes, or treats.
- Scores come only from `packages/instruments`. No LLM output writes scores, bands or flags.
- The crisis check runs before every LLM call on patient input.
- Scholar code never touches patient modules or the `patient` schema.
- No real patient data anywhere in dev, tests or prompts.
- Use design tokens; no raw hex in components. Follow the anti-slop checklist in Brand-Kit.md.

Workflow:

- Work on the current phase branch (`phase/pN-name`); one commit per tracker task, message starting with the task ID. Merge to `main` and tag only after the phase exit check passes.
- Commits are authored by Hamza Younas <hamzavelous@gmail.com> only. Never add `Co-Authored-By` or any AI attribution.
- Tests first for scoring, safety, permissions and trace logic.
- Update Tracker.md, RTM.md and Memory.md in the same change when status, requirements or decisions move.
- Record new architecture decisions in `docs/06-Memory/Decisions.md`.
- `source-docs/` is read-only reference. The vault wins where they disagree.

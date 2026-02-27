# Jan Process Demo TODO

Last updated: 2026-02-27
Branch: `feat/jan-process-demo`

## Status legend
- ✅ Done
- 🟡 In progress / pending external system
- ⬜ Not started

## Task list

1. ✅ Create dedicated Jan demo project TODO list
   - Added this file (`docs/jan-demo-todo.md`).

2. ✅ Fix deployment blocker (security policy failures)
   - Upgraded vulnerable/policy-blocked runtime dependencies and lockfile:
     - `next` → `^15.5.12`
     - `eslint-config-next` → `^15.5.12`
     - `react` / `react-dom` → `^19.1.1`
     - `@types/react` / `@types/react-dom` updated for compatibility
   - Ran `npm audit --omit=dev` and confirmed **0 runtime vulnerabilities**.

3. ✅ Verify local quality gates
   - `npm run lint` passes
   - `npm run build` passes

4. ✅ Run browser click QA on `/jan-demo`
   - Verified major interactions using OpenClaw browser automation:
     - stage advance
     - skip-next logic
     - role handoff + claim
     - flag toggles
     - file upload
     - signature action
     - add temporary user + auto-switch
     - activity feed updates

5. ✅ Produce QA report
   - Added `docs/jan-demo-qa.md`.

6. 🟡 Verify preview after push
   - ✅ Pushed fixes to `feat/jan-process-demo`.
   - ⏳ Vercel preview deployment triggered and currently pending final status.

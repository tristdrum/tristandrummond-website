# Jan Process Demo Spec

## Goal
Deliver a same-day, interactive process-automation demo route for Jan Kotsia inside Tristan's existing website.

## Route
- `GET /jan-demo`

## Demo Scope (v1)
- Fake authentication via active-user picker (+ temporary user add).
- Kanban-style staged process board with drag-and-drop between stages.
- Stages represent role-based ownership:
  1. Intake (Intake Agent)
  2. Qualification (Ops Lead)
  3. Proposal (Ops Lead)
  4. Approval (Compliance Officer)
  5. Complete (Client Success)
- Role/user handoff simulation:
  - Auto reassigns owner when moving into a stage with a mapped role.
  - Manual "Claim" action supported.
- Per-process controls:
  - Toggle switches (`Notify client`, `Needs review`, `Requires signature`)
  - `Skip next stage` switch
  - `Move back` and `Advance` actions
- Document upload field (client-side filename capture for demo).
- Signature field (typed signature + one-click sign as active user).
- Live activity feed for observable process/audit trail.

## Data Model (UI-only runtime)
Client-side in-memory state seeded with:
- Demo users (role tagged)
- Demo process cases
- Activity entries generated from interactions

No backend required for demo operation.

## Optional Persistence (Supabase-ready)
A SQL migration is included for `jan_demo_*` tables to support persistence later:
- `jan_demo_users`
- `jan_demo_processes`
- `jan_demo_activity`

## UX / Responsiveness
- Mobile-first layout
- Horizontal scroll kanban columns on narrow screens
- Touch-friendly buttons and inputs

## Acceptance Checklist
- [x] Route works inside existing website
- [x] Drag/drop columns moves process stage
- [x] Advance/back + skip-next behavior works
- [x] Handoff visible via owner changes + activity log
- [x] Document upload and signature inputs present
- [x] Mobile responsive behavior

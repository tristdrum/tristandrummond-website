# Jan Demo QA Report

Date: 2026-02-27  
Branch: `feat/jan-process-demo`  
Route under test: `/jan-demo`

## 1) Build/deployment blocker remediation

### Changes made
- Updated dependency set to remove policy-blocking vulnerabilities:
  - `next`: `^15.0.1` → `^15.5.12`
  - `eslint-config-next`: `15.0.1` → `^15.5.12`
  - `react`: prerelease pin → `^19.1.1`
  - `react-dom`: prerelease pin → `^19.1.1`
  - `@types/react`: `^18` → `^19.1.12`
  - `@types/react-dom`: `^18` → `^19.1.9`
- Regenerated lockfile via npm install/audit fix.

### Security verification
- Command: `npm audit --omit=dev`
- Result: **0 vulnerabilities found** (runtime deps)

## 2) Local verification gates

### Lint
- Command: `npm run lint`
- Result: ✅ Pass (no ESLint errors)

### Production build
- Command: `npm run build`
- Result: ✅ Pass (`Next.js 15.5.12`, static generation complete)

## 3) Browser click QA (OpenClaw browser automation)

Environment: local dev server at `http://localhost:3000/jan-demo`

| Test case | Steps | Expected | Result |
|---|---|---|---|
| Page render | Open `/jan-demo` | Header, fake-auth panel, kanban columns, activity feed visible | ✅ Pass |
| Stage advance + handoff | Click **Advance** on `JAN-101` in Intake | Card moves to Qualification, owner role handoff applies, activity feed logs transition | ✅ Pass |
| Claim ownership | Switch active user to Jan K.; click **Claim** on `JAN-103` | Owner updates to active user, feed logs claim | ✅ Pass |
| Flag toggle | Toggle `Notify client` on `JAN-103` | Checkbox state changes, feed logs toggle event | ✅ Pass |
| Skip-next logic | Enable **Skip next stage** for `JAN-102`, then **Advance** | Card jumps from Qualification → Approval, feed logs skipped transition | ✅ Pass |
| Document upload | Upload `jan-demo-upload.txt` to `JAN-102` | Filename appears in documents list, feed logs upload count | ✅ Pass |
| Signature workflow | Click **Sign as Jan K.** on `JAN-102` | Signature field populated with active user name, feed logs sign-off | ✅ Pass |
| Add temporary user | Enter `QA Tester`, role `Client Success`, click **Add + switch user** | User is added to selector and becomes active | ✅ Pass |
| Final stage completion | Click **Advance** on `JAN-103` while in Approval | Card moves to Complete, feed logs 4→5 transition and owner handoff | ✅ Pass |

Screenshot captured during QA: local artifact at  
`/Users/tristdrum/.openclaw/media/browser/20713469-3ac8-4c92-b290-a6ec007945c8.jpg`

## 4) Notes / risks

- Local `next dev` shows a non-blocking workspace-root warning due multiple lockfiles on the host machine (outside this repo). This does not block build output.
- Vercel preview revalidation requires push + CI/check refresh after commit.

## 5) QA verdict

**PASS** for Jan demo scope and local build/lint gates.

The primary blocker (dependency security policy failure) is addressed in code + lockfile, and runtime audit is clean.

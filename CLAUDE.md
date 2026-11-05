# Green Home Grant checker

React 18 + Vite 5 + react-router-dom 6 eligibility checker (GOV.UK style, WCAG 2.2 AA). Read `intent.md`, `spec.md`, `plan.md` first; rules are in `docs/eligibility-rules.md`.

## Commands
- `npm run dev` — dev server on port 5002 (lab host, https://<hostname>:5002). Do not change the `server` block in `vite.config.js`.
- `npm test` — Vitest (jsdom). Example: `Tests  14 passed (14)`
- `npm run build` then `npm run preview` — production build, used for Lighthouse.
- Contrast/Lighthouse on saved pages: `~/.claude/skills/new-project/scripts/lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css`

## Conventions
- Files stay in the repo root (starter layout), not `app/`.
- All answers live in one `answers` object in `App` (`propertyType`, `ownership`, `incomeBand`, `heating`).
- Eligibility is one pure function, `src/utils/eligibility.js`, returning `{ status, reasons }`; status is `eligible`, `partial` or `not-eligible`.
- Questions are data in `src/data/questions.js`, rendered by one `QuestionPage`.
- Use react-router `Link`/`useNavigate`, never `<a href="/...">` (reloads lose the answers; breaks behind a path prefix).
- No `<style>`, `style=""` or inline `onclick`. CSS in `src/App.css` only.
- One `<main>` only (in `App.jsx`).
- Never change a test's expected result to make it pass; ask first.
- On-screen wording is "partially eligible"; code uses `partial`.

## Common mistakes

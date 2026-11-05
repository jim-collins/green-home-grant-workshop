Sources: intent.md, spec.md, README.md, Rubric.pdf, W3 - Hackathon 1 Pack.pdf, the starter code in `src/`

# Plan: Green Home Grant eligibility checker

## Context
`spec.md` is approved. This plan builds it on the supplied React + Vite starter in as few steps as the spec needs. Nothing is built until you say so.

**Two things the starter gets wrong, which the plan fixes:**
- Links such as `<a href="/">` (Back link, header, footer) reload the whole page, which would wipe the answers held in React state, and they break behind a path prefix. We use react-router `Link`s instead.
- `AccessibilityStatementPage` has its own `<main>` inside the `<main>` in `App.jsx` (two main landmarks).

**Deviation from the lab's standing rules (needs your OK):** the starter's files already sit in the repository root and the README says to work there, so I keep them there instead of moving everything into `app/`. The Python/Flask rules (port 5000, `.py`) do not apply to this JavaScript app. Dev server: port 5002 (starter's `vite.config.js`, server section untouched). Port 5000 is currently in use by something else on this machine, and this plan does not need it.

## Provisional answers (open questions from spec.md)
| # | Open question | What the build uses until you answer |
|---|---|---|
| 1 | Property types | Detached house, Semi-detached house, Terraced house, Bungalow, Flat or maisonette, Other. "Other" has no effect on eligibility. |
| 2 | Early exits skip Check your answers | Yes: flat/maisonette and renters go straight to the result. |
| 3 | Result page content | Panel with the outcome, the reason(s), and one short plain "what happens next" sentence per outcome. No grant value, no apply link (none was given). |
| 4 | After a Change | Back to Check your answers if every question is answered. Otherwise on to the next unanswered question. |
| 5 | Income wording | Hint: "Add up the yearly income of everyone in your household, before tax." |
| 6 | "Other" / "None" options | Only property type has "Other". Heating keeps exactly the four options. |
| 7 | Several reasons | The result lists every reason that applies. |
| 8 | Landlords abroad / UK property | Start page says "The property must be in the UK." No residency question. |
| 9 | Confirmation pattern | The result page is the confirmation (GOV.UK panel). |

## Design (kept small)
- **State:** one `answers` object in `App` (`propertyType`, `ownership`, `incomeBand`, `heating`), passed to pages as props.
- **One data-driven question page:** `src/data/questions.js` holds each question's path, legend, hint, options, error message and "ends journey" answers. `src/pages/QuestionPage.jsx` renders any of them. This replaces the four near-identical starter pages (Rubric: no duplication). The starter's `PropertyTypePage`, `OwnershipPage`, `IncomePage`, `InsulationPage`, `HeatingPage` files are deleted.
- **Rules:** one pure function in `src/utils/eligibility.js`: `checkEligibility(answers)` returns `{ status: 'eligible' | 'partial' | 'not-eligible', reasons: [...] }` (status spelling follows the pack's example test).
- **Small components:** `ErrorSummary`, `RadioQuestion` (fieldset, legend, hint, inline error), plus the starter's `GovukHeader`, `PhaseBanner`, `GovukFooter`, `GovukButton`.
- **Page behaviour:** a `usePageTitle` hook sets a distinct `document.title` and moves focus to the page's `<h1>` after each route change.

## Pages and error states (for the accessibility checks)
Pages: Start, Property type, Ownership, Income, Heating, Check your answers, Result (eligible), Result (partially eligible), Result (not eligible), Accessibility statement.
Error states: each of the four question pages with nothing chosen.

## Steps

### Step 1: Test tooling and project notes
- **Files:** `package.json`, `vite.config.js` (test block only, server block untouched), `CLAUDE.md`, `docs/eligibility-rules.md`, `.gitignore`
- **What will be done:** install `vitest@1`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `axe-core` (or `jest-axe`); add `"test": "vitest run"`. Write `CLAUDE.md` (under a page: run/test commands with example output, conventions, empty "Common mistakes"). Write the rules table to `docs/eligibility-rules.md`. Delete the insulation page and route.
- **Risks:** Vitest 1 must work with the starter's Vite 5. The lockfile changes.
- **Check:** `npm test` runs and reports "No test files" without error; `npm run build` still succeeds.

### Step 2: Eligibility function (tests first)
- **Files:** `src/utils/eligibility.test.js`, `src/utils/eligibility.js`
- **What will be done:** write the tests first from the spec's rule table, watch them fail, then write the function. Tests cover: eligible path, partial via income, partial via electric heating, not eligible via flat, via each renter option, via over £50,000, via heat pump; "any not eligible beats partial"; boundary values (the income options map to bands, so the test checks the band decision, not a number); under £30,000 has no effect; several reasons listed; same input gives same output.
- **Risks:** misreading a rule. Expected results come from `spec.md`, and I will not change an expected result to make a test pass.
- **Check:** `npm test` shows at least 12 passing tests (requirement 29 asks for 5).

### Step 3: App shell and navigation
- **Files:** `src/App.jsx`, `src/App.css`, `src/components/GovukHeader.jsx`, `PhaseBanner.jsx`, `GovukFooter.jsx`, `src/hooks/usePageTitle.js`, `src/pages/AccessibilityStatementPage.jsx` (remove the extra `<main>`)
- **What will be done:** mount phase banner (Alpha + feedback link) and footer; replace every `<a href>` with `Link`; add the missing CSS (footer, phase banner, tag, fieldset/legend, hint text, skip link, focus styles, 320px reflow) using the starter's CSS variables; add the title and focus hook; add a skip link.
- **Risks:** the starter CSS may lack classes used by the starter components (footer, phase banner), and some colours may fail contrast.
- **Check:** `npm run build` succeeds; a test renders the shell and confirms one `main` landmark, one `banner`, one `contentinfo`; axe finds no violations on the shell.

### Step 4: Start page and question pages with validation (tests first)
- **Files:** `src/data/questions.js`, `src/components/RadioQuestion.jsx`, `src/components/ErrorSummary.jsx`, `src/pages/QuestionPage.jsx`, `src/pages/StartPage.jsx`, `src/pages/QuestionPage.test.jsx`, `src/pages/StartPage.test.jsx`
- **What will be done:** start page (title, description, who the grant is for, "Start now"); four questions with radios, Continue, Back, validation (error summary with "There is a problem", link to the first radio, inline error); flats and renters go straight to the result; answers stay when going Back.
- **Risks:** focus handling (error summary link must focus the radio; page change must focus the heading); Back after an early exit leaves later answers empty.
- **Check:** component tests pass for: empty submit shows both errors; summary link focuses the first radio; answer kept after Back; flat and renter route straight to `/result`; income over £50,000 continues to heating; axe finds no violations (colour contrast off in jsdom) on the start page and on each of the 4 question pages and their 4 error states.

### Step 5: Check your answers and result
- **Files:** `src/pages/CheckAnswersPage.jsx`, `src/pages/ResultPage.jsx`, `src/pages/CheckAnswersPage.test.jsx`, `src/pages/ResultPage.test.jsx`, `src/App.css`
- **What will be done:** summary list (`<dl>`) of the answers with "Change" links and hidden text; the Change rule from provisional answer 4; confirm button; result panel for each outcome with reasons and next-step sentence; "Check again" link that clears the answers. A direct visit to `/check-answers` or `/result` with no answers redirects to the start page.
- **Risks:** the Change/Back journey after an early exit (the riskiest step, see below).
- **Check:** tests pass for: every answer has a Change link with hidden text; Change shows the selected answer and returns to the summary; the three outcomes render the right panel and reasons; a full eligible journey, a partial journey and a not-eligible journey run end to end; axe finds no violations on Check your answers and the three result pages.

### Step 6: Accessibility statement, contrast and evidence
- **Files:** `src/pages/AccessibilityStatementPage.jsx`, `tests/pages/` (saved HTML, git-ignored), `tests/save-pages.test.jsx`, `AI_LOG.md`, `done.md`
- **What will be done:** fill in the statement from what the tests found (service name, how accessible, known problems, contact, how it was tested, plan to improve). Save the HTML of every page and error state to `tests/pages/`. Run contrast checks in real Chrome against the built CSS. Complete three or more `AI_LOG.md` entries from this work (plan-mode planning, test generation, a critique of generated code), each with all four fields.
- **Risks:** colour contrast fails only in a real browser; the AI log entries must describe real changes made.
- **Check:** `lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css` exits 0 with no `INCOMPLETE`; axe finds no violations on the statement page; `AI_LOG.md` has at least 3 completed entries.

### Step 7: Final checks
- **Files:** none new; `done.md` records the manual checks.
- **What will be done:** `npm run build` and `npm run preview`, Lighthouse on every page that has its own address (`/`, `/property-type`, `/ownership`, `/income`, `/heating`, `/check-answers`, `/result`, `/accessibility-statement`); measure width at 320px. Then you do the manual accessibility checklist in a real browser.
- **Risks:** a single-page app shows Lighthouse only the page it loads, so deep links must work on the preview server.
- **Check:** Lighthouse accessibility 100 with no failing axe audits and performance at least 90 on each page; no horizontal scroll at 320px; `npm test` all pass; the manual checklist below, which only you can pass.

## Manual accessibility checklist (you do this in Step 7, on the preview build)
1. **Keyboard only:** Tab through Start → Property type → Ownership → Income → Heating → Check your answers → Result, and through each error state. Focus is always visible, nothing traps it, the "Skip to main content" link works, each page change starts at the heading, each error summary link focuses its first radio, arrow keys move between radios.
2. **Screen reader:** each page title/heading is announced; the error summary is announced; every radio is read with its question, hint and error; "Change" links read as "Change property type", "Change ownership" and so on; the result panel is announced.
3. **Zoom and reflow:** 200% and 400% (320px) on every page, plus a text-spacing bookmarklet; nothing cut off, no sideways scroll.
4. **Contrast the tools don't measure:** radio borders, focus outlines, the phase-banner tag, and link hover/focus colours reach 3:1.
5. **WCAG 2.2:** the sticky nothing hides focus (no sticky elements are planned); targets (Back, Change, footer links, feedback link) are at least 24×24px; no one retypes an answer (answers are kept); there is no login.
6. **Content:** each page has its own tab title; each error says what to do; link and button text says what happens; plain English.

## Riskiest step
**Step 5 (Check your answers and result)**, because the Change journey meets the early exits: a user can arrive at the result without a full set of answers, then press Back, change an answer, and need to be taken forward correctly. The step has tests for each of those paths before the code is written.

## Final check: every requirement
| Req | Delivered by | Covered by |
|---|---|---|
| 1–3 | Step 4 | StartPage tests |
| 4–7 | Step 4 | QuestionPage tests (order, labels, Back keeps answer) |
| 8–11 | Steps 2, 4 | Rule tests and QuestionPage tests (options, early exits) |
| 12–13 | Step 4 | Empty-submit and focus tests |
| 14–17 | Step 5 | CheckAnswersPage tests |
| 18–22 | Steps 2, 5 | Eligibility tests, ResultPage tests, "Check again" test |
| 23 | Steps 3–5 | Manual checklist item 1 |
| 24 | Steps 3, 6, 7 | Lighthouse/contrast run, 320px measurement |
| 25 | Step 3 | Hook test (title, focus) + manual checklist item 2 |
| 26 | Steps 3, 4, 5 | Manual look in browser against the GOV.UK patterns |
| 27 | Step 3 | Shell test (banner, footer link) |
| 28 | Step 6 | Statement page axe test |
| 29 | Step 2 | `npm test` count |
| 30 | Step 6 | `AI_LOG.md` check |

No requirement is without a step. Requirement 26 (GOV.UK look) has no automated check, so it is covered by your visual check at the end, and the plan says so.

## Verification, end to end
`npm test` (all pass) → `npm run build` → `lighthouse-pages.sh --dir tests/pages --css dist/assets/index-*.css` → `npm run preview` + Lighthouse per page → your manual checklist in a browser on the preview build. Three journeys to try by hand: eligible (house, owner, under £30,000, gas), partial (house, landlord, £30,000 to £50,000, electric), not eligible (renter, and flat).

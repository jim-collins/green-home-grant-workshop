# AI Assistance Log

Record every instance where you use AI to generate, refactor, or debug code. Four fields per entry: what you asked for, what the AI produced, what you changed, and why you changed it.

Document **3+ entries** in your AI_LOG covering **3-5 distinct patterns** from this list -- planning, multi-agent critique, plan-mode scaffolding, refactor, test generation. Aim for variety: an entry that just says "asked Claude to write X" three times doesn't demonstrate AI as a real engineering tool.

## Instance 1: Planning the build in plan mode (planning, plan-mode scaffolding)

| Field | Detail |
|-------|--------|
| **Date** | 2026-11-05 |
| **Task** | Turn the approved `spec.md` into a build plan (`plan.md`) for the Green Home Grant checker, using Claude's plan mode and reading the starter code first. |
| **What AI Generated** | A 7-step plan with files, risks and checks per step, a table of provisional answers for the 9 open questions, and a requirement-by-requirement coverage table. It also read the starter and flagged two faults in it: `<a href="/">` links that reload the page and would wipe the answers held in React state, and an accessibility statement page with a second `<main>` nested inside the one in `App.jsx`. |
| **What You Changed + Why** | I decided the rules the AI could not decide: no fifth question (even though the brief says 5+), "any not eligible answer wins", under £30,000 is fully eligible, and no cookie notice. Each was moved from an assumption to a decision in `spec.md` before the plan was approved, because the AI had only guessed at them. I also approved keeping the starter in the repository root instead of moving it into `app/`. |

## Instance 2: Test generation caught two real bugs (test generation)

| Field | Detail |
|-------|--------|
| **Date** | 2026-11-05 |
| **Task** | Write tests for the question pages and journey rules before the code, then build the code to pass them. |
| **What AI Generated** | 15 unit tests for `checkEligibility` and the journey rules from the spec's rule table, then component tests that click through the whole app. When they ran, two failures showed up. First, going Back two pages showed the wrong answer: all four questions used the same `QuestionPage` element in the same place, so React reused one component and kept the previous question's selection. Second, around 80 "not wrapped in act()" warnings, caused by two different copies of `@testing-library/dom` being installed. |
| **What You Changed + Why** | Added `key={question.key}` so each question page starts fresh. Installed one shared `@testing-library/dom@9` so the warnings disappeared instead of being hidden. The expected results in the tests came from the spec, and none of them was edited to make a test pass. |

## Instance 3: Critique of generated accessible link text (critical review)

| Field | Detail |
|-------|--------|
| **Date** | 2026-11-05 |
| **Task** | Check the "Change" links on Check your answers, which need hidden text so a screen reader hears "Change property type" rather than just "Change". |
| **What AI Generated** | `Change<span class="govuk-visually-hidden"> property type</span>`, which looked right and is the GOV.UK pattern. The test for the link's accessible name failed: the computed name was not "Change property type", because the space sat inside the hidden span, where it is dropped when the name is worked out. |
| **What You Changed + Why** | Moved the space outside the span (`Change <span ...>property type</span>`) so the name has a space in every browser and screen reader. A looks-right pattern can still be wrong, so the check is a test of the accessible name, not a visual check. |

Sources: intent.md, README.md, Rubric.pdf, W3 - Hackathon 1 Pack.pdf


## 1. Requirements

Each one can be checked by using the running app.

### Start page
1. The start page shows a title, a short description and a "Start now" button.
2. The start page says that the grant is only available to homeowners or landlords.
3. "Start now" takes the user to the first question.

### Question pages
4. There is one question per page, in this order: Property type, Ownership, Household income band, Current heating. There is no fifth question (decided; see Decisions).
5. Every question is answered with radio buttons, and each radio has a label. Clicking a label selects its option.
6. Every question page has a "Continue" button and a "Back" link. Back returns to the previous question with the answer still selected.
7. Answers are kept while the user moves between pages. Going Back or following a Change link never loses another answer.
8. Property type offers the property types (list: open question 1). Choosing a flat or maisonette goes straight to the "not eligible" result, without the remaining questions.
9. Ownership offers exactly: "I own and live in it", "I own it and rent it out (landlord)", "I rent from a private landlord", "I rent from a council or housing association". Choosing either renter option goes straight to the "not eligible" result.
10. Household income band offers exactly: "Under £30,000", "£30,000 to £50,000", "Over £50,000". Choosing "Over £50,000" does not stop the journey: the user carries on and sees "not eligible" at the end.
11. Current heating offers exactly: "Gas boiler", "Oil boiler", "Electric", "Heat pump already installed".

### Validation
12. Pressing Continue with nothing chosen keeps the user on the page and shows an error summary at the top (heading "There is a problem", with a link to the question) and an inline error on the question.
13. Each error message says what to do, for example "Select the type of property you live in". Selecting the link moves focus to the first radio.

### Check your answers
14. After the last question, a "Check your answers" page lists every answer in a summary list.
15. Each answer has a "Change" link whose hidden text names the question (for example "Change property type"). Following it shows that question with the answer selected.
16. After a change, the user continues through any questions they have not yet answered, then returns to Check your answers. **(assumption: see open question 4.)**
17. The page has a button to confirm and see the result.

### Result
18. The result page shows one of three outcomes: **eligible**, **partially eligible** or **not eligible**, with the reason(s) in plain English.
19. The outcome is worked out from the answers like this:
    - any ineligible answer gives "not eligible"
    - otherwise, any partial answer gives "partially eligible"
    - otherwise "eligible"
20. The answer-to-outcome rules are exactly:

    | Question | Answer | Effect |
    |---|---|---|
    | Property type | Flat or maisonette | ot eligible (ends journey) |
    | Property type | Any other type | o effect |
    | Ownership | I own and live in it | o effect (eligible) |
    | Ownership | I own it and rent it out (landlord) | o effect (eligible) |
    | Ownership | Either renter option | ot eligible (ends journey) |
    | Income | Under £30,000 | o effect (fully eligible) |
    | Income | £30,000 to £50,000 (including exactly £30,000 and exactly £50,000) | Partially eligible |
    | Income | Over £50,000 | ot eligible |
    | Heating | Gas boiler, Oil boiler | o effect (eligible) |
    | Heating | Electric | Partially eligible |
    | Heating | Heat pump already installed | ot eligible |

21. The same answers always give the same outcome, and the rules live in one function that the pages only call.
22. A user can start again from the result page.

### Accessibility and GOV.UK
23. The whole journey (start page to result) can be completed with the keyboard alone, and focus is always visible.
24. All text has at least 4.5:1 contrast, and no page scrolls sideways at 320px width.
25. After every page change, focus and the page title tell a screen-reader user the new page has loaded. Each page has its own tab title.
26. The pages use the GOV.UK type scale, spacing, header, colours and buttons from the starter's CSS variables.
27. A phase banner ("Alpha" with a feedback link) shows under the header. The footer has a link to the accessibility statement. There is no cookie notice (out of scope).
28. An accessibility statement page exists, filled in using what the accessibility tests found. **(from pack Activity 12)**

### Evidence
29. `npm test` shows at least 5 passing unit tests of the eligibility function, including at least one each for eligible, not eligible and partially eligible, and the boundary values £30,000 and £50,000.
30. `AI_LOG.md` has at least 3 entries with all four fields filled in, covering different patterns (for example planning, plan-mode scaffolding, test generation, critique).

## 2. Decisions

| Decision | Reason |
|---|---|
| Build on the supplied React + Vite + react-router-dom starter | The brief and README require it. The lab's Python/Flask rules do not apply. |
| One state object held in `App`, with a field per question (`propertyType`, `ownership`, `incomeBand`, `heating`) | README hint; keeps answers across Back and Change |
| Eligibility rules are one pure function in `src/utils/eligibility.js`, returning a status and reason(s) | README and pack both ask for this, and it makes it unit-testable |
| Unit tests with Vitest v1 (`npm test`) | The pack says the starter has no runner and tells us to install `vitest@1` |
| Written eligibility rules go in `docs/eligibility-rules.md` | Pack Activity 4 asks for the rules to be written down |
| Flat/maisonette and renters stop the journey; income over £50,000 does not | Your answers in the interview |
| Insulation is not asked | Your answer in the interview |
| Phase banner, footer and accessibility statement are in scope; the cookie notice is not | Your answer after the first spec draft |
| Exactly £30,000 and exactly £50,000 both fall in the middle band | Your answer in the interview |
| Combine answers as "any not eligible wins, else any partial, else eligible" | Your answer after the first spec draft |
| Four questions only; no fifth question | Your answer after the first spec draft. This is below the brief's "5+ questions" and the Rubric's Excellent Functionality row, and you accepted that. |
| Under £30,000 is fully eligible on income | Your answer after the first spec draft |
| Use the starter's GOV.UK-style classes in `App.css`, not `govuk-frontend` | The starter teaches the patterns from first principles; avoids extra dependencies |
| Language split: JSX in `.jsx`, styles in `.css`, logic in `.js`, tests in `.test.js`. No inline `<style>` or `style=""` | Keeps each language in its own file |
| Relative links and the starter's `vite.config.js` unchanged (port 5002 on the lab host) | The pack says not to change the server section |
| Accessibility checks: axe-core in the tests, then Lighthouse on `npm run build` + `npm run preview`, plus the manual checklist | The JavaScript-app route in the lab's standing constraints |

## 3. Review of the source documents

### Wording that could mean two things
- "Eligible / not eligible / partial" (README) versus "partially eligible" (pack, rubric). I use "partially eligible" on screen and `partial` in code. (user)
- "Any UK resident can use it" versus "grant only for homeowners or landlords". The first says who may use the checker; the second says who can get the grant. A landlord may not live in the UK. (user)
- "All property types" has no list.
- "Household income" does not say gross or net, annual or monthly, or whose income counts.
- "Flats are ineligible": the intent does not say whether a flat owner who owns the freehold, or a share of it, is treated differently.

### Cases not covered
- Someone whose home fits none of the listed property types or heating options (for example wood or solid-fuel heating, or no heating at all). They cannot answer honestly.
- Oil boiler: it is not said whether LPG counts.
- What "partially eligible" means for the user, and what to do next (for example, what is missing, or who to contact). The brief gives no next step for any outcome.
- The grant's value, how to apply, and where to go for more help are not given.
- What happens when the user follows a Change link and changes an answer that ends the journey, or changes one that was an early exit.
- What happens when a user who was sent to "not eligible" early goes Back: the later questions have no answers.
- Early exits skip Check your answers, but the README says the result comes "after confirming answers".
- Several reasons at once (for example over £50,000 and a heat pump already installed): show one or all?

### Rules that conflict
- README says "5+ question pages" (and the Rubric's Excellent row says "5+ questions"). Your decision gives four, which you accepted.
- README says the result appears after confirming answers. Your rule sends renters and flats to the result before that. (Open question 2.)
- The pack's example test uses `ownership: 'rent-council'` and `result.status` as `'not-eligible'`. This is only an example, but it fixes a result shape (`status`) and value spelling that our function should follow. It is compatible with our rules.
- The Rubric's "Excellent" Service Standard row lists a cookie notice. You have ruled it out, so that row will be short of Excellent by one signal.

### Terms used but never defined
- "Landlord", "homeowner", "flat", "maisonette", "household income", "partially eligible".

### Already settled by the interview
- Which two answers end the journey early, and which one does not.
- The income boundaries.
- The four ownership options and four heating options, and their effects.
- That insulation is out.

## 4. Open questions

| # | Question | Who answers |
|---|---|---|
| 1 | Which property types does the first question offer? I suggest: Detached house, Semi-detached house, Terraced house, Bungalow, Flat or maisonette, Other. And is "Other" eligible? | You |
| 2 | Early exits skip Check your answers. Is that acceptable, or should a renter/flat owner see Check your answers first? | You |
| 3 | What does each result page say beyond the outcome and reason (what happens next, what a "partial" user should do, any grant value)? | You (fictional scheme, so your team decides) |
| 4 | After changing an answer on Check your answers, should the user go straight back to Check your answers, or through the questions after it? (The pack's stretch goal says "return the user to the summary"; I assumed they return to the summary only if every question is answered.) | You |
| 5 | Is household income annual, gross, and for the whole household? Should the question hint say so? | You |
| 6 | Should the heating and property questions have an "Other" or "None" option, so everyone can answer? | You |
| 7 | If several reasons apply, should the result page list all of them? I suggest yes, in plain English. | You |
| 8 | Is a landlord who lives abroad within "any UK resident"? Should the start page say the property must be in the UK? | You |
| 9 | Does the course want the confirmation page to be the result page or a separate GOV.UK confirmation panel? (Rubric: "start and confirmation patterns".) | The course facilitators |

## 5. Comparison with intent.md

**Contradictions**
- Intent has four questions, but the brief requires at least five. You decided on four, so the service will not meet that requirement.

**My assumptions (not your words)**
- Back link, validation text and focus behaviour details.
- The shape of the Change-link journey (requirement 16).
- Result page shows reasons in plain English.
- Restart link on the result page.
- Specific labels such as "Flat or maisonette".

**In your intent but not yet in a requirement**
- None.

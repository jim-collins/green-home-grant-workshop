# Checks record

Date of automated checks: 2026-11-05. Manual checks below are **not done yet**: nothing is marked as passed until the user reports it.

## Automated (run by Claude)

| Check | Result |
|---|---|
| `npm test` | 96 tests pass in 8 files (15 eligibility, journey rules, all pages, axe on each page and error state with contrast off in jsdom) |
| Lighthouse accessibility (axe, including colour contrast) in real Chrome on the saved HTML of 14 pages/error states with the built CSS | 100 on all 14, `RESULT: PASS` |
| Lighthouse on the production preview build (`npm run build` + `npm run preview`) for `/`, `/property-type`, `/ownership`, `/income`, `/heating`, `/accessibility-statement` | performance 100, accessibility 100 on each |
| Same, for `/check-answers` and `/result` opened directly | These redirect to `/` when there are no answers, so Lighthouse measured the start page again: performance 96, accessibility 100 |
| Page width at 320px in headless Chrome (automated, not by hand): start, property type, property type error, ownership, result (not eligible), check your answers, result (partial), accessibility statement | `scrollWidth` 320 on all. Check your answers was 345 before a fix (default `dd` margin). |

## Manual (the user does these on the preview build)

Run: `npm run build && npm run preview`, then open the address it prints (use the lab address `https://lab11126.labs.decoded.com:<port>` if the port is proxied). `npm run dev` serves on port 5002.

| # | Check | Result | Who | Date |
|---|---|---|---|---|
| 1 | Keyboard only: Start, 4 questions, error states, Check your answers, Result. Visible focus, no traps, skip link, heading focus after page change, error summary links focus the first radio, arrow keys in radios | not done | | |
| 2 | Screen reader: page titles/headings announced, error summary announced, radios read with question, hint and error, "Change property type" links, result panel | not done | | |
| 3 | Zoom 200% and 400% plus text-spacing bookmarklet on every page | not done | | |
| 4 | Contrast the tools don't measure (3:1): radio borders, focus outline, phase banner tag, link hover/focus | not done | | |
| 5 | WCAG 2.2: focus not obscured (nothing sticky), target size 24x24px (Back, Change, footer, feedback links), no retyping, no login | not done | | |
| 6 | Content: distinct tab titles, errors say how to fix, link/button text clear, plain English | not done | | |
| 7 | Requirement 26: looks like GOV.UK (type scale, spacing, header, buttons) | not done | | |
| 8 | Three journeys by hand: eligible, partial, not eligible (renter and flat) | not done | | |

## Not proven by the automated checks
Focus and keyboard behaviour in a real browser, screen reader output, zoom and text spacing, 3:1 non-text contrast, and the GOV.UK look. These are manual checks 1 to 7.

## Open questions still unanswered (provisional answers in `plan.md`)
All 9 from `spec.md`. The app uses the provisional answers listed in `plan.md`.

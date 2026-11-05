Sources: README.md, Rubric.pdf, W3 - Hackathon 1 Pack.pdf

## Problem

The Green Home Grant is a fictional government scheme that funds home insulation and heat pumps. Today citizens phone a call centre and wait an average of 35 minutes to find out whether they qualify. The service replaces that call.

## Who it is for

Any UK resident can use the service. The target audience is homeowners. It should be accessible to everyone who needs assistive technology, through a web app.

The grant is only available to homeowners or landlords. The start page should make this clear.

## What success looks like

A multi-step eligibility checker with a start page, one question per page, a check-your-answers page with a Change link for every answer, and a result page showing eligible, not eligible or partially eligible. It follows GOV.UK design patterns and meets WCAG 2.2 AA, with 5+ passing unit tests on the eligibility logic and an `AI_LOG.md` with 3+ entries.

The questions and their rules are:

- **Property type:** offers all the property types. Flats are ineligible and go straight to the "not eligible" result without answering the remaining questions. Maisonettes count as flats.
- **Ownership:** offers "I own and live in it", "I own it and rent it out (landlord)", "I rent from a private landlord", and "I rent from a council or housing association". Renters are ineligible, and they go straight to the "not eligible" result without answering the remaining questions.
- **Household income band:** offers under £30,000, £30,000 to £50,000, and over £50,000. Over £50,000 is ineligible. £30,000 to £50,000 is partially eligible. Exactly £30,000 is in the "£30,000 to £50,000" band, and exactly £50,000 is not "over £50,000". Someone who picks over £50,000 carries on through the rest of the questions and sees "not eligible" at the end.
- **Current heating:** offers gas boiler, oil boiler, electric, and heat pump already installed. Gas boiler and oil boiler are eligible, electric is partially eligible, and heat pump already installed is not eligible.

## Constraints

Must be built with the supplied starter (React, Vite, react-router-dom), shown in a 5-minute live demo on Day 2 at 13:30, and submitted by 16:00 on Day 2.

The service does not include the Existing insulation question.

## Out of scope

The Existing insulation question.

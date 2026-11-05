// Rules are written down in docs/eligibility-rules.md.
// Each rule: which answer causes which effect, and the reason shown to the user.
const RULES = [
  {
    field: 'propertyType',
    values: ['flat'],
    effect: 'not-eligible',
    reason: 'The grant is not available for flats or maisonettes.',
  },
  {
    field: 'ownership',
    values: ['rent-private', 'rent-council'],
    effect: 'not-eligible',
    reason: 'The grant is only available to homeowners and landlords, not to people who rent their home.',
  },
  {
    field: 'incomeBand',
    values: ['over-50k'],
    effect: 'not-eligible',
    reason: 'Your household income is over £50,000.',
  },
  {
    field: 'incomeBand',
    values: ['30k-50k'],
    effect: 'partial',
    reason: 'Your household income is between £30,000 and £50,000, so you may only get part of the grant.',
  },
  {
    field: 'heating',
    values: ['electric'],
    effect: 'partial',
    reason: 'You already have electric heating, so you may only get part of the grant.',
  },
  {
    field: 'heating',
    values: ['heat-pump'],
    effect: 'not-eligible',
    reason: 'You already have a heat pump installed.',
  },
];

// Pure function: the same answers always give the same result.
export function checkEligibility(answers) {
  const matched = RULES.filter((rule) => rule.values.includes(answers[rule.field]));
  const reasons = matched.map((rule) => rule.reason);

  if (matched.some((rule) => rule.effect === 'not-eligible')) {
    return { status: 'not-eligible', reasons: matched.filter((r) => r.effect === 'not-eligible').map((r) => r.reason) };
  }
  if (matched.length > 0) {
    return { status: 'partial', reasons };
  }
  return { status: 'eligible', reasons: [] };
}

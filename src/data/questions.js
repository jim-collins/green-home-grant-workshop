// The four questions, in the order they are asked.
// `ends` lists answers that send the user straight to the result.
export const QUESTIONS = [
  {
    key: 'propertyType',
    path: '/property-type',
    title: 'What type of property is it?',
    hint: 'Select the type of property the grant would be for.',
    summaryLabel: 'Property type',
    error: 'Select the type of property',
    options: [
      { value: 'detached', label: 'Detached house' },
      { value: 'semi-detached', label: 'Semi-detached house' },
      { value: 'terraced', label: 'Terraced house' },
      { value: 'bungalow', label: 'Bungalow' },
      { value: 'flat', label: 'Flat or maisonette' },
      { value: 'other', label: 'Other' },
    ],
    ends: ['flat'],
  },
  {
    key: 'ownership',
    path: '/ownership',
    title: 'Do you own or rent the property?',
    hint: 'Select the option that best describes your situation.',
    summaryLabel: 'Ownership',
    error: 'Select whether you own or rent the property',
    options: [
      { value: 'own-live', label: 'I own and live in it' },
      { value: 'own-let', label: 'I own it and rent it out (landlord)' },
      { value: 'rent-private', label: 'I rent from a private landlord' },
      { value: 'rent-council', label: 'I rent from a council or housing association' },
    ],
    ends: ['rent-private', 'rent-council'],
  },
  {
    key: 'incomeBand',
    path: '/income',
    title: 'What is your household income?',
    hint: 'Add up the yearly income of everyone in your household, before tax.',
    summaryLabel: 'Household income',
    error: 'Select your household income',
    options: [
      { value: 'under-30k', label: 'Under £30,000' },
      { value: '30k-50k', label: '£30,000 to £50,000' },
      { value: 'over-50k', label: 'Over £50,000' },
    ],
    ends: [],
  },
  {
    key: 'heating',
    path: '/heating',
    title: 'How do you heat the property now?',
    hint: 'Select the main way you heat the property.',
    summaryLabel: 'Current heating',
    error: 'Select how you heat the property',
    options: [
      { value: 'gas', label: 'Gas boiler' },
      { value: 'oil', label: 'Oil boiler' },
      { value: 'electric', label: 'Electric' },
      { value: 'heat-pump', label: 'Heat pump already installed' },
    ],
    ends: [],
  },
];

export const NO_ANSWERS = Object.fromEntries(QUESTIONS.map((q) => [q.key, '']));

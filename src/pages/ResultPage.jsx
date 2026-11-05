import { Link, Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import { NO_ANSWERS } from '../data/questions';
import { backFromResult, canShowResult, relevantAnswers } from '../utils/journey';
import { checkEligibility } from '../utils/eligibility';

const OUTCOMES = {
  eligible: {
    title: 'You are eligible',
    panelClass: '',
    body: 'You meet all the conditions for the Green Home Grant.',
    next: 'This is an alpha prototype, so you cannot apply online yet.',
  },
  partial: {
    title: 'You are partially eligible',
    panelClass: ' govuk-panel--partial',
    body: 'You may be able to get part of the Green Home Grant.',
    next: 'This is an alpha prototype, so you cannot apply online yet.',
  },
  'not-eligible': {
    title: 'You are not eligible',
    panelClass: ' govuk-panel--not-eligible',
    body: 'You cannot get the Green Home Grant for this property.',
    next: 'You can check again if your situation changes.',
  },
};

function ResultPage({ answers, setAnswers }) {
  const outcomeKey = canShowResult(answers) ? checkEligibility(relevantAnswers(answers)).status : 'eligible';
  const outcome = OUTCOMES[outcomeKey];
  usePageTitle(outcome.title);

  if (!canShowResult(answers)) return <Navigate to="/" replace />;

  const { reasons } = checkEligibility(relevantAnswers(answers));

  return (
    <>
      <Link to={backFromResult(answers)} className="govuk-back-link">Back</Link>
      <div className={`govuk-panel${outcome.panelClass}`}>
        <h1 className="govuk-panel__title">{outcome.title}</h1>
        <div className="govuk-panel__body">{outcome.body}</div>
      </div>
      {reasons.length > 0 && (
        <>
          <h2 className="govuk-heading-m">Why you got this result</h2>
          <ul className="govuk-list govuk-list--bullet govuk-list--reasons">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </>
      )}
      <h2 className="govuk-heading-m">What happens next</h2>
      <p className="govuk-body">{outcome.next}</p>
      <p className="govuk-body">
        <Link className="govuk-link" to="/" onClick={() => setAnswers(NO_ANSWERS)}>
          Check again
        </Link>
      </p>
    </>
  );
}

export default ResultPage;

import { Link, Navigate, useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { QUESTIONS } from '../data/questions';
import { endedEarly, isComplete } from '../utils/journey';

function CheckAnswersPage({ answers }) {
  const navigate = useNavigate();
  usePageTitle('Check your answers');

  if (endedEarly(answers)) return <Navigate to="/result" replace />;
  if (!isComplete(answers)) return <Navigate to="/" replace />;

  return (
    <>
      <Link to={QUESTIONS[QUESTIONS.length - 1].path} className="govuk-back-link">Back</Link>
      <h1 className="govuk-heading-l">Check your answers</h1>
      <dl className="govuk-summary-list">
        {QUESTIONS.map((question) => {
          const option = question.options.find((o) => o.value === answers[question.key]);
          return (
            <div className="govuk-summary-list__row" key={question.key}>
              <dt className="govuk-summary-list__key">{question.summaryLabel}</dt>
              <dd className="govuk-summary-list__value">{option.label}</dd>
              <dd className="govuk-summary-list__actions">
                <Link className="govuk-link" to={`${question.path}?change=true`}>
                  Change <span className="govuk-visually-hidden">{question.summaryLabel.toLowerCase()}</span>
                </Link>
              </dd>
            </div>
          );
        })}
      </dl>
      <GovukButton onClick={() => navigate('/result')}>Accept and see your result</GovukButton>
    </>
  );
}

export default CheckAnswersPage;

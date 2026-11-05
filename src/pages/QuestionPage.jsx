import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ErrorSummary from '../components/ErrorSummary';
import RadioQuestion from '../components/RadioQuestion';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';
import { nextPath, previousPath } from '../utils/journey';

// Renders any question from src/data/questions.js.
export default function QuestionPage({ question, answers, setAnswers }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const changing = searchParams.get('change') === 'true';
  const [selected, setSelected] = useState(answers[question.key]);
  const [showError, setShowError] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const summaryRef = useRef(null);

  usePageTitle(showError ? `Error: ${question.title}` : question.title);

  // Declared after usePageTitle so focus ends on the error summary, not the heading.
  useEffect(() => {
    if (showError) summaryRef.current?.focus();
  }, [showError, submitCount]);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitCount((count) => count + 1);
    if (!selected) {
      setShowError(true);
      return;
    }
    const updated = { ...answers, [question.key]: selected };
    setAnswers(updated);
    navigate(nextPath(updated, question.key, changing));
  }

  return (
    <>
      <Link to={previousPath(question.key, changing)} className="govuk-back-link">Back</Link>
      {showError && <ErrorSummary ref={summaryRef} errors={[{ fieldId: question.key, message: question.error }]} />}
      <form onSubmit={handleSubmit} noValidate>
        <RadioQuestion
          question={question}
          value={selected}
          onChange={setSelected}
          error={showError ? question.error : ''}
        />
        <GovukButton type="submit">Continue</GovukButton>
      </form>
    </>
  );
}

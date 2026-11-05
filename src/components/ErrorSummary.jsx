import { forwardRef } from 'react';

// GOV.UK error summary. Each link moves focus to the field with the problem.
const ErrorSummary = forwardRef(function ErrorSummary({ errors }, ref) {
  function focusField(event, fieldId) {
    event.preventDefault();
    document.getElementById(fieldId)?.focus();
  }

  return (
    <div className="govuk-error-summary" role="alert" tabIndex={-1} ref={ref}>
      <h2 className="govuk-error-summary__title">There is a problem</h2>
      <ul className="govuk-list govuk-error-summary__list">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a href={`#${error.fieldId}`} onClick={(event) => focusField(event, error.fieldId)}>
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default ErrorSummary;

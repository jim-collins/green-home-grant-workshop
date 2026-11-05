// One question with radio buttons: legend (as the page heading), hint, inline error.
export default function RadioQuestion({ question, value, onChange, error }) {
  const hintId = `${question.key}-hint`;
  const errorId = `${question.key}-error`;
  const describedBy = [question.hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');

  return (
    <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
      <fieldset className="govuk-fieldset" aria-describedby={describedBy || undefined}>
        <legend className="govuk-fieldset__legend">
          <h1 className="govuk-heading-l">{question.title}</h1>
        </legend>
        <div id={hintId} className="govuk-hint">{question.hint}</div>
        {error && (
          <p id={errorId} className="govuk-error-message">
            <span className="govuk-visually-hidden">Error:</span> {error}
          </p>
        )}
        <div className="govuk-radios">
          {question.options.map((option, index) => {
            const id = index === 0 ? question.key : `${question.key}-${index + 1}`;
            return (
              <div className="govuk-radios__item" key={option.value}>
                <input
                  className="govuk-radios__input"
                  id={id}
                  name={question.key}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                />
                <label className="govuk-label govuk-radios__label" htmlFor={id}>
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

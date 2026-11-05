import { Link } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';

export default function AccessibilityStatementPage() {
  usePageTitle('Accessibility statement');

  return (
    <>
      <h1 className="govuk-heading-xl">Accessibility statement</h1>
      <p className="govuk-body">
        This statement applies to the "Check if you can get a Green Home Grant" service. It is an alpha
        prototype for a fictional government scheme. You can start the service from the{' '}
        <Link className="govuk-link" to="/">start page</Link>.
      </p>
      <p className="govuk-body">
        We want as many people as possible to be able to use this service. You should be able to use it
        with a keyboard only, with a screen reader, at 320 pixels wide and when zoomed to 400%.
      </p>

      <h2 className="govuk-heading-l">How accessible this service is</h2>
      <p className="govuk-body">
        We have tested every page and every error message with automated checks. We have not finished
        our manual checks with assistive technology, so we cannot yet say that the service is fully
        accessible.
      </p>

      <h2 className="govuk-heading-l">Feedback and contact information</h2>
      <p className="govuk-body">
        If you have a problem using this service, or need it in a different format, email{' '}
        <a className="govuk-link" href="mailto:greenhomegrant-feedback@example.gov.uk">
          greenhomegrant-feedback@example.gov.uk
        </a>
        . This is a prototype, so the address is an example and is not monitored.
      </p>

      <h2 className="govuk-heading-l">Technical information</h2>
      <p className="govuk-body">This service is partially compliant with WCAG 2.2 AA.</p>
      <h3 className="govuk-heading-m">Known problems</h3>
      <ul className="govuk-list govuk-list--bullet">
        <li>We have not yet tested the service with a screen reader. We will list any problems here.</li>
        <li>The feedback link opens your email program. It does not open a feedback form.</li>
      </ul>

      <h2 className="govuk-heading-l">How we tested this service</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li>Automated tests with axe-core on every page and every error message.</li>
        <li>Lighthouse accessibility audits, including colour contrast, in Chrome.</li>
        <li>Checks of the layout at 320 pixels wide.</li>
      </ul>
      <p className="govuk-body">
        Checking with the keyboard, a screen reader and browser zoom is still to be done.
      </p>

      <h2 className="govuk-heading-l">What we are doing to improve</h2>
      <p className="govuk-body">
        We will finish the manual checks and update this statement with what we find.
      </p>
    </>
  );
}

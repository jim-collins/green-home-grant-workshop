import { Link } from 'react-router-dom';

function GovukHeader() {
  return (
    <header className="govuk-header" role="banner">
      <div className="govuk-header__container">
        <Link to="/" className="govuk-header__link">
          GOV.UK
        </Link>
      </div>
    </header>
  );
}

export default GovukHeader;

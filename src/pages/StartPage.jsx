import { useNavigate } from 'react-router-dom';
import GovukButton from '../components/GovukButton';
import usePageTitle from '../hooks/usePageTitle';

function StartPage() {
  const navigate = useNavigate();
  usePageTitle('Start');

  return (
    <>
      <h1 className="govuk-heading-xl">Check if you can get a Green Home Grant</h1>
      <p className="govuk-body-l">
        Use this service to find out if you can get a grant towards home insulation and heat pumps.
        You will answer 4 short questions.
      </p>
      <h2 className="govuk-heading-m">Who can use this service</h2>
      <p className="govuk-body">The grant is only available to homeowners or landlords.</p>
      <ul className="govuk-list govuk-list--bullet">
        <li>You cannot get the grant if you rent your home.</li>
        <li>You cannot get the grant for a flat or maisonette.</li>
        <li>The property must be in the UK.</li>
      </ul>
      <GovukButton variant="start" onClick={() => navigate('/property-type')}>
        Start now
      </GovukButton>
    </>
  );
}

export default StartPage;

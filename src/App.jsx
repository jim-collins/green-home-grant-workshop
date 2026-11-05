import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import PropertyTypePage from './pages/PropertyTypePage';
import OwnershipPage from './pages/OwnershipPage';
import IncomePage from './pages/IncomePage';
import HeatingPage from './pages/HeatingPage';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

const NO_ANSWERS = { propertyType: '', ownership: '', incomeBand: '', heating: '' };

function App() {
  // All answers live here so they survive Back and Change.
  // eslint-disable-next-line no-unused-vars
  const [answers, setAnswers] = useState(NO_ANSWERS);

  return (
    <>
      <a href="#main-content" className="govuk-skip-link">Skip to main content</a>
      <GovukHeader />
      <div className="govuk-width-container">
        <PhaseBanner phase="alpha" />
      </div>
      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/property-type" element={<PropertyTypePage />} />
            <Route path="/ownership" element={<OwnershipPage />} />
            <Route path="/income" element={<IncomePage />} />
            <Route path="/heating" element={<HeatingPage />} />
            <Route path="/check-answers" element={<CheckAnswersPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;

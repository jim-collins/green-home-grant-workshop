import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GovukHeader from './components/GovukHeader';
import PhaseBanner from './components/PhaseBanner';
import GovukFooter from './components/GovukFooter';
import StartPage from './pages/StartPage';
import QuestionPage from './pages/QuestionPage';
import { QUESTIONS, NO_ANSWERS } from './data/questions';
import CheckAnswersPage from './pages/CheckAnswersPage';
import ResultPage from './pages/ResultPage';
import AccessibilityStatementPage from './pages/AccessibilityStatementPage';

function App() {
  // All answers live here so they survive Back and Change.
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
            {QUESTIONS.map((question) => (
              <Route
                key={question.key}
                path={question.path}
                element={<QuestionPage key={question.key} question={question} answers={answers} setAnswers={setAnswers} />}
              />
            ))}
            <Route path="/check-answers" element={<CheckAnswersPage answers={answers} />} />
            <Route path="/result" element={<ResultPage answers={answers} setAnswers={setAnswers} />} />
            <Route path="/accessibility-statement" element={<AccessibilityStatementPage />} />
          </Routes>
        </main>
      </div>
      <GovukFooter />
    </>
  );
}

export default App;

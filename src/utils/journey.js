import { QUESTIONS, NO_ANSWERS } from '../data/questions';

export function isComplete(answers) {
  return QUESTIONS.every((q) => answers[q.key]);
}

// The first question whose answer ends the journey, if any.
function endingIndex(answers) {
  return QUESTIONS.findIndex((q) => q.ends.includes(answers[q.key]));
}

// Answers after one that ended the journey are ignored, so old answers
// never change the result of a shorter journey.
export function relevantAnswers(answers) {
  const end = endingIndex(answers);
  if (end === -1) return { ...answers };
  const kept = { ...NO_ANSWERS };
  QUESTIONS.slice(0, end + 1).forEach((q) => {
    kept[q.key] = answers[q.key];
  });
  return kept;
}

export function nextPath(answers, key, changing) {
  const index = QUESTIONS.findIndex((q) => q.key === key);
  if (QUESTIONS[index].ends.includes(answers[key])) return '/result';
  if (changing) {
    const unanswered = QUESTIONS.find((q) => !answers[q.key]);
    return unanswered ? unanswered.path : '/check-answers';
  }
  const next = QUESTIONS[index + 1];
  return next ? next.path : '/check-answers';
}

export function previousPath(key, changing) {
  if (changing) return '/check-answers';
  const index = QUESTIONS.findIndex((q) => q.key === key);
  return index === 0 ? '/' : QUESTIONS[index - 1].path;
}

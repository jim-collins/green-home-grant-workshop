import { describe, it, expect } from 'vitest';
import { NO_ANSWERS } from '../data/questions';
import { nextPath, previousPath, relevantAnswers, isComplete } from './journey';

const full = {
  propertyType: 'detached',
  ownership: 'own-live',
  incomeBand: 'under-30k',
  heating: 'gas',
};

describe('nextPath', () => {
  it('goes to the next question in order', () => {
    expect(nextPath({ ...NO_ANSWERS, propertyType: 'detached' }, 'propertyType', false)).toBe('/ownership');
    expect(nextPath({ ...NO_ANSWERS, ownership: 'own-let' }, 'ownership', false)).toBe('/income');
  });

  it('goes to Check your answers after the last question', () => {
    expect(nextPath(full, 'heating', false)).toBe('/check-answers');
  });

  it('sends a flat or maisonette straight to the result', () => {
    expect(nextPath({ ...NO_ANSWERS, propertyType: 'flat' }, 'propertyType', false)).toBe('/result');
  });

  it('sends both kinds of renter straight to the result', () => {
    expect(nextPath({ ...NO_ANSWERS, ownership: 'rent-private' }, 'ownership', false)).toBe('/result');
    expect(nextPath({ ...NO_ANSWERS, ownership: 'rent-council' }, 'ownership', false)).toBe('/result');
  });

  it('carries on after income over £50,000', () => {
    expect(nextPath({ ...NO_ANSWERS, incomeBand: 'over-50k' }, 'incomeBand', false)).toBe('/heating');
  });

  it('returns to Check your answers after a change when every question is answered', () => {
    expect(nextPath(full, 'incomeBand', true)).toBe('/check-answers');
  });

  it('goes to the first unanswered question after a change when something is missing', () => {
    const missing = { ...full, heating: '' };
    expect(nextPath(missing, 'propertyType', true)).toBe('/heating');
  });

  it('still goes to the result when a change picks an answer that ends the journey', () => {
    expect(nextPath({ ...full, propertyType: 'flat' }, 'propertyType', true)).toBe('/result');
  });
});

describe('previousPath', () => {
  it('goes back to the start page from the first question', () => {
    expect(previousPath('propertyType', false)).toBe('/');
  });
  it('goes back to the previous question', () => {
    expect(previousPath('heating', false)).toBe('/income');
  });
  it('goes back to Check your answers when changing an answer', () => {
    expect(previousPath('heating', true)).toBe('/check-answers');
  });
});

describe('relevantAnswers', () => {
  it('keeps all answers when nothing ends the journey', () => {
    expect(relevantAnswers(full)).toEqual(full);
  });
  it('ignores answers after the one that ended the journey', () => {
    const stale = { ...full, propertyType: 'flat', incomeBand: 'over-50k' };
    expect(relevantAnswers(stale)).toEqual({ ...NO_ANSWERS, propertyType: 'flat' });
  });
});

describe('isComplete', () => {
  it('is true only when every question has an answer', () => {
    expect(isComplete(full)).toBe(true);
    expect(isComplete({ ...full, heating: '' })).toBe(false);
  });
});

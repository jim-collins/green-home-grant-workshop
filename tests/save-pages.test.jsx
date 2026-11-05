// Saves the HTML of every page and error state to tests/pages/ (git-ignored),
// so Lighthouse can check colour contrast in real Chrome against the built CSS.
import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../src/test-utils';

const DIR = 'tests/pages';

function save(name) {
  mkdirSync(DIR, { recursive: true });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${document.title}</title></head><body>${document.body.innerHTML}</body></html>`;
  writeFileSync(`${DIR}/${name}.html`, html);
}

async function choose(label) {
  await userEvent.click(screen.getByLabelText(label));
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
}

describe('save pages for the contrast check', () => {
  it('saves the start page, question pages, and their error states', async () => {
    renderApp('/');
    save('start');
    for (const [route, name] of [['/property-type', 'property-type'], ['/ownership', 'ownership'], ['/income', 'income'], ['/heating', 'heating']]) {
      const { unmount } = renderApp(route);
      save(name);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
      save(`${name}-error`);
      unmount();
    }
  });

  it('saves check your answers and the three outcomes', async () => {
    const journeys = [
      ['result-eligible', ['Detached house', 'I own and live in it', 'Under £30,000', 'Gas boiler']],
      ['result-partial', ['Terraced house', 'I own it and rent it out (landlord)', '£30,000 to £50,000', 'Electric']],
      ['result-not-eligible', ['Bungalow', 'I own and live in it', 'Over £50,000', 'Heat pump already installed']],
    ];
    for (const [name, answers] of journeys) {
      const { unmount } = renderApp('/property-type');
      for (const a of answers) await choose(a);
      if (name === 'result-eligible') save('check-answers');
      await userEvent.click(screen.getByRole('button', { name: 'Accept and see your result' }));
      save(name);
      unmount();
    }
  });

  it('saves the accessibility statement', () => {
    renderApp('/accessibility-statement');
    save('accessibility-statement');
  });
});

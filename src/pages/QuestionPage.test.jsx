import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, axeViolations } from '../test-utils';
import { QUESTIONS } from '../data/questions';

const path = () => screen.getByTestId('path').textContent;

async function choose(label) {
  await userEvent.click(screen.getByLabelText(label));
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
}

describe('Question pages: content', () => {
  it('asks the four questions in order, one per page', async () => {
    renderApp('/property-type');
    await choose('Detached house');
    expect(path()).toBe('/ownership');
    await choose('I own and live in it');
    expect(path()).toBe('/income');
    await choose('Under £30,000');
    expect(path()).toBe('/heating');
  });

  it.each([
    ['/property-type', ['Detached house', 'Semi-detached house', 'Terraced house', 'Bungalow', 'Flat or maisonette', 'Other']],
    ['/ownership', ['I own and live in it', 'I own it and rent it out (landlord)', 'I rent from a private landlord', 'I rent from a council or housing association']],
    ['/income', ['Under £30,000', '£30,000 to £50,000', 'Over £50,000']],
    ['/heating', ['Gas boiler', 'Oil boiler', 'Electric', 'Heat pump already installed']],
  ])('%s offers exactly the right labelled radios', (route, labels) => {
    renderApp(route);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.labels[0].textContent)).toEqual(labels);
  });

  it('shows the income hint', () => {
    renderApp('/income');
    expect(screen.getByText('Add up the yearly income of everyone in your household, before tax.')).toBeInTheDocument();
  });

  it('has Continue and Back on every question page', () => {
    for (const q of QUESTIONS) {
      const { unmount } = renderApp(q.path);
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument();
      unmount();
    }
  });

  it('selects an option when its label is clicked', async () => {
    renderApp('/heating');
    await userEvent.click(screen.getByText('Oil boiler'));
    expect(screen.getByRole('radio', { name: 'Oil boiler' })).toBeChecked();
  });

  it('gives each question its own page title and focuses its heading', () => {
    renderApp('/ownership');
    expect(document.title).toMatch(/^Do you own or rent the property\? - /);
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });
});

describe('Question pages: Back and saved answers', () => {
  it('keeps the answer when the user goes Back', async () => {
    renderApp('/property-type');
    await choose('Terraced house');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(path()).toBe('/property-type');
    expect(screen.getByRole('radio', { name: 'Terraced house' })).toBeChecked();
  });

  it('keeps earlier answers when the user goes back several pages', async () => {
    renderApp('/property-type');
    await choose('Bungalow');
    await choose('I own it and rent it out (landlord)');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(screen.getByRole('radio', { name: 'Bungalow' })).toBeChecked();
  });

  it('goes back to the start page from the first question', async () => {
    renderApp('/property-type');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(path()).toBe('/');
  });
});

describe('Question pages: early exits', () => {
  it('sends a flat to the result straight away', async () => {
    renderApp('/property-type');
    await choose('Flat or maisonette');
    expect(path()).toBe('/result');
  });

  it.each(['I rent from a private landlord', 'I rent from a council or housing association'])(
    'sends "%s" to the result straight away',
    async (label) => {
      renderApp('/property-type');
      await choose('Detached house');
      await choose(label);
      expect(path()).toBe('/result');
    }
  );

  it('carries on to heating after income over £50,000', async () => {
    renderApp('/income');
    await choose('Over £50,000');
    expect(path()).toBe('/heating');
  });
});

describe('Question pages: validation', () => {
  it.each(QUESTIONS.map((q) => [q.path, q.error]))(
    '%s: Continue with nothing chosen shows the error summary and the inline error',
    async (route, message) => {
      renderApp(route);
      await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
      expect(path()).toBe(route);
      const summary = screen.getByRole('alert');
      expect(summary).toHaveTextContent('There is a problem');
      expect(summary).toHaveFocus();
      expect(screen.getByRole('link', { name: message })).toBeInTheDocument();
      expect(document.getElementById(`${QUESTIONS.find((q) => q.path === route).key}-error`)).toHaveTextContent(message);
      expect(document.title).toMatch(/^Error: /);
    }
  );

  it('moves focus to the first radio when the summary link is used', async () => {
    renderApp('/ownership');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await userEvent.click(screen.getByRole('link', { name: 'Select whether you own or rent the property' }));
    expect(screen.getByRole('radio', { name: 'I own and live in it' })).toHaveFocus();
  });

  it('puts focus back on the error summary when Continue is pressed empty twice', async () => {
    renderApp('/heating');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    screen.getByRole('radio', { name: 'Gas boiler' }).focus();
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByRole('alert')).toHaveFocus();
  });

  it('lets the user carry on once they choose an answer', async () => {
    renderApp('/income');
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await choose('£30,000 to £50,000');
    expect(path()).toBe('/heating');
  });
});

describe('Question pages: axe', () => {
  it.each(QUESTIONS.map((q) => q.path))('%s has no axe violations', async (route) => {
    const { container } = renderApp(route);
    expect(await axeViolations(container)).toEqual([]);
  });

  it.each(QUESTIONS.map((q) => q.path))('%s error state has no axe violations', async (route) => {
    const { container } = renderApp(route);
    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(await axeViolations(container)).toEqual([]);
  });
});

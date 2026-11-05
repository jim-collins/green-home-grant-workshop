import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, axeViolations } from '../test-utils';

const path = () => screen.getByTestId('path').textContent;

async function choose(label) {
  await userEvent.click(screen.getByLabelText(label));
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
}

async function fullJourney() {
  const view = renderApp('/property-type');
  await choose('Detached house');
  await choose('I own and live in it');
  await choose('Under £30,000');
  await choose('Gas boiler');
  return view;
}

describe('Check your answers', () => {
  it('is shown after the last question, with every answer in a summary list', async () => {
    await fullJourney();
    expect(path()).toBe('/check-answers');
    expect(screen.getByRole('heading', { level: 1, name: 'Check your answers' })).toBeInTheDocument();
    const rows = document.querySelectorAll('.govuk-summary-list__row');
    expect(rows).toHaveLength(4);
    expect(within(rows[0]).getByText('Property type')).toBeInTheDocument();
    expect(within(rows[0]).getByText('Detached house')).toBeInTheDocument();
    expect(within(rows[1]).getByText('I own and live in it')).toBeInTheDocument();
    expect(within(rows[2]).getByText('Under £30,000')).toBeInTheDocument();
    expect(within(rows[3]).getByText('Gas boiler')).toBeInTheDocument();
  });

  it('uses a description list, not a table', async () => {
    await fullJourney();
    expect(document.querySelector('dl.govuk-summary-list')).not.toBeNull();
    expect(document.querySelector('table')).toBeNull();
  });

  it('gives every answer a Change link with hidden text naming the question', async () => {
    await fullJourney();
    for (const name of ['Change property type', 'Change ownership', 'Change household income', 'Change current heating']) {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    }
  });

  it('shows the question with the answer selected when Change is used, then returns to the summary', async () => {
    await fullJourney();
    await userEvent.click(screen.getByRole('link', { name: 'Change household income' }));
    expect(path()).toBe('/income?change=true');
    expect(screen.getByRole('radio', { name: 'Under £30,000' })).toBeChecked();
    await choose('£30,000 to £50,000');
    expect(path()).toBe('/check-answers');
    expect(screen.getByText('£30,000 to £50,000')).toBeInTheDocument();
    expect(screen.getByText('Detached house')).toBeInTheDocument();
    expect(screen.getByText('Gas boiler')).toBeInTheDocument();
  });

  it('has a Back link from a changed question to the summary', async () => {
    await fullJourney();
    await userEvent.click(screen.getByRole('link', { name: 'Change ownership' }));
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(path()).toBe('/check-answers');
  });

  it('goes to the result when a change picks an answer that ends the journey', async () => {
    await fullJourney();
    await userEvent.click(screen.getByRole('link', { name: 'Change property type' }));
    await choose('Flat or maisonette');
    expect(path()).toBe('/result');
  });

  it('confirms and shows the result', async () => {
    await fullJourney();
    await userEvent.click(screen.getByRole('button', { name: 'Accept and see your result' }));
    expect(path()).toBe('/result');
  });

  it('sends a visitor with no answers to the start page', () => {
    renderApp('/check-answers');
    expect(path()).toBe('/');
  });

  it('has its own title, focuses the heading and has no axe violations', async () => {
    const { container } = await fullJourney();
    expect(document.title).toMatch(/^Check your answers - /);
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    expect(await axeViolations(container)).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, axeViolations } from '../test-utils';

const path = () => screen.getByTestId('path').textContent;

async function choose(label) {
  await userEvent.click(screen.getByLabelText(label));
  await userEvent.click(screen.getByRole('button', { name: 'Continue' }));
}

async function journey(property, ownership, income, heating) {
  const view = renderApp('/property-type');
  await choose(property);
  await choose(ownership);
  await choose(income);
  await choose(heating);
  await userEvent.click(screen.getByRole('button', { name: 'Accept and see your result' }));
  return view;
}

describe('Result page', () => {
  it('says eligible for a clean path', async () => {
    const { container } = await journey('Detached house', 'I own and live in it', 'Under £30,000', 'Gas boiler');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You are eligible');
    expect(container.querySelector('.govuk-panel--partial, .govuk-panel--not-eligible')).toBeNull();
    expect(container.querySelector('.govuk-panel')).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('says partially eligible for a landlord on £30,000 to £50,000 with electric heating, and lists both reasons', async () => {
    const { container } = await journey('Terraced house', 'I own it and rent it out (landlord)', '£30,000 to £50,000', 'Electric');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You are partially eligible');
    expect(container.querySelector('.govuk-panel--partial')).not.toBeNull();
    expect(screen.getAllByRole('listitem').filter((li) => li.closest('.govuk-list--reasons'))).toHaveLength(2);
    expect(await axeViolations(container)).toEqual([]);
  });

  it('says not eligible for income over £50,000 and lists every reason', async () => {
    const { container } = await journey('Bungalow', 'I own and live in it', 'Over £50,000', 'Heat pump already installed');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You are not eligible');
    expect(screen.getByText('Your household income is over £50,000.')).toBeInTheDocument();
    expect(screen.getByText('You already have a heat pump installed.')).toBeInTheDocument();
    expect(container.querySelector('.govuk-panel--not-eligible')).not.toBeNull();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('says not eligible straight away for a flat, with only that reason', async () => {
    const { container } = renderApp('/property-type');
    await choose('Flat or maisonette');
    expect(path()).toBe('/result');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You are not eligible');
    expect(screen.getByText('The grant is not available for flats or maisonettes.')).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });

  it('says not eligible straight away for a renter', async () => {
    renderApp('/property-type');
    await choose('Terraced house');
    await choose('I rent from a private landlord');
    expect(path()).toBe('/result');
    expect(screen.getByText(/not to people who rent their home/)).toBeInTheDocument();
  });

  it('ignores stale answers when a change makes the journey end early', async () => {
    await journey('Detached house', 'I own and live in it', 'Over £50,000', 'Heat pump already installed');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    await userEvent.click(screen.getByRole('link', { name: 'Change property type' }));
    await choose('Flat or maisonette');
    expect(screen.getByText('The grant is not available for flats or maisonettes.')).toBeInTheDocument();
    expect(screen.queryByText('You already have a heat pump installed.')).toBeNull();
    expect(screen.queryByText('Your household income is over £50,000.')).toBeNull();
  });

  it('Back after an early exit returns to the question that ended it, with the answer kept', async () => {
    renderApp('/property-type');
    await choose('Flat or maisonette');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(path()).toBe('/property-type');
    expect(screen.getByRole('radio', { name: 'Flat or maisonette' })).toBeChecked();
    await choose('Detached house');
    expect(path()).toBe('/ownership');
  });

  it('Back after a full journey returns to Check your answers', async () => {
    await journey('Detached house', 'I own and live in it', 'Under £30,000', 'Gas boiler');
    await userEvent.click(screen.getByRole('link', { name: 'Back' }));
    expect(path()).toBe('/check-answers');
  });

  it('lets the user check again, with the answers cleared', async () => {
    await journey('Detached house', 'I own and live in it', 'Under £30,000', 'Gas boiler');
    await userEvent.click(screen.getByRole('link', { name: 'Check again' }));
    expect(path()).toBe('/');
    await userEvent.click(screen.getByRole('button', { name: 'Start now' }));
    expect(screen.getAllByRole('radio').some((r) => r.checked)).toBe(false);
  });

  it('sends a visitor with no answers to the start page', () => {
    renderApp('/result');
    expect(path()).toBe('/');
  });

  it('has its own title and focuses the heading', async () => {
    await journey('Detached house', 'I own and live in it', 'Under £30,000', 'Gas boiler');
    expect(document.title).toMatch(/^You are eligible - /);
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });
});

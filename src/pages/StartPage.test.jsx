import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp, axeViolations } from '../test-utils';

describe('Start page', () => {
  it('shows a title, a description and a Start now button', () => {
    renderApp('/');
    expect(screen.getByRole('heading', { level: 1, name: 'Check if you can get a Green Home Grant' })).toBeInTheDocument();
    expect(screen.getByText(/find out if you can get a grant/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start now' })).toBeInTheDocument();
  });

  it('says the grant is only for homeowners or landlords', () => {
    renderApp('/');
    expect(screen.getByText('The grant is only available to homeowners or landlords.')).toBeInTheDocument();
  });

  it('goes to the first question when Start now is pressed', async () => {
    renderApp('/');
    await userEvent.click(screen.getByRole('button', { name: 'Start now' }));
    expect(screen.getByTestId('path')).toHaveTextContent('/property-type');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('What type of property is it?');
  });

  it('has its own page title and no axe violations', async () => {
    const { container } = renderApp('/');
    expect(document.title).toMatch(/^Start - /);
    expect(await axeViolations(container)).toEqual([]);
  });
});

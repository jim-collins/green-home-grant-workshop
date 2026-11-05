import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axe from 'axe-core';
import App from './App';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
}

describe('App shell', () => {
  it('has one main, one banner and one footer landmark', () => {
    renderApp();
    expect(screen.getAllByRole('main')).toHaveLength(1);
    expect(screen.getAllByRole('banner')).toHaveLength(1);
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1);
  });

  it('shows the alpha phase banner with a feedback link', () => {
    renderApp();
    expect(screen.getByText('alpha')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'feedback' })).toBeInTheDocument();
  });

  it('links the footer to the accessibility statement', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'Accessibility statement' })).toHaveAttribute(
      'href',
      '/accessibility-statement'
    );
  });

  it('has a skip link to the main content', () => {
    renderApp();
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute(
      'href',
      '#main-content'
    );
  });

  it('gives the accessibility statement its own title and focuses its heading', () => {
    renderApp('/accessibility-statement');
    expect(document.title).toBe(
      'Accessibility statement - Check if you can get a Green Home Grant - GOV.UK'
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
  });

  it('has no axe violations (contrast is checked later in real Chrome)', async () => {
    const { container } = renderApp('/accessibility-statement');
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});

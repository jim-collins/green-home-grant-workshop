import { render } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import axe from 'axe-core';
import App from './App';

function LocationProbe() {
  const location = useLocation();
  return <span data-testid="path">{location.pathname + location.search}</span>;
}

export function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
      <LocationProbe />
    </MemoryRouter>
  );
}

// jsdom cannot compute colours, so contrast is checked separately in real Chrome.
export async function axeViolations(container) {
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  return results.violations;
}

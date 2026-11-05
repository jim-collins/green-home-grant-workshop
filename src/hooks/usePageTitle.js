import { useEffect } from 'react';

const SERVICE_NAME = 'Check if you can get a Green Home Grant';

// Gives each page its own tab title and moves focus to the page heading,
// so screen reader and keyboard users know the page has changed.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} - ${SERVICE_NAME} - GOV.UK`;
    const heading = document.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }, [title]);
}

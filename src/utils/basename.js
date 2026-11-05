// The lab's web address puts the app behind a path prefix (https://<host>/proxy/).
// The router needs to know about it, or no route matches and the page is blank.
const PREFIX = '/proxy';

export function getBasename(pathname) {
  return pathname === PREFIX || pathname.startsWith(`${PREFIX}/`) ? PREFIX : '';
}

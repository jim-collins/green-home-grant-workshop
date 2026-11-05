import { describe, it, expect } from 'vitest';
import { getBasename } from './basename';

describe('getBasename', () => {
  it('is empty when the app is served from the root', () => {
    expect(getBasename('/')).toBe('');
    expect(getBasename('/property-type')).toBe('');
  });

  it('is /proxy when the lab proxy puts the app under /proxy/', () => {
    expect(getBasename('/proxy/')).toBe('/proxy');
    expect(getBasename('/proxy')).toBe('/proxy');
    expect(getBasename('/proxy/property-type')).toBe('/proxy');
  });

  it('does not treat a path that only starts with the same letters as the prefix', () => {
    expect(getBasename('/proxyish')).toBe('');
  });
});

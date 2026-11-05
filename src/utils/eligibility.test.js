import { describe, it, expect } from 'vitest';
import { checkEligibility } from './eligibility';

const eligible = {
  propertyType: 'detached',
  ownership: 'own-live',
  incomeBand: 'under-30k',
  heating: 'gas',
};

describe('checkEligibility', () => {
  it('is eligible for an owner-occupier of a house, under £30,000, with a gas boiler', () => {
    const result = checkEligibility(eligible);
    expect(result.status).toBe('eligible');
    expect(result.reasons).toEqual([]);
  });

  it('is eligible for a landlord with an oil boiler', () => {
    const result = checkEligibility({ ...eligible, ownership: 'own-let', heating: 'oil' });
    expect(result.status).toBe('eligible');
  });

  it('treats the "other" property type as no effect', () => {
    expect(checkEligibility({ ...eligible, propertyType: 'other' }).status).toBe('eligible');
  });

  it('says not eligible for a flat or maisonette', () => {
    const result = checkEligibility({ propertyType: 'flat' });
    expect(result.status).toBe('not-eligible');
    expect(result.reasons).toHaveLength(1);
  });

  it('says not eligible for a private renter', () => {
    const result = checkEligibility({ ...eligible, ownership: 'rent-private' });
    expect(result.status).toBe('not-eligible');
  });

  it('says not eligible for a council or housing association tenant', () => {
    const result = checkEligibility({ ...eligible, ownership: 'rent-council' });
    expect(result.status).toBe('not-eligible');
  });

  it('says not eligible for income over £50,000', () => {
    const result = checkEligibility({ ...eligible, incomeBand: 'over-50k' });
    expect(result.status).toBe('not-eligible');
    expect(result.reasons).toHaveLength(1);
  });

  it('says partially eligible for income from £30,000 to £50,000', () => {
    const result = checkEligibility({ ...eligible, incomeBand: '30k-50k' });
    expect(result.status).toBe('partial');
    expect(result.reasons).toHaveLength(1);
  });

  it('says partially eligible for electric heating', () => {
    const result = checkEligibility({ ...eligible, heating: 'electric' });
    expect(result.status).toBe('partial');
    expect(result.reasons).toHaveLength(1);
  });

  it('says not eligible when a heat pump is already installed', () => {
    const result = checkEligibility({ ...eligible, heating: 'heat-pump' });
    expect(result.status).toBe('not-eligible');
  });

  it('lets any not-eligible answer beat a partial one', () => {
    const result = checkEligibility({
      ...eligible,
      incomeBand: '30k-50k',
      heating: 'heat-pump',
    });
    expect(result.status).toBe('not-eligible');
  });

  it('lists every reason that applies', () => {
    const result = checkEligibility({
      ...eligible,
      incomeBand: 'over-50k',
      heating: 'heat-pump',
    });
    expect(result.status).toBe('not-eligible');
    expect(result.reasons).toHaveLength(2);
  });

  it('lists both partial reasons together', () => {
    const result = checkEligibility({ ...eligible, incomeBand: '30k-50k', heating: 'electric' });
    expect(result.status).toBe('partial');
    expect(result.reasons).toHaveLength(2);
  });

  it('gives the same result for the same answers every time', () => {
    const answers = { ...eligible, incomeBand: '30k-50k' };
    expect(checkEligibility(answers)).toEqual(checkEligibility({ ...answers }));
  });

  it('does not change the answers it is given', () => {
    const answers = { ...eligible };
    checkEligibility(answers);
    expect(answers).toEqual(eligible);
  });
});

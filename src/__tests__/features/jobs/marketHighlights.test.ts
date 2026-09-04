import { getMarketHighlightCards } from '@/features/jobs/utils/marketHighlights';

describe('getMarketHighlightCards', () => {
  it('priorise le salaire quand il est disponible', () => {
    expect(
      getMarketHighlightCards({
        salary: { amount: 42000 },
        offers: { count: 80 },
      }),
    ).toEqual([
      expect.objectContaining({ key: 'salary', value: '42 k€' }),
      expect.objectContaining({ key: 'offers', value: '80' }),
    ]);
  });

  it('masque le salaire absent et ignore les libellés marché trop longs', () => {
    expect(
      getMarketHighlightCards({
        offers: { count: 80 },
        tension: { label: 'Attractivité salariale du métier' },
      }),
    ).toEqual([expect.objectContaining({ key: 'offers', value: '80' })]);
  });
});

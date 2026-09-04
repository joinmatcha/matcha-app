import { JobMarketHighlights } from '@/features/jobs/api/jobsApi';

type MarketHighlightCard = {
  key: 'salary' | 'offers' | 'tension';
  icon: 'payments' | 'work-outline' | 'trending-up';
  label: string;
  value: string;
};

const euroFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('fr-FR', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatSalary(amount: number) {
  if (amount >= 1000) {
    return `${Math.round(amount / 1000)} k€`;
  }

  return `${euroFormatter.format(amount)} €`;
}

function formatOffers(count: number) {
  return compactFormatter.format(count);
}

function formatTension(market: NonNullable<JobMarketHighlights>['tension']) {
  if (!market) return null;
  if (typeof market.decimal === 'number') return market.decimal.toFixed(1);
  if (typeof market.rate === 'number') return `${market.rate.toFixed(1)}%`;
  if (typeof market.rank === 'number') return `Rang ${market.rank}`;
  if (market.label && market.label.length <= 18) return market.label;
  return null;
}

export function getMarketHighlightCards(
  marketHighlights?: JobMarketHighlights,
): MarketHighlightCard[] {
  if (!marketHighlights) return [];

  const cards: MarketHighlightCard[] = [];
  if (typeof marketHighlights.salary?.amount === 'number') {
    cards.push({
      key: 'salary',
      icon: 'payments',
      label: 'Salaire',
      value: formatSalary(marketHighlights.salary.amount),
    });
  }

  if (typeof marketHighlights.offers?.count === 'number') {
    cards.push({
      key: 'offers',
      icon: 'work-outline',
      label: 'Offres',
      value: formatOffers(marketHighlights.offers.count),
    });
  }

  const tension = formatTension(marketHighlights.tension);
  if (tension) {
    cards.push({
      key: 'tension',
      icon: 'trending-up',
      label: 'Marché',
      value: tension,
    });
  }

  return cards.slice(0, 2);
}

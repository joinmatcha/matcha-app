export type Subscription = 'free' | 'premium';

export function normalizeSubscription(
  value: string | null | undefined,
): Subscription {
  return value === 'premium' ? 'premium' : 'free';
}

export function isPremiumSubscription(value: string | null | undefined) {
  return normalizeSubscription(value) === 'premium';
}

import { render } from '@testing-library/react-native';
import React from 'react';

import PricingPlansScreen from '@/features/home/screens/PricingPlans';

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
});

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: () => void) => cb(),
}));

const mockUseAuth = jest.fn();

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('PricingPlansScreen', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: { subscription: 'free' },
      refreshUser: jest.fn(),
    });
  });

  it('présente les plans free et pass complet', () => {
    const screen = render(<PricingPlansScreen />);

    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('0 €')).toBeTruthy();
    expect(screen.getByText('Pass Complet')).toBeTruthy();
    expect(screen.getByText('39 €')).toBeTruthy();
    expect(screen.getByText('Accès lié à ton compte')).toBeTruthy();
  });

  it('affiche un écran de statut actif quand le user est premium', () => {
    mockUseAuth.mockReturnValue({
      user: { subscription: 'premium' },
      refreshUser: jest.fn(),
    });

    const screen = render(<PricingPlansScreen />);

    expect(screen.getByText('PASS COMPLET ACTIF')).toBeTruthy();
    expect(screen.getByText('Ton accès est débloqué à vie')).toBeTruthy();
    expect(screen.getByText('Rien à renouveler')).toBeTruthy();
    expect(screen.queryByText('Free')).toBeNull();
    expect(screen.queryByText('39 €')).toBeNull();
  });
});

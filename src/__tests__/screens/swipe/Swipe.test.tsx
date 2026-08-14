import { render } from '@testing-library/react-native';
import React from 'react';

import SwipeScreen from '@/features/swipe/screens/Swipe';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: (props: any) => <View {...props} />,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: () => void) => cb(),
  useNavigation: () => ({ navigate: jest.fn() }),
}));
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: () => null,
}));
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
jest.mock('@/features/swipe/hooks/useSwipe', () => ({
  useSwipe: () => ({
    deck: [
      {
        id: 'j1',
        title: 'Développeur web',
        sector: 'Informatique',
        tags: ['Digital', 'Autonomie'],
      },
    ],
    remaining: 5,
    limit: 10,
    loading: false,
    error: null,
    loadDeck: jest.fn(),
    swipe: jest.fn(),
  }),
}));

describe('SwipeScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<SwipeScreen />)).not.toThrow();
  });

  it("affiche le métier courant et l'état des swipes", () => {
    const screen = render(<SwipeScreen />);

    expect(screen.getByText('Métiers à explorer')).toBeTruthy();
    expect(screen.getByText('Développeur web')).toBeTruthy();
    expect(screen.getByText('Informatique')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('5/10 utilisés')).toBeTruthy();
    expect(screen.getByText('Voir la fiche')).toBeTruthy();
  });
});

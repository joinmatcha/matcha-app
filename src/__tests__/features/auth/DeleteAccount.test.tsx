import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import DeleteAccount from '@/features/auth/components/DeleteAccount';

const mockDeleteAccount = jest.fn();
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ deleteAccount: mockDeleteAccount }),
}));
jest.mock('react-native-paper', () => {
  const { Text, View, Pressable } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    Modal: ({ children, visible }: any) =>
      visible ? <View>{children}</View> : null,
    Portal: ({ children }: any) => <View>{children}</View>,
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('DeleteAccount', () => {
  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() => render(<DeleteAccount />)).not.toThrow();
  });

  it('affiche le bouton de suppression', () => {
    const { getByText } = render(<DeleteAccount />);
    expect(getByText('Cliquez ici')).toBeTruthy();
  });

  it('ouvre la modal quand on clique sur le bouton', () => {
    const { getByText } = render(<DeleteAccount />);
    fireEvent.press(getByText('Cliquez ici'));
    expect(getByText('Tu nous quittes déjà ?')).toBeTruthy();
  });
});

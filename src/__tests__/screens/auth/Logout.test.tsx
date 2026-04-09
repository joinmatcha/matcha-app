import { render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

import { AuthContext } from '@/contexts/AuthContext';
import LogoutScreen from '@/features/auth/screens/Logout';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('react-native-paper', () => ({
  DefaultTheme: { colors: {}, fonts: {} },
}));

const mockLogout = jest.fn();
jest.mock('@/contexts/AuthContext', () => ({
  AuthContext: {
    ...jest.requireActual('react').createContext({ logout: jest.fn() }),
  },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useFocusEffect: (cb: () => void) => cb(),
}));

const alertSpy = jest.spyOn(Alert, 'alert');

describe('LogoutScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  it('affiche une alerte de confirmation au focus', () => {
    render(
      <AuthContext.Provider value={{ logout: mockLogout } as any}>
        <LogoutScreen />
      </AuthContext.Provider>,
    );
    expect(alertSpy).toHaveBeenCalledWith(
      'Deconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      expect.any(Array),
      expect.any(Object),
    );
  });

  it('retourne null (pas de rendu)', () => {
    const { toJSON } = render(
      <AuthContext.Provider value={{ logout: mockLogout } as any}>
        <LogoutScreen />
      </AuthContext.Provider>,
    );
    expect(toJSON()).toBeNull();
  });
});

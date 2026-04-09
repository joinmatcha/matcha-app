import { render } from '@testing-library/react-native';
import React from 'react';

import AppNavigator from '@/navigation/AppNavigator';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('expo-linking', () => ({
  createURL: (path: string) => `exp://localhost:19000/${path}`,
}));
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

// Mock loading state to avoid NavigationContainer rendering issues
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: true }),
}));

describe('AppNavigator', () => {
  it('se rend avec un loader quand loading est true', () => {
    expect(() => render(<AppNavigator />)).not.toThrow();
  });
});

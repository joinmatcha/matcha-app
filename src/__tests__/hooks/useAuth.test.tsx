import { renderHook } from '@testing-library/react-native';
import React from 'react';

import { AuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockContextValue = {
  user: null,
  loading: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  deleteAccount: jest.fn(),
  refreshUser: jest.fn(),
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={mockContextValue}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth', () => {
  it('retourne le contexte quand utilisé dans un AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toBe(mockContextValue);
  });

  it('lance une erreur quand utilisé hors du AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});

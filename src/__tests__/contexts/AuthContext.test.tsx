import { act, renderHook, waitFor } from '@testing-library/react-native';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

import {
  deleteAccount as apiDeleteAccount,
  login as apiLogin,
  register as apiRegister,
  getCurrentUser,
} from '@/api/auth';
import { AuthContext, AuthProvider } from '@/contexts/AuthContext';
import { getToken, removeToken, storeToken } from '@/utils/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));
jest.mock('@/api/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
  getCurrentUser: jest.fn(),
  deleteAccount: jest.fn(),
}));
jest.mock('@/utils/storage', () => ({
  getToken: jest.fn(),
  storeToken: jest.fn(),
  removeToken: jest.fn(),
}));

const mockedGetToken = getToken as jest.Mock;
const mockedStoreToken = storeToken as jest.Mock;
const mockedRemoveToken = removeToken as jest.Mock;
const mockedJwtDecode = jwtDecode as jest.Mock;
const mockedApiLogin = apiLogin as jest.Mock;
const mockedApiRegister = apiRegister as jest.Mock;
const mockedGetCurrentUser = getCurrentUser as jest.Mock;
const mockedApiDeleteAccount = apiDeleteAccount as jest.Mock;

const useAuthContext = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('No context');
  return context;
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetToken.mockResolvedValue(null);
  });

  describe('loadUser au montage', () => {
    it("met loading à false et user à null quand il n'y a pas de token", async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toBeNull();
    });

    it('charge le user quand un token valide existe', async () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      mockedGetToken.mockResolvedValue('valid-token');
      mockedJwtDecode.mockReturnValue({
        id: 'user-123',
        email: 'test@test.com',
        exp: futureExp,
      });
      mockedGetCurrentUser.mockResolvedValue({
        _id: 'user-123',
        email: 'test@test.com',
        firstName: 'Test',
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.user).toEqual(
        expect.objectContaining({ id: 'user-123', email: 'test@test.com' }),
      );
    });

    it('supprime le token et met user à null si le token est expiré', async () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      mockedGetToken.mockResolvedValue('expired-token');
      mockedJwtDecode.mockReturnValue({
        id: 'user-123',
        email: 'test@test.com',
        exp: pastExp,
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(mockedRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });

    it('gère les erreurs pendant le chargement du user', async () => {
      mockedGetToken.mockResolvedValue('token');
      mockedJwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(mockedRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe('login', () => {
    it('stocke le token et met à jour le user', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      mockedApiLogin.mockResolvedValue({
        token: 'new-token',
        user: { id: 'u1', email: 'a@b.com' },
      });

      await act(async () => {
        await result.current.login('a@b.com', 'password');
      });

      expect(mockedStoreToken).toHaveBeenCalledWith('new-token');
      expect(result.current.user).toEqual(
        expect.objectContaining({ id: 'u1', email: 'a@b.com' }),
      );
    });
  });

  describe('register', () => {
    it('appelle apiRegister avec consentAccepted à true', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      mockedApiRegister.mockResolvedValue({});

      await act(async () => {
        await result.current.register({
          email: 'new@test.com',
          password: 'pass',
          firstName: 'John',
          lastName: 'Doe',
        });
      });

      expect(mockedApiRegister).toHaveBeenCalledWith({
        email: 'new@test.com',
        password: 'pass',
        firstName: 'John',
        lastName: 'Doe',
        consentAccepted: true,
      });
    });
  });

  describe('logout', () => {
    it('supprime le token et met user à null', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.logout();
      });

      expect(mockedRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    it("appelle l'API, supprime le token et met user à null", async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      mockedApiDeleteAccount.mockResolvedValue({});

      await act(async () => {
        await result.current.deleteAccount();
      });

      expect(mockedApiDeleteAccount).toHaveBeenCalled();
      expect(mockedRemoveToken).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
    });
  });

  describe('refreshUser', () => {
    it('recharge le user depuis le token', async () => {
      const { result } = renderHook(() => useAuthContext(), { wrapper });

      await waitFor(() => expect(result.current.loading).toBe(false));

      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      mockedGetToken.mockResolvedValue('token');
      mockedJwtDecode.mockReturnValue({
        id: 'refreshed',
        email: 'r@r.com',
        exp: futureExp,
      });
      mockedGetCurrentUser.mockResolvedValue({
        _id: 'refreshed',
        email: 'r@r.com',
      });

      await act(async () => {
        await result.current.refreshUser();
      });

      expect(result.current.user).toEqual(
        expect.objectContaining({ id: 'refreshed' }),
      );
    });
  });
});

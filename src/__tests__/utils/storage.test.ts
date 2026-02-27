import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SecureStore = jest.requireMock('expo-secure-store') as {
  isAvailableAsync: jest.Mock;
  setItemAsync: jest.Mock;
  getItemAsync: jest.Mock;
  deleteItemAsync: jest.Mock;
};

const TOKEN_KEY = 'auth_token';

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('storage', () => {
  describe('storeToken', () => {
    it('stocke le token dans secure store quand disponible', async () => {
      SecureStore.isAvailableAsync.mockResolvedValue(true);

      await storeToken('mon-token');

      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        TOKEN_KEY,
        'mon-token',
      );
    });

    it('stocke le token dans async storage quand secure store indisponible', async () => {
      SecureStore.isAvailableAsync.mockResolvedValue(false);

      await storeToken('mon-token');

      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      expect(stored).toBe('mon-token');
    });
  });

  describe('getToken', () => {
    it('retourne le token de secure store en priorité', async () => {
      SecureStore.isAvailableAsync.mockResolvedValue(true);
      SecureStore.getItemAsync.mockResolvedValue('secure-token');

      const token = await getToken();
      expect(token).toBe('secure-token');
    });

    it('retourne le token stocké', async () => {
      SecureStore.isAvailableAsync.mockResolvedValue(false);

      await AsyncStorage.setItem(TOKEN_KEY, 'mon-token');
      const token = await getToken();
      expect(token).toBe('mon-token');
    });

    it('retourne null si aucun token stocké', async () => {
      const token = await getToken();
      expect(token).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('supprime le token dans secure store et async storage', async () => {
      SecureStore.isAvailableAsync.mockResolvedValue(true);
      await AsyncStorage.setItem(TOKEN_KEY, 'mon-token');
      await removeToken();

      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      expect(token).toBeNull();
    });
  });
});

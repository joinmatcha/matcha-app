import AsyncStorage from '@react-native-async-storage/async-storage';

import { getToken, removeToken, storeToken } from '@/utils/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const TOKEN_KEY = 'auth_token';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('storage', () => {
  describe('storeToken', () => {
    it('stocke le token avec la bonne clé', async () => {
      await storeToken('mon-token');
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      expect(stored).toBe('mon-token');
    });
  });

  describe('getToken', () => {
    it('retourne le token stocké', async () => {
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
    it('supprime le token', async () => {
      await AsyncStorage.setItem(TOKEN_KEY, 'mon-token');
      await removeToken();
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      expect(token).toBeNull();
    });
  });
});

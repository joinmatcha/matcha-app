import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

const setFallbackToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

const getFallbackToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

const removeFallbackToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const storeToken = async (token: string) => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

  if (isSecureStoreAvailable) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await removeFallbackToken();
    return;
  }

  await setFallbackToken(token);
};

export const getToken = async (): Promise<string | null> => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

  if (isSecureStoreAvailable) {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      return token;
    }
  }

  return await getFallbackToken();
};

export const removeToken = async () => {
  const isSecureStoreAvailable = await SecureStore.isAvailableAsync();

  if (isSecureStoreAvailable) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  await removeFallbackToken();
};

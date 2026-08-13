import api from '@/api/api';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));

describe('api instance', () => {
  it('est une instance axios avec les bons defaults', () => {
    expect(api.defaults.timeout).toBe(60000);
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
    expect(api.defaults.headers['Accept']).toBe('application/json');
  });

  it('a un interceptor de requête configuré', () => {
    const interceptors = api.interceptors.request as any;
    expect(interceptors.handlers.length).toBeGreaterThan(0);
  });
});

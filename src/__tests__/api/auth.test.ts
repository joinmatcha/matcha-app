import api from '@/api/api';
import {
  deleteAccount,
  getCurrentUser,
  login,
  register,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
} from '@/api/auth';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('auth API', () => {
  beforeEach(() => jest.clearAllMocks());

  it('register envoie un POST /api/users avec les données utilisateur', async () => {
    const userData = {
      email: 'a@b.com',
      password: 'p',
      firstName: 'A',
      lastName: 'B',
      consentAccepted: true,
    };
    mockedApi.post.mockResolvedValue({ data: { id: '1' } });

    const result = await register(userData);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/users', userData);
    expect(result).toEqual({ id: '1' });
  });

  it('login envoie un POST /api/auth/login', async () => {
    mockedApi.post.mockResolvedValue({
      data: { token: 'tok', user: { id: '1' } },
    });

    const result = await login('a@b.com', 'pass');

    expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'a@b.com',
      password: 'pass',
    });
    expect(result).toEqual({ token: 'tok', user: { id: '1' } });
  });

  it('getCurrentUser envoie un GET /api/users/me', async () => {
    mockedApi.get.mockResolvedValue({ data: { id: '1', email: 'a@b.com' } });

    const result = await getCurrentUser();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/users/me');
    expect(result).toEqual({ id: '1', email: 'a@b.com' });
  });

  it('deleteAccount envoie un DELETE /api/profile/account', async () => {
    mockedApi.delete.mockResolvedValue({ data: { success: true } });

    const result = await deleteAccount();

    expect(mockedApi.delete).toHaveBeenCalledWith('/api/profile/account');
    expect(result).toEqual({ success: true });
  });

  it('requestPasswordReset envoie un POST /api/auth/request-reset', async () => {
    mockedApi.post.mockResolvedValue({ data: { message: 'sent' } });

    const result = await requestPasswordReset('a@b.com');

    expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/request-reset', {
      email: 'a@b.com',
    });
    expect(result).toEqual({ message: 'sent' });
  });

  it('resendVerificationEmail envoie un POST /api/users/resend-verification', async () => {
    mockedApi.post.mockResolvedValue({ data: { message: 'sent' } });

    const result = await resendVerificationEmail('a@b.com');

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/api/users/resend-verification',
      {
        email: 'a@b.com',
      },
    );
    expect(result).toEqual({ message: 'sent' });
  });

  it('resetPassword envoie un POST /api/auth/reset-password', async () => {
    mockedApi.post.mockResolvedValue({ data: { success: true } });

    const result = await resetPassword('tok123', 'newpass');

    expect(mockedApi.post).toHaveBeenCalledWith('/api/auth/reset-password', {
      token: 'tok123',
      newPassword: 'newpass',
    });
    expect(result).toEqual({ success: true });
  });
});

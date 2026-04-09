import api from '@/api/api';
import {
  changePassword,
  deleteAccount,
  getProfile,
  requestEmailChange,
  updateProfile,
} from '@/features/profile/api/profileApi';

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
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('profileApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('changePassword envoie un POST /api/profile/change-password', async () => {
    const data = {
      oldPassword: 'old',
      newPassword: 'new',
      confirmNewPassword: 'new',
    };
    mockedApi.post.mockResolvedValue({ data: { success: true } });

    const result = await changePassword(data);

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/api/profile/change-password',
      data,
    );
    expect(result).toEqual({ success: true });
  });

  it('getProfile appelle GET /api/profile', async () => {
    mockedApi.get.mockResolvedValue({ data: { id: '1', firstName: 'John' } });

    const result = await getProfile();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/profile');
    expect(result).toEqual({ id: '1', firstName: 'John' });
  });

  it('updateProfile envoie un PATCH /api/profile', async () => {
    const payload = { firstName: 'Jane' };
    mockedApi.patch.mockResolvedValue({ data: { id: '1', firstName: 'Jane' } });

    const result = await updateProfile(payload);

    expect(mockedApi.patch).toHaveBeenCalledWith('/api/profile', payload);
    expect(result.firstName).toBe('Jane');
  });

  it('deleteAccount envoie un DELETE /api/profile/account', async () => {
    mockedApi.delete.mockResolvedValue({ data: { success: true } });

    const result = await deleteAccount();

    expect(mockedApi.delete).toHaveBeenCalledWith('/api/profile/account');
    expect(result).toEqual({ success: true });
  });

  it('requestEmailChange envoie un POST /api/profile/request-email-change', async () => {
    mockedApi.post.mockResolvedValue({ data: { message: 'sent' } });

    const result = await requestEmailChange('new@test.com');

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/api/profile/request-email-change',
      { newEmail: 'new@test.com' },
    );
    expect(result).toEqual({ message: 'sent' });
  });
});

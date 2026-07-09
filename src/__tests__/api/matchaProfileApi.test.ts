import api from '@/api/api';
import { getMatchaProfile } from '@/features/home/api/matchaProfileApi';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('matchaProfileApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getMatchaProfile appelle GET /api/matcha-profile/me', async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        profile: {
          completion: 100,
          mainProfile: {
            title: 'Le catalyseur humain',
            summary: 'Synthèse',
          },
        },
      },
    });

    const result = await getMatchaProfile();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/matcha-profile/me');
    expect(result.profile.mainProfile.title).toBe('Le catalyseur humain');
  });
});

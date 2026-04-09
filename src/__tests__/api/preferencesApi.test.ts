import api from '@/api/api';
import { getPreferences } from '@/features/swipe/api/preferencesApi';

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

describe('preferencesApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getPreferences appelle GET /api/users/me/preferences', async () => {
    const prefs = {
      totalLikes: 5,
      totalDislikes: 2,
      topSectors: [],
      topCompetences: [],
      topTags: [],
      topWorkConditions: [],
      recentLikes: [],
    };
    mockedApi.get.mockResolvedValue({ data: { preferences: prefs } });

    const result = await getPreferences();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/users/me/preferences');
    expect(result).toEqual(prefs);
  });
});

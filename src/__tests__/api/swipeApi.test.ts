import api from '@/api/api';
import { getDeck, postSwipe } from '@/features/swipe/api/swipeApi';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/api/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('swipeApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getDeck appelle GET /api/jobs/deck', async () => {
    const data = { jobs: [], remaining: 5, limit: 10 };
    mockedApi.get.mockResolvedValue({ data });

    const result = await getDeck();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/jobs/deck');
    expect(result).toEqual(data);
  });

  it('postSwipe envoie un POST /api/jobs/swipe avec jobId et action', async () => {
    const swipeData = {
      swipe: { id: 's1', jobId: 'j1', action: 'like', swipedAt: '2024-01-01' },
      remaining: 4,
      limit: 10,
    };
    mockedApi.post.mockResolvedValue({ data: swipeData });

    const result = await postSwipe('j1', 'like');

    expect(mockedApi.post).toHaveBeenCalledWith('/api/jobs/swipe', {
      jobId: 'j1',
      action: 'like',
    });
    expect(result.swipe.action).toBe('like');
  });
});

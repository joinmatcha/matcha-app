import api from '@/api/api';
import {
  getActiveWorkStyleTest,
  getMyWorkStyle,
  resetWorkStyleTest,
  submitWorkStyleTest,
} from '@/features/workStyle/api/workStyleApi';

jest.mock('@/api/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe('workStyleApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getActiveWorkStyleTest appelle GET /api/work-style/active', async () => {
    mockedApi.get.mockResolvedValue({ data: { completed: false, test: {} } });

    const result = await getActiveWorkStyleTest();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/work-style/active');
    expect(result.completed).toBe(false);
  });

  it('getMyWorkStyle appelle GET /api/work-style/me', async () => {
    mockedApi.get.mockResolvedValue({
      data: { latestResult: null, history: [] },
    });

    const result = await getMyWorkStyle();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/work-style/me');
    expect(result.history).toEqual([]);
  });

  it('submitWorkStyleTest envoie les réponses', async () => {
    mockedApi.post.mockResolvedValue({ data: { result: { id: 'w1' } } });

    const result = await submitWorkStyleTest([{ questionId: 'Q1', value: 5 }]);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/work-style/submit', {
      answers: [{ questionId: 'Q1', value: 5 }],
    });
    expect(result.id).toBe('w1');
  });

  it('resetWorkStyleTest appelle POST /api/work-style/reset', async () => {
    mockedApi.post.mockResolvedValue({ data: {} });

    await resetWorkStyleTest();

    expect(mockedApi.post).toHaveBeenCalledWith('/api/work-style/reset');
  });
});

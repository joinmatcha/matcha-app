import api from '@/api/api';
import {
  getActivePersonalityTest,
  resetPersonalityTest,
  submitPersonalityTest,
} from '@/features/personality/api/personalityApi';

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

describe('personalityApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getActivePersonalityTest appelle GET /api/personality/active', async () => {
    const data = { completed: false, test: { _id: 't1' } };
    mockedApi.get.mockResolvedValue({ data });

    const result = await getActivePersonalityTest();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/personality/active');
    expect(result).toEqual(data);
  });

  it('submitPersonalityTest envoie les réponses en POST', async () => {
    const answers = [{ questionId: 'q1', value: 3 }];
    const resultData = { type: 'INTJ', label: 'Architecte' };
    mockedApi.post.mockResolvedValue({ data: { data: resultData } });

    const result = await submitPersonalityTest(answers);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/personality/submit', {
      answers,
    });
    expect(result).toEqual(resultData);
  });

  it('resetPersonalityTest envoie un POST /api/personality/reset', async () => {
    mockedApi.post.mockResolvedValue({ data: undefined });

    await resetPersonalityTest();

    expect(mockedApi.post).toHaveBeenCalledWith('/api/personality/reset');
  });
});

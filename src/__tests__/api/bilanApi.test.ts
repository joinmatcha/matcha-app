import api from '@/api/api';
import {
  generateBilan,
  getBilanQuestions,
  getMyBilan,
  postBilanAnswers,
} from '@/features/bilan/api/bilanApi';

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

describe('bilanApi', () => {
  beforeEach(() => jest.clearAllMocks());

  it('getBilanQuestions appelle GET /api/bilan/questions', async () => {
    const data = { version: 1, questions: [] };
    mockedApi.get.mockResolvedValue({ data });

    const result = await getBilanQuestions();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/bilan/questions');
    expect(result).toEqual(data);
  });

  it('postBilanAnswers envoie les réponses avec la version', async () => {
    const answers = [{ questionCode: 'Q1', valueNumber: 3 }];
    mockedApi.post.mockResolvedValue({ data: { ok: true } });

    const result = await postBilanAnswers(1, answers);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/bilan/answers', {
      version: 1,
      answers,
    });
    expect(result).toEqual({ ok: true });
  });

  it('generateBilan envoie un POST avec la version', async () => {
    const bilanResult = { bilan: { id: 'b1' } };
    mockedApi.post.mockResolvedValue({ data: bilanResult });

    const result = await generateBilan(2);

    expect(mockedApi.post).toHaveBeenCalledWith('/api/bilan/generate', {
      version: 2,
    });
    expect(result).toEqual(bilanResult);
  });

  it('getMyBilan appelle GET /api/bilan/me', async () => {
    const data = { bilan: null };
    mockedApi.get.mockResolvedValue({ data });

    const result = await getMyBilan();

    expect(mockedApi.get).toHaveBeenCalledWith('/api/bilan/me');
    expect(result).toEqual(data);
  });
});

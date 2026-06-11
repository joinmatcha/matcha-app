import { act, renderHook, waitFor } from '@testing-library/react-native';

import {
  generateBilan,
  getBilanQuestions,
  getMyBilan,
  postBilanAnswers,
} from '@/features/bilan/api/bilanApi';
import { useBilan } from '@/features/bilan/hooks/useBilan';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/features/bilan/api/bilanApi', () => ({
  getBilanQuestions: jest.fn(),
  postBilanAnswers: jest.fn(),
  generateBilan: jest.fn(),
  getMyBilan: jest.fn(),
}));

const mockedGetQuestions = getBilanQuestions as jest.Mock;
const mockedPostAnswers = postBilanAnswers as jest.Mock;
const mockedGenerateBilan = generateBilan as jest.Mock;
const mockedGetMyBilan = getMyBilan as jest.Mock;

describe('useBilan', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetQuestions.mockResolvedValue({
      version: 1,
      questions: [{ code: 'Q1' }],
    });
    mockedGetMyBilan.mockResolvedValue({ bilan: null });
  });

  it('charge les questions et le bilan au montage', async () => {
    const { result } = renderHook(() => useBilan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.questions).toEqual([{ code: 'Q1' }]);
    expect(result.current.version).toBe(1);
    expect(result.current.bilan).toBeNull();
  });

  it('met une erreur si le chargement des questions échoue', async () => {
    mockedGetQuestions.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useBilan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(
      "Impossible de charger l'auto-évaluation.",
    );
    expect(result.current.questions).toEqual([]);
    expect(result.current.version).toBeNull();
  });

  it('saveAnswers appelle postBilanAnswers', async () => {
    mockedPostAnswers.mockResolvedValue({ ok: true });
    const { result } = renderHook(() => useBilan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const answers = [{ questionCode: 'Q1', valueNumber: 4 }];
    await act(async () => {
      await result.current.saveAnswers(1, answers);
    });

    expect(mockedPostAnswers).toHaveBeenCalledWith(1, answers);
  });

  it('generate appelle generateBilan et met à jour le bilan', async () => {
    const bilanResult = { bilan: { id: 'b1', conclusion: {} } };
    mockedGenerateBilan.mockResolvedValue(bilanResult);

    const { result } = renderHook(() => useBilan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.generate(1);
    });

    expect(result.current.bilan).toEqual(bilanResult.bilan);
  });

  it('refreshQuestions recharge les questions', async () => {
    const { result } = renderHook(() => useBilan());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedGetQuestions.mockResolvedValue({
      version: 2,
      questions: [{ code: 'Q2' }],
    });

    await act(async () => {
      await result.current.refreshQuestions();
    });

    expect(result.current.version).toBe(2);
  });
});

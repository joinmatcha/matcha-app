import { act, renderHook } from '@testing-library/react-native';

import { getDeck, postSwipe } from '@/features/swipe/api/swipeApi';
import { useSwipe } from '@/features/swipe/hooks/useSwipe';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/features/swipe/api/swipeApi', () => ({
  getDeck: jest.fn(),
  postSwipe: jest.fn(),
}));

const mockedGetDeck = getDeck as jest.Mock;
const mockedPostSwipe = postSwipe as jest.Mock;

describe('useSwipe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDeck.mockResolvedValue({
      jobs: [
        { id: 'j1', title: 'Dev', tags: [] },
        { id: 'j2', title: 'Designer', tags: [] },
      ],
      remaining: 5,
      limit: 10,
    });
  });

  it('charge le deck via loadDeck', async () => {
    const { result } = renderHook(() => useSwipe());

    await act(async () => {
      await result.current.loadDeck();
    });

    expect(result.current.deck).toHaveLength(2);
    expect(result.current.remaining).toBe(5);
    expect(result.current.error).toBeNull();
  });

  it('gère les erreurs de chargement', async () => {
    mockedGetDeck.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useSwipe());

    await act(async () => {
      await result.current.loadDeck();
    });

    expect(result.current.error).toBe('Impossible de charger les métiers.');
  });

  it('swipe retire le job du deck et met à jour remaining', async () => {
    const { result } = renderHook(() => useSwipe());

    await act(async () => {
      await result.current.loadDeck();
    });

    mockedPostSwipe.mockResolvedValue({
      swipe: { id: 's1' },
      remaining: 4,
      limit: 10,
    });

    await act(async () => {
      await result.current.swipe('j1', 'like');
    });

    expect(result.current.deck).toHaveLength(1);
    expect(result.current.deck[0].id).toBe('j2');
    expect(result.current.remaining).toBe(4);
  });

  it('gère les erreurs de swipe', async () => {
    const { result } = renderHook(() => useSwipe());

    await act(async () => {
      await result.current.loadDeck();
    });

    mockedPostSwipe.mockRejectedValue(new Error('fail'));

    await act(async () => {
      await result.current.swipe('j1', 'dislike');
    });

    expect(result.current.error).toContain('Impossible');
  });
});

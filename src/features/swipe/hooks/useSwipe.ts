import { useCallback, useEffect, useRef, useState } from 'react';

import { DeckJob, getDeck, postSwipe } from '@/features/swipe/api/swipeApi';
import { getApiErrorMessage } from '@/utils/apiError';

export function useSwipe() {
  const [deck, setDeck] = useState<DeckJob[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadingRef = useRef(false);

  const loadDeck = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await getDeck();
      setDeck(data.jobs);
      setRemaining(data.remaining);
      setLimit(data.limit);
    } catch {
      setError('Impossible de charger les métiers.');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const swipe = useCallback(
    async (jobId: string, action: 'like' | 'dislike') => {
      try {
        setError(null);
        const data = await postSwipe(jobId, action);
        setRemaining(data.remaining);
        setLimit(data.limit);
        setDeck((prev) => prev.filter((j) => j.id !== jobId));
      } catch (err) {
        setError(
          getApiErrorMessage(err, 'Impossible d’enregistrer ton swipe.'),
        );
      }
    },
    [],
  );

  useEffect(() => {
    if (
      deck.length === 0 &&
      remaining !== null &&
      remaining > 0 &&
      !loadingRef.current
    ) {
      loadDeck();
    }
  }, [deck.length, remaining, loadDeck]);

  return {
    deck,
    remaining,
    limit,
    loading,
    error,
    loadDeck,
    swipe,
  };
}

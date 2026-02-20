import { useCallback, useEffect, useRef, useState } from 'react';

import { DeckJob, getDeck, postSwipe } from '@/api/swipe';

export function useSwipe() {
  const [deck, setDeck] = useState<DeckJob[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
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
        const data = await postSwipe(jobId, action);
        setRemaining(data.remaining);
        setDeck((prev) => prev.filter((j) => j.id !== jobId));
      } catch {
        // On ignore les erreurs réseau silencieusement pour ne pas bloquer l'UX
      }
    },
    [],
  );

  // Recharge automatiquement si le deck est vide mais qu'il reste du quota
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
    loading,
    error,
    loadDeck,
    swipe,
  };
}

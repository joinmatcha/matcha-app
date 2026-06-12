import { useCallback, useEffect, useState } from 'react';

import {
  WorkStyleResult,
  getMyWorkStyle,
} from '@/features/workStyle/api/workStyleApi';

export function useWorkStyle() {
  const [latestResult, setLatestResult] = useState<WorkStyleResult | null>(
    null,
  );
  const [history, setHistory] = useState<WorkStyleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshWorkStyle = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyWorkStyle();
      setLatestResult(response.latestResult);
      setHistory(response.history);
    } catch {
      setLatestResult(null);
      setHistory([]);
      setError('Style professionnel indisponible.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWorkStyle();
  }, [refreshWorkStyle]);

  return { latestResult, history, loading, error, refreshWorkStyle };
}

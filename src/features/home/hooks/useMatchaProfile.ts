import { useCallback, useEffect, useState } from 'react';

import {
  MatchaProfileSummary,
  getMatchaProfile,
} from '@/features/home/api/matchaProfileApi';
import { getApiErrorMessage } from '@/utils/apiError';

export function useMatchaProfile() {
  const [profile, setProfile] = useState<MatchaProfileSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMatchaProfile();
      setProfile(response.profile);
    } catch (err) {
      setProfile(null);
      setError(
        getApiErrorMessage(err, 'Impossible de charger ton profil Matcha.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    profile,
    loading,
    error,
    refresh,
  };
}

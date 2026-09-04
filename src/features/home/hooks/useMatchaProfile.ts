import { useCallback, useEffect, useState } from 'react';

import {
  MatchaProfileSummary,
  getMatchaProfile,
} from '@/features/home/api/matchaProfileApi';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/utils/apiError';

let cachedProfile: MatchaProfileSummary | null = null;
let cachedProfileUserId: string | null = null;

export function useMatchaProfile() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const initialProfile =
    userId && cachedProfileUserId === userId ? cachedProfile : null;
  const [profile, setProfile] = useState<MatchaProfileSummary | null>(
    initialProfile,
  );
  const [loading, setLoading] = useState(!initialProfile);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      cachedProfile = null;
      cachedProfileUserId = null;
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getMatchaProfile();
      cachedProfile = response.profile;
      cachedProfileUserId = userId;
      setProfile(response.profile);
    } catch (err) {
      if (!cachedProfile || cachedProfileUserId !== userId) {
        setProfile(null);
      }
      setError(
        getApiErrorMessage(err, 'Impossible de charger ton profil Matcha.'),
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

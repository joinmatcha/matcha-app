import { useCallback, useEffect, useState } from 'react';

import { getProfile } from '@/features/profile/api/profileApi';
import { UserFull } from '@/types/user';
import { getApiErrorMessage } from '@/utils/apiError';

export function useProfile() {
  const [user, setUser] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const raw = await getProfile();
      const data = raw.user;

      const normalized: UserFull = {
        id: data._id,
        email: data.email,
        firstName: data.firstName ?? '',
        lastName: data.lastName ?? '',
        birthYear: data.birthYear,
        gender: data.gender,
        subscription: data.subscription ?? 'free',

        addressStreet: data.addressStreet,
        addressCity: data.addressCity,
        addressPostalCode: data.addressPostalCode,
        addressCountry: data.addressCountry,

        jobTypes: data.jobTypes || [],
        locationPref: data.locationPref,
        remote: data.remote,

        location: data.location,

        avatarUrl: data.avatarUrl,

        isEmailVerified: data.isEmailVerified,
        consentAccepted: data.consentAccepted,

        personalityTestId: data.personalityTestId,
        skillsAssessmentId: data.skillsAssessmentId,

        personality: data.personality
          ? {
              type: data.personality.type,
              label: data.personality.label,
              description: data.personality.description,
              strengths: data.personality.strengths || [],
              weaknesses: data.personality.weaknesses || [],
              suggestedSectors: data.personality.suggestedSectors || [],
              scoreBreakdown: {
                EI: data.personality.scoreBreakdown?.EI ?? 0,
                SN: data.personality.scoreBreakdown?.SN ?? 0,
                TF: data.personality.scoreBreakdown?.TF ?? 0,
                JP: data.personality.scoreBreakdown?.JP ?? 0,
              },
            }
          : null,
      };

      setUser(normalized);
    } catch (err) {
      setUser(null);
      setError(getApiErrorMessage(err, 'Impossible de charger le profil.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    user,
    loading,
    error,
    refresh: load,
  };
}

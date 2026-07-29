import { act, renderHook, waitFor } from '@testing-library/react-native';

import { getProfile } from '@/features/profile/api/profileApi';
import { useProfile } from '@/features/profile/hooks/useProfile';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('@/features/profile/api/profileApi', () => ({
  getProfile: jest.fn(),
}));

const mockedGetProfile = getProfile as jest.Mock;

const rawUser = {
  _id: 'u1',
  email: 'a@b.com',
  firstName: 'John',
  lastName: 'Doe',
  birthYear: 2000,
  gender: 'male',
  subscription: 'free',
  jobTypes: ['cdi'],
  locationPref: 'remote',
  remote: true,
  isEmailVerified: true,
  consentAccepted: true,
  personality: {
    type: 'INTJ',
    label: 'Architecte',
    description: 'desc',
    strengths: ['s1'],
    weaknesses: ['w1'],
    suggestedSectors: ['dev'],
    scoreBreakdown: { EI: 1, SN: 2, TF: 3, JP: 4 },
  },
};

describe('useProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetProfile.mockResolvedValue({ user: rawUser });
  });

  it('charge et normalise le profil au montage', async () => {
    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(
      expect.objectContaining({
        id: 'u1',
        email: 'a@b.com',
        firstName: 'John',
      }),
    );
    expect(result.current.user?.personality?.type).toBe('INTJ');
    expect(result.current.error).toBeNull();
  });

  it('normalise un profil sans personality', async () => {
    mockedGetProfile.mockResolvedValue({
      user: { ...rawUser, personality: null },
    });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user?.personality).toBeNull();
  });

  it('met une erreur si le chargement échoue', async () => {
    mockedGetProfile.mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe('Impossible de charger le profil.');
  });

  it('refresh recharge le profil', async () => {
    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockedGetProfile.mockResolvedValue({
      user: { ...rawUser, firstName: 'Jane' },
    });

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.user?.firstName).toBe('Jane');
  });
});

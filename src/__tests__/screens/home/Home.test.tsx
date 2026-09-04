import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '@/features/home/screens/Home';

const mockNavigate = jest.fn();
const mockUseProfile = jest.fn();
const mockUseBilan = jest.fn();
const mockUseWorkStyle = jest.fn();
const mockUseMatchaProfile = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
}));
jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: { View },
    useSharedValue: (v: number) => ({ value: v }),
    useAnimatedStyle: (fn: () => any) => fn(),
    withRepeat: (v: any) => v,
    withTiming: (v: number) => v,
  };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
});
jest.mock('@/assets', () => ({
  Branding: { Logo: () => null },
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: () => void) => cb(),
}));
jest.mock('react-native-paper', () => {
  const { Text, Pressable } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}));
jest.mock('@/features/bilan/hooks/useBilan', () => ({
  useBilan: () => mockUseBilan(),
}));
jest.mock('@/features/home/hooks/useMatchaProfile', () => ({
  useMatchaProfile: () => mockUseMatchaProfile(),
}));
jest.mock('@/features/workStyle', () => ({
  useWorkStyle: () => mockUseWorkStyle(),
}));
jest.mock('@/features/swipe/api/preferencesApi', () => ({
  getPreferences: jest.fn().mockRejectedValue(new Error('no prefs')),
}));
jest.mock('@/features/jobs', () => ({
  getTopLikedJobs: jest.fn().mockResolvedValue({ jobs: [] }),
}));
jest.mock('@/services/draftStorage', () => ({
  loadDraft: jest.fn().mockResolvedValue(null),
  clearDraft: jest.fn(),
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', subscription: 'free' },
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    mockUseProfile.mockReturnValue({
      user: {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@b.com',
        subscription: 'free',
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    mockUseBilan.mockReturnValue({
      bilan: null,
      loading: false,
      error: null,
      refreshBilan: jest.fn(),
    });
    mockUseWorkStyle.mockReturnValue({
      latestResult: null,
      loading: false,
      refreshWorkStyle: jest.fn(),
    });
    mockUseMatchaProfile.mockReturnValue({
      profile: {
        completion: 0,
        matchingStatus: {
          unlocked: false,
          total: 0,
          remaining: 0,
          completed: false,
          liked: 0,
          disliked: 0,
        },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
  });

  it('se rend sans erreur', async () => {
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Hello John !/)).toBeTruthy();
    });
  });

  it("affiche le prénom de l'utilisateur", async () => {
    const { getByText } = render(<HomeScreen />);

    await waitFor(() => {
      expect(getByText(/Hello John !/)).toBeTruthy();
    });
  });

  it('ouvre la page des plans depuis le bouton du header', async () => {
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Voir les plans Matcha')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Voir les plans Matcha'));

    expect(mockNavigate).toHaveBeenCalledWith('PricingPlans');
  });

  it('oriente un compte free vers les plans depuis le profil Matcha', async () => {
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Pass Complet requis')).toBeTruthy();
      expect(screen.getByText('0%')).toBeTruthy();
    });

    fireEvent.press(screen.getAllByText('Voir les plans')[0]);

    expect(mockNavigate).toHaveBeenCalledWith('PricingPlans');
  });

  it('ouvre le matching quand les 3 tests sont terminés', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', subscription: 'premium' },
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    mockUseBilan.mockReturnValue({
      bilan: { createdAt: '2026-01-01T00:00:00.000Z' },
      loading: false,
      error: null,
      refreshBilan: jest.fn(),
    });
    mockUseProfile.mockReturnValue({
      user: {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@b.com',
        subscription: 'premium',
        personality: { label: 'Profil personnalité' },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    mockUseWorkStyle.mockReturnValue({
      latestResult: { profile: { title: 'Style pro' }, topAxisLabels: [] },
      loading: false,
      refreshWorkStyle: jest.fn(),
    });
    mockUseMatchaProfile.mockReturnValue({
      profile: {
        completion: 100,
        matchingStatus: {
          unlocked: true,
          total: 20,
          remaining: 20,
          completed: false,
          liked: 0,
          disliked: 0,
        },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Matching métier débloqué')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Lancer le matching'));

    expect(mockNavigate).toHaveBeenCalledWith('JobMatching');
  });

  it("n'affiche pas lancer le matching pendant le refresh du profil Matcha", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', subscription: 'premium' },
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    mockUseBilan.mockReturnValue({
      bilan: { createdAt: '2026-01-01T00:00:00.000Z' },
      loading: false,
      error: null,
      refreshBilan: jest.fn(),
    });
    mockUseProfile.mockReturnValue({
      user: {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@b.com',
        subscription: 'premium',
        personality: { label: 'Profil personnalité' },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    mockUseWorkStyle.mockReturnValue({
      latestResult: { profile: { title: 'Style pro' }, topAxisLabels: [] },
      loading: false,
      refreshWorkStyle: jest.fn(),
    });
    mockUseMatchaProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      refresh: jest.fn(),
    });

    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Actualisation')).toBeTruthy();
    });

    expect(screen.queryByText('Lancer le matching')).toBeNull();
  });

  it('ouvre le profil complet après le matching terminé', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', subscription: 'premium' },
      logout: jest.fn(),
      refreshUser: jest.fn(),
    });
    mockUseBilan.mockReturnValue({
      bilan: { createdAt: '2026-01-01T00:00:00.000Z' },
      loading: false,
      error: null,
      refreshBilan: jest.fn(),
    });
    mockUseProfile.mockReturnValue({
      user: {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'a@b.com',
        subscription: 'premium',
        personality: { label: 'Profil personnalité' },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });
    mockUseWorkStyle.mockReturnValue({
      latestResult: { profile: { title: 'Style pro' }, topAxisLabels: [] },
      loading: false,
      refreshWorkStyle: jest.fn(),
    });
    mockUseMatchaProfile.mockReturnValue({
      profile: {
        completion: 100,
        matchingStatus: {
          unlocked: true,
          total: 20,
          remaining: 0,
          completed: true,
          liked: 5,
          disliked: 15,
        },
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    });

    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Ton profil Matcha est prêt')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Voir mon profil complet'));

    expect(mockNavigate).toHaveBeenCalledWith('MatchaProfile');
  });

  it('oriente un compte free vers les plans depuis les tests premium', async () => {
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Auto-évaluation Premium')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Auto-évaluation Premium'));

    expect(mockNavigate).toHaveBeenCalledWith('PricingPlans');
  });
});

import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import HomeScreen from '@/features/home/screens/Home';

const mockNavigate = jest.fn();

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
  useAuth: () => ({ user: { id: 'u1' }, logout: jest.fn() }),
}));
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({
    user: { id: 'u1', firstName: 'John', lastName: 'Doe', email: 'a@b.com' },
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));
jest.mock('@/features/bilan/hooks/useBilan', () => ({
  useBilan: () => ({
    bilan: null,
    loading: false,
    error: null,
    refreshBilan: jest.fn(),
  }),
}));
jest.mock('@/features/home/hooks/useMatchaProfile', () => ({
  useMatchaProfile: () => ({
    profile: {
      completion: 0,
    },
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));
jest.mock('@/features/workStyle', () => ({
  useWorkStyle: () => ({
    latestResult: null,
    loading: false,
    refreshWorkStyle: jest.fn(),
  }),
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

  it('ouvre la synthèse Profil Matcha depuis la card profil', async () => {
    const screen = render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('Construire mon profil')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Construire mon profil'));

    expect(mockNavigate).toHaveBeenCalledWith('MatchaProfile');
  });
});

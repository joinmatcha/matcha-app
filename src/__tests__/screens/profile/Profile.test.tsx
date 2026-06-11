import { render } from '@testing-library/react-native';
import React from 'react';

import ProfileScreen from '@/features/profile/screens/Profile';

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
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
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
  useAuth: () => ({ deleteAccount: jest.fn(), logout: jest.fn() }),
}));
jest.mock('@/features/profile/hooks/useProfile', () => ({
  useProfile: () => ({
    user: {
      id: 'u1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'a@b.com',
      isEmailVerified: true,
    },
    loading: false,
    error: null,
    refresh: jest.fn(),
  }),
}));
jest.mock('@/features/profile/components/ProfileHeader', () => {
  const { Text } = require('react-native');
  return () => <Text>ProfileHeader</Text>;
});
jest.mock('@/features/profile/components/ProfileInfosReadOnly', () => {
  const { Text } = require('react-native');
  return () => <Text>ProfileInfosReadOnly</Text>;
});

describe('ProfileScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<ProfileScreen />)).not.toThrow();
  });

  it('affiche le bouton de déconnexion', () => {
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Se déconnecter')).toBeTruthy();
  });
});

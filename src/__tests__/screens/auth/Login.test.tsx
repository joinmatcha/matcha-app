import { render } from '@testing-library/react-native';
import React from 'react';

import LoginScreen from '@/features/auth/screens/Login';

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
  const {
    Text,
    View,
    Pressable,
    TextInput: RNTextInput,
  } = require('react-native');
  return {
    Text,
    Portal: ({ children }: any) => <View>{children}</View>,
    Button: ({ children, onPress }: any) => (
      <Pressable onPress={onPress}>
        <Text>{children}</Text>
      </Pressable>
    ),
    HelperText: ({ children }: any) => <Text>{children}</Text>,
    TextInput: Object.assign(
      ({ label, value, onChangeText }: any) => (
        <RNTextInput
          placeholder={label}
          value={value}
          onChangeText={onChangeText}
        />
      ),
      { Icon: () => null },
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});
jest.mock('@/assets', () => ({ Branding: { Logo: () => null } }));
jest.mock('@/hooks/useAuth', () => ({ useAuth: () => ({ login: jest.fn() }) }));

describe('LoginScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<LoginScreen />)).not.toThrow();
  });

  it('affiche le titre Connexion', () => {
    const { getByText } = render(<LoginScreen />);
    expect(getByText('Connexion')).toBeTruthy();
  });
});

import { render } from '@testing-library/react-native';
import React from 'react';

import PersonalityResultScreen from '@/features/personality/screens/PersonalityResult';

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
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      result: {
        type: 'INTJ',
        label: 'Architecte',
        description: 'desc',
        strengths: ['Analytique'],
        weaknesses: ['Perfectionniste'],
        recommendedJobs: ['Dev'],
        scoreBreakdown: { EI: 0.7, SN: 0.4, TF: 0.8, JP: 0.3 },
      },
    },
  }),
}));
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return {
    Text: RN.Text,
    Button: ({ children, onPress }: any) => (
      <RN.Pressable onPress={onPress}>
        <RN.Text>{children}</RN.Text>
      </RN.Pressable>
    ),
    DefaultTheme: { colors: {}, fonts: {} },
  };
});
jest.mock('react-native-svg', () => {
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View {...props} />,
    Line: (props: any) => <View {...props} />,
    Polygon: (props: any) => <View {...props} />,
    Text: (props: any) => <Text {...props} />,
  };
});
jest.mock('@/assets', () => ({ Branding: { Logo: () => null } }));
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));

describe('PersonalityResultScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<PersonalityResultScreen />)).not.toThrow();
  });
});

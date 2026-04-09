import { render } from '@testing-library/react-native';
import React from 'react';

import PersonalityTestScreen from '@/features/personality/screens/PersonalityTest';

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
  useAuth: () => ({ user: { id: 'u1' } }),
}));
jest.mock('@/features/personality/api/personalityApi', () => ({
  getActivePersonalityTest: jest.fn().mockResolvedValue({
    completed: false,
    test: {
      _id: 't1',
      title: 'MBTI',
      summary: 'Test',
      isActive: true,
      version: '1',
      profiles: [],
      questions: [
        {
          id: 'q1',
          text: 'Question 1',
          dimension: 'EI',
          options: [{ value: 1, label: '1' }],
        },
      ],
    },
  }),
  submitPersonalityTest: jest.fn(),
}));
jest.mock('@/services/draftStorage', () => ({
  loadDraft: jest.fn().mockResolvedValue(null),
  saveDraft: jest.fn(),
  clearDraft: jest.fn(),
}));

describe('PersonalityTestScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<PersonalityTestScreen />)).not.toThrow();
  });
});

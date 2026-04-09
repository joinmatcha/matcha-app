import { render } from '@testing-library/react-native';
import React from 'react';

import BilanQuestionsScreen from '@/features/bilan/screens/BilanQuestions';

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
  useRoute: () => ({ params: {} }),
}));
jest.mock('react-native-paper', () => {
  const { Text, Pressable, TextInput: RNTextInput } = require('react-native');
  return {
    Text,
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
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));
jest.mock('@/features/bilan/hooks/useBilan', () => ({
  useBilan: () => ({
    loading: false,
    error: null,
    version: 1,
    questions: [
      {
        code: 'Q1',
        question: 'Question 1',
        type: 'likert_1_5',
        domain: 'd',
        subdomain: 's',
      },
    ],
    bilan: null,
    saveAnswers: jest.fn(),
    generate: jest.fn(),
  }),
}));
jest.mock('@/services/draftStorage', () => ({
  loadDraft: jest.fn().mockResolvedValue(null),
  saveDraft: jest.fn(),
  clearDraft: jest.fn(),
}));

describe('BilanQuestionsScreen', () => {
  it('se rend sans erreur', () => {
    expect(() => render(<BilanQuestionsScreen />)).not.toThrow();
  });
});

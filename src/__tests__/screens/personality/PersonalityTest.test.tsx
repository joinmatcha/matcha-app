import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import {
  getActivePersonalityTest,
  submitPersonalityTest,
} from '@/features/personality/api/personalityApi';
import PersonalityTestScreen from '@/features/personality/screens/PersonalityTest';

const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockGoBack = jest.fn();

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
  useNavigation: () => ({
    navigate: mockNavigate,
    replace: mockReplace,
    goBack: mockGoBack,
  }),
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
  useAuth: () => ({ user: { id: 'u1' }, refreshUser: jest.fn() }),
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
jest.mock('@/features/analytics', () => ({
  trackAnalyticsEvent: jest.fn(),
}));
jest.mock('@/services/draftStorage', () => ({
  loadDraft: jest.fn().mockResolvedValue(null),
  saveDraft: jest.fn().mockResolvedValue(undefined),
  clearDraft: jest.fn(),
}));

describe('PersonalityTestScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getActivePersonalityTest as jest.Mock).mockResolvedValue({
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
    });
    (submitPersonalityTest as jest.Mock).mockResolvedValue({
      type: 'INTJ',
      label: 'Architecte',
      description: 'Profil structuré',
      dimensions: {},
      strengths: [],
      weaknesses: [],
      careerSuggestions: [],
    });
  });

  it('se rend sans erreur', async () => {
    const screen = render(<PersonalityTestScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Réponse 1')).toBeTruthy();
    });
  });

  it("remplace l'écran de questions par le résultat après soumission", async () => {
    const screen = render(<PersonalityTestScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Réponse 1')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Réponse 1'));
    await waitFor(() => {
      expect(screen.getByText('Parfait, tu peux finaliser.')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('Terminer le test'));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('PersonalityResult', {
        result: expect.objectContaining({
          type: 'INTJ',
          label: 'Architecte',
        }),
      });
    });
    expect(mockNavigate).not.toHaveBeenCalledWith(
      'PersonalityResult',
      expect.anything(),
    );
  });
});

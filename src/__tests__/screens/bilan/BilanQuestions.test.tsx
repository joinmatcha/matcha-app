import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';

import {
  generateBilan,
  getBilanQuestions,
  postBilanAnswers,
} from '@/features/bilan/api/bilanApi';
import BilanQuestionsScreen from '@/features/bilan/screens/BilanQuestions';

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
jest.mock('@/features/bilan/api/bilanApi', () => ({
  getBilanQuestions: jest.fn(),
  postBilanAnswers: jest.fn(),
  generateBilan: jest.fn(),
}));
jest.mock('@/features/analytics', () => ({
  trackAnalyticsEvent: jest.fn(),
}));
jest.mock('@/services/draftStorage', () => ({
  loadDraft: jest.fn().mockResolvedValue(null),
  saveDraft: jest.fn().mockResolvedValue(undefined),
  clearDraft: jest.fn(),
}));

describe('BilanQuestionsScreen', () => {
  const generatedBilan = {
    _id: 'bilan1',
    user: 'u1',
    version: 1,
    answers: [],
    scores: [],
    conclusion: {
      archetype: { id: 'balanced', title: 'Profil équilibré' },
      recommendedJobs: [
        {
          id: 'job1',
          title: 'Développeur web',
          sector: 'Informatique',
          score: 82,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getBilanQuestions as jest.Mock).mockResolvedValue({
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
    });
    (postBilanAnswers as jest.Mock).mockResolvedValue({});
    (generateBilan as jest.Mock).mockResolvedValue({ bilan: generatedBilan });
  });

  it('se rend sans erreur', async () => {
    const screen = render(<BilanQuestionsScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Réponse 5')).toBeTruthy();
    });
  });

  it("remplace l'écran de questions par le résultat après soumission", async () => {
    const screen = render(<BilanQuestionsScreen />);

    await waitFor(() => {
      expect(screen.getByLabelText('Réponse 5')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Réponse 5'));
    await waitFor(() => {
      expect(screen.getByText('Parfait, tu peux finaliser.')).toBeTruthy();
    });
    fireEvent.press(screen.getByText("Terminer l'auto-évaluation"));

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('BilanResult', {
        bilan: generatedBilan,
      });
    });
    expect(mockNavigate).not.toHaveBeenCalledWith(
      'BilanResult',
      expect.anything(),
    );
  });
});

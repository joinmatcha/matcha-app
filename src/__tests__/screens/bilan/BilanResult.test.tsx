import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import BilanResultScreen from '@/features/bilan/screens/BilanResult';

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
jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: { id: 'u1' } }),
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  useRoute: () => ({
    params: {
      bilan: {
        id: 'b1',
        version: 1,
        createdAt: '2024-01-01',
        conclusion: {
          archetype: {
            id: 'a1',
            title: 'Stratège',
            subtitle: 's',
            description: 'd',
          },
          profileSummary: 'summary',
          keyStrengths: ['Force'],
          improvementAxes: ['Axe'],
          recommendedEnvironments: ['Remote'],
          recommendedJobs: [
            {
              id: 'j1',
              title: 'Développeur web',
              description: 'Conçoit des applications',
              sector: 'Tech',
              score: 82,
              reasons: ['Compatible avec ton profil'],
            },
            {
              id: 'j2',
              title: 'Data analyst',
              description: 'Analyse des données',
              sector: 'Data',
              score: 76,
              reasons: ['Mobilise tes compétences'],
            },
          ],
          actionPlan: [],
        },
        investigation: {
          topValues: ['Autonomie'],
          topWorkConditions: ['Flex'],
          interestsProfile: [],
        },
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

describe('BilanResultScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('se rend sans erreur', () => {
    expect(() => render(<BilanResultScreen />)).not.toThrow();
  });

  it('permet de sélectionner deux métiers et de lancer la comparaison', () => {
    const screen = render(<BilanResultScreen />);

    fireEvent.press(screen.getByText('Comparer'));
    fireEvent.press(screen.getAllByText('Ajouter à la comparaison')[0]);
    fireEvent.press(screen.getAllByText('Ajouter à la comparaison')[0]);
    fireEvent.press(screen.getByText('Comparer 2 métiers'));

    expect(mockNavigate).toHaveBeenCalledWith('JobCompare', {
      jobIds: ['j1', 'j2'],
    });
  });
});

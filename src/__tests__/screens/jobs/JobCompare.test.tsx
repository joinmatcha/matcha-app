import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import JobCompareScreen from '@/features/jobs/screens/JobCompare';

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
  useRoute: () => ({ params: { jobIds: ['j1', 'j2'] } }),
}));
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
jest.mock('@/features/jobs/api/jobsApi', () => ({
  compareJobs: jest.fn().mockResolvedValue({
    context: {
      bilanId: 'b1',
      bilanVersion: 1,
      interestsProfile: ['RIASEC_I'],
      strengths: ['Analyse'],
      workConditions: ['Télétravail'],
    },
    jobs: [
      {
        id: 'j1',
        code: 'M1805',
        title: 'Développeur web',
        sector: 'Tech',
        matchScore: 84,
        matchReasons: ['Compatible avec ton profil d’intérêts'],
        riasec: ['RIASEC_I'],
        matchedInterests: ['RIASEC_I'],
        matchedSkills: ['analysis'],
        skillsToDevelop: ['testing'],
        matchedWorkConditions: ['remote'],
        workContexts: ['remote'],
        accessToJob: 'Formation en développement web',
        market: null,
        recommendedNextStep: 'Explorer une formation courte.',
      },
      {
        id: 'j2',
        code: 'M1403',
        title: 'Data analyst',
        sector: 'Data',
        matchScore: 76,
        matchReasons: ['Mobilise des compétences proches de ton profil'],
        riasec: ['RIASEC_I'],
        matchedInterests: ['RIASEC_I'],
        matchedSkills: ['analysis'],
        skillsToDevelop: ['sql'],
        matchedWorkConditions: [],
        workContexts: [],
        market: null,
        recommendedNextStep: 'Approfondir la fiche métier.',
      },
    ],
  }),
}));

describe('JobCompareScreen', () => {
  it('affiche la comparaison des métiers', async () => {
    const screen = render(<JobCompareScreen />);

    await waitFor(
      () => {
        expect(screen.getAllByText('Développeur web').length).toBeGreaterThan(
          0,
        );
      },
      { timeout: 10000 },
    );

    expect(screen.getAllByText('Data analyst').length).toBeGreaterThan(0);
    expect(screen.getByText('84%')).toBeTruthy();
    expect(screen.getByText('Prochaine action')).toBeTruthy();
  }, 15000);
});

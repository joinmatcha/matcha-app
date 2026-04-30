import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import JobDetailScreen from '@/features/jobs/screens/JobDetail';

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
  useNavigation: () => ({ goBack: jest.fn() }),
  useRoute: () => ({ params: { jobId: 'j1' } }),
}));
jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});
jest.mock('@/features/jobs/api/jobsApi', () => ({
  getJobById: jest.fn().mockResolvedValue({
    job: {
      id: 'j1',
      code: 'M1805',
      title: 'Dev',
      sector: 'Tech',
      description: 'desc',
      growthOutlook: 'unknown',
      tags: [],
      riasec: [],
      appellations: [],
      skills: [],
      skillGroups: [],
      knowledge: [],
      knowledgeGroups: [],
      workContexts: [],
      themes: [],
      interests: [],
      trainingCodes: [],
      sectors: [],
      relatedJobs: [],
    },
  }),
}));

describe('JobDetailScreen', () => {
  it('se rend sans erreur', async () => {
    const screen = render(<JobDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText('Dev')).toBeTruthy();
    });
  });
});

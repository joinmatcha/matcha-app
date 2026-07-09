import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import CareerPreferencesScreen from '@/features/home/screens/CareerPreferences';

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
jest.mock('@react-navigation/native', () => {
  const React = require('react');

  return {
    useNavigation: () => ({ navigate: jest.fn() }),
    useFocusEffect: (cb: () => void | (() => void)) => {
      React.useEffect(() => cb(), [cb]);
    },
  };
});
jest.mock('@/features/jobs', () => ({
  getTopLikedJobs: jest.fn().mockResolvedValue({
    jobs: [
      {
        id: 'job-1',
        title: 'Développeur web',
        sector: 'Informatique',
        code: 'M1805',
        likesCount: 3,
      },
    ],
  }),
}));
jest.mock('@/features/swipe/api/preferencesApi', () => ({
  getPreferences: jest.fn().mockResolvedValue({
    totalLikes: 3,
    totalDislikes: 1,
    topSectors: [{ key: 'Informatique', score: 3 }],
    topCompetences: [{ key: 'Analyse', score: 2 }],
    topTags: [],
    topWorkConditions: [],
    recentLikes: [],
  }),
}));

describe('CareerPreferencesScreen', () => {
  it('affiche les métiers favoris et les signaux de préférence', async () => {
    const screen = render(<CareerPreferencesScreen />);

    await waitFor(() => {
      expect(screen.getByText('Tes métiers favoris')).toBeTruthy();
      expect(screen.getByText('Développeur web')).toBeTruthy();
      expect(screen.getAllByText('Informatique').length).toBeGreaterThan(0);
      expect(screen.getByText('Analyse')).toBeTruthy();
    });
  });
});

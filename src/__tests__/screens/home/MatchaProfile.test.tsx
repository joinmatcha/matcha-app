import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import MatchaProfileScreen from '@/features/home/screens/MatchaProfile';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
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

jest.mock('@/features/home/hooks/useMatchaProfile', () => ({
  useMatchaProfile: () => ({
    loading: false,
    refresh: jest.fn(),
    profile: {
      completion: 100,
      mainProfile: {
        title: 'Le catalyseur humain',
        summary:
          'Tu avances bien quand tu peux créer du lien et aider les autres.',
      },
      completedTests: {
        total: 3,
        bilan: true,
        personality: true,
        workStyle: true,
      },
      strongSignals: [
        {
          label: 'Relation client',
          sources: ['Auto-évaluation', 'Personnalité'],
          weight: 3,
        },
      ],
      keyDimensions: {
        strengths: ['Relation client', 'Pédagogie'],
        values: ['Impact'],
        environments: ['Contact humain'],
        sectors: ['Relation client'],
      },
      tests: [
        {
          key: 'bilan',
          label: 'Auto-évaluation',
          title: 'Le catalyseur humain',
          description: 'Forces, valeurs et métiers recommandés.',
          completed: true,
        },
        {
          key: 'personality',
          label: 'Personnalité',
          title: 'ENFJ',
          description: 'Énergie et préférences naturelles.',
          completed: true,
        },
        {
          key: 'work_style',
          label: 'Style professionnel',
          title: 'Autonome structuré',
          description: 'Cadre de travail favorable.',
          completed: true,
        },
      ],
      recommendedJobs: [
        {
          id: 'job-1',
          title: 'Conseiller clientèle',
          sector: 'Relation client',
          score: 86,
        },
      ],
      likedJobs: [
        {
          id: 'job-2',
          title: 'Formateur',
          sector: 'Transmission',
          likesCount: 2,
        },
      ],
      nextBestAction: {
        type: 'compare_jobs',
        label: 'Comparer mes métiers',
        route: 'JobCompare',
        jobIds: ['job-1', 'job-2'],
      },
    },
  }),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
  }),
}));

describe('MatchaProfileScreen', () => {
  it('affiche une synthèse croisée des tests et des métiers aimés', async () => {
    const screen = render(<MatchaProfileScreen />);

    await waitFor(() => {
      expect(screen.getByText('Ce que Matcha comprend de toi')).toBeTruthy();
      expect(
        screen.getAllByText('Le catalyseur humain').length,
      ).toBeGreaterThan(0);
      expect(screen.getByText('3/3')).toBeTruthy();
      expect(screen.getByText('Signaux qui ressortent')).toBeTruthy();
      expect(screen.getAllByText('Relation client').length).toBeGreaterThan(0);
      expect(
        screen.getAllByText('Conseiller clientèle').length,
      ).toBeGreaterThan(0);
    });
  });
});

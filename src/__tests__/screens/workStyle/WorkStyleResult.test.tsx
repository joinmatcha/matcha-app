import { render } from '@testing-library/react-native';
import React from 'react';

import WorkStyleResultScreen from '@/features/workStyle/screens/WorkStyleResult';

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: (props: any) => <View {...props} /> };
});
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
  useRoute: () => ({
    params: {
      result: {
        id: 'w1',
        version: 1,
        scores: {},
        topAxes: ['autonomy'],
        topAxisLabels: ['Autonomie'],
        profile: {
          key: 'autonomous_structured',
          title: 'Autonome structuré',
          description: 'Tu avances mieux avec un cadre clair.',
          strengths: ['Organisation'],
          cautions: ['Attention au flou'],
          advice: ['Clarifier les objectifs'],
        },
      },
    },
  }),
}));

describe('WorkStyleResultScreen', () => {
  it('affiche le profil', () => {
    const screen = render(<WorkStyleResultScreen />);

    expect(screen.getByText('Autonome structuré')).toBeTruthy();
    expect(screen.getAllByText('Autonomie').length).toBeGreaterThan(0);
    expect(screen.getByText('Retour à l’accueil')).toBeTruthy();
  });
});

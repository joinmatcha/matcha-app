import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import PersonalitySummaryCard from '@/features/home/components/PersonalitySummaryCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

const personality = {
  type: 'INTJ',
  label: 'Architecte',
  description: 'desc',
  strengths: ['Analytique', 'Stratégique', 'Déterminé', 'Extra'],
  weaknesses: ['Perfectionniste'],
  recommendedJobs: ['Dev'],
  scoreBreakdown: { EI: 1, SN: 2, TF: 3, JP: 4 },
};

describe('PersonalitySummaryCard', () => {
  const onPress = jest.fn();

  it('ne rend rien sans personality', () => {
    const { toJSON } = render(
      <PersonalitySummaryCard personality={undefined} onPress={onPress} />,
    );
    expect(toJSON()).toBeNull();
  });

  it('affiche le label et le type', () => {
    const { getByText } = render(
      <PersonalitySummaryCard personality={personality} onPress={onPress} />,
    );
    expect(getByText('Architecte')).toBeTruthy();
    expect(getByText('INTJ')).toBeTruthy();
  });

  it('affiche max 3 forces', () => {
    const { getByText, queryByText } = render(
      <PersonalitySummaryCard personality={personality} onPress={onPress} />,
    );
    expect(getByText('Analytique')).toBeTruthy();
    expect(getByText('Stratégique')).toBeTruthy();
    expect(getByText('Déterminé')).toBeTruthy();
    expect(queryByText('Extra')).toBeNull();
  });

  it('appelle onPress quand on clique sur le bouton', () => {
    const { getByText } = render(
      <PersonalitySummaryCard personality={personality} onPress={onPress} />,
    );
    fireEvent.press(getByText('Voir mon analyse'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import BilanSummaryCard from '@/features/home/components/BilanSummaryCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

const bilan = {
  id: 'b1',
  version: 1,
  createdAt: '2024-01-01',
  conclusion: {
    archetype: {
      id: 'a1',
      title: 'Le Stratège',
      subtitle: 'sub',
      description: 'desc',
    },
    profileSummary: 'summary',
    keyStrengths: ['Analyse', 'Communication', 'Leadership'],
    improvementAxes: [],
    recommendedSectors: ['Informatique', 'Design'],
    actionPlan: [],
  },
  investigation: {
    topValues: [],
    topWorkConditions: [],
    interestsProfile: [],
  },
};

describe('BilanSummaryCard', () => {
  const onPress = jest.fn();

  it("affiche le titre de l'archétype", () => {
    const { getByText } = render(
      <BilanSummaryCard bilan={bilan as any} onPress={onPress} />,
    );
    expect(getByText('Le Stratège')).toBeTruthy();
  });

  it('affiche les forces clés', () => {
    const { getByText } = render(
      <BilanSummaryCard bilan={bilan as any} onPress={onPress} />,
    );
    expect(getByText('Analyse')).toBeTruthy();
    expect(getByText('Communication')).toBeTruthy();
  });

  it('affiche les secteurs à explorer', () => {
    const { getByText } = render(
      <BilanSummaryCard bilan={bilan as any} onPress={onPress} />,
    );
    expect(getByText('Informatique')).toBeTruthy();
    expect(getByText('Design')).toBeTruthy();
  });

  it('appelle onPress quand on clique', () => {
    const { getByText } = render(
      <BilanSummaryCard bilan={bilan as any} onPress={onPress} />,
    );
    fireEvent.press(getByText('Voir ma synthèse'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

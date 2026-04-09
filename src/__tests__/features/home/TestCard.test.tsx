import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import TestCard from '@/features/home/components/TestCard';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('TestCard', () => {
  const onPress = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('affiche le titre et la description', () => {
    const { getByText } = render(
      <TestCard
        title="Test MBTI"
        description="Découvre ta personnalité"
        onPress={onPress}
      />,
    );
    expect(getByText('Test MBTI')).toBeTruthy();
    expect(getByText('Découvre ta personnalité')).toBeTruthy();
  });

  it('affiche le label par défaut du bouton', () => {
    const { getByText } = render(
      <TestCard title="Test" description="Desc" onPress={onPress} />,
    );
    expect(getByText('Commencer')).toBeTruthy();
  });

  it('affiche un label personnalisé', () => {
    const { getByText } = render(
      <TestCard
        title="Test"
        description="Desc"
        onPress={onPress}
        buttonLabel="Go"
      />,
    );
    expect(getByText('Go')).toBeTruthy();
  });

  it('appelle onPress quand on clique', () => {
    const { UNSAFE_getByType } = render(
      <TestCard title="Test" description="Desc" onPress={onPress} />,
    );
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

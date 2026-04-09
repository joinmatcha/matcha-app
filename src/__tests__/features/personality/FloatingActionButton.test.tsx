import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';

import FloatingActionButton from '@/features/personality/components/FloatingActionButton';

jest.mock('react-native-paper', () => {
  const RN = require('react-native');
  return { Text: RN.Text, DefaultTheme: { colors: {}, fonts: {} } };
});

describe('FloatingActionButton', () => {
  const onPress = jest.fn();
  const scrollY = new Animated.Value(0);

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur', () => {
    expect(() =>
      render(<FloatingActionButton onPress={onPress} scrollY={scrollY} />),
    ).not.toThrow();
  });

  it('appelle onPress quand on appuie', () => {
    const { UNSAFE_getByType } = render(
      <FloatingActionButton onPress={onPress} scrollY={scrollY} />,
    );
    fireEvent.press(UNSAFE_getByType(TouchableOpacity));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("affiche l'icône par défaut", () => {
    const { getByText } = render(
      <FloatingActionButton onPress={onPress} scrollY={scrollY} />,
    );
    expect(getByText('→')).toBeTruthy();
  });

  it('affiche une icône personnalisée', () => {
    const { getByText } = render(
      <FloatingActionButton onPress={onPress} scrollY={scrollY} icon="✓" />,
    );
    expect(getByText('✓')).toBeTruthy();
  });
});

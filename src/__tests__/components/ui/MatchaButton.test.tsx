import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';

import MatchaButton from '@/components/ui/MatchaButton';

describe('MatchaButton', () => {
  it('affiche le libellé et déclenche onPress', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MatchaButton label="Continuer" onPress={onPress} />,
    );

    fireEvent.press(getByText('Continuer'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('ne déclenche pas onPress quand il est désactivé', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MatchaButton label="Bientôt disponible" onPress={onPress} disabled />,
    );

    fireEvent.press(getByText('Bientôt disponible'));

    expect(onPress).not.toHaveBeenCalled();
    expect(getByText('lock-outline')).toBeTruthy();
  });

  it('affiche un état de chargement sans libellé actionnable', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <MatchaButton label="Envoyer" loading />,
    );

    expect(queryByText('Envoyer')).toBeNull();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});

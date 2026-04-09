import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import PrivacyModal from '@/components/Modals/PrivacyModal';

jest.mock('react-native-paper', () => {
  const { Text, View, Pressable } = require('react-native');
  return {
    Text,
    Button: ({ children, onPress, ...rest }: any) => (
      <Pressable onPress={onPress} {...rest}>
        <Text>{children}</Text>
      </Pressable>
    ),
    Modal: ({ children, visible }: any) =>
      visible ? <View>{children}</View> : null,
    Portal: ({ children }: any) => <View>{children}</View>,
    DefaultTheme: { colors: {}, fonts: {} },
  };
});

describe('PrivacyModal', () => {
  const onDismiss = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur quand visible', () => {
    expect(() =>
      render(<PrivacyModal visible={true} onDismiss={onDismiss} />),
    ).not.toThrow();
  });

  it('affiche le titre de la politique de confidentialité', () => {
    const { getAllByText } = render(
      <PrivacyModal visible={true} onDismiss={onDismiss} />,
    );
    expect(getAllByText(/Politique de Confidentialité/).length).toBeGreaterThan(
      0,
    );
  });

  it('appelle onDismiss quand on clique sur Fermer', () => {
    const { getByText } = render(
      <PrivacyModal visible={true} onDismiss={onDismiss} />,
    );
    fireEvent.press(getByText('Fermer'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

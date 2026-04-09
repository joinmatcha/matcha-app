import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import CGUModal from '@/components/Modals/CGUModal';

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

describe('CGUModal', () => {
  const onDismiss = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur quand visible', () => {
    expect(() =>
      render(<CGUModal visible={true} onDismiss={onDismiss} />),
    ).not.toThrow();
  });

  it('affiche le titre des CGU', () => {
    const { getAllByText } = render(
      <CGUModal visible={true} onDismiss={onDismiss} />,
    );
    expect(getAllByText(/Conditions Générales/).length).toBeGreaterThan(0);
  });

  it('appelle onDismiss quand on clique sur Fermer', () => {
    const { getByText } = render(
      <CGUModal visible={true} onDismiss={onDismiss} />,
    );
    fireEvent.press(getByText('Fermer'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ne rend rien quand visible est false', () => {
    const { queryByText } = render(
      <CGUModal visible={false} onDismiss={onDismiss} />,
    );
    expect(queryByText(/Conditions Générales/)).toBeNull();
  });
});

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';

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

describe('DeleteAccountModal', () => {
  const onDismiss = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('se rend sans erreur quand visible', () => {
    expect(() =>
      render(
        <DeleteAccountModal
          visible={true}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
        />,
      ),
    ).not.toThrow();
  });

  it('affiche le titre', () => {
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />,
    );
    expect(getByText('Tu nous quittes déjà ?')).toBeTruthy();
  });

  it('appelle onConfirm quand on clique sur Adieu', () => {
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.press(getByText('Adieu !'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("appelle onDismiss quand on clique sur C'est une erreur", () => {
    const { getByText } = render(
      <DeleteAccountModal
        visible={true}
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />,
    );
    fireEvent.press(getByText("C'est une erreur !"));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
